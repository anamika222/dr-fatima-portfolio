// Fallback content so the site renders even before the API is connected.
export const PROFILE = {
  name: "Dr. Fatima Sultana",
  title: "Orthopaedic & Spine Surgeon",
  tagline: "Orthopaedic & Spine Surgeon | Consultant, BIHS General Hospital",
  phone: "01921-196202",
  facebook_url: "", // paste the Facebook page URL here
  qualifications: [
    { degree: "MBBS", institution: "Dhaka" },
    { degree: "D Ortho", institution: "BSMMU" },
    { degree: "Basic Spine Course", institution: "APSS" },
    { degree: "Advanced Endoscopic Spine Course", institution: "AO Spine, Thailand" },
  ],
};

export const SERVICES = [
  ["Knee Pain Consultation", "Bone", "joints", "Orthopaedic assessment for knee pain, stiffness, joint problems, and mobility issues.", ["Knee pain", "Stiffness", "Joint problems", "Mobility issues"]],
  ["Spine & Musculoskeletal Care", "Activity", "spine", "Comprehensive consultation for spine, bone, joint, muscle, and movement conditions.", ["Spine", "Bone", "Joint", "Muscle", "Movement conditions"]],
  ["Back Pain Consultation", "PersonStanding", "spine", "Clinical assessment for persistent or recurring back pain.", ["Persistent back pain", "Recurring back pain"]],
  ["Trauma & Injury Care", "Siren", "trauma", "Emergency and standard orthopaedic consultation for injuries, trauma, and fractures.", ["Injuries", "Trauma", "Fractures"]],
  ["Spine Care & Consultation", "Stethoscope", "spine", "Specialist care for back pain, neck pain, and complex spinal problems.", ["Back pain", "Neck pain", "Spinal problems"]],
  ["Joint Pain Consultation", "Link2", "joints", "Care for pain, stiffness, and swelling in knee, shoulder, hip, and other joints.", ["Knee", "Shoulder", "Hip", "Pain", "Stiffness", "Swelling"]],
  ["Neck Pain Consultation", "ScanLine", "spine", "Evaluation and guidance for neck stiffness and cervical spine issues.", ["Neck pain", "Neck stiffness", "Cervical spine"]],
  ["Fracture & Injury Consultation", "Bandage", "trauma", "Treatment and follow-up guidance for bone fractures and trauma.", ["Fractures", "Bone injuries", "Follow-up care"]],
  ["Bone & Joint Care", "Dumbbell", "joints", "Everyday joint health and daily movement-related wellness.", ["Bone health", "Joint health", "Muscle", "Daily movement"]],
  ["Orthopaedic Consultation", "ClipboardList", "general", "Personalized comprehensive orthopaedic assessment and treatment planning.", ["Assessment", "Treatment planning"]],
].map(([title, icon, category, summary, conditions], i) => ({ id: i + 1, slug: String(i + 1), title, icon, category, summary, conditions }));

export const STATS = [
  { id: 1, label: "Chambers", value: 3, suffix: "" },
  { id: 2, label: "Care areas", value: 10, suffix: "" },
  { id: 3, label: "Degrees & Courses", value: 4, suffix: "" },
];

export const FAQS = [];

export const LOCATIONS = [
  { 
    id: 1, 
    name: "BIHS General Hospital", 
    role: "Consultant", 
    city: "Dhaka", 
    address: "125/1 Darus Salam (Technical Mor), Mirpur, Dhaka-1216", 
    map_url: "", 
    accepts_bookings: true 
  },
  { 
    id: 2, 
    name: "Medison Specialized Hospital & Trauma Center", 
    role: "Consultant", 
    city: "Patuakhali", 
    address: "49, Sher-e-Bangla Road, Patuakhali, Bangladesh, 8600", 
    map_url: "", 
    accepts_bookings: true 
  },
  { 
    id: 3, 
    name: "Purnima Diagnostic Center, Patuakhali", 
    role: "Consultant", 
    city: "Patuakhali", 
    address: "Medical College Hospital Road, Patuakhali", 
    map_url: "", 
    accepts_bookings: true 
  },
];