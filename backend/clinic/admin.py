from django.contrib import admin
from .models import (FAQ, Stat, Appointment, Availability, ContactMessage, DoctorProfile,
                     Location, Qualification, Service, Testimonial)

class AvailabilityInline(admin.TabularInline):
    model = Availability
    extra = 1

@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    inlines = [AvailabilityInline]

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ["title", "order", "is_active"]
    prepopulated_fields = {"slug": ("title",)}

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ["patient_name", "phone", "service", "location", "date", "time", "status"]
    list_filter = ["status", "location", "date"]
    search_fields = ["patient_name", "phone"]
    actions = ["confirm", "cancel"]

    @admin.action(description="Mark as confirmed")
    def confirm(self, request, qs): qs.update(status="confirmed")
    @admin.action(description="Mark as cancelled")
    def cancel(self, request, qs): qs.update(status="cancelled")

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ["patient_name", "rating", "is_published", "created_at"]
    list_editable = ["is_published"]

admin.site.register([DoctorProfile, Qualification, ContactMessage])

admin.site.register([FAQ, Stat])
