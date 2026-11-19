import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useState } from "react";
import { api, errorText } from "../api";

function ReviewForm() {
  const [f, setF] = useState({ patient_name: "", rating: 5, text: "" });
  const [msg, setMsg] = useState("");
  async function submit(e) {
    e.preventDefault();
    try { await api.review({ ...f, rating: Number(f.rating) }); setMsg("Thank you. Your review will appear after it is checked."); setF({ patient_name: "", rating: 5, text: "" }); }
    catch (err) { setMsg(errorText(err)); }
  }
  return (
    <form onSubmit={submit} className="mx-auto mt-10 grid max-w-xl gap-3 text-left">
      <input required className="field" placeholder="Your name" value={f.patient_name} onChange={(e) => setF({ ...f, patient_name: e.target.value })} />
      <select className="field" aria-label="Rating" value={f.rating} onChange={(e) => setF({ ...f, rating: e.target.value })}>
        {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 && "s"}</option>)}
      </select>
      <textarea required rows="3" maxLength="600" className="field" placeholder="Share your experience" value={f.text} onChange={(e) => setF({ ...f, text: e.target.value })} />
      <button className="btn btn-primary">Send review</button>
      {msg && <p role="status" className="text-center text-ink/70">{msg}</p>}
    </form>
  );
}

export default function Testimonials({ items }) {
  const [i, setI] = useState(0);
  const cur = items[i % Math.max(items.length, 1)];
  const go = (d) => setI((i + d + items.length) % items.length);

  return (
    <section id="reviews" className="bg-mist">
      <div className="section text-center">
        <h2 className="font-display text-4xl font-bold md:text-5xl">Patient reviews</h2>
        {cur ? (
          <div className="mx-auto mt-10 max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.blockquote key={cur.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="rounded-3xl bg-white p-8 shadow-sm">
                <div className="flex justify-center gap-1 text-cyan" aria-label={`${cur.rating} out of 5 stars`}>
                  {Array.from({ length: cur.rating }, (_, k) => <Star key={k} size={20} fill="currentColor" />)}
                </div>
                <p className="mt-4 text-xl leading-relaxed">{cur.text}</p>
                <footer className="mt-4 font-semibold text-deep">{cur.patient_name}</footer>
              </motion.blockquote>
            </AnimatePresence>
            {items.length > 1 && (
              <div className="mt-6 flex justify-center gap-3">
                <button onClick={() => go(-1)} aria-label="Previous review" className="btn btn-ghost !p-3"><ChevronLeft /></button>
                <button onClick={() => go(1)} aria-label="Next review" className="btn btn-ghost !p-3"><ChevronRight /></button>
              </div>
            )}
          </div>
        ) : (
          <p className="mx-auto mt-6 max-w-md text-lg text-ink/70">No reviews yet. Treated by Dr. Fatima? Share your experience below.</p>
        )}
        <ReviewForm />
      </div>
    </section>
  );
}
