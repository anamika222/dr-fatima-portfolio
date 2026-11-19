from django.core.management.base import BaseCommand

from clinic.models import FAQ, DoctorProfile, Location, Qualification, Service, Stat

# (title, icon, category, summary, conditions) -- text taken from the doctor's profile
SERVICES = [
 ("Knee Pain Consultation","Bone","joints","Orthopaedic assessment for knee pain, stiffness, joint problems, and mobility issues.",["Knee pain","Stiffness","Joint problems","Mobility issues"]),
 ("Spine & Musculoskeletal Care","Activity","spine","Comprehensive consultation for spine, bone, joint, muscle, and movement conditions.",["Spine","Bone","Joint","Muscle","Movement conditions"]),
 ("Back Pain Consultation","PersonStanding","spine","Clinical assessment for persistent or recurring back pain.",["Persistent back pain","Recurring back pain"]),
 ("Trauma & Injury Care","Siren","trauma","Emergency and standard orthopaedic consultation for injuries, trauma, and fractures.",["Injuries","Trauma","Fractures"]),
 ("Spine Care & Consultation","Stethoscope","spine","Specialist care for back pain, neck pain, and complex spinal problems.",["Back pain","Neck pain","Spinal problems"]),
 ("Joint Pain Consultation","Link2","joints","Care for pain, stiffness, and swelling in knee, shoulder, hip, and other joints.",["Knee","Shoulder","Hip","Pain","Stiffness","Swelling"]),
 ("Neck Pain Consultation","ScanLine","spine","Evaluation and guidance for neck stiffness and cervical spine issues.",["Neck pain","Neck stiffness","Cervical spine"]),
 ("Fracture & Injury Consultation","Bandage","trauma","Treatment and follow-up guidance for bone fractures and trauma.",["Fractures","Bone injuries","Follow-up care"]),
 ("Bone & Joint Care","Dumbbell","joints","Everyday joint health and daily movement-related wellness.",["Bone health","Joint health","Muscle","Daily movement"]),
 ("Orthopaedic Consultation","ClipboardList","general","Personalized comprehensive orthopaedic assessment and treatment planning.",["Assessment","Treatment planning"]),
]

FAQS = [
 ("When should I see an orthopaedic doctor for knee pain?","Book a visit if pain lasts more than a few days, if the knee is swollen or stiff, if it gives way or locks, or if you cannot put weight on it after an injury."),
 ("Does back pain always need surgery?","No. Many cases of back pain are managed without surgery. After examining you and reviewing any reports, the doctor will explain which treatment options suit your condition."),
 ("What should I bring to my first appointment?","Bring previous X-rays, MRI or CT reports, prescriptions, and a list of medicines you take. Note when the pain started and what makes it better or worse."),
 ("What should I do if I think a bone is broken?","Keep the injured part still, avoid forcing movement, and go to the nearest emergency department or call 01921-196202 for guidance."),
 ("When is neck pain urgent?","Seek prompt care if neck pain follows an injury, or comes with numbness, weakness or tingling in the arms or hands."),
 ("How do I confirm my appointment?","Send a request online, choosing a hospital, date and time. Our team will call to confirm your visit."),
]

class Command(BaseCommand):
    help = "Load Dr. Fatima Sultana's initial content (safe to run again)"

    def handle(self, *a, **kw):
        DoctorProfile.objects.get_or_create(pk=1)
        for i, (d, inst) in enumerate([("MBBS", "Dhaka"), ("D Ortho", "BSMMU")]):
            Qualification.objects.get_or_create(degree=d, defaults={"institution": inst, "order": i})
        for i, (t, icon, cat, sm, cond) in enumerate(SERVICES):
            slug = t.lower().replace(" & ", "-").replace(" ", "-")
            Service.objects.update_or_create(slug=slug, defaults=dict(title=t, icon=icon, category=cat, summary=sm, conditions=cond, order=i))
        Location.objects.get_or_create(name="Green Life Medical College Hospital", defaults=dict(role="Registrar", city="Dhaka", order=0))
        Location.objects.get_or_create(name="Medison Specialized Hospital & Trauma Centre", defaults=dict(role="Consultant", city="Dhaka", order=1))
        for i, (q, ans) in enumerate(FAQS):
            FAQ.objects.get_or_create(question=q, defaults=dict(answer=ans, order=i))
        # Only facts from the doctor's profile. Add experience/patient counts in /admin if verified.
        for i, (l, v) in enumerate([("Hospitals", 2), ("Care areas", 10), ("Degrees", 2)]):
            Stat.objects.get_or_create(label=l, defaults=dict(value=v, order=i))
        self.stdout.write(self.style.SUCCESS("Seeded."))
