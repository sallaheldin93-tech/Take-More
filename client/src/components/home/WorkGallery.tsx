type Language = "en" | "ar";

type Project = { src: string; client: string; title: string; category: string; summary: string; alt: string };

const projects: Record<Language, Project[]> = {
  ar: [
    { src: "/assets/work/miraza-dashboard.jpg", client: "Miraza", title: "لوحة التحكم", category: "ERP", summary: "المبيعات والأرباح والأوردرات في شاشة واحدة، لحظة بلحظة.", alt: "لوحة تحكم Miraza بالعربي تعرض المبيعات والأرباح والأوردرات" },
    { src: "/assets/work/beko-store.jpg", client: "مؤسسة بيكو التجارية", title: "متجر العدد والآلات", category: "متجر إلكتروني", summary: "متجر عربي سريع لعرض المنتجات وطلبها بسهولة.", alt: "الصفحة الرئيسية لمتجر بيكو للعدد والآلات" },
    { src: "/assets/work/miraza-products.jpg", client: "Miraza", title: "إدارة المنتجات", category: "ERP", summary: "مخزون لكل مقاس ولون، مع استيراد وطباعة الباركود.", alt: "شاشة المنتجات في نظام Miraza مع المخزون لكل مقاس" },
    { src: "/assets/work/miraza-settings.jpg", client: "Miraza", title: "الإعدادات والفروع", category: "ERP", summary: "إدارة المخازن والفروع وصلاحيات التشغيل من مكان واحد.", alt: "صفحة الإعدادات والفروع في نظام Miraza" },
  ],
  en: [
    { src: "/assets/work/miraza-dashboard.jpg", client: "Miraza", title: "Operations dashboard", category: "ERP", summary: "Sales, profit and orders on a single live screen.", alt: "Arabic Miraza dashboard showing sales, profit and orders" },
    { src: "/assets/work/beko-store.jpg", client: "Beko Trading Est.", title: "Tools storefront", category: "E-commerce", summary: "A fast Arabic storefront built for browsing and ordering.", alt: "Beko tools store homepage" },
    { src: "/assets/work/miraza-products.jpg", client: "Miraza", title: "Product management", category: "ERP", summary: "Variant-level stock with CSV import and barcode printing.", alt: "Miraza products screen with variant-level inventory" },
    { src: "/assets/work/miraza-settings.jpg", client: "Miraza", title: "Settings & locations", category: "ERP", summary: "Warehouses, branches and permissions managed in one place.", alt: "Miraza settings and locations page" },
  ],
};

export function WorkGallery({ language }: { language: Language }) {
  return (
    <section id="work" className="sd-gallery" aria-label={language === "ar" ? "أعمالنا" : "Our work"}>
      {projects[language].map(project => (
        <article key={project.src} className="sd-project scroll-reveal">
          <div className="sd-project-frame">
            <img src={project.src} alt={project.alt} loading="lazy" />
          </div>
          <div className="sd-project-info">
            <div className="sd-project-head">
              <span className="sd-project-client">{project.client}</span>
              <span className="sd-project-tag">{project.category}</span>
            </div>
            <h3>{project.title}</h3>
            <p>{project.summary}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
