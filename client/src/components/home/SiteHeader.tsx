import { ChevronLeft, ChevronRight, Languages, Menu, X } from "lucide-react";

type Language = "en" | "ar";

const navCopy = {
  ar: { home: "الرئيسية", services: "خدماتنا", work: "أعمالنا", about: "من نحن", contact: "تواصل معنا", start: "ابدأ مشروعك", open: "فتح القائمة", close: "إغلاق القائمة" },
  en: { home: "Home", services: "Services", work: "Our work", about: "About us", contact: "Contact", start: "Start your project", open: "Open menu", close: "Close menu" },
} as const;

type Props = {
  language: Language;
  activeSection: string;
  mobileOpen: boolean;
  onToggleMobile: () => void;
  onNavigate: (id: string) => void;
  onToggleLanguage: () => void;
  onStart: () => void;
};

export function SiteHeader({ language, activeSection, mobileOpen, onToggleMobile, onNavigate, onToggleLanguage, onStart }: Props) {
  const copy = navCopy[language];
  const Arrow = language === "ar" ? ChevronLeft : ChevronRight;
  const links = [
    { id: "home", label: copy.home },
    { id: "services", label: copy.services },
    { id: "work", label: copy.work },
    { id: "why", label: copy.about },
    { id: "contact", label: copy.contact },
  ];

  return (
    <header className="tmx-header">
      <div className="tmx-header-inner">
        <a className="tmx-logo" href="#home" onClick={event => { event.preventDefault(); onNavigate("home"); }}>
          <img src="/assets/take-more-logo.png" alt="Take More" width={169} height={47} />
        </a>

        <nav id="tmx-nav" className={mobileOpen ? "tmx-nav is-open" : "tmx-nav"} aria-label={language === "ar" ? "التنقل الرئيسي" : "Main navigation"}>
          {links.map(link => (
            <button
              key={link.id}
              type="button"
              className={activeSection === link.id ? "tmx-nav-link is-active" : "tmx-nav-link"}
              aria-current={activeSection === link.id ? "page" : undefined}
              onClick={() => onNavigate(link.id)}
            >
              {link.label}
            </button>
          ))}
          <button type="button" className="tmx-nav-cta-mobile" onClick={onStart}>
            {copy.start} <Arrow size={16} aria-hidden="true" />
          </button>
        </nav>

        <div className="tmx-header-actions">
          <button type="button" className="tmx-lang" onClick={onToggleLanguage} aria-label={language === "en" ? "عرض الموقع بالعربية" : "View website in English"}>
            <Languages size={16} aria-hidden="true" />
            <span>{language === "en" ? "عربي" : "EN"}</span>
          </button>
          <button type="button" className="tmx-outline-btn" onClick={onStart}>
            {copy.start} <Arrow size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="tmx-menu-btn"
            onClick={onToggleMobile}
            aria-label={mobileOpen ? copy.close : copy.open}
            aria-expanded={mobileOpen}
            aria-controls="tmx-nav"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}
