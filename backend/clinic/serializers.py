from django.db import IntegrityError, transaction
from django.utils import timezone
from rest_framework import serializers

from .models import (FAQ, Appointment, ContactMessage, DoctorProfile, Location,
                     Qualification, Service, Stat, Testimonial)
from .slots import free_slots


class QualificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Qualification
        fields = ["degree", "institution"]


class DoctorProfileSerializer(serializers.ModelSerializer):
    qualifications = serializers.SerializerMethodField()

    class Meta:
        model = DoctorProfile
        fields = ["name", "title", "tagline", "bio", "phone", "facebook_url", "qualifications"]

    def get_qualifications(self, _):
        return QualificationSerializer(Qualification.objects.all(), many=True).data


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ["id", "title", "slug", "summary", "details", "icon", "category", "conditions"]


class LocationSerializer(serializers.ModelSerializer):
    schedule = serializers.SerializerMethodField()
    open_today = serializers.SerializerMethodField()

    class Meta:
        model = Location
        fields = ["id", "name", "role", "area", "city", "address", "phone", "map_url",
                  "accepts_bookings", "schedule", "open_today"]

    def _rules(self, obj):
        return [a for a in obj.availability.all() if a.is_active]  # uses prefetch, no extra queries

    def get_schedule(self, obj):
        return [{"weekday": a.weekday, "day": a.get_weekday_display(),
                 "start": a.start_time.strftime("%H:%M"), "end": a.end_time.strftime("%H:%M")}
                for a in sorted(self._rules(obj), key=lambda a: (a.weekday, a.start_time))]

    def get_open_today(self, obj):
        today = timezone.localdate().weekday()
        return any(a.weekday == today for a in self._rules(obj))


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ["id", "question", "answer"]


class StatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stat
        fields = ["id", "label", "value", "suffix"]


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ["id", "patient_name", "text", "rating"]
        read_only_fields = ["id"]


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["name", "phone", "message"]


class AppointmentCreateSerializer(serializers.ModelSerializer):
    time = serializers.TimeField(input_formats=["%H:%M"])

    class Meta:
        model = Appointment
        fields = ["id", "patient_name", "phone", "age", "service", "location", "date", "time", "notes"]
        read_only_fields = ["id"]

    def validate_date(self, value):
        if value < timezone.localdate():
            raise serializers.ValidationError("Choose today or a future date.")
        return value

    def validate(self, data):
        if not data["location"].accepts_bookings:
            raise serializers.ValidationError({"location": "Online booking is not available here."})
        if not data["service"].is_active:
            raise serializers.ValidationError({"service": "This service is not available."})
        if data["time"].strftime("%H:%M") not in free_slots(data["location"], data["date"]):
            raise serializers.ValidationError({"time": "That time is no longer available. Pick another slot."})
        return data

    def create(self, validated):
        try:
            with transaction.atomic():
                return super().create(validated)
        except IntegrityError:  # two patients picked the same slot at once
            raise serializers.ValidationError({"time": "That time was just booked. Pick another slot."})
