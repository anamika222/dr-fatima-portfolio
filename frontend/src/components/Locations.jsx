import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const todayIdx = () => (new Date().getDay() + 6) % 7; // JS Sunday=0 -> Monday=0

function Status({ l }) {
  if (!l.schedule?.length) return <span className="rounded-full bg-lilac-soft px-3 py-1 text-sm font-semibold text-ink/70">Call for timing</span>;
  return l.open_today
    ? <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-600" />Available today</span>
    : <span className="rounded-full bg-ink/5 px-3 py-1 text-sm font-semibold text-ink/70">Not available today</span>;
}

export default function Locations({ locations, onBook }) {
  const today = todayIdx();
  return (
    <section id="locations" className="section">
      <h2 className="font-display text-4xl font-bold md:text-5xl">Chambers</h2>
      <p className="mt-4 max-w-xl text-lg text-ink/75">Dr. Fatima sees patients at two hospitals in Dhaka.</p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {locations.map((l, i) => (
          <motion.article key={l.id} whileHover={{ y: -6 }} className="rounded-3xl border border-ink/10 bg-white p-7 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan to-deep text-white"><MapPin /></span>
              <Status l={l} />
            </div>
            <p className="mt-5 font-semibold text-deep">{l.role}</p>
            <h3 className="font-display text-2xl font-bold">{l.name}</h3>
            <p className="mt-1 text-ink/70">{[l.address, l.city].filter(Boolean).join(", ")}</p>

            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-ink/60"><Clock size={16} /> Weekly schedule</div>
            <div className="mt-2 grid grid-cols-7 gap-1.5" role="list">
              {DAYS.map((d, di) => {
                const slots = (l.schedule || []).filter((x) => x.weekday === di);
                return (
                  <div key={d} role="listitem" title={slots.map((s) => `${s.start}-${s.end}`).join(", ") || "Closed"}
                    className={`rounded-xl px-1 py-2 text-center text-xs ${slots.length ? "bg-cyan-soft text-deep" : "bg-ink/5 text-ink/35"} ${di === today ? "ring-2 ring-deep" : ""}`}>
                    <p className="font-semibold">{d}</p>
                    <p>{slots[0] ? slots[0].start : "–"}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {l.accepts_bookings && <button onClick={() => onBook(null, l)} className="btn btn-primary !py-2">Book here</button>}
              {l.map_url && <a className="btn btn-ghost !py-2" href={l.map_url} target="_blank" rel="noreferrer">Open in Maps</a>}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
