from datetime import datetime, timedelta

from django.utils import timezone

from .models import Appointment, Availability


def free_slots(location, date):
    """Return ['10:00', '10:15', ...] still bookable for a location on a date."""
    rules = Availability.objects.filter(location=location, weekday=date.weekday(), is_active=True)
    taken = set(
        Appointment.objects.filter(location=location, date=date)
        .exclude(status="cancelled")
        .values_list("time", flat=True)
    )
    now = timezone.localtime()
    slots = []
    for r in rules:
        cur = datetime.combine(date, r.start_time)
        end = datetime.combine(date, r.end_time)
        while cur + timedelta(minutes=r.slot_minutes) <= end:
            t = cur.time()
            in_past = date == now.date() and t <= now.time()
            if t not in taken and not in_past:
                slots.append(t.strftime("%H:%M"))
            cur += timedelta(minutes=r.slot_minutes)
    return sorted(set(slots))
