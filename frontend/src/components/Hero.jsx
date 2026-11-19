import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { Award, CalendarCheck, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Magnetic } from "./ui";

function Counter({ to, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.4, ease: "easeOut", onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

/** Slow-drifting colour blobs behind the hero. */
function Mesh() {
  const reduce = useReducedMotion();
  const blob = (cls, dx, dy, d) => (
    <motion.div className={`absolute rounded-full blur-3xl ${cls}`}
      animate={reduce ? {} : { x: [0, dx, 0], y: [0, dy, 0] }} transition={{ duration: d, repeat: Infinity, ease: "easeInOut" }} />
  );
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden bg-mist">
      {blob("-left-24 -top-24 h-[28rem] w-[28rem] bg-cyan/35", 80, 60, 14)}
      {blob("right-0 top-10 h-[26rem] w-[26rem] bg-deep/25", -90, 50, 18)}
      {blob("bottom-0 left-1/3 h-[22rem] w-[22rem] bg-lilac/35", 60, -60, 16)}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent" />
    </div>
  );
}

const rise = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } };

export default function Hero({ profile, stats, onBook }) {
  const reduce = useReducedMotion();
  return (
    <header id="top" className="relative overflow-hidden">
      <Mesh />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-24 pt-32 md:grid-cols-[1.1fr_.9fr] md:pt-36">
        <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.12 }}>
          <motion.p variants={rise} className="glass mb-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-deep">
            <Award size={16} className="text-cyan" /> MBBS, D Ortho Specialist
          </motion.p>
          <motion.h1 variants={rise} className="font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl">{profile.name}</motion.h1>
          <motion.p variants={rise} className="mt-3 font-display text-2xl text-deep md:text-3xl">{profile.title}</motion.p>
          <motion.p variants={rise} className="mt-5 max-w-md text-lg text-ink/75">Bone, joint and spine care in Dhaka, for knee pain, back pain, neck pain, fractures and injuries.</motion.p>
          <motion.div variants={rise} className="mt-8 flex flex-wrap gap-4">
            <Magnetic onClick={() => onBook()} className="btn btn-primary btn-glow"><CalendarCheck size={18} /> Book consultation</Magnetic>
            <a href={`tel:${profile.phone.replace(/\D/g, "")}`} className="btn glass text-deep hover:bg-white"><Phone size={18} /> Direct call</a>
          </motion.div>
          <motion.dl variants={rise} className="mt-12 grid max-w-md grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.id} className="glass rounded-2xl p-4">
                <dd className="font-display text-3xl font-bold text-deep"><Counter to={s.value} suffix={s.suffix} /></dd>
                <dt className="text-sm text-ink/65">{s.label}</dt>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2 }} className="relative mx-auto w-full max-w-md">
          <motion.img src="/doctor-badge.jpg" alt="Dr. Fatima Sultana, Orthopaedic & Spine Specialist"
            animate={reduce ? {} : { y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="aspect-square w-full rounded-full object-cover shadow-2xl shadow-deep/25" />
          <motion.div animate={reduce ? {} : { y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="glass absolute -bottom-2 -left-2 rounded-2xl px-4 py-3 shadow-lg md:-left-8">
            <p className="text-xs text-ink/60">Qualifications</p>
            <p className="font-display font-bold text-deep">MBBS (Dhaka) · D Ortho (BSMMU)</p>
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
}
