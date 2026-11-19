from django.core.validators import MaxValueValidator, MinValueValidator, RegexValidator
from django.db import models
from django.db.models import Q

bd_phone = RegexValidator(r"^(?:\+?88)?01[3-9]\d{8}$", "Enter a valid Bangladeshi mobile number.")


class DoctorProfile(models.Model):
    """Single-row table: edit everything about the doctor from the admin."""
    name = models.CharField(max_length=120, default="Dr. Fatima Sultana")
    title = models.CharField(max_length=160, default="Orthopaedic & Spine Specialist")
    tagline = models.CharField(max_length=255, default="Orthopaedic, Spine & Trauma Specialist | Expert in Bone, Joint & Spine Care")
    bio = models.TextField(blank=True)
    phone = models.CharField(max_length=20, default="01921-196202")
    facebook_url = models.URLField(blank=True)
    photo = models.ImageField(upload_to="doctor/", blank=True)

    def save(self, *a, **kw):
        self.pk = 1  # enforce singleton
        super().save(*a, **kw)

    def __str__(self):
        return self.name


class Qualification(models.Model):
    degree = models.CharField(max_length=80)          # e.g. "D Ortho"
    institution = models.CharField(max_length=120)    # e.g. "BSMMU"
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.degree} ({self.institution})"


class Service(models.Model):
    title = models.CharField(max_length=120)
    slug = models.SlugField(unique=True)
    summary = models.CharField(max_length=255)
    details = models.TextField(blank=True)
    icon = models.CharField(max_length=40, default="Bone", help_text="Lucide icon name")
    category = models.CharField(max_length=10, default="general",
        choices=[("spine", "Spine"), ("joints", "Joints"), ("trauma", "Trauma"), ("general", "General")])
    conditions = models.JSONField(default=list, blank=True, help_text="List of conditions covered, shown when the card expands")
    order = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "title"]

    def __str__(self):
        return self.title


class Location(models.Model):
    name = models.CharField(max_length=160)
    role = models.CharField(max_length=80)            # Registrar / Consultant
    area = models.CharField(max_length=120, blank=True)
    city = models.CharField(max_length=80, default="Dhaka")
    address = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    map_url = models.URLField(blank=True)
    accepts_bookings = models.BooleanField(default=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.name


class Availability(models.Model):
    """Weekly recurring visiting hours per location. Slots are generated from these."""
    WEEKDAYS = [(0, "Mon"), (1, "Tue"), (2, "Wed"), (3, "Thu"), (4, "Fri"), (5, "Sat"), (6, "Sun")]
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name="availability")
    weekday = models.PositiveSmallIntegerField(choices=WEEKDAYS)  # matches date.weekday()
    start_time = models.TimeField()
    end_time = models.TimeField()
    slot_minutes = models.PositiveSmallIntegerField(default=15)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "availability"

    def __str__(self):
        return f"{self.location} {self.get_weekday_display()} {self.start_time:%H:%M}-{self.end_time:%H:%M}"


class Appointment(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending"
        CONFIRMED = "confirmed"
        CANCELLED = "cancelled"
        COMPLETED = "completed"

    patient_name = models.CharField(max_length=120)
    phone = models.CharField(max_length=20, validators=[bd_phone])
    age = models.PositiveSmallIntegerField(validators=[MinValueValidator(0), MaxValueValidator(120)])
    service = models.ForeignKey(Service, on_delete=models.PROTECT)
    location = models.ForeignKey(Location, on_delete=models.PROTECT)
    date = models.DateField()
    time = models.TimeField()
    notes = models.TextField(blank=True, max_length=1000)
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["date", "time"]
        constraints = [  # DB-level guard against double booking
            models.UniqueConstraint(
                fields=["location", "date", "time"],
                condition=~Q(status="cancelled"),
                name="unique_active_slot",
            )
        ]

    def __str__(self):
        return f"{self.patient_name} - {self.date} {self.time:%H:%M}"


class Testimonial(models.Model):
    """Submitted by patients, hidden until the doctor's team approves it."""
    patient_name = models.CharField(max_length=80)
    text = models.TextField(max_length=600)
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]


class ContactMessage(models.Model):
    name = models.CharField(max_length=120)
    phone = models.CharField(max_length=20, validators=[bd_phone])
    message = models.TextField(max_length=1500)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]


class FAQ(models.Model):
    question = models.CharField(max_length=255)
    answer = models.TextField()
    order = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]
        verbose_name = "FAQ"

    def __str__(self):
        return self.question


class Stat(models.Model):
    """Hero counters. Only enter figures you can stand behind."""
    label = models.CharField(max_length=40)
    value = models.PositiveIntegerField()
    suffix = models.CharField(max_length=4, blank=True, help_text='e.g. "+"')
    order = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.value}{self.suffix} {self.label}"
