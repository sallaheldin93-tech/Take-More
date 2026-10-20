import { useEffect, useState } from "react";
import { ArrowUpLeft, ArrowUpRight, Check, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { applySeo } from "@/lib/seo";
import { SiteHeader } from "@/components/home/SiteHeader";

type Language = "en" | "ar";

const servicesEn = [
  { id: "erp", serviceId: 1, image: "/assets/erp-illustration.webp", tag: "01 / OPERATIONS", title: "ERP Solutions", intro: "Bring finance, inventory and daily operations into one clear, connected system.", bullets: ["Finance and accounting workflows", "Inventory control and stock visibility", "Reports that help you act faster"] },
  { id: "pos", serviceId: 2, image: "/assets/pos-illustration.webp", tag: "02 / SALES", title: "POS Systems", intro: "Keep every transaction moving with a reliable point-of-sale experience built around your business.", bullets: ["Fast sales and billing", "Multi-branch support", "Daily reconciliation and insights"] },
  { id: "websites", serviceId: 3, image: "/assets/website-illustration.webp", tag: "03 / PRESENCE", title: "Websites", intro: "Turn your digital presence into a practical business asset that builds trust and converts visitors.", bullets: ["Responsive, premium design", "Business and e-commerce builds", "SEO-friendly foundations"] },
  { id: "crm", serviceId: 4, image: "/assets/crm-illustration.webp", tag: "04 / GROWTH", title: "Business & CRM Automation", intro: "Make follow-ups, lead tracking and internal workflows simpler for your whole team.", bullets: ["Contact and lead tracking", "Task and follow-up automation", "Clear sales pipeline visibility"] },
];

const servicesAr = [
  { id: "erp", serviceId: 1, image: "/assets/erp-illustration.webp", tag: "01 / العمليات", title: "حلول ERP", intro: "اربط الحسابات والمخزون والعمليات اليومية داخل نظام واحد واضح ومتكامل.", bullets: ["إدارة الحسابات والمالية", "مراقبة المخزون وتوفر المنتجات", "تقارير تساعدك على اتخاذ القرار"] },
  { id: "pos", serviceId: 2, image: "/assets/pos-illustration.webp", tag: "02 / المبيعات", title: "أنظمة نقاط البيع", intro: "حافظ على سرعة كل عملية بيع من خلال تجربة نقاط بيع موثوقة ومصممة لنشاطك.", bullets: ["مبيعات وفواتير سريعة", "دعم الفروع المتعددة", "تسويات وتقارير يومية"] },
  { id: "websites", serviceId: 3, image: "/assets/website-illustration.webp", tag: "03 / الحضور الرقمي", title: "تصميم وتطوير المواقع", intro: "حوّل حضورك الرقمي إلى أصل تجاري يعزز الثقة ويحول الزوار إلى عملاء.", bullets: ["تصميم احترافي ومتجاوب", "مواقع أعمال ومتاجر إلكترونية", "أساس قوي لمحركات البحث"] },
  { id: "crm", serviceId: 4, image: "/assets/crm-illustration.webp", tag: "04 / النمو", title: "أتمتة الأعمال وCRM", intro: "بسّط المتابعات وإدارة العملاء وسير العمل الداخلي لفريقك بالكامل.", bullets: ["إدارة جهات الاتصال والعملاء", "أتمتة المهام والمتابعات", "رؤية واضحة لخط سير المبيعات"] },
];

const pageCopy = {
  en: { eyebrow: "WHAT WE DO / SERVICES", titleA: "Systems that make", titleB: "business feel lighter.", text: "From operations to customer growth, we design and deliver the technology your business needs to move with more clarity.", explore: "See the services", book: "Book a call", bookService: "Book this service", bottomEyebrow: "NOT SURE WHERE TO START?", bottomTitle: "Let's find the right next step together.", bottomText: "Tell us what is slowing the business down and we will recommend the simplest, most useful place to begin.", discovery: "Book a discovery call", footer: "Smart Business Solutions — Helping businesses simplify operations and grow smarter.", chat: "Chat with us" },
  ar: { eyebrow: "ماذا نقدم / خدماتنا", titleA: "أنظمة تجعل", titleB: "إدارة أعمالك أسهل.", text: "من إدارة العمليات إلى تنمية العملاء، نصمم وننفذ التقنية التي يحتاجها نشاطك للعمل بوضوح وكفاءة.", explore: "استعرض الخدمات", book: "احجز مكالمة", bookService: "احجز هذه الخدمة", bottomEyebrow: "لا تعرف من أين تبدأ؟", bottomTitle: "سنحدد معًا الخطوة المناسبة.", bottomText: "حدثنا عما يبطئ نشاطك وسنرشح لك أبسط نقطة بداية وأكثرها فائدة.", discovery: "احجز مكالمة استكشافية", footer: "حلول أعمال ذكية تساعد الشركات على تبسيط عملياتها والنمو بكفاءة.", chat: "تواصل معنا" },
} as const;

const seoServices = (language: Language) => (language === "ar" ? servicesAr : servicesEn).map(service => ({ name: service.title, description: service.intro, slug: `/services#service-${service.id}` }));

export default function Services() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [language, setLanguage] = useState<Language>(() => {
    const requested = new URLSearchParams(window.location.search).get("lang");
    if (requested === "ar" || requested === "en") return requested;
    const saved = localStorage.getItem("take-more-language");
    if (saved === "ar" || saved === "en") return saved;
    return navigator.language.toLowerCase().startsWith("ar") ? "ar" : "en";
  });
  const copy = pageCopy[language];
  const services = language === "ar" ? servicesAr : servicesEn;
  const Arrow = language === "ar" ? ArrowUpLeft : ArrowUpRight;

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    localStorage.setItem("take-more-language", language);
    const seo = language === "ar"
      ? { title: "خدمات Take More | ERP ونقاط البيع والمواقع وأتمتة الأعمال", description: "اكتشف خدمات Take More في مصر: حلول ERP، أنظمة نقاط البيع، تصميم المواقع والمتاجر الإلكترونية، وCRM وأتمتة الأعمال.", keywords: "ERP مصر, نقاط البيع, تصميم مواقع, متجر إلكتروني, CRM, أتمتة الأعمال" }
      : { title: "Take More Services | ERP, POS, Websites and Automation", description: "Explore Take More business technology services in Egypt: ERP, POS systems, websites, e-commerce and CRM automation.", keywords: "ERP Egypt, POS systems, website development, e-commerce, CRM automation" };
    applySeo({ ...seo, lang: language, path: "/services", services: seoServices(language) });
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
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setMobileOpen(false); };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [mobileOpen]);

  const navigate = (id: string) => {
    setMobileOpen(false);
    if (id === "services") {
      document.getElementById("service-list")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    window.location.href = id === "home" ? "/" : `/#${id}`;
  };

  return (
    <div className="site-shell sd-page" dir={language === "ar" ? "rtl" : "ltr"}>
      <SiteHeader
        language={language}
        activeSection="services"
        mobileOpen={mobileOpen}
        onToggleMobile={() => setMobileOpen(value => !value)}
        onNavigate={navigate}
        onToggleLanguage={() => setLanguage(value => value === "en" ? "ar" : "en")}
        onStart={() => { window.location.href = "/?book=1"; }}
      />
      {mobileOpen && <button className="mobile-nav-backdrop" aria-label="Close navigation menu" onClick={() => setMobileOpen(false)} />}

      <main>
        <section className="sd-hero sd-subhero">
          <p className="sd-eyebrow">{copy.eyebrow}</p>
          <h1 className="sd-display sd-display-xl">{copy.titleA}<br /><span className="sd-mark">{copy.titleB}</span></h1>
          <p className="sd-hero-text">{copy.text}</p>
          <div className="sd-hero-actions">
            <Link className="sd-pill sd-pill-dark" href="/?book=1">{copy.book}</Link>
            <button type="button" className="sd-pill" onClick={() => navigate("services")}>{copy.explore}</button>
          </div>
        </section>

        <section id="service-list" className="sd-section sd-detail-list" aria-label={copy.explore}>
          {services.map(service => (
            <article id={`service-${service.id}`} className="sd-detail scroll-reveal" key={service.id}>
              <div className="sd-detail-media">
                <img src={service.image} alt={service.title} loading="lazy" />
              </div>
              <div className="sd-detail-body">
                <p className="sd-service-tag">{service.tag}</p>
                <h2>{service.title}</h2>
                <p className="sd-detail-intro">{service.intro}</p>
                <ul className="sd-detail-points">
                  {service.bullets.map(bullet => <li key={bullet}><Check size={16} aria-hidden="true" />{bullet}</li>)}
                </ul>
                <Link className="sd-pill sd-pill-dark sd-detail-cta" href={`/?book=1&service=${service.serviceId}`}>
                  {copy.bookService} <Arrow size={16} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </section>

        <section className="sd-section sd-closing scroll-reveal">
          <p className="sd-eyebrow">{copy.bottomEyebrow}</p>
          <h2 className="sd-display">{copy.bottomTitle}</h2>
          <p className="sd-lede">{copy.bottomText}</p>
          <div className="sd-hero-actions">
            <Link className="sd-pill sd-pill-dark" href="/?book=1">{copy.discovery}</Link>
          </div>
        </section>
      </main>

      <footer className="footer">
        <Link className="brand" href="/"><img src="/assets/take-more-logo.png" alt="Take More" /></Link>
        <p>{copy.footer}</p>
        <div className="footer-links">
          <a href="https://www.facebook.com/share/1C6TU1C2ub/?mibextid=wwXIfr" target="_blank" rel="noreferrer">Facebook</a>
          <a href="https://www.instagram.com/takemore.eg?stkn=YzJhYXNpYnJnZnFl&utm_source=qr" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a>
          <Link href="/admin">Admin</Link>
        </div>
      </footer>
      <a className="floating-whatsapp" href="https://wa.me/201153213270" target="_blank" rel="noreferrer" aria-label="Chat with Take More on WhatsApp"><MessageCircle size={25} /><span>{copy.chat}</span></a>
    </div>
  );
}
