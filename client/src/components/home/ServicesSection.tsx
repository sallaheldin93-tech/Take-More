import { ArrowUpLeft, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";

type Language = "en" | "ar";

const servicesCopy = {
  ar: {
    eyebrow: "ماذا نقدم",
    title: ["حلول", "تعمل معك"],
    text: "من العمليات اليومية إلى نمو العملاء، نوفر الأنظمة التي يعتمد عليها نشاطك.",
    all: "كل الخدمات",
    items: [
      { slug: "erp", tag: "ERP", title: "حلول ERP", text: "الحسابات والمخزون والمشتريات في نظام واحد واضح." },
      { slug: "pos", tag: "POS", title: "نقاط البيع والتجزئة", text: "المبيعات والفواتير والفروع تحت السيطرة." },
      { slug: "websites", tag: "WEB", title: "المواقع والمتاجر", text: "حضور رقمي سريع يحوّل الزيارات إلى محادثات." },
      { slug: "crm", tag: "CRM", title: "CRM وأتمتة الأعمال", text: "متابعات آلية ووقت أكثر للنمو." },
    ],
  },
  en: {
    eyebrow: "WHAT WE DO",
    title: ["Systems", "that work"],
    text: "From daily operations to customer growth, we deliver the systems your business runs on.",
    all: "All services",
    items: [
      { slug: "erp", tag: "ERP", title: "ERP Solutions", text: "Finance, inventory and purchasing in one clear system." },
      { slug: "pos", tag: "POS", title: "POS & Retail", text: "Every sale, invoice and branch under control." },
      { slug: "websites", tag: "WEB", title: "Websites & Stores", text: "A fast digital presence that starts conversations." },
      { slug: "crm", tag: "CRM", title: "CRM & Automation", text: "Automated follow-ups and more time to grow." },
    ],
  },
} as const;

export function ServicesSection({ language }: { language: Language }) {
  const copy = servicesCopy[language];
  const Arrow = language === "ar" ? ArrowUpLeft : ArrowUpRight;

  return (
    <section id="services" className="sd-section sd-services">
      <div className="sd-section-head scroll-reveal">
        <p className="sd-eyebrow">{copy.eyebrow}</p>
        <h2 className="sd-display">{copy.title[0]}<br />{copy.title[1]}</h2>
        <p className="sd-lede">{copy.text}</p>
      </div>
      <ul className="sd-service-list">
        {copy.items.map(item => (
          <li key={item.slug} className="scroll-reveal">
            <Link href={`/services#service-${item.slug}`} className="sd-service-row">
              <span className="sd-service-tag">{item.tag}</span>
              <strong>{item.title}</strong>
              <span className="sd-service-text">{item.text}</span>
              <span className="sd-round" aria-hidden="true"><Arrow size={17} /></span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="sd-services-all">
        <Link href="/services" className="sd-pill">{copy.all}</Link>
      </div>
    </section>
  );
}
