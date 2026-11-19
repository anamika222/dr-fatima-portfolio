import { motion, useMotionValue, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/** Button that leans toward the pointer. */
export function Magnetic({ children, className = "", strength = 0.25, ...rest }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 15 }), sy = useSpring(y, { stiffness: 220, damping: 15 });
  const move = (e) => {
    if (reduce) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => { x.set(0); y.set(0); };
  return (
    <motion.span ref={ref} style={{ x: sx, y: sy }} onMouseMove={move} onMouseLeave={leave} className="inline-block">
      <button className={className} {...rest}>{children}</button>
    </motion.span>
  );
}

/** Thin progress bar fixed to the top of the screen. */
export function ScrollBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  return <motion.div aria-hidden="true" style={{ scaleX }} className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-deep via-cyan to-lilac" />;
}

/** Subtle ring that follows the mouse and grows over links and buttons. Fine pointers only. */
export function Cursor() {
  const reduce = useReducedMotion();
  const [on, setOn] = useState(false);
  const [big, setBig] = useState(false);
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40 }), sy = useSpring(y, { stiffness: 500, damping: 40 });
  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    setOn(true);
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); setBig(!!e.target.closest?.("a,button,select,input,textarea,summary")); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [reduce]);
  if (!on) return null;
  return (
    <motion.div aria-hidden="true" style={{ x: sx, y: sy }} className="pointer-events-none fixed left-0 top-0 z-[70]">
      <div className={`-ml-4 -mt-4 h-8 w-8 rounded-full border-2 border-cyan transition-all duration-200 ${big ? "scale-150 bg-cyan/15" : ""}`} />
    </motion.div>
  );
}

import { MessageCircle, Phone } from "lucide-react";
export function FloatingActions({ phone }) {
  const digits = phone.replace(/\D/g, "");               // 01921196202
  const wa = `https://wa.me/88${digits}`;                 // Bangladesh country code
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      <a href={wa} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-110"><MessageCircle /></a>
      <a href={`tel:${digits}`} aria-label={`Call ${phone}`} className="btn-glow grid h-14 w-14 place-items-center rounded-full bg-deep text-white shadow-xl transition hover:scale-110"><Phone /></a>
    </div>
  );
}
