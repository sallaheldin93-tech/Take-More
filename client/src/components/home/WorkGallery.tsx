type Language = "en" | "ar";

type Tile =
  | { kind: "image"; src: string; ratio: string; title: string; meta: string; alt: string }
  | { kind: "type"; tone: "lime" | "ink" | "soft"; ratio: string; title: string; meta: string; display: string };

const tiles: Record<Language, Tile[]> = {
  ar: [
    { kind: "image", src: "/assets/work/erp-laptop.png", ratio: "1 / 1", title: "نظام ERP متكامل", meta: "العمليات", alt: "لوحة تحكم نظام ERP على حاسوب محمول" },
    { kind: "image", src: "/assets/work/pos-counter.png", ratio: "4 / 5", title: "نقاط بيع للمقاهي", meta: "التجزئة", alt: "جهاز نقاط بيع على كاونتر مقهى" },
    { kind: "type", tone: "lime", ratio: "1 / 1", title: "Take More", meta: "الاستوديو", display: "Take More" },
    { kind: "image", src: "/assets/work/store-phone.png", ratio: "4 / 5", title: "متجر إلكتروني", meta: "المواقع", alt: "صفحة منتج لمتجر إلكتروني على هاتف ذكي" },
    { kind: "image", src: "/assets/work/crm-flow.png", ratio: "4 / 3", title: "أتمتة المتابعات", meta: "CRM", alt: "مخطط سير عمل آلي لإدارة العملاء" },
    { kind: "type", tone: "ink", ratio: "4 / 5", title: "من الفكرة إلى الإطلاق", meta: "منهجنا", display: "من الفكرة إلى الإطلاق." },
    { kind: "image", src: "/assets/work/retail-shelf.png", ratio: "4 / 3", title: "إدارة المخزون", meta: "التجزئة", alt: "متجر صغير بمنتجات منظمة وجهاز لمسح الباركود" },
    { kind: "image", src: "/assets/work/brand-stationery.png", ratio: "4 / 5", title: "هوية بصرية", meta: "الهوية", alt: "مطبوعات هوية بصرية باللونين الكحلي والسماوي" },
  ],
  en: [
    { kind: "image", src: "/assets/work/erp-laptop.png", ratio: "1 / 1", title: "Connected ERP", meta: "OPERATIONS", alt: "ERP dashboard on a laptop" },
    { kind: "image", src: "/assets/work/pos-counter.png", ratio: "4 / 5", title: "Cafe POS", meta: "RETAIL", alt: "Point-of-sale terminal on a cafe counter" },
    { kind: "type", tone: "lime", ratio: "1 / 1", title: "Take More", meta: "STUDIO", display: "Take More" },
    { kind: "image", src: "/assets/work/store-phone.png", ratio: "4 / 5", title: "Online store", meta: "WEB", alt: "E-commerce product page on a smartphone" },
    { kind: "image", src: "/assets/work/crm-flow.png", ratio: "4 / 3", title: "Automated follow-ups", meta: "CRM", alt: "Automation workflow diagram for customer management" },
    { kind: "type", tone: "ink", ratio: "4 / 5", title: "Idea to launch", meta: "APPROACH", display: "From idea to launch." },
    { kind: "image", src: "/assets/work/retail-shelf.png", ratio: "4 / 3", title: "Inventory control", meta: "RETAIL", alt: "Small shop with organized products and a barcode scanner" },
    { kind: "image", src: "/assets/work/brand-stationery.png", ratio: "4 / 5", title: "Brand identity", meta: "BRAND", alt: "Navy and cyan brand stationery" },
  ],
};

export function WorkGallery({ language }: { language: Language }) {
  return (
    <section id="work" className="sd-gallery" aria-label={language === "ar" ? "أعمالنا" : "Our work"}>
      {tiles[language].map(tile => (
        <figure key={tile.title} className="sd-tile scroll-reveal">
          {tile.kind === "image" ? (
            <div className="sd-tile-media" style={{ aspectRatio: tile.ratio }}>
              <img src={tile.src} alt={tile.alt} loading="lazy" />
            </div>
          ) : (
            <div className={`sd-tile-media sd-tile-type is-${tile.tone}`} style={{ aspectRatio: tile.ratio }}>
              <span>{tile.display}</span>
            </div>
          )}
          <figcaption><span>{tile.title}</span><span>{tile.meta}</span></figcaption>
        </figure>
      ))}
    </section>
  );
}
