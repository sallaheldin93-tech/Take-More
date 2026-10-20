import { ArrowUpLeft, ArrowUpRight, Menu, X } from "lucide-react";

type Language = "en" | "ar";

const navCopy = {
  ar: { home: "الرئيسية", services: "خدماتنا", work: "أعمالنا", about: "من نحن", contact: "تواصل معنا", start: "ابدأ مشروعك", open: "فتح القائمة", close: "إغلاق القائمة", nav: "التنقل الرئيسي" },
  en: { home: "Home", services: "Services", work: "Work", about: "About", contact: "Contact", start: "Start a project", open: "Open menu", close: "Close menu", nav: "Main navigation" },
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
  const Arrow = language === "ar" ? ArrowUpLeft : ArrowUpRight;
  const links = [
    { id: "work", label: copy.work },
    { id: "services", label: copy.services },
    { id: "why", label: copy.about },
    { id: "contact", label: copy.contact },
  ];

  return (
    <header className="sd-header">
      <a className="sd-logo" href="#home" onClick={event => { event.preventDefault(); onNavigate("home"); }}>
        <img src="/assets/take-more-logo-white.png" alt="Take More" width={150} height={42} />
      </a>

      <div className="sd-header-actions">
        <nav id="sd-nav" className={mobileOpen ? "sd-nav is-open" : "sd-nav"} aria-label={copy.nav}>
          {links.map(link => (
            <button
              key={link.id}
              type="button"
              className={activeSection === link.id ? "sd-nav-link is-active" : "sd-nav-link"}
              aria-current={activeSection === link.id ? "true" : undefined}
              onClick={() => onNavigate(link.id)}
            >
              {link.label}
            </button>
          ))}
        </nav>
        <button type="button" className="sd-pill sd-pill-quiet" onClick={onToggleLanguage} aria-label={language === "en" ? "عرض الموقع بالعربية" : "View website in English"}>
          {language === "en" ? "عربي" : "EN"}
        </button>
        <button type="button" className="sd-pill sd-start" onClick={onStart}>{copy.start}</button>
        <button type="button" className="sd-round" onClick={onStart} aria-label={copy.start}>
          <Arrow size={17} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="sd-round sd-menu-btn"
          onClick={onToggleMobile}
          aria-label={mobileOpen ? copy.close : copy.open}
          aria-expanded={mobileOpen}
          aria-controls="sd-nav"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
    </header>
  );
}
