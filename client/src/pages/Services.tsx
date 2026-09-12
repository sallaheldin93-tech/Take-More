import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Check,
  Globe2,
  Layers3,
  Menu,
  MessageCircle,
  ShoppingCart,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { Link } from "wouter";

const services = [
  {
    icon: Layers3,
    image: "/manus-storage/erp-illustration_8dfcf856.png",
    serviceId: 1,
    number: "01",
    kicker: "OPERATIONS",
    title: "ERP Solutions",
    intro: "Bring finance, inventory and daily operations into one clear, connected system.",
    bullets: ["Finance and accounting workflows", "Inventory control and stock visibility", "Reports that help you act faster"],
    tone: "service-detail-cyan",
  },
  {
    icon: ShoppingCart,
    image: "/manus-storage/pos-illustration_680ba0c9.png",
    serviceId: 2,
    number: "02",
    kicker: "SALES",
    title: "POS Systems",
    intro: "Keep every transaction moving with a reliable point-of-sale experience built around your business.",
    bullets: ["Fast sales and billing", "Multi-branch support", "Daily reconciliation and insights"],
    tone: "service-detail-ice",
  },
  {
    icon: Globe2,
    image: "/manus-storage/website-illustration_d9df8bb4.png",
    serviceId: 3,
    number: "03",
    kicker: "PRESENCE",
    title: "Websites",
    intro: "Turn your digital presence into a practical business asset that builds trust and converts visitors.",
    bullets: ["Responsive, premium design", "Business and e-commerce builds", "SEO-friendly foundations"],
    tone: "service-detail-sky",
  },
  {
    icon: Zap,
    image: "/manus-storage/crm-illustration_83bed60d.png",
    serviceId: 4,
    number: "04",
    kicker: "GROWTH",
    title: "Business & CRM Automation",
    intro: "Make follow-ups, lead tracking and internal workflows simpler for your whole team.",
    bullets: ["Contact and lead tracking", "Task and follow-up automation", "Clear sales pipeline visibility"],
    tone: "service-detail-navy",
  },
];

export default function Services() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [brandMode, setBrandMode] = useState<"blue" | "white">(
    () => (localStorage.getItem("take-more-mode") as "blue" | "white") || "blue",
  );

  useEffect(() => {
    document.documentElement.dataset.brandMode = brandMode;
    localStorage.setItem("take-more-mode", brandMode);
  }, [brandMode]);

  useEffect(() => {
    const items = document.querySelectorAll(".scroll-reveal");
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12 },
    );
    items.forEach(item => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [mobileOpen]);

  return (
    <div className="services-page">
      <header className="topbar dark-header">
        <Link className="brand" href="/" onClick={() => setMobileOpen(false)}>
          <img
            src={brandMode === "white" ? "/manus-storage/take-more-logo-white_a363634f.png" : "/manus-storage/take-more-logo_88d6d8ae.png"}
            alt="Take More — Retail & Web, Made Smarter"
          />
        </Link>
        <nav id="services-mobile-nav" className={mobileOpen ? "main-nav mobile-open" : "main-nav"}>
          <Link href="/" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link className="active-nav" href="/services" onClick={() => setMobileOpen(false)}>Services</Link>
          <a href="/#why" onClick={() => setMobileOpen(false)}>Why us</a>
          <a href="/#contact" onClick={() => setMobileOpen(false)}>Contact</a>
          <Link className="nav-book" href="/?book=1" onClick={() => setMobileOpen(false)}>
            Book a call <ArrowUpRight size={15} />
          </Link>
        </nav>
        <button
          className="mobile-menu"
          onClick={() => setMobileOpen(value => !value)}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          aria-controls="services-mobile-nav"
        >
          {mobileOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
        <div className="header-actions">
          <button
            className="mode-toggle"
            onClick={() => setBrandMode(value => value === "blue" ? "white" : "blue")}
            aria-label="Toggle blue and white mode"
          >
            {brandMode === "blue" ? "White mode" : "Blue mode"}
          </button>
          <Link className="desktop-book" href="/?book=1">
            Get started <ArrowUpRight size={15} />
          </Link>
        </div>
      </header>
      {mobileOpen && <button className="mobile-nav-backdrop" aria-label="Close navigation menu" onClick={() => setMobileOpen(false)} />}

      <main>
        <section className="services-hero scroll-reveal">
          <p className="eyebrow">WHAT WE DO / SERVICES</p>
          <h1>Systems that make<br /><em>business feel lighter.</em></h1>
          <p>From operations to customer growth, we design and deliver the technology your business needs to move with more clarity.</p>
          <div className="services-hero-meta">
            <span><Sparkles size={16} /> Built around your reality</span>
            <span><BarChart3 size={16} /> Ready to scale</span>
          </div>
        </section>

        <section className="services-details">
          {services.map(({ icon: Icon, image, serviceId, number, kicker, title, intro, bullets, tone }) => (
            <article className={`service-detail-card ${tone} scroll-reveal`} key={title}>
              <div className="service-detail-top"><span className="service-detail-number">{number}</span><Icon size={27} /></div>
              <div className="service-detail-illustration"><img src={image} alt="" loading="lazy" /></div>
              <p className="eyebrow">{kicker}</p>
              <h2>{title}</h2>
              <p className="service-detail-intro">{intro}</p>
              <ul>{bullets.map(bullet => <li key={bullet}><Check size={16} />{bullet}</li>)}</ul>
              <Link className="detail-cta" href={`/?book=1&service=${serviceId}`}>Book a conversation <ArrowUpRight size={16} /></Link>
              <Link className="detail-book" href={`/?book=1&service=${serviceId}`}>احجز الآن <ArrowUpRight size={15} /></Link>
            </article>
          ))}
        </section>

        <section className="services-bottom scroll-reveal">
          <div><p className="eyebrow">NOT SURE WHERE TO START?</p><h2>Let's find the right<br /><em>next step together.</em></h2></div>
          <div><p>Tell us what is slowing the business down and we will recommend the simplest, most useful place to begin.</p><Link className="primary-button" href="/?book=1">Book a discovery call <ArrowUpRight size={17} /></Link></div>
        </section>
      </main>

      <footer className="footer">
        <Link className="brand" href="/">
          <img src={brandMode === "white" ? "/manus-storage/take-more-logo-white_a363634f.png" : "/manus-storage/take-more-logo_88d6d8ae.png"} alt="Take More — Retail & Web, Made Smarter" />
        </Link>
        <p>Smart Business Solutions — Helping businesses simplify operations & grow smarter.</p>
        <div className="footer-links">
          <a href="https://www.facebook.com/share/1C6TU1C2ub/?mibextid=wwXIfr" target="_blank" rel="noreferrer">Facebook</a>
          <a href="https://www.instagram.com/takemore.eg?stkn=YzJhYXNpYnJnZnFl&utm_source=qr" target="_blank" rel="noreferrer">Instagram</a>
          <Link href="/admin">Admin</Link>
        </div>
      </footer>
      <a className="floating-whatsapp" href="https://wa.me/201153213270" target="_blank" rel="noreferrer" aria-label="Chat with Take More on WhatsApp"><MessageCircle size={25} /><span>Chat with us</span></a>
    </div>
  );
}
