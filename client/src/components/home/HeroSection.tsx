import { ArrowLeft, ArrowRight, BarChart3, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, Cloud, Code2, Database, FolderOpen, Headphones, Home as HomeIcon, MapPin, Settings, Settings2, Users } from "lucide-react";

type Language = "en" | "ar";

const heroCopy = {
  ar: {
    badge: "شريكك في التحول الرقمي",
    titleA: "نحوّل أفكارك",
    titleB: "إلى",
    titleHighlight: "حلول رقمية",
    text: "نبني مواقع إلكترونية وأنظمة أعمال مخصصة تساعدك على النمو وتحقيق أهدافك في السوق المصري وخارجه.",
    primary: "تحدث معنا",
    secondary: "اكتشف خدماتنا",
    trust: ["خبرة في السوق المصري", "حلول مخصصة لكل قطاع", "دعم مستمر وموثوق"],
    floating: [
      { title: "مواقع احترافية", text: "تجربة رقمية مميزة" },
      { title: "أنظمة أعمال متكاملة", text: "لزيادة كفاءة شركتك" },
      { title: "حلول سحابية آمنة", text: "توسع مع أعمالك" },
    ],
    dash: {
      welcome: "مرحباً بك", sub: "هنا نظرة سريعة على أداء أعمالك", period: "هذا الشهر", chart: "الأداء العام",
      nav: ["الرئيسية", "المشاريع", "العملاء", "التقارير", "الإعدادات"],
      stats: [["+42%", "نمو المبيعات"], ["1,250", "العملاء النشطون"], ["28", "المشاريع المكتملة"]],
      months: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو"],
    },
  },
  en: {
    badge: "Your digital transformation partner",
    titleA: "We turn your ideas",
    titleB: "into",
    titleHighlight: "digital solutions",
    text: "We build websites and custom business systems that help you grow and reach your goals in Egypt and beyond.",
    primary: "Talk to us",
    secondary: "Explore our services",
    trust: ["Experience in the Egyptian market", "Tailored solutions for every sector", "Reliable ongoing support"],
    floating: [
      { title: "Professional websites", text: "A standout digital experience" },
      { title: "Integrated business systems", text: "Boost your company's efficiency" },
      { title: "Secure cloud solutions", text: "Scale with your business" },
    ],
    dash: {
      welcome: "Welcome back", sub: "A quick look at your business performance", period: "This month", chart: "Overall performance",
      nav: ["Home", "Projects", "Clients", "Reports", "Settings"],
      stats: [["+42%", "Sales growth"], ["1,250", "Active clients"], ["28", "Completed projects"]],
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    },
  },
} as const;

const navIcons = [HomeIcon, FolderOpen, Users, BarChart3, Settings2];
const statIcons = [BarChart3, Users, Check];

function DashboardMockup({ language }: { language: Language }) {
  const d = heroCopy[language].dash;
  return (
    <div className="tmx-dash" aria-hidden="true">
      <div className="tmx-dash-bar"><i /><i /><i /></div>
      <div className="tmx-dash-body">
        <aside className="tmx-dash-side">
          <img src="/assets/take-more-logo.png" alt="" width={110} height={30} />
          <ul>
            {d.nav.map((label, index) => {
              const Icon = navIcons[index];
              return <li key={label} className={index === 0 ? "is-active" : undefined}><Icon size={15} />{label}</li>;
            })}
          </ul>
        </aside>
        <div className="tmx-dash-main">
          <div className="tmx-dash-head">
            <div>
              <strong>{d.welcome}</strong>
              <small>{d.sub}</small>
            </div>
            <span className="tmx-dash-period"><CalendarDays size={13} />{d.period}<ChevronDown size={13} /></span>
          </div>
          <div className="tmx-dash-stats">
            {d.stats.map(([value, label], index) => {
              const Icon = statIcons[index];
              return (
                <div key={label} className="tmx-dash-stat">
                  <div><b className={index === 0 ? "is-accent" : undefined}>{value}</b><small>{label}</small></div>
                  <span className={index === 2 ? "is-success" : undefined}><Icon size={14} /></span>
                </div>
              );
            })}
          </div>
          <div className="tmx-dash-chart">
            <strong>{d.chart}</strong>
            <svg viewBox="0 0 320 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="tmxArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#00b9ed" stopOpacity=".28" />
                  <stop offset="100%" stopColor="#00b9ed" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[20, 50, 80].map(y => <line key={y} x1="0" x2="320" y1={y} y2={y} stroke="#e3edf4" strokeWidth="1" />)}
              <path d="M5 100 C 30 92, 45 75, 65 78 S 95 98, 115 85 S 145 55, 170 60 S 200 78, 225 62 S 250 70, 270 52 S 300 30, 315 22 L315 120 L5 120 Z" fill="url(#tmxArea)" />
              <path className="tmx-dash-line" d="M5 100 C 30 92, 45 75, 65 78 S 95 98, 115 85 S 145 55, 170 60 S 200 78, 225 62 S 250 70, 270 52 S 300 30, 315 22" fill="none" stroke="#0a8fe0" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="225" cy="62" r="4.5" fill="#fff" stroke="#00b9ed" strokeWidth="2.5" />
            </svg>
            <span className="tmx-dash-tip">+42%</span>
            <div className="tmx-dash-months">{d.months.map(month => <span key={month}>{month}</span>)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

type Props = { language: Language; onTalk: () => void; onExplore: () => void };

export function HeroSection({ language, onTalk, onExplore }: Props) {
  const copy = heroCopy[language];
  const Chevron = language === "ar" ? ChevronLeft : ChevronRight;
  const Arrow = language === "ar" ? ArrowLeft : ArrowRight;
  const trustIcons = [MapPin, Settings, Headphones];
  const floatIcons = [Code2, Database, Cloud];

  return (
    <section id="home" className="tmx-hero">
      <div className="tmx-container tmx-hero-grid">
        <div className="tmx-hero-copy">
          <p className="tmx-badge reveal"><span aria-hidden="true" />{copy.badge}</p>
          <h1 className="tmx-hero-title reveal delay-1">
            <span>{copy.titleA}</span>
            <span>{copy.titleB} <em>{copy.titleHighlight}</em></span>
          </h1>
          <p className="tmx-hero-text reveal delay-2">{copy.text}</p>
          <div className="tmx-hero-actions reveal delay-3">
            <button type="button" className="tmx-primary-btn" onClick={onTalk}>{copy.primary} <Chevron size={18} aria-hidden="true" /></button>
            <button type="button" className="tmx-text-btn" onClick={onExplore}>{copy.secondary} <Arrow size={18} aria-hidden="true" /></button>
          </div>
          <ul className="tmx-trust reveal delay-3">
            {copy.trust.map((item, index) => {
              const Icon = trustIcons[index];
              return <li key={item}><Icon size={20} aria-hidden="true" />{item}</li>;
            })}
          </ul>
        </div>

        <div className="tmx-hero-visual reveal delay-2">
          <DashboardMockup language={language} />
          {copy.floating.map((card, index) => {
            const Icon = floatIcons[index];
            return (
              <div key={card.title} className={`tmx-float tmx-float-${index + 1}`}>
                <span className="tmx-float-icon"><Icon size={22} aria-hidden="true" /></span>
                <strong>{card.title}</strong>
                <small>{card.text}</small>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
