type Language = "en" | "ar";

type Capability = { src: string; title: string; text: string; items: string[]; alt: string };

const copy: Record<Language, { eyebrow: string; title: string; note: string; badge: string; list: Capability[] }> = {
  ar: {
    eyebrow: "إيه اللي بنبنيه",
    title: "حلول رقمية لكل جزء في شغلك.",
    note: "الصور هنا نماذج توضيحية لنوع الحلول اللي بنقدمها، مش مشاريع عملاء.",
    badge: "نموذج توضيحي",
    list: [
      { src: "/assets/work/erp-laptop.png", title: "أنظمة ERP وإدارة الأعمال", text: "نظام واحد يربط المبيعات والمشتريات والحسابات والتقارير.", items: ["مبيعات ومشتريات", "حسابات", "تقارير لحظية"], alt: "نموذج لنظام إدارة أعمال على لابتوب" },
      { src: "/assets/work/pos-counter.png", title: "نقاط البيع POS", text: "كاشير سريع متصل بالمخزون والفروع، بيشتغل حتى من غير إنترنت.", items: ["كاشير", "فواتير", "ربط الفروع"], alt: "نموذج لشاشة نقطة بيع على كاونتر محل" },
      { src: "/assets/work/store-phone.png", title: "متاجر إلكترونية", text: "متجر بهويتك مع الدفع والشحن ولوحة تحكم للطلبات.", items: ["دفع أونلاين", "شحن", "إدارة الطلبات"], alt: "نموذج لمتجر إلكتروني على موبايل" },
      { src: "/assets/work/retail-shelf.png", title: "المخزون والفروع", text: "تتبع المخزون لكل صنف ومقاس، والتحويلات بين المخازن والفروع.", items: ["مخزون لكل مقاس", "تحويلات", "تنبيهات النقص"], alt: "نموذج لرفوف بضاعة في محل تجزئة" },
      { src: "/assets/work/crm-flow.png", title: "CRM وأتمتة العمليات", text: "متابعة العملاء والفرص، وأتمتة الشغل المتكرر بدل الورق والإكسل.", items: ["إدارة العملاء", "متابعة الفرص", "أتمتة"], alt: "نموذج لمخطط سير عمل CRM" },
      { src: "/assets/work/brand-stationery.png", title: "مواقع الشركات والهوية", text: "موقع سريع وواضح يعرّف بشركتك ويجيب لك عملاء.", items: ["موقع شركة", "SEO", "هوية بصرية"], alt: "نموذج لهوية بصرية ومطبوعات شركة" },
    ],
  },
  en: {
    eyebrow: "What we build",
    title: "Digital systems for every part of your business.",
    note: "Images below are illustrative concepts of the solutions we build, not client projects.",
    badge: "Concept",
    list: [
      { src: "/assets/work/erp-laptop.png", title: "ERP & business systems", text: "One system connecting sales, purchasing, accounting and reporting.", items: ["Sales & purchasing", "Accounting", "Live reports"], alt: "Concept of a business management system on a laptop" },
      { src: "/assets/work/pos-counter.png", title: "Point of sale", text: "Fast checkout linked to inventory and branches, works offline too.", items: ["Checkout", "Invoicing", "Multi-branch"], alt: "Concept of a POS screen on a shop counter" },
      { src: "/assets/work/store-phone.png", title: "E-commerce stores", text: "A branded store with payments, shipping and an orders dashboard.", items: ["Online payments", "Shipping", "Order management"], alt: "Concept of an online store on a phone" },
      { src: "/assets/work/retail-shelf.png", title: "Inventory & branches", text: "Track stock per item and size, with transfers between locations.", items: ["Variant stock", "Transfers", "Low-stock alerts"], alt: "Concept of retail shelves" },
      { src: "/assets/work/crm-flow.png", title: "CRM & automation", text: "Follow customers and deals, and automate repetitive work.", items: ["Customers", "Pipeline", "Automation"], alt: "Concept of a CRM workflow diagram" },
      { src: "/assets/work/brand-stationery.png", title: "Company sites & identity", text: "A fast, clear website that presents your company and brings leads.", items: ["Company site", "SEO", "Brand identity"], alt: "Concept of company brand stationery" },
    ],
  },
};

export function CapabilitiesSection({ language }: { language: Language }) {
  const c = copy[language];
  return (
    <section id="capabilities" className="sd-section sd-caps" aria-labelledby="caps-title">
      <header className="sd-caps-head">
        <p className="sd-eyebrow scroll-reveal">{c.eyebrow}</p>
        <h2 id="caps-title" className="sd-caps-title scroll-reveal">{c.title}</h2>
        <p className="sd-caps-note scroll-reveal">{c.note}</p>
      </header>
      <ul className="sd-caps-grid">
        {c.list.map(cap => (
          <li key={cap.title} className="sd-cap scroll-reveal">
            <div className="sd-cap-media">
              <img src={cap.src} alt={cap.alt} loading="lazy" />
              <span className="sd-cap-badge">{c.badge}</span>
            </div>
            <h3>{cap.title}</h3>
            <p>{cap.text}</p>
            <ul className="sd-cap-items" aria-label={cap.title}>
              {cap.items.map(item => <li key={item}>{item}</li>)}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
