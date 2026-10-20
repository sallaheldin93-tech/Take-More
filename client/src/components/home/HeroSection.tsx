type Language = "en" | "ar";

const heroCopy = {
  ar: {
    lines: [["اصنع", "خطوتك"], ["القادمة"]],
    text: "ERP ونقاط البيع والمواقع وأتمتة الأعمال. أنظمة عملية تساعد نشاطك على النمو بوضوح.",
    primary: "احجز مكالمة",
    secondary: "شوف بنعمل إيه",
    live: "اللي بنعمله",
    from: "من استوديو TAKE MORE",
  },
  en: {
    lines: [["Make", "your"], ["next", "move"]],
    text: "ERP, POS, websites and business automation. Practical systems that help your business grow with clarity.",
    primary: "Book a call",
    secondary: "See what we build",
    live: "WHAT WE BUILD",
    from: "FROM TAKE MORE STUDIO",
  },
} as const;

type Props = { language: Language; onTalk: () => void; onExplore: () => void };

export function HeroSection({ language, onTalk, onExplore }: Props) {
  const copy = heroCopy[language];
  let wordIndex = 0;

  return (
    <section id="home" className="sd-hero">
      <h1 className="sd-hero-title">
        {copy.lines.map(line => (
          <span className="sd-hero-line" key={line.join(" ")}>
            {line.map(word => {
              const delay = wordIndex++ * 90;
              return <span className="sd-word" key={word} style={{ animationDelay: `${delay}ms` }}>{word}</span>;
            })}
          </span>
        ))}
      </h1>
      <p className="sd-hero-text">{copy.text}</p>
      <div className="sd-hero-actions">
        <button type="button" className="sd-pill sd-pill-dark" onClick={onTalk}>{copy.primary}</button>
        <button type="button" className="sd-pill" onClick={onExplore}>{copy.secondary}</button>
      </div>

      <div className="sd-rule" aria-hidden="true">
        <span className="sd-live"><i />{copy.live}</span>
        <span className="sd-rule-line" />
        <span className="sd-from">{copy.from}</span>
      </div>
    </section>
  );
}
