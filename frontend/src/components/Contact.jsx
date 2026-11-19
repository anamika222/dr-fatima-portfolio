import { Facebook, MessageSquare, Phone } from "lucide-react";
import { useState } from "react";
import { api, errorText } from "../api";

function ContactForm() {
  const [f, setF] = useState({ name: "", phone: "", message: "" });
  const [msg, setMsg] = useState("");
  async function submit(e) {
    e.preventDefault();
    try { await api.contact(f); setMsg("Message sent. We will call you back."); setF({ name: "", phone: "", message: "" }); }
    catch (err) { setMsg(errorText(err)); }
  }
  return (
    <form onSubmit={submit} className="grid gap-3">
      <input required className="field !border-white/20 !bg-white/10 placeholder:text-white/50" placeholder="Name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
      <input required inputMode="tel" className="field !border-white/20 !bg-white/10 placeholder:text-white/50" placeholder="Mobile number" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
      <textarea required rows="3" className="field !border-white/20 !bg-white/10 placeholder:text-white/50" placeholder="Message" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
      <button className="btn bg-cyan text-ink hover:bg-white">Send message</button>
      {msg && <p role="status" className="text-white/80">{msg}</p>}
    </form>
  );
}

export default function Contact({ profile, onBook }) {
  const tel = profile.phone.replace(/-/g, "");
  return (
    <footer id="contact" className="bg-ink text-white">
      <div className="section grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="font-display text-4xl font-bold">Contact</h2>
          <a href={`tel:${tel}`} className="mt-6 flex items-center gap-3 text-2xl font-semibold hover:text-cyan"><Phone /> {profile.phone}</a>
          {profile.facebook_url && (
            <a href={profile.facebook_url} target="_blank" rel="noreferrer" className="mt-4 flex items-center gap-3 text-white/80 hover:text-cyan">
              <Facebook /> {profile.name} - {profile.title}
            </a>
          )}
          <nav aria-label="Footer" className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-white/70">
            {["about", "services", "locations", "faq", "reviews"].map((id) => <a key={id} href={`#${id}`} className="capitalize hover:text-white">{id}</a>)}
          </nav>
          <button onClick={() => onBook()} className="btn mt-8 bg-cyan text-ink hover:bg-white"><MessageSquare size={18} /> Book appointment</button>
        </div>
        <ContactForm />
      </div>
      <p className="border-t border-white/10 px-5 py-6 text-center text-sm text-white/50">
        © {new Date().getFullYear()} {profile.name}. This site does not replace in-person medical advice.
      </p>
    </footer>
  );
}
