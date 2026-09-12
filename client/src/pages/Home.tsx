import { useMemo, useState } from "react";
import { Link } from "wouter";
import { CalendarDays, Check, ChevronDown, Clock3, Facebook, Instagram, Linkedin, Layers3, Menu, MessageCircle, MoveUpRight, Phone, ShieldCheck, Sparkles, X, Zap } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const serviceCopy = [
  { icon: Layers3, eyebrow: "01 / OPERATIONS", title: "ERP Solutions", description: "End-to-end enterprise planning that unifies finance, inventory and operations in one connected system.", bullets: ["Finance & accounting", "Inventory control", "Reporting & analytics"], tone: "lime" },
  { icon: Zap, eyebrow: "02 / SALES", title: "POS Systems", description: "Fast and reliable point-of-sale solutions for retail, restaurants and services that keep every transaction flowing.", bullets: ["Sales & billing", "Multi-branch support", "Daily reconciliation"], tone: "sky" },
  { icon: Sparkles, eyebrow: "03 / PRESENCE", title: "Websites", description: "Modern, high-performance websites designed to build trust, tell your story and convert visitors into customers.", bullets: ["Responsive design", "Business & e-commerce", "SEO-friendly build"], tone: "ice" },
  { icon: ShieldCheck, eyebrow: "04 / GROWTH", title: "Business & CRM Automation", description: "Automation that streamlines customer relationships, follow-ups and internal workflows so your team works smarter.", bullets: ["Contact & lead tracking", "Task automation", "Sales pipeline"], tone: "blue" },
] as const;

function BookingPanel({ onClose }: { onClose?: () => void }) {
  const config = trpc.booking.config.useQuery();
  const [serviceId, setServiceId] = useState<number>();
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [form, setForm] = useState({ customerName: "", customerPhone: "", customerEmail: "", notes: "" });
  const slots = trpc.booking.availableSlots.useQuery({ serviceId: serviceId || 1, date }, { enabled: Boolean(serviceId && date) });
  const createBooking = trpc.booking.create.useMutation({
    onSuccess: result => {
      toast.success(`Booking confirmed — ${result.bookingCode}`);
      setSlot("");
      setDate("");
      setForm({ customerName: "", customerPhone: "", customerEmail: "", notes: "" });
      onClose?.();
    },
    onError: error => toast.error(error.message),
  });
  const selectedService = config.data?.services.find(item => item.id === serviceId);
  const minDate = useMemo(() => new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10), []);
  const update = (field: keyof typeof form, value: string) => setForm(current => ({ ...current, [field]: value }));
  return (
    <div className="booking-panel" id="book">
      <div className="booking-panel-heading">
        <div><p className="eyebrow">BOOK A DISCOVERY CALL</p><h3>Choose a time that works.</h3></div>
        {onClose && <button className="icon-button" onClick={onClose} aria-label="Close booking"><X size={18} /></button>}
      </div>
      <div className="booking-steps"><span className={serviceId ? "step active" : "step"}>01 <b>Service</b></span><span className={date ? "step active" : "step"}>02 <b>Date & time</b></span><span className={slot ? "step active" : "step"}>03 <b>Your details</b></span></div>
      <div className="booking-grid">
        <label>What do you need?<select value={serviceId ?? ""} onChange={event => { setServiceId(Number(event.target.value)); setSlot(""); }}><option value="">Select a service</option>{config.data?.services.map(service => <option key={service.id} value={service.id}>{service.name} · {service.durationMinutes} min</option>)}</select></label>
        <label>Preferred date<input type="date" min={minDate} value={date} onChange={event => { setDate(event.target.value); setSlot(""); }} /></label>
      </div>
      {serviceId && date && <div className="slot-section"><div className="field-heading"><span>Available times</span><small>{selectedService?.durationMinutes} minute session</small></div><div className="slot-grid">{slots.isLoading ? <span className="muted">Checking live availability…</span> : slots.data?.length ? slots.data.map(value => { const time = new Date(value).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Cairo" }); return <button type="button" key={value} className={slot === value ? "slot selected" : "slot"} onClick={() => setSlot(value)}>{time}</button>; }) : <span className="muted">No times left on this day. Try another date.</span>}</div></div>}
      {slot && <div className="details-fields"><Input placeholder="Full name" value={form.customerName} onChange={event => update("customerName", event.target.value)} /><Input placeholder="WhatsApp number (with country code)" value={form.customerPhone} onChange={event => update("customerPhone", event.target.value)} /><Input type="email" placeholder="Email (optional)" value={form.customerEmail} onChange={event => update("customerEmail", event.target.value)} /><Textarea className="full-field" placeholder="Tell us a little about your business (optional)" value={form.notes} onChange={event => update("notes", event.target.value)} /></div>}
      <div className="booking-footer"><p><MessageCircle size={16} /> Confirmation is sent to your WhatsApp.</p><Button className="primary-button" disabled={!slot || !form.customerName || !form.customerPhone || createBooking.isPending} onClick={() => createBooking.mutate({ serviceId: serviceId!, startAt: slot, ...form })}>{createBooking.isPending ? "Confirming…" : "Confirm booking"}<MoveUpRight size={17} /></Button></div>
    </div>
  );
}

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const scrollTo = (id: string) => { setMobileOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  return <div className="site-shell">
    <header className="topbar"><a className="brand" href="#home" onClick={() => scrollTo("home")}><img src="/manus-storage/take-more-logo_88d6d8ae.png" alt="Take More — Retail & Web, Made Smarter" /></a><nav className={mobileOpen ? "main-nav mobile-open" : "main-nav"}><button onClick={() => scrollTo("home")}>Home</button><button onClick={() => scrollTo("services")}>Services</button><button onClick={() => scrollTo("why")}>Why us</button><button onClick={() => scrollTo("contact")}>Contact</button><button className="nav-book" onClick={() => { setBookingOpen(true); setMobileOpen(false); }}>Book a call <MoveUpRight size={15} /></button></nav><button className="mobile-menu" onClick={() => setMobileOpen(value => !value)} aria-label="Toggle menu">{mobileOpen ? <X /> : <Menu />}</button><button className="desktop-book" onClick={() => setBookingOpen(true)}>Get started <MoveUpRight size={15} /></button></header>
    <main>
      <section id="home" className="hero container"><div className="hero-copy"><p className="eyebrow reveal">SOFTWARE FOR THE REAL WORLD</p><h1 className="reveal delay-1">Software that runs<br /><em>your entire</em> business.</h1><p className="hero-text reveal delay-2">ERP <span>•</span> POS <span>•</span> Websites <span>•</span> Business & CRM Automation. Helping businesses simplify operations & grow smarter.</p><div className="hero-actions reveal delay-3"><Button className="primary-button" onClick={() => setBookingOpen(true)}>Book a discovery call <MoveUpRight size={17} /></Button><button className="text-link" onClick={() => scrollTo("services")}>Explore services <ChevronDown size={16} /></button></div></div><div className="hero-visual reveal delay-2"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="dashboard-card"><div className="dashboard-top"><span className="tiny-dot" /><span>TM / dashboard</span><span className="live-pill">LIVE</span></div><div className="dashboard-number">+38.4% <span>↗</span></div><p>business efficiency</p><div className="mini-bars"><i /><i /><i /><i /><i /><i /><i /></div><div className="dashboard-bottom"><span>ERP</span><span>POS</span><span>CRM</span></div></div><div className="floating-note"><span className="green-check"><Check size={13} /></span><div><strong>All systems go</strong><small>Everything connected</small></div></div><div className="hero-sticker">BUILT<br /><span>TO</span><br />GROW</div></div></section>
      <section className="proof-strip container"><div><strong>50<span>+</span></strong><small>Happy clients</small></div><div><strong>120<span>+</span></strong><small>Projects delivered</small></div><div><strong>8<span>+</span></strong><small>Years of experience</small></div><div className="proof-note">We make complex<br /><em>feel simple.</em></div></section>
      <section id="services" className="services-section container"><div className="section-intro"><div><p className="eyebrow">WHAT WE DO</p><h2>One partner for<br /><em>your business software.</em></h2></div><p>From daily operations to customer growth — we deliver the systems your business runs on.</p></div><div className="service-grid">{serviceCopy.map(({ icon: Icon, eyebrow, title, description, bullets, tone }, index) => <article className={`service-card ${tone}`} key={title}><div className="service-icon"><Icon size={22} /></div><p className="eyebrow">{eyebrow}</p><h3>{title}</h3><p className="service-description">{description}</p><ul>{bullets.map(item => <li key={item}><Check size={15} />{item}</li>)}</ul><button className="card-link" onClick={() => setBookingOpen(true)}>Get started <MoveUpRight size={15} /></button><span className="card-number">0{index + 1}</span></article>)}</div></section>
      <section id="why" className="why-section container"><div className="why-art"><div className="art-square square-one" /><div className="art-square square-two" /><div className="art-square square-three" /><span>ERP<br /><b>•</b> POS<br /><b>•</b> CRM</span></div><div className="why-copy"><p className="eyebrow">WHY TAKE MORE</p><h2>Everything your business<br /><em>needs, in one place.</em></h2><p>We combine technical know-how with business thinking. No jargon, no disconnected tools — just technology that works harder for you.</p><div className="why-points"><div><span>01</span><strong>Clear thinking</strong><small>Solutions designed around your reality.</small></div><div><span>02</span><strong>Built to scale</strong><small>Systems that grow with your ambition.</small></div></div></div></section>
      <section id="contact" className="contact-section container"><div><p className="eyebrow">READY TO SIMPLIFY?</p><h2>Let's make your<br /><em>next move smarter.</em></h2></div><div className="contact-card"><p>Tell us about your business and we will recommend the right software and automation for your growth.</p><button className="primary-button" onClick={() => setBookingOpen(true)}>Tell us about your business <MoveUpRight size={17} /></button><div className="contact-meta"><span><Phone size={14} /> Cairo, Egypt</span><a className="whatsapp-contact" href="https://wa.me/201153213270" target="_blank" rel="noreferrer"><MessageCircle size={14} /> WhatsApp +201153213270</a></div><div className="contact-socials"><span>Connect with us</span><div><a className="contact-social facebook" href="https://www.facebook.com/share/1C6TU1C2ub/?mibextid=wwXIfr" target="_blank" rel="noreferrer" aria-label="Take More on Facebook"><Facebook size={17} /></a><a className="contact-social instagram" href="https://www.instagram.com/takemore.eg?stkn=YzJhYXNpYnJnZnFl&utm_source=qr" target="_blank" rel="noreferrer" aria-label="Take More on Instagram"><Instagram size={17} /></a><a className="contact-social linkedin disabled" href="#contact" aria-label="LinkedIn link coming soon" onClick={event => event.preventDefault()}><Linkedin size={17} /></a></div></div></div></section>
    </main>
    <footer className="footer container"><a className="brand" href="#home"><img src="/manus-storage/take-more-logo_88d6d8ae.png" alt="Take More — Retail & Web, Made Smarter" /></a><p>Smart Business Solutions — Helping businesses simplify operations & grow smarter.</p><div className="footer-links"><a className="social-link facebook" href="https://www.facebook.com/share/1C6TU1C2ub/?mibextid=wwXIfr" target="_blank" rel="noreferrer"><Facebook size={16} /><span>Facebook</span></a><a className="social-link instagram" href="https://www.instagram.com/takemore.eg?stkn=YzJhYXNpYnJnZnFl&utm_source=qr" target="_blank" rel="noreferrer"><Instagram size={16} /><span>Instagram</span></a><a className="social-link linkedin" href="https://www.linkedin.com/" target="_blank" rel="noreferrer"><Linkedin size={16} /><span>LinkedIn</span></a><Link href="/admin">Admin</Link></div></footer>
    {bookingOpen && <div className="modal-backdrop" onClick={event => { if (event.target === event.currentTarget) setBookingOpen(false); }}><BookingPanel onClose={() => setBookingOpen(false)} /></div>}
  </div>;
}
