import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function FAQ({ items }) {
  const [open, setOpen] = useState(0);
  if (!items.length) return null;
  return (
    <section id="faq" className="section">
      <div className="grid gap-12 md:grid-cols-[.8fr_1.2fr]">
        <div>
          <h2 className="font-display text-4xl font-bold md:text-5xl">Patient questions</h2>
          <p className="mt-4 max-w-sm text-lg text-ink/75">General guidance only. It does not replace an examination.</p>
        </div>
        <div className="divide-y divide-ink/10 rounded-3xl border border-ink/10">
          {items.map((it, i) => (
            <div key={it.id}>
              <h3>
                <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 p-6 text-left font-display text-lg font-bold">
                  {it.question}
                  <motion.span animate={{ rotate: open === i ? 45 : 0 }} className="shrink-0 text-deep"><Plus /></motion.span>
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <p className="px-6 pb-6 text-ink/75">{it.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
