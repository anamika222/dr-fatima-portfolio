from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_date
from rest_framework import generics, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from . import serializers as s
from .models import FAQ, DoctorProfile, Location, Service, Stat, Testimonial
from .slots import free_slots


class ProfileView(APIView):
    def get(self, request):
        profile = DoctorProfile.objects.first() or DoctorProfile()
        return Response(s.DoctorProfileSerializer(profile).data)


class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Service.objects.filter(is_active=True)
    serializer_class = s.ServiceSerializer
    lookup_field = "slug"
    pagination_class = None


class LocationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Location.objects.prefetch_related("availability")
    serializer_class = s.LocationSerializer
    pagination_class = None


class AvailabilityView(APIView):
    """GET /api/availability/?location=1&date=2026-11-05 -> {"slots": ["10:00", ...]}"""
    def get(self, request):
        location = get_object_or_404(Location, pk=request.query_params.get("location"))
        date = parse_date(request.query_params.get("date", ""))
        if not date:
            return Response({"slots": []})
        return Response({"slots": free_slots(location, date)})


class AppointmentCreateView(generics.CreateAPIView):
    serializer_class = s.AppointmentCreateSerializer
    throttle_scope = "booking"


class ContactCreateView(generics.CreateAPIView):
    serializer_class = s.ContactMessageSerializer
    throttle_scope = "contact"


class TestimonialListCreateView(generics.ListCreateAPIView):
    """GET returns approved reviews only. POST stores a review for moderation."""
    serializer_class = s.TestimonialSerializer
    pagination_class = None

    def get_queryset(self):
        return Testimonial.objects.filter(is_published=True)

    def get_throttles(self):
        if self.request.method == "POST":
            self.throttle_scope = "feedback"
            return super().get_throttles()
        return []


class FAQViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FAQ.objects.filter(is_active=True)
    serializer_class = s.FAQSerializer
    pagination_class = None


class StatViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Stat.objects.filter(is_active=True)
    serializer_class = s.StatSerializer
    pagination_class = None
