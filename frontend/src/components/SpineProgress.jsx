import { useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { useState } from "react";

const COUNT = 24; // vertebrae: 7 cervical, 12 thoracic, 5 lumbar
const width = (i) => (i < 7 ? 14 : i < 19 ? 20 : 26);

/** The signature element: a spine in the page margin that fills as you read. */
export default function SpineProgress() {
  const { scrollYProgress } = useScroll();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.round(v * COUNT)));

  return (
    <div aria-hidden="true" className="pointer-events-none fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-[3px] xl:flex">
      {Array.from({ length: COUNT }, (_, i) => (
        <span
          key={i}
          style={{ width: width(i), transitionDuration: reduce ? "0ms" : "300ms" }}
          className={`h-2.5 rounded-[4px] transition-colors ${i < active ? "bg-deep" : "bg-deep/15"}`}
        />
      ))}
    </div>
  );
}
