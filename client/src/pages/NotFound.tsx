import { Link } from "wouter";

export default function NotFound() {
  const isArabic = (localStorage.getItem("take-more-language") || document.documentElement.lang) === "ar";
  const copy = isArabic
    ? { eyebrow: "خطأ 404", title: "الصفحة غير موجودة.", text: "ربما تم نقل الصفحة أو حذفها. ارجع للرئيسية وكمّل من هناك.", home: "العودة للرئيسية" }
    : { eyebrow: "ERROR 404", title: "Page not found.", text: "The page you are looking for may have been moved or deleted.", home: "Back to home" };

  return (
    <div className="site-shell sd-page" dir={isArabic ? "rtl" : "ltr"}>
      <header className="sd-header">
        <Link className="sd-logo" href="/"><img src="/assets/take-more-logo.png" alt="Take More" width={160} height={100} /></Link>
      </header>
      <main className="sd-hero sd-subhero sd-notfound">
        <p className="sd-eyebrow">{copy.eyebrow}</p>
        <h1 className="sd-display sd-display-xl">{copy.title}</h1>
        <p className="sd-hero-text">{copy.text}</p>
        <div className="sd-hero-actions">
          <Link className="sd-pill sd-pill-dark" href="/">{copy.home}</Link>
        </div>
      </main>
    </div>
  );
}
