import * as Icons from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

const TABS = [["all", "All"], ["spine", "Spine"], ["joints", "Joints"], ["trauma", "Trauma"], ["general", "General"]];
const Icon = ({ name, ...p }) => { const C = Icons[name] || Icons.Bone; return <C {...p} />; };

function Card({ s, open, toggle, onBook }) {
  // Spotlight follows the pointer; it lights the icon and card edge.
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };
  return (
    <motion.article layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
      onMouseMove={move}
      style={{ "--x": "50%", "--y": "0px" }}
      className="glass group relative overflow-hidden rounded-3xl shadow-sm transition-shadow hover:shadow-xl hover:shadow-deep/15">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(260px circle at var(--x) var(--y), rgba(18,164,198,.20), transparent 70%)" }} />
      <button onClick={toggle} aria-expanded={open} className="relative w-full p-6 text-left">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-deep shadow transition group-hover:bg-deep group-hover:text-white group-hover:shadow-[0_0_24px_rgba(18,164,198,.6)]">
          <Icon name={s.icon} size={22} />
        </span>
        <h3 className="mt-5 font-display text-xl font-bold">{s.title}</h3>
        <p className="mt-2 text-ink/70">{s.summary}</p>
        <Icons.ChevronDown className={`mt-3 text-deep transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="relative overflow-hidden">
            <div className="px-6 pb-6">
              <p className="text-sm font-semibold text-deep">Conditions covered</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {(s.conditions || []).map((c) => <li key={c} className="rounded-full bg-white/80 px-3 py-1 text-sm">{c}</li>)}
              </ul>
              <button onClick={() => onBook(s)} className="btn btn-primary mt-5 !py-2">Book this consultation</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export default function Services({ services, onBook }) {
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState(null);
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return services.filter((s) =>
      (tab === "all" || s.category === tab) &&
      (!needle || [s.title, s.summary, ...(s.conditions || [])].join(" ").toLowerCase().includes(needle)));
  }, [services, tab, q]);

  return (
    <section id="services" className="relative overflow-hidden bg-gradient-to-b from-white via-cyan-soft/50 to-lilac-soft/60">
      <div className="section">
        <h2 className="font-display text-4xl font-bold md:text-5xl">Services</h2>
        <p className="mt-4 max-w-xl text-lg text-ink/75">Search by condition, or filter by area of care.</p>

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div role="tablist" aria-label="Service categories" className="flex flex-wrap gap-2">
            {TABS.map(([id, label]) => (
              <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
                className="relative rounded-full px-5 py-2 font-semibold text-ink/70 transition hover:text-deep aria-selected:text-white">
                {tab === id && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-deep" />}
                <span className="relative">{label}</span>
              </button>
            ))}
          </div>
          <label className="relative block md:w-72">
            <span className="sr-only">Search conditions</span>
            <Icons.Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search e.g. knee, neck, fracture" className="field !rounded-full !pl-11" />
          </label>
        </div>

        <motion.div layout className="mt-10 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((s) => <Card key={s.id} s={s} open={openId === s.id} toggle={() => setOpenId(openId === s.id ? null : s.id)} onBook={onBook} />)}
          </AnimatePresence>
        </motion.div>
        {list.length === 0 && <p className="mt-10 text-lg text-ink/70">No service matches “{q}”. Try a body part such as knee, back or neck.</p>}
      </div>
    </section>
  );
}
