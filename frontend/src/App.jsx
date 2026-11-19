import { useState } from "react";
import { api } from "./api";
import { FAQS, LOCATIONS, PROFILE, SERVICES, STATS } from "./data";
import { useApi } from "./hooks";
import About from "./components/About";
import BookingModal from "./components/BookingModal";
import Contact from "./components/Contact";
import FAQ from "./components/FAQ";
import Hero from "./components/Hero";
import Locations from "./components/Locations";
import Services from "./components/Services";
import SpineProgress from "./components/SpineProgress";
import Testimonials from "./components/Testimonials";
import { Cursor, FloatingActions, Magnetic, ScrollBar } from "./components/ui";

const NAV = [["about", "About"], ["services", "Services"], ["locations", "Chambers"], ["faq", "FAQ"], ["contact", "Contact"]];

export default function App() {
  const [profile] = useApi(api.profile, PROFILE);
  const [services] = useApi(api.services, SERVICES);
  const [locations] = useApi(api.locations, LOCATIONS);
  const [stats] = useApi(api.stats, STATS);
  const [faqs] = useApi(api.faqs, FAQS);
  const [reviews] = useApi(api.testimonials, []);
  const [booking, setBooking] = useState({ open: false, preset: null });

  // Any button can open the modal, optionally with a service and/or hospital preselected.
  const onBook = (service = null, location = null) => setBooking({ open: true, preset: { service, location } });

  return (
    <>
      <ScrollBar />
      <Cursor />
      <nav className="fixed inset-x-0 top-1 z-40 mx-auto max-w-6xl px-3">
        <div className="glass mt-2 flex items-center justify-between rounded-full px-5 py-2.5 shadow-sm">
          <a href="#top" className="font-display text-lg font-bold">Dr. Fatima Sultana</a>
          <div className="hidden gap-6 font-medium md:flex">
            {NAV.map(([id, label]) => <a key={id} href={`#${id}`} className="hover:text-deep">{label}</a>)}
          </div>
          <Magnetic onClick={() => onBook()} className="btn btn-primary !px-5 !py-2">Book</Magnetic>
        </div>
      </nav>
      <SpineProgress />
      <Hero profile={profile} stats={stats} onBook={onBook} />
      <main>
        <About profile={profile} locations={locations} />
        <Services services={services} onBook={onBook} />
        <Locations locations={locations} onBook={onBook} />
        <FAQ items={faqs} />
        <Testimonials items={reviews} />
      </main>
      <Contact profile={profile} onBook={onBook} />
      <FloatingActions phone={profile.phone} />
      <BookingModal open={booking.open} preset={booking.preset} onClose={() => setBooking({ open: false, preset: null })} services={services} locations={locations} />
    </>
  );
}
