from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register("services", views.ServiceViewSet, basename="service")
router.register("faqs", views.FAQViewSet, basename="faq")
router.register("stats", views.StatViewSet, basename="stat")
router.register("locations", views.LocationViewSet, basename="location")

urlpatterns = [
    path("profile/", views.ProfileView.as_view()),
    path("availability/", views.AvailabilityView.as_view()),
    path("appointments/", views.AppointmentCreateView.as_view()),
    path("contact/", views.ContactCreateView.as_view()),
    path("testimonials/", views.TestimonialListCreateView.as_view()),
    path("", include(router.urls)),
]
