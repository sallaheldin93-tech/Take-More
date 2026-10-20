type Language = "en" | "ar";

type Tile =
  | { kind: "image"; src: string; ratio: string; title: string; meta: string; alt: string }
  | { kind: "type"; tone: "lime" | "ink" | "soft"; ratio: string; title: string; meta: string; display: string };

const tiles: Record<Language, Tile[]> = {
  ar: [
    { kind: "image", src: "/assets/work/miraza-products.jpg", ratio: "2880 / 1558", title: "Miraza — إدارة المنتجات", meta: "ERP", alt: "شاشة المنتجات في نظام Miraza مع المخزون لكل مقاس" },
    { kind: "image", src: "/assets/work/beko-store.jpg", ratio: "2000 / 900", title: "مؤسسة بيكو التجارية", meta: "متجر إلكتروني", alt: "الصفحة الرئيسية لمتجر بيكو للعدد والآلات" },
    { kind: "type", tone: "lime", ratio: "1 / 1", title: "Take More", meta: "الاستوديو", display: "Take More" },
    { kind: "image", src: "/assets/work/miraza-dashboard.jpg", ratio: "2880 / 1558", title: "Miraza — لوحة التحكم", meta: "ERP", alt: "لوحة تحكم Miraza بالعربي تعرض المبيعات والأرباح والأوردرات" },
    { kind: "image", src: "/assets/work/miraza-settings.jpg", ratio: "1880 / 1110", title: "Miraza — الإعدادات والفروع", meta: "ERP", alt: "صفحة الإعدادات والفروع في نظام Miraza" },
    { kind: "type", tone: "ink", ratio: "4 / 5", title: "من الفكرة إلى الإطلاق", meta: "منهجنا", display: "من الفكرة إلى الإطلاق." },
  ],
  en: [
    { kind: "image", src: "/assets/work/miraza-products.jpg", ratio: "2880 / 1558", title: "Miraza — Products", meta: "ERP", alt: "Miraza products screen with variant-level inventory" },
    { kind: "image", src: "/assets/work/beko-store.jpg", ratio: "2000 / 900", title: "Beko Trading Est.", meta: "E-COMMERCE", alt: "Beko tools store homepage" },
    { kind: "type", tone: "lime", ratio: "1 / 1", title: "Take More", meta: "STUDIO", display: "Take More" },
    { kind: "image", src: "/assets/work/miraza-dashboard.jpg", ratio: "2880 / 1558", title: "Miraza — Dashboard", meta: "ERP", alt: "Arabic Miraza dashboard showing sales, profit and orders" },
    { kind: "image", src: "/assets/work/miraza-settings.jpg", ratio: "1880 / 1110", title: "Miraza — Settings & locations", meta: "ERP", alt: "Miraza settings and locations page" },
    { kind: "type", tone: "ink", ratio: "4 / 5", title: "Idea to launch", meta: "APPROACH", display: "From idea to launch." },
  ],
};

export function WorkGallery({ language }: { language: Language }) {
  return (
    <section id="work" className="sd-gallery" aria-label={language === "ar" ? "أعمالنا" : "Our work"}>
      {tiles[language].map(tile => (
        <figure key={tile.title} className="sd-tile scroll-reveal">
          {tile.kind === "image" ? (
            <div className="sd-tile-media sd-tile-shot" style={{ aspectRatio: tile.ratio }}>
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
