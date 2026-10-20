type Language = "en" | "ar";

type Tile =
  | { kind: "image"; src: string; ratio: string; title: string; meta: string; alt: string; position?: string }
  | { kind: "type"; tone: "lime" | "ink" | "soft"; ratio: string; title: string; meta: string; display: string };

const tiles: Record<Language, Tile[]> = {
  ar: [
    { kind: "image", src: "/assets/work/miraza-products.jpg", ratio: "4 / 3", title: "Miraza — إدارة المنتجات", meta: "ERP", alt: "شاشة المنتجات في نظام Miraza مع المخزون لكل مقاس", position: "left top" },
    { kind: "image", src: "/assets/work/beko-store.jpg", ratio: "4 / 5", title: "مؤسسة بيكو التجارية", meta: "متجر إلكتروني", alt: "الصفحة الرئيسية لمتجر بيكو للعدد والآلات على شاشة", position: "center 45%" },
    { kind: "type", tone: "lime", ratio: "1 / 1", title: "Take More", meta: "الاستوديو", display: "Take More" },
    { kind: "image", src: "/assets/work/miraza-dashboard.jpg", ratio: "4 / 3", title: "Miraza — لوحة التحكم", meta: "ERP", alt: "لوحة تحكم Miraza بالعربي تعرض المبيعات والأرباح والأوردرات", position: "right top" },
    { kind: "image", src: "/assets/work/miraza-settings.jpg", ratio: "4 / 5", title: "Miraza — الإعدادات والفروع", meta: "ERP", alt: "صفحة الإعدادات في نظام Miraza على لابتوب", position: "60% center" },
    { kind: "type", tone: "ink", ratio: "4 / 5", title: "من الفكرة إلى الإطلاق", meta: "منهجنا", display: "من الفكرة إلى الإطلاق." },
    { kind: "image", src: "/assets/work/miraza-login-code.jpg", ratio: "4 / 5", title: "Miraza Atelier — تطوير", meta: "كود", alt: "شاشة تسجيل الدخول لـ Miraza Atelier مع أدوات المطور مفتوحة على لابتوب", position: "center 35%" },
  ],
  en: [
    { kind: "image", src: "/assets/work/miraza-products.jpg", ratio: "4 / 3", title: "Miraza — Products", meta: "ERP", alt: "Miraza products screen with variant-level inventory", position: "left top" },
    { kind: "image", src: "/assets/work/beko-store.jpg", ratio: "4 / 5", title: "Beko Trading Est.", meta: "E-COMMERCE", alt: "Beko tools store homepage shown on a monitor", position: "center 45%" },
    { kind: "type", tone: "lime", ratio: "1 / 1", title: "Take More", meta: "STUDIO", display: "Take More" },
    { kind: "image", src: "/assets/work/miraza-dashboard.jpg", ratio: "4 / 3", title: "Miraza — Dashboard", meta: "ERP", alt: "Arabic Miraza dashboard showing sales, profit and orders", position: "right top" },
    { kind: "image", src: "/assets/work/miraza-settings.jpg", ratio: "4 / 5", title: "Miraza — Settings & locations", meta: "ERP", alt: "Miraza settings page on a laptop", position: "60% center" },
    { kind: "type", tone: "ink", ratio: "4 / 5", title: "Idea to launch", meta: "APPROACH", display: "From idea to launch." },
    { kind: "image", src: "/assets/work/miraza-login-code.jpg", ratio: "4 / 5", title: "Miraza Atelier — In development", meta: "CODE", alt: "Miraza Atelier login screen with developer tools open on a laptop", position: "center 35%" },
  ],
};

export function WorkGallery({ language }: { language: Language }) {
  return (
    <section id="work" className="sd-gallery" aria-label={language === "ar" ? "أعمالنا" : "Our work"}>
      {tiles[language].map(tile => (
        <figure key={tile.title} className="sd-tile scroll-reveal">
          {tile.kind === "image" ? (
            <div className="sd-tile-media" style={{ aspectRatio: tile.ratio }}>
              <img src={tile.src} alt={tile.alt} loading="lazy" style={tile.position ? { objectPosition: tile.position } : undefined} />
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
