import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { api, errorText } from "../api";

const today = () => new Date().toLocaleDateString("en-CA");
const EMPTY = { service: "", location: "", date: "", time: "", patient_name: "", phone: "", age: "", notes: "" };
const STEPS = ["Visit", "Time", "Details"];

export default function BookingModal({ open, onClose, preset, services, locations }) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [f, setF] = useState(EMPTY);
  const [slots, setSlots] = useState(null);
  const [state, setState] = useState({ status: "idle", error: "" });

  useEffect(() => {          // reset each time it opens, applying any preselected service/hospital
    if (!open) return;
    setStep(0); setDir(1); setSlots(null); setState({ status: "idle", error: "" });
    setF({ ...EMPTY, service: preset?.service?.id ?? "", location: preset?.location?.id ?? "" });
  }, [open]);

  useEffect(() => {          // Esc to close + lock page scroll
    if (!open) return;
    const key = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", key); document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!f.location || !f.date) return setSlots(null);
    let off = false;
    api.slots(f.location, f.date).then((r) => !off && setSlots(r.slots)).catch(() => !off && setSlots([]));
    return () => { off = true; };
  }, [f.location, f.date]);

  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value, ...(k === "date" || k === "location" ? { time: "" } : {}) }));
  const go = (n) => { setDir(n > step ? 1 : -1); setStep(n); };
  const canNext = [f.service && f.location, f.date && f.time, f.patient_name && f.phone && f.age][step];

  async function submit(e) {
    e.preventDefault();
    setState({ status: "sending", error: "" });
    try {
      await api.book({ ...f, age: Number(f.age), service: Number(f.service), location: Number(f.location) });
      setState({ status: "done", error: "" });
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        confetti({ particleCount: 140, spread: 80, origin: { y: 0.65 }, colors: ["#0B4A8F", "#12A4C6", "#B79BDB", "#ffffff"] });
    } catch (err) {
      const fields = err.fields || {};
      if (fields.time || fields.date) go(1);   // send the patient back to fix the slot
      setState({ status: "error", error: errorText(err) });
    }
  }

  const slide = { enter: (d) => ({ x: d * 40, opacity: 0 }), center: { x: 0, opacity: 1 }, exit: (d) => ({ x: d * -40, opacity: 0 }) };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[80] grid place-items-center bg-ink/60 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div role="dialog" aria-modal="true" aria-label="Book an appointment" onClick={(e) => e.stopPropagation()}
            initial={{ y: 40, scale: 0.97, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
            className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 md:p-8">
            <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 rounded-full p-2 hover:bg-mist"><X size={20} /></button>

            {state.status === "done" ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-12 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.15 }}>
                  <CheckCircle2 className="mx-auto text-cyan" size={72} />
                </motion.div>
                <h3 className="mt-4 font-display text-3xl font-bold">Request received</h3>
                <p className="mx-auto mt-2 max-w-sm text-ink/70">We will call {f.phone} to confirm your visit on {f.date} at {f.time}.</p>
                <button onClick={onClose} className="btn btn-primary mt-7">Done</button>
              </motion.div>
            ) : (
              <>
                <h3 className="font-display text-2xl font-bold">Book an appointment</h3>
                <ol className="mt-5 flex gap-2" aria-label="Progress">
                  {STEPS.map((s, i) => (
                    <li key={s} className="flex-1">
                      <div className="h-1.5 overflow-hidden rounded-full bg-ink/10"><motion.div className="h-full bg-cyan" animate={{ width: i <= step ? "100%" : "0%" }} /></div>
                      <p className={`mt-1 text-xs font-semibold ${i === step ? "text-deep" : "text-ink/40"}`}>{s}</p>
                    </li>
                  ))}
                </ol>

                <form onSubmit={submit} className="mt-6 overflow-hidden">
                  <AnimatePresence mode="wait" custom={dir}>
                    <motion.div key={step} custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.22 }} className="grid gap-4">
                      {step === 0 && (<>
                        <label>Service
                          <select required className="field mt-1" value={f.service} onChange={set("service")}>
                            <option value="">Select a service</option>
                            {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                          </select></label>
                        <label>Hospital
                          <select required className="field mt-1" value={f.location} onChange={set("location")}>
                            <option value="">Select a hospital</option>
                            {locations.filter((l) => l.accepts_bookings).map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                          </select></label>
                      </>)}
                      {step === 1 && (<>
                        <label>Date<input type="date" min={today()} className="field mt-1" value={f.date} onChange={set("date")} /></label>
                        {slots && (slots.length === 0
                          ? <p className="rounded-xl bg-lilac-soft p-3">No free slots on this date. Try another day.</p>
                          : <div className="flex flex-wrap gap-2" role="group" aria-label="Available times">
                              {slots.map((t) => (
                                <button type="button" key={t} aria-pressed={f.time === t} onClick={() => setF((p) => ({ ...p, time: t }))}
                                  className={`rounded-full border px-4 py-2 font-medium transition ${f.time === t ? "border-deep bg-deep text-white" : "border-ink/15 hover:border-cyan hover:bg-cyan-soft"}`}>{t}</button>
                              ))}
                            </div>)}
                      </>)}
                      {step === 2 && (<>
                        <label>Patient name<input required className="field mt-1" value={f.patient_name} onChange={set("patient_name")} autoComplete="name" /></label>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <label>Mobile number<input required inputMode="tel" placeholder="01XXXXXXXXX" className="field mt-1" value={f.phone} onChange={set("phone")} autoComplete="tel" /></label>
                          <label>Age<input required type="number" min="0" max="120" className="field mt-1" value={f.age} onChange={set("age")} /></label>
                        </div>
                        <label>Describe the problem (optional)<textarea rows="3" maxLength="1000" className="field mt-1" value={f.notes} onChange={set("notes")} /></label>
                      </>)}
                    </motion.div>
                  </AnimatePresence>

                  {state.error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-red-800">{state.error}</p>}
                  <div className="mt-6 flex items-center justify-between">
                    {step > 0 ? <button type="button" onClick={() => go(step - 1)} className="btn btn-ghost !py-2"><ArrowLeft size={16} /> Back</button> : <span />}
                    {step < 2
                      ? <button type="button" disabled={!canNext} onClick={() => go(step + 1)} className="btn btn-primary disabled:opacity-40">Continue</button>
                      : <button disabled={!canNext || state.status === "sending"} className="btn btn-primary btn-glow disabled:opacity-40">{state.status === "sending" ? "Sending…" : "Request appointment"}</button>}
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
