import { ChevronDown } from "lucide-react";

type Language = "en" | "ar";

const copy = {
  ar: {
    philosophy: "فلسفتنا",
    statement: ["اجعل التقنية", "أبسط للجميع."],
    statementText: "كل نشاط يستحق أنظمة واضحة يفهمها فريقه من أول يوم. لذلك نبدأ من طريقة عملك الحقيقية، لا من قائمة خصائص لا تحتاجها.",
    principles: [["الأعمال أولًا", "اختيارات التقنية تبدأ من طريقة عمل فريقك."], ["جاهز للتطور", "أساس قوي يتسع لفروع ومستخدمين جدد."], ["صورة مترابطة", "عملياتك وعملاؤك وحضورك الرقمي معًا."]],
    placeA: ["من", "القاهرة"],
    placeB: ["إلى", "كل مكان."],
    tags: ["القاهرة، مصر", "خدمة عن بُعد", "دعم بالعربية والإنجليزية"],
    faq: "أسئلة شائعة",
    faqTitle: "قبل أن نبدأ",
    ctaEyebrow: "TAKE MORE · 2026",
    cta: "جاهز للخطوة القادمة؟",
    book: "احجز مكالمة",
    whatsapp: "واتساب",
  },
  en: {
    philosophy: "OUR PHILOSOPHY",
    statement: ["Make software", "simpler for everyone."],
    statementText: "Every business deserves systems its team understands from day one. So we start with how you actually work, not a list of features you don't need.",
    principles: [["Business-first", "Technology choices start with how your team works."], ["Built to evolve", "A foundation with room for new branches and users."], ["One connected view", "Operations, customers and digital presence together."]],
    placeA: ["From", "Cairo"],
    placeB: ["to", "everywhere."],
    tags: ["Cairo, Egypt", "Remote delivery", "Arabic & English support"],
    faq: "FAQ",
    faqTitle: "Before we begin",
    ctaEyebrow: "TAKE MORE · 2026",
    cta: "Ready for your next move?",
    book: "Book a call",
    whatsapp: "WhatsApp",
  },
} as const;

export function StatementSection({ language }: { language: Language }) {
  const c = copy[language];
  return (
    <section id="why" className="sd-section sd-statement">
      <p className="sd-eyebrow scroll-reveal">{c.philosophy}</p>
      <h2 className="sd-display sd-display-xl scroll-reveal">{c.statement[0]}<br />{c.statement[1]}</h2>
      <p className="sd-lede scroll-reveal">{c.statementText}</p>
      <ul className="sd-principles">
        {c.principles.map(([title, text]) => (
          <li key={title} className="scroll-reveal"><strong>{title}</strong><span>{text}</span></li>
        ))}
      </ul>
    </section>
  );
}

export function PlaceSection({ language }: { language: Language }) {
  const c = copy[language];
  return (
    <section className="sd-section sd-place" aria-label={c.tags[0]}>
      <p className="sd-place-line scroll-reveal"><span className="sd-place-muted">{c.placeA[0]}</span> {c.placeA[1]}</p>
      <p className="sd-place-line scroll-reveal"><span className="sd-place-muted">{c.placeB[0]}</span> {c.placeB[1]}</p>
      <ul className="sd-tags">{c.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
    </section>
  );
}

export function FaqSection({ language, items }: { language: Language; items: readonly (readonly [string, string])[] }) {
  const c = copy[language];
  return (
    <section id="faq" className="sd-section sd-faq">
      <div className="sd-section-head scroll-reveal">
        <p className="sd-eyebrow">{c.faq}</p>
        <h2 className="sd-display">{c.faqTitle}</h2>
      </div>
      <div className="sd-faq-list">
        {items.map(([question, answer]) => (
          <details key={question} className="sd-faq-item">
            <summary><strong>{question}</strong><ChevronDown size={18} aria-hidden="true" /></summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function ClosingSection({ language, onBook }: { language: Language; onBook: () => void }) {
  const c = copy[language];
  return (
    <section id="contact" className="sd-section sd-closing">
      <p className="sd-eyebrow">{c.ctaEyebrow}</p>
      <h2 className="sd-display sd-display-xl">{c.cta}</h2>
      <div className="sd-hero-actions">
        <button type="button" className="sd-pill sd-pill-dark" onClick={onBook}>{c.book}</button>
        <a className="sd-pill" href="https://wa.me/201153213270" target="_blank" rel="noreferrer">{c.whatsapp}</a>
        <a className="sd-pill" href="mailto:Info@take-more.com">Info@take-more.com</a>
      </div>
    </section>
  );
}
