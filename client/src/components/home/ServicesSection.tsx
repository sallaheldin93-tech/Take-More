import { ArrowLeft, ArrowRight, Cloud, Code2, Settings } from "lucide-react";
import { Link } from "wouter";

type Language = "en" | "ar";

const servicesCopy = {
  ar: {
    pill: "خدماتنا",
    title: "كل ما تحتاجه لنمو عملك في مكان واحد",
    text: "من تطوير المواقع إلى أنظمة إدارة الأعمال، نقدم حلولاً رقمية متكاملة.",
    more: "اعرف المزيد",
    all: "عرض كل الخدمات",
    items: [
      { title: "تطوير المواقع الإلكترونية", text: "مواقع سريعة وعصرية تعكس هوية علامتك وتحقق أهدافك." },
      { title: "أنظمة إدارة الأعمال", text: "أنظمة مخصصة لإدارة شركتك بكفاءة أعلى وقرارات أدق." },
      { title: "الحلول السحابية", text: "بنية تحتية مرنة وآمنة تساعدك على التوسع من أي مكان." },
    ],
  },
  en: {
    pill: "Our services",
    title: "Everything your business needs to grow, in one place",
    text: "From website development to business management systems, we deliver complete digital solutions.",
    more: "Learn more",
    all: "View all services",
    items: [
      { title: "Website development", text: "Fast, modern websites that reflect your brand and hit your goals." },
      { title: "Business management systems", text: "Custom systems to run your company more efficiently with sharper decisions." },
      { title: "Cloud solutions", text: "Flexible, secure infrastructure that helps you scale from anywhere." },
    ],
  },
} as const;

const icons = [Code2, Settings, Cloud];
const anchors = ["websites", "erp", "solutions"];

export function ServicesSection({ language }: { language: Language }) {
  const copy = servicesCopy[language];
  const Arrow = language === "ar" ? ArrowLeft : ArrowRight;

  return (
    <section id="services" className="tmx-services">
      <div className="tmx-container">
        <div className="tmx-services-head scroll-reveal">
          <p className="tmx-pill">{copy.pill}</p>
          <h2 className="tmx-section-title">{copy.title}</h2>
          <p className="tmx-section-text">{copy.text}</p>
        </div>
        <div className="tmx-services-grid">
          {copy.items.map((item, index) => {
            const Icon = icons[index];
            return (
              <article key={item.title} className="tmx-service-card scroll-reveal">
                <span className="tmx-service-icon"><Icon size={28} aria-hidden="true" /></span>
                <div className="tmx-service-body">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <Link href={`/services#service-${anchors[index]}`} className="tmx-service-link">
                    {copy.more} <Arrow size={16} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
        <div className="tmx-services-all">
          <Link href="/services" className="tmx-text-btn">{copy.all} <Arrow size={18} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}
