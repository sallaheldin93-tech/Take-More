type Language = "en" | "ar";

type Showcase = { src: string; label: string; title: string; category: string; summary: string; alt: string };

const showcases: Record<Language, Showcase[]> = {
  ar: [
    { src: "/assets/work/service-erp.png", label: "أنظمة ERP", title: "لوحة تحكم لإدارة شغلك", category: "إدارة", summary: "المبيعات والمخزون والأرباح في شاشة واحدة، لحظة بلحظة.", alt: "لابتوب يعرض لوحة تحكم نظام ERP بالمبيعات والمخزون" },
    { src: "/assets/work/service-ecommerce.png", label: "متاجر إلكترونية", title: "متجر يبيع من الموبايل", category: "تجارة", summary: "تجربة شراء سريعة من أول منتج لحد الدفع والشحن.", alt: "موبايل يعرض متجر إلكتروني بجانب طرد شحن" },
    { src: "/assets/work/service-pos.png", label: "نقاط البيع POS", title: "كاشير ذكي لفرعك", category: "مبيعات", summary: "بيع ودفع وفواتير متربطة مباشرة بالمخزون.", alt: "جهاز نقطة بيع على كاونتر محل" },
    { src: "/assets/work/service-website.png", label: "مواقع الشركات", title: "موقع يعبّر عن براندك", category: "مواقع", summary: "تصميم احترافي يحوّل الزوار لعملاء.", alt: "شاشة كمبيوتر تعرض موقع شركة احترافي" },
  ],
  en: [
    { src: "/assets/work/service-erp.png", label: "ERP systems", title: "A dashboard to run your business", category: "Operations", summary: "Sales, stock and profit on a single live screen.", alt: "Laptop showing an ERP dashboard with sales and inventory" },
    { src: "/assets/work/service-ecommerce.png", label: "Online stores", title: "A store that sells on mobile", category: "Commerce", summary: "Fast buying from first product to checkout and shipping.", alt: "Phone showing an online store next to a shipping box" },
    { src: "/assets/work/service-pos.png", label: "POS", title: "Smart checkout for your branch", category: "Sales", summary: "Sales, payments and invoices synced with inventory.", alt: "Point of sale tablet on a store counter" },
    { src: "/assets/work/service-website.png", label: "Company websites", title: "A site that speaks your brand", category: "Web", summary: "Professional design that turns visitors into clients.", alt: "Desktop monitor showing a professional company website" },
  ],
};

export function WorkGallery({ language }: { language: Language }) {
  return (
    <section id="work" className="sd-gallery" aria-label={language === "ar" ? "اللي بنعمله" : "What we build"}>
      {showcases[language].map(item => (
        <article key={item.src} className="sd-project scroll-reveal">
          <div className="sd-project-frame">
            <img src={item.src} alt={item.alt} loading="lazy" />
          </div>
          <div className="sd-project-info">
            <div className="sd-project-head">
              <span className="sd-project-client">{item.label}</span>
              <span className="sd-project-tag">{item.category}</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
