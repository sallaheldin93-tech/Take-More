import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Check,
  Globe2,
  Languages,
  Layers3,
  Menu,
  MessageCircle,
  Moon,
  ShoppingCart,
  Sparkles,
  Sun,
  X,
  Zap,
} from "lucide-react";
import { Link } from "wouter";

const servicesEn = [
  { icon: Layers3, image: "/assets/erp-illustration.webp", serviceId: 1, number: "01", kicker: "OPERATIONS", title: "ERP Solutions", intro: "Bring finance, inventory and daily operations into one clear, connected system.", bullets: ["Finance and accounting workflows", "Inventory control and stock visibility", "Reports that help you act faster"], tone: "service-detail-cyan" },
  { icon: ShoppingCart, image: "/assets/pos-illustration.webp", serviceId: 2, number: "02", kicker: "SALES", title: "POS Systems", intro: "Keep every transaction moving with a reliable point-of-sale experience built around your business.", bullets: ["Fast sales and billing", "Multi-branch support", "Daily reconciliation and insights"], tone: "service-detail-ice" },
  { icon: Globe2, image: "/assets/website-illustration.webp", serviceId: 3, number: "03", kicker: "PRESENCE", title: "Websites", intro: "Turn your digital presence into a practical business asset that builds trust and converts visitors.", bullets: ["Responsive, premium design", "Business and e-commerce builds", "SEO-friendly foundations"], tone: "service-detail-sky" },
  { icon: Zap, image: "/assets/crm-illustration.webp", serviceId: 4, number: "04", kicker: "GROWTH", title: "Business & CRM Automation", intro: "Make follow-ups, lead tracking and internal workflows simpler for your whole team.", bullets: ["Contact and lead tracking", "Task and follow-up automation", "Clear sales pipeline visibility"], tone: "service-detail-navy" },
];

const servicesAr = [
  { icon: Layers3, image: "/assets/erp-illustration.webp", serviceId: 1, number: "01", kicker: "العمليات", title: "حلول ERP", intro: "اربط الحسابات والمخزون والعمليات اليومية داخل نظام واحد واضح ومتكامل.", bullets: ["إدارة الحسابات والمالية", "مراقبة المخزون وتوفر المنتجات", "تقارير تساعدك على اتخاذ القرار"], tone: "service-detail-cyan" },
  { icon: ShoppingCart, image: "/assets/pos-illustration.webp", serviceId: 2, number: "02", kicker: "المبيعات", title: "أنظمة نقاط البيع", intro: "حافظ على سرعة كل عملية بيع من خلال تجربة نقاط بيع موثوقة ومصممة لنشاطك.", bullets: ["مبيعات وفواتير سريعة", "دعم الفروع المتعددة", "تسويات وتقارير يومية"], tone: "service-detail-ice" },
  { icon: Globe2, image: "/assets/website-illustration.webp", serviceId: 3, number: "03", kicker: "الحضور الرقمي", title: "تصميم وتطوير المواقع", intro: "حوّل حضورك الرقمي إلى أصل تجاري يعزز الثقة ويحول الزوار إلى عملاء.", bullets: ["تصميم احترافي ومتجاوب", "مواقع أعمال ومتاجر إلكترونية", "أساس قوي لمحركات البحث"], tone: "service-detail-sky" },
  { icon: Zap, image: "/assets/crm-illustration.webp", serviceId: 4, number: "04", kicker: "النمو", title: "أتمتة الأعمال وCRM", intro: "بسّط المتابعات وإدارة العملاء وسير العمل الداخلي لفريقك بالكامل.", bullets: ["إدارة جهات الاتصال والعملاء", "أتمتة المهام والمتابعات", "رؤية واضحة لخط سير المبيعات"], tone: "service-detail-navy" },
];

const pageCopy = {
  en: {
    nav: { home: "Home", services: "Services", why: "Why us", contact: "Contact", book: "Book a call", start: "Get started" },
    whiteMode: "White", blueMode: "Blue", heroEyebrow: "WHAT WE DO / SERVICES", heroTitleA: "Systems that make", heroTitleB: "business feel lighter.", heroText: "From operations to customer growth, we design and deliver the technology your business needs to move with more clarity.", reality: "Built around your reality", scale: "Ready to scale", conversation: "Book a conversation", bookNow: "Book now", bottomEyebrow: "NOT SURE WHERE TO START?", bottomTitleA: "Let's find the right", bottomTitleB: "next step together.", bottomText: "Tell us what is slowing the business down and we will recommend the simplest, most useful place to begin.", discovery: "Book a discovery call", footer: "Smart Business Solutions — Helping businesses simplify operations and grow smarter.", chat: "Chat with us"
  },
  ar: {
    nav: { home: "الرئيسية", services: "خدماتنا", why: "لماذا نحن", contact: "تواصل معنا", book: "احجز مكالمة", start: "ابدأ الآن" },
    whiteMode: "أبيض", blueMode: "أزرق", heroEyebrow: "ماذا نقدم / خدماتنا", heroTitleA: "أنظمة تجعل", heroTitleB: "إدارة أعمالك أسهل.", heroText: "من إدارة العمليات إلى تنمية العملاء، نصمم وننفذ التقنية التي يحتاجها نشاطك للعمل بوضوح وكفاءة.", reality: "مصمم وفق احتياجاتك", scale: "جاهز للتوسع", conversation: "ناقش احتياجك معنا", bookNow: "احجز الآن", bottomEyebrow: "لا تعرف من أين تبدأ؟", bottomTitleA: "سنحدد معًا", bottomTitleB: "الخطوة المناسبة.", bottomText: "حدثنا عما يبطئ نشاطك وسنرشح لك أبسط نقطة بداية وأكثرها فائدة.", discovery: "احجز مكالمة استكشافية", footer: "حلول أعمال ذكية تساعد الشركات على تبسيط عملياتها والنمو بكفاءة.", chat: "تواصل معنا"
  }
} as const;

export default function Services() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [language, setLanguage] = useState<"en" | "ar">(() => {
    const requested = new URLSearchParams(window.location.search).get("lang");
    if (requested === "ar" || requested === "en") return requested;
    const saved = localStorage.getItem("take-more-language");
    if (saved === "ar" || saved === "en") return saved;
    return navigator.language.toLowerCase().startsWith("ar") ? "ar" : "en";
  });
  const [brandMode, setBrandMode] = useState<"blue" | "white">(() => (localStorage.getItem("take-more-mode") as "blue" | "white") || "blue");
  const content = pageCopy[language];
  const services = language === "ar" ? servicesAr : servicesEn;

  useEffect(() => {
    document.documentElement.dataset.brandMode = brandMode;
    localStorage.setItem("take-more-mode", brandMode);
  }, [brandMode]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    localStorage.setItem("take-more-language", language);
  }, [language]);

  useEffect(() => {
    const items = document.querySelectorAll(".scroll-reveal");
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    items.forEach(item => observer.observe(item));
    return () => observer.disconnect();
  }, [language]);

  useEffect(() => {
    if (!mobileOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [mobileOpen]);

  return (
    <div className="services-page" dir={language === "ar" ? "rtl" : "ltr"}>
      <header className="topbar dark-header">
        <Link className="brand" href="/" onClick={() => setMobileOpen(false)}><img src={brandMode === "white" ? "/assets/take-more-logo-white.png" : "/assets/take-more-logo.png"} alt="Take More — Retail & Web, Made Smarter" /></Link>
        <nav id="services-mobile-nav" className={mobileOpen ? "main-nav mobile-open" : "main-nav"}>
          <Link href="/" onClick={() => setMobileOpen(false)}>{content.nav.home}</Link>
          <Link className="active-nav" href="/services" onClick={() => setMobileOpen(false)}>{content.nav.services}</Link>
          <a href="/#why" onClick={() => setMobileOpen(false)}>{content.nav.why}</a>
          <a href="/#contact" onClick={() => setMobileOpen(false)}>{content.nav.contact}</a>
          <Link className="nav-book" href="/?book=1" onClick={() => setMobileOpen(false)}>{content.nav.book} <ArrowUpRight size={15} /></Link>
        </nav>
        <button className="mobile-menu" onClick={() => setMobileOpen(value => !value)} aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={mobileOpen} aria-controls="services-mobile-nav">{mobileOpen ? <X size={23} /> : <Menu size={23} />}</button>
        <div className="header-actions">
          <button className="language-switch" onClick={() => setLanguage(value => value === "en" ? "ar" : "en")} aria-label={language === "en" ? "عرض الموقع بالعربية" : "View website in English"}><Languages size={15} /><span>{language === "en" ? "العربية" : "EN"}</span></button>
          <button className="mode-toggle" onClick={() => setBrandMode(value => value === "blue" ? "white" : "blue")} aria-label={brandMode === "blue" ? "Switch to white mode" : "Switch to blue mode"}>{brandMode === "blue" ? <Sun size={15} /> : <Moon size={15} />}<span>{brandMode === "blue" ? content.whiteMode : content.blueMode}</span></button>
          <Link className="desktop-book" href="/?book=1">{content.nav.start} <ArrowUpRight size={15} /></Link>
        </div>
      </header>
      {mobileOpen && <button className="mobile-nav-backdrop" aria-label="Close navigation menu" onClick={() => setMobileOpen(false)} />}

      <main>
        <section className="services-hero scroll-reveal"><p className="eyebrow">{content.heroEyebrow}</p><h1>{content.heroTitleA}<br /><em>{content.heroTitleB}</em></h1><p>{content.heroText}</p><div className="services-hero-meta"><span><Sparkles size={16} /> {content.reality}</span><span><BarChart3 size={16} /> {content.scale}</span></div></section>
        <section className="services-details">{services.map(({ icon: Icon, image, serviceId, number, kicker, title, intro, bullets, tone }) => <article className={`service-detail-card ${tone} scroll-reveal`} key={title}><div className="service-detail-top"><span className="service-detail-number">{number}</span><Icon size={27} /></div><div className="service-detail-illustration"><img src={image} alt="" loading="lazy" /></div><p className="eyebrow">{kicker}</p><h2>{title}</h2><p className="service-detail-intro">{intro}</p><ul>{bullets.map(bullet => <li key={bullet}><Check size={16} />{bullet}</li>)}</ul><Link className="detail-cta" href={`/?book=1&service=${serviceId}`}>{content.conversation} <ArrowUpRight size={16} /></Link><Link className="detail-book" href={`/?book=1&service=${serviceId}`}>{content.bookNow} <ArrowUpRight size={15} /></Link></article>)}</section>
        <section className="services-bottom scroll-reveal"><div><p className="eyebrow">{content.bottomEyebrow}</p><h2>{content.bottomTitleA}<br /><em>{content.bottomTitleB}</em></h2></div><div><p>{content.bottomText}</p><Link className="primary-button" href="/?book=1">{content.discovery} <ArrowUpRight size={17} /></Link></div></section>
      </main>

      <footer className="footer"><Link className="brand" href="/"><img src={brandMode === "white" ? "/assets/take-more-logo-white.png" : "/assets/take-more-logo.png"} alt="Take More — Retail & Web, Made Smarter" /></Link><p>{content.footer}</p><div className="footer-links"><a href="https://www.facebook.com/share/1C6TU1C2ub/?mibextid=wwXIfr" target="_blank" rel="noreferrer">Facebook</a><a href="https://www.instagram.com/takemore.eg?stkn=YzJhYXNpYnJnZnFl&utm_source=qr" target="_blank" rel="noreferrer">Instagram</a><Link href="/admin">Admin</Link></div></footer>
      <a className="floating-whatsapp" href="https://wa.me/201153213270" target="_blank" rel="noreferrer" aria-label="Chat with Take More on WhatsApp"><MessageCircle size={25} /><span>{content.chat}</span></a>
    </div>
  );
}
