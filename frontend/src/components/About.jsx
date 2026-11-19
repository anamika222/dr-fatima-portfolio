import { Building2, GraduationCap, Stethoscope } from "lucide-react";

export default function About({ profile, locations }) {
  const cards = [
    { icon: GraduationCap, title: "Qualifications", lines: profile.qualifications.map((q) => `${q.degree} (${q.institution})`) },
    { icon: Building2, title: "Hospital roles", lines: locations.map((l) => `${l.role}, ${l.name}`) },
    { icon: Stethoscope, title: "Focus", lines: ["Orthopaedic care", "Spine care", "Trauma and injury care"] },
  ];
  return (
    <section id="about" className="section">
      <div className="grid gap-12 md:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="font-display text-4xl font-bold md:text-5xl">About Dr. Fatima</h2>
          <p className="mt-5 max-w-md text-lg text-ink/75">{profile.tagline}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {cards.map(({ icon: Icon, title, lines }, i) => (
            <article key={title} className={`rounded-3xl p-6 ${i === 0 ? "bg-deep text-white sm:row-span-2" : "bg-mist"}`}>
              <Icon className={i === 0 ? "text-cyan" : "text-deep"} />
              <h3 className="mt-4 font-display text-xl font-bold">{title}</h3>
              <ul className={`mt-3 space-y-2 ${i === 0 ? "text-white/85" : "text-ink/75"}`}>
                {lines.map((l) => <li key={l}>{l}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
