import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { CalendarDays, Check, ChevronDown, Clock3, Facebook, Instagram, Languages, Linkedin, Layers3, Menu, MessageCircle, Mail, Moon, MoveUpRight, Phone, ShieldCheck, Sparkles, Sun, X, Zap } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const normalizePhone = (value: string) => value
  .replace(/[٠-٩]/g, digit => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
  .replace(/[^0-9+]/g, "");

const BrandIcon = ({ brand, size = 18 }: { brand: "facebook" | "instagram" | "linkedin" | "whatsapp"; size?: number }) => {
  const paths = {
    facebook: <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.54-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.07 24 18.09 24 12.07z" />,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></>,
    linkedin: <><path d="M5.2 8.2H1.3V22h3.9V8.2ZM3.25 2A2.25 2.25 0 1 0 3.25 6.5 2.25 2.25 0 0 0 3.25 2ZM22.7 14.1c0-4.16-2.22-6.1-5.18-6.1-2.39 0-3.46 1.31-4.06 2.23V8.2H9.57V22h3.89v-6.83c0-1.8.34-3.55 2.58-3.55 2.2 0 2.23 2.07 2.23 3.67V22h3.89l.54-7.9Z" /></>,
    whatsapp: <path d="M20.52 3.48A11.84 11.84 0 0 0 12.08 0C5.52 0 .18 5.33.18 11.9c0 2.1.55 4.15 1.6 5.96L.08 24l6.28-1.65a11.9 11.9 0 0 0 5.71 1.46h.01c6.56 0 11.9-5.33 11.9-11.9a11.84 11.84 0 0 0-3.46-8.43ZM12.08 21.8h-.01a9.88 9.88 0 0 1-5.04-1.38l-.36-.21-3.73.98 1-3.64-.23-.37a9.88 9.88 0 0 1-1.52-5.28C2.19 6.42 6.62 2 12.08 2a9.84 9.84 0 0 1 7 2.9 9.85 9.85 0 0 1 2.9 7c0 5.46-4.44 9.9-9.9 9.9Zm5.43-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.64-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.5 1.7.64.72.23 1.37.2 1.89.12.58-.09 1.76-.72 2.01-1.42.25-.69.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z" />,
  };
  return <svg width={size} height={size} viewBox={brand === "facebook" ? "0 0 24 24" : "0 0 24 24"} fill={brand === "instagram" ? "none" : "currentColor"} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" stroke={brand === "instagram" ? "currentColor" : undefined} strokeWidth={brand === "instagram" ? 1.8 : undefined}>{paths[brand]}</svg>;
};

const serviceCopy = [
  { icon: Layers3, eyebrow: "01 / OPERATIONS", title: "ERP Solutions", description: "End-to-end enterprise planning that unifies finance, inventory and operations in one connected system.", bullets: ["Finance & accounting", "Inventory control", "Reporting & analytics"], tone: "lime" },
  { icon: Zap, eyebrow: "02 / SALES", title: "POS Systems", description: "Fast and reliable point-of-sale solutions for retail, restaurants and services that keep every transaction flowing.", bullets: ["Sales & billing", "Multi-branch support", "Daily reconciliation"], tone: "sky" },
  { icon: Sparkles, eyebrow: "03 / PRESENCE", title: "Websites", description: "Modern, high-performance websites designed to build trust, tell your story and convert visitors into customers.", bullets: ["Responsive design", "Business & e-commerce", "SEO-friendly build"], tone: "ice" },
  { icon: ShieldCheck, eyebrow: "04 / GROWTH", title: "Business & CRM Automation", description: "Automation that streamlines customer relationships, follow-ups and internal workflows so your team works smarter.", bullets: ["Contact & lead tracking", "Task automation", "Sales pipeline"], tone: "blue" },

] as const;

const serviceCopyAr = [
  { icon: Layers3, eyebrow: "01 / العمليات", title: "حلول ERP", description: "نظام متكامل يربط الحسابات والمخزون والعمليات اليومية داخل منصة واحدة واضحة.", bullets: ["الحسابات والمالية", "إدارة المخزون", "التقارير والتحليلات"], tone: "lime" },
  { icon: Zap, eyebrow: "02 / المبيعات", title: "أنظمة نقاط البيع", description: "حلول نقاط بيع سريعة وموثوقة للمتاجر والمطاعم والخدمات، تساعدك على إدارة كل عملية بسهولة.", bullets: ["المبيعات والفواتير", "دعم الفروع المتعددة", "التسويات اليومية"], tone: "sky" },
  { icon: Sparkles, eyebrow: "03 / الحضور الرقمي", title: "تصميم وتطوير المواقع", description: "مواقع عصرية وسريعة تعزز ثقة عملائك، وتعرض نشاطك باحترافية وتحول الزوار إلى عملاء.", bullets: ["تصميم متجاوب", "مواقع ومتاجر إلكترونية", "تهيئة لمحركات البحث"], tone: "ice" },
  { icon: ShieldCheck, eyebrow: "04 / النمو", title: "أتمتة الأعمال وCRM", description: "أتمتة ذكية تنظم علاقات العملاء والمتابعات وسير العمل الداخلي حتى يعمل فريقك بكفاءة أكبر.", bullets: ["إدارة العملاء المحتملين", "أتمتة المهام", "خط سير المبيعات"], tone: "blue" },
] as const;

const homeCopy = {
  en: {
    nav: { home: "Home", services: "Services", work: "Solutions", process: "How we work", why: "Why us", contact: "Contact", book: "Book a call", start: "Get started" },
    mode: { white: "White", blue: "Blue" },
    heroEyebrow: "SOFTWARE FOR THE REAL WORLD", heroTitleA: "Software that runs", heroTitleB: "your entire", heroTitleC: "business.", heroLine: "ERP • POS • Websites • Business & CRM Automation.", heroText: "Helping businesses simplify operations and grow smarter.", discovery: "Book a discovery call", explore: "Explore services",
    servicesEyebrow: "WHAT WE DO", servicesTitleA: "One partner for", servicesTitleB: "your business software.", servicesText: "From daily operations to customer growth — we deliver the systems your business runs on.", cardCta: "Get started",
    whyEyebrow: "WHY TAKE MORE", whyTitleA: "Results you can", whyTitleB: "build confidence on.", whyText: "We combine technical know-how with business thinking to deliver connected systems that create measurable value and support sustainable growth.", stats: ["Happy clients", "Projects delivered", "Years of experience", "Core business solutions"], clear: "Clear thinking", clearText: "Solutions designed around your reality.", scale: "Built to scale", scaleText: "Systems that grow with your ambition.",
    contactEyebrow: "READY TO SIMPLIFY?", contactTitleA: "Let's make your", contactTitleB: "next move smarter.", contactText: "Tell us about your business and we will recommend the right software and automation for your growth.", tellUs: "Tell us about your business", connect: "Connect with us", location: "Cairo, Egypt", footer: "Smart Business Solutions — Helping businesses simplify operations and grow smarter.", chat: "Chat with us"
  },
  ar: {
    nav: { home: "الرئيسية", services: "خدماتنا", work: "حلولنا", process: "كيف نعمل", why: "لماذا نحن", contact: "تواصل معنا", book: "احجز مكالمة", start: "ابدأ الآن" },
    mode: { white: "أبيض", blue: "أزرق" },
    heroEyebrow: "حلول برمجية تناسب أعمالك", heroTitleA: "برمجيات تدير", heroTitleB: "كل تفاصيل", heroTitleC: "أعمالك.", heroLine: "ERP • POS • المواقع • أتمتة الأعمال وCRM.", heroText: "نساعد الشركات على تبسيط عملياتها وتحقيق نمو أذكى.", discovery: "احجز مكالمة استكشافية", explore: "استكشف خدماتنا",
    servicesEyebrow: "ماذا نقدم", servicesTitleA: "شريك واحد لكل", servicesTitleB: "حلول أعمالك التقنية.", servicesText: "من العمليات اليومية إلى نمو العملاء — نوفر الأنظمة التي يعتمد عليها نشاطك.", cardCta: "ابدأ الآن",
    whyEyebrow: "لماذا TAKE MORE", whyTitleA: "نتائج تمنحك", whyTitleB: "ثقة أكبر.", whyText: "نجمع بين الخبرة التقنية والفهم التجاري لنقدم أنظمة مترابطة تحقق قيمة قابلة للقياس وتدعم نمو أعمالك بثبات.", stats: ["عميل سعيد", "مشروع تم تنفيذه", "سنوات من الخبرة", "حلول أعمال أساسية"], clear: "رؤية واضحة", clearText: "حلول مصممة وفق احتياجات نشاطك.", scale: "جاهز للتوسع", scaleText: "أنظمة تنمو مع طموحاتك.",
    contactEyebrow: "جاهز لتبسيط أعمالك؟", contactTitleA: "لنصنع خطوتك", contactTitleB: "القادمة بذكاء.", contactText: "حدثنا عن نشاطك وسنرشح لك أنسب الحلول البرمجية والأتمتة التي تدعم نموك.", tellUs: "حدثنا عن نشاطك", connect: "تواصل معنا", location: "القاهرة، مصر", footer: "حلول أعمال ذكية تساعد الشركات على تبسيط عملياتها والنمو بكفاءة.", chat: "تواصل معنا"
  }
} as const;

const trustSections = {
  en: {
    showcaseEyebrow: "CAPABILITY SNAPSHOTS",
    showcaseTitleA: "Solutions built",
    showcaseTitleB: "around real work.",
    showcaseText: "A closer look at the business systems Take More can shape around your operations, customers and growth goals.",
    showcaseItems: [
      { icon: Layers3, number: "01", title: "Connected operations", text: "Bring finance, inventory and daily workflows into one clearer operating picture.", tag: "ERP / Operations" },
      { icon: Zap, number: "02", title: "Faster transactions", text: "Create a dependable POS experience that keeps sales, billing and reporting moving.", tag: "POS / Retail" },
      { icon: Sparkles, number: "03", title: "Digital presence", text: "Turn your website into a useful business asset that earns trust and starts conversations.", tag: "Web / Growth" },
    ],
    processEyebrow: "HOW WE WORK",
    processTitleA: "From first conversation",
    processTitleB: "to a system that fits.",
    processText: "A simple, transparent process keeps decisions clear and progress visible at every step.",
    processItems: [
      ["01", "Understand", "We listen to your business, goals and current bottlenecks."],
      ["02", "Shape", "We turn the requirements into a focused solution and clear next steps."],
      ["03", "Build", "We design, develop and test the experience around your real workflow."],
      ["04", "Grow", "We hand over a foundation that can improve as your business grows."],
    ],
    proofEyebrow: "THE TAKE MORE APPROACH",
    proofTitleA: "Clear thinking",
    proofTitleB: "before more software.",
    proofItems: [
      ["Business-first", "Technology choices start with the way your team actually works."],
      ["Built to evolve", "A strong foundation leaves room for new branches, users and ideas."],
      ["One connected view", "Your operations, customer experience and digital presence work together."],
    ],
  },
  ar: {
    showcaseEyebrow: "نماذج من الحلول",
    showcaseTitleA: "حلول مصممة",
    showcaseTitleB: "حول واقع عملك.",
    showcaseText: "نظرة على نوعية الأنظمة التي يمكن لـ Take More تصميمها حول عملياتك وعملائك وأهداف نموك.",
    showcaseItems: [
      { icon: Layers3, number: "01", title: "عمليات مترابطة", text: "اربط الحسابات والمخزون وسير العمل اليومي في صورة تشغيلية أوضح.", tag: "ERP / العمليات" },
      { icon: Zap, number: "02", title: "معاملات أسرع", text: "أنشئ تجربة نقاط بيع موثوقة تحافظ على انسيابية المبيعات والفواتير والتقارير.", tag: "POS / التجزئة" },
      { icon: Sparkles, number: "03", title: "حضور رقمي فعال", text: "حوّل موقعك إلى أصل تجاري مفيد يبني الثقة ويفتح حوارات جديدة.", tag: "المواقع / النمو" },
    ],
    processEyebrow: "كيف نعمل",
    processTitleA: "من أول محادثة",
    processTitleB: "إلى نظام يناسبك.",
    processText: "خطوات بسيطة وشفافة تجعل القرارات واضحة والتقدم ظاهرًا في كل مرحلة.",
    processItems: [
      ["01", "نفهم", "نستمع إلى نشاطك وأهدافك والعوائق الموجودة في عملياتك."],
      ["02", "نخطط", "نحوّل الاحتياجات إلى حل واضح وخطوات تنفيذ محددة."],
      ["03", "نبني", "نصمم ونطور ونختبر التجربة حول طريقة عمل فريقك الحقيقية."],
      ["04", "نطوّر", "نسلمك أساسًا قويًا يمكن تحسينه مع نمو نشاطك."],
    ],
    proofEyebrow: "منهج TAKE MORE",
    proofTitleA: "رؤية واضحة",
    proofTitleB: "قبل المزيد من البرمجيات.",
    proofItems: [
      ["الأعمال أولًا", "اختيارات التقنية تبدأ من طريقة عمل فريقك الفعلية."],
      ["جاهز للتطور", "أساس قوي يترك مساحة للفروع والمستخدمين والأفكار الجديدة."],
      ["صورة مترابطة", "عملياتك وتجربة عملائك وحضورك الرقمي تعمل معًا."],
    ],
  },
} as const;

function AnimatedStat({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setDisplay(value);
        observer.disconnect();
        return;
      }
      const startedAt = performance.now();
      const duration = 1100;
      const tick = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(value * eased));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.disconnect();
    }, { threshold: 0.45 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return <div className="trust-stat" ref={ref}><strong>{display}{suffix}</strong><span>{label}</span></div>;
}

function BookingPanel({ onClose }: { onClose?: () => void }) {
  const config = trpc.booking.config.useQuery();
  const [language, setLanguage] = useState<"en" | "ar">(() => (localStorage.getItem("take-more-language") as "en" | "ar") || (navigator.language.toLowerCase().startsWith("ar") ? "ar" : "en"));
  const [serviceId, setServiceId] = useState<number | undefined>(() => Number(new URLSearchParams(window.location.search).get("service")) || undefined);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [success, setSuccess] = useState<{ bookingCode: string; serviceName: string; whatsappSent: boolean } | null>(null);
  const [form, setForm] = useState({ customerName: "", customerPhone: "", customerEmail: "", notes: "" });
  const slots = trpc.booking.availableSlots.useQuery({ serviceId: serviceId || 1, date }, { enabled: Boolean(serviceId && date) });
  const copy = language === "ar" ? {
    eyebrow: "احجز مكالمة استكشافية", title: "اختر الموعد المناسب لك.", service: "ما الخدمة التي تحتاجها؟", choose: "اختر خدمة", date: "التاريخ المفضل", available: "المواعيد المتاحة", session: "دقيقة للجلسة", checking: "جارٍ التحقق من المواعيد…", empty: "لا توجد مواعيد متاحة في هذا اليوم.", name: "الاسم بالكامل", phone: "رقم WhatsApp مع كود الدولة", email: "البريد الإلكتروني (اختياري)", notes: "حدثنا عن نشاطك التجاري (اختياري)", confirmation: "سيتم إرسال التأكيد إلى WhatsApp الخاص بك.", confirm: "تأكيد الحجز", confirming: "جارٍ التأكيد…", successTitle: "تم تأكيد حجزك بنجاح!", successText: "شكرًا لك. تم إرسال تفاصيل الحجز إلى WhatsApp وسنتواصل معك قريبًا.", successTextNoWhatsApp: "تم تسجيل الحجز بنجاح، لكن تعذر إرسال رسالة WhatsApp تلقائيًا. احتفظ برقم الحجز وسنتواصل معك.", code: "رقم الحجز", done: "تم", newBooking: "حجز موعد آخر", close: "إغلاق"
  } : {
    eyebrow: "BOOK A DISCOVERY CALL", title: "Choose a time that works.", service: "What do you need?", choose: "Select a service", date: "Preferred date", available: "Available times", session: "minute session", checking: "Checking live availability…", empty: "No times left on this day. Try another date.", name: "Full name", phone: "WhatsApp number (with country code)", email: "Email (optional)", notes: "Tell us a little about your business (optional)", confirmation: "Confirmation is sent to your WhatsApp.", confirm: "Confirm booking", confirming: "Confirming…", successTitle: "Your booking is confirmed!", successText: "Thanks for booking with Take More. The details were sent to WhatsApp and we will be in touch shortly.", successTextNoWhatsApp: "Your booking was saved, but the automatic WhatsApp message could not be sent. Keep the booking code and we will contact you.", code: "Booking code", done: "Done", newBooking: "Book another time", close: "Close"
  };
  const createBooking = trpc.booking.create.useMutation({
    onSuccess: result => { setSuccess({ bookingCode: result.bookingCode, serviceName: result.serviceName, whatsappSent: result.whatsapp.customerSent }); setSlot(""); setDate(""); setForm({ customerName: "", customerPhone: "", customerEmail: "", notes: "" }); },
    onError: error => {
      const message = error.message.includes("customerPhone")
        ? (language === "ar" ? "اكتب رقم WhatsApp صحيحًا من 7 أرقام على الأقل." : "Please enter a valid WhatsApp number with at least 7 digits.")
        : error.data?.code === "PRECONDITION_FAILED"
          ? (language === "ar" ? "الحجز غير متاح مؤقتًا. يرجى المحاولة مرة أخرى بعد قليل." : "Booking is temporarily unavailable. Please try again shortly.")
          : error.data?.code === "CONFLICT"
            ? (language === "ar" ? "هذا الموعد تم حجزه للتو. اختر موعدًا آخر." : "This slot was just booked. Please choose another time.")
            : error.message;
      toast.error(message);
    },
  });
  const selectedService = config.data?.services.find(item => item.id === serviceId);
  const minDate = useMemo(() => new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10), []);
  const update = (field: keyof typeof form, value: string) => setForm(current => ({ ...current, [field]: value }));
  return <div className="booking-panel" id="book" dir={language === "ar" ? "rtl" : "ltr"}>
    <div className="booking-panel-heading"><div><p className="eyebrow">{copy.eyebrow}</p><h3>{success ? copy.successTitle : copy.title}</h3></div><div className="booking-heading-actions"><button className="language-toggle" onClick={() => setLanguage(value => value === "en" ? "ar" : "en")} aria-label="Switch language">{language === "en" ? "العربية" : "English"}</button>{onClose && <button className="icon-button" onClick={onClose} aria-label={copy.close}><X size={18} /></button>}</div></div>
    {success ? <div className="booking-success"><div className="success-icon"><Check size={30} /></div><p>{success.whatsappSent ? copy.successText : copy.successTextNoWhatsApp}</p><div className="booking-code"><small>{copy.code}</small><strong>{success.bookingCode}</strong><span>{success.serviceName}</span></div><div className="success-actions"><Button className="primary-button" onClick={() => setSuccess(null)}>{copy.newBooking} <CalendarDays size={16} /></Button><button className="success-close" onClick={onClose}>{copy.done}</button></div></div> : <><div className="booking-steps"><span className={serviceId ? "step active" : "step"}>01 <b>{language === "ar" ? "الخدمة" : "Service"}</b></span><span className={date ? "step active" : "step"}>02 <b>{language === "ar" ? "الموعد" : "Date & time"}</b></span><span className={slot ? "step active" : "step"}>03 <b>{language === "ar" ? "بياناتك" : "Your details"}</b></span></div><div className="booking-grid"><label>{copy.service}<select value={serviceId ?? ""} onChange={event => { setServiceId(Number(event.target.value)); setSlot(""); }}><option value="">{copy.choose}</option>{config.data?.services.map(service => <option key={service.id} value={service.id}>{service.name} · {service.durationMinutes} {language === "ar" ? "دقيقة" : "min"}</option>)}</select></label><label>{copy.date}<input className="booking-date-input" type="date" min={minDate} value={date} onClick={event => { const input = event.currentTarget; if (typeof input.showPicker === "function") input.showPicker(); }} onChange={event => { setDate(event.target.value); setSlot(""); }} /></label></div>{serviceId && date && <div className="slot-section"><div className="field-heading"><span>{copy.available}</span><small>{selectedService?.durationMinutes} {copy.session}</small></div><div className="slot-grid">{slots.isLoading ? <span className="muted">{copy.checking}</span> : slots.data?.length ? slots.data.map(value => { const time = new Date(value).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Cairo" }); return <button type="button" key={value} className={slot === value ? "slot selected" : "slot"} onClick={() => setSlot(value)}>{time}</button>; }) : <span className="muted">{copy.empty}</span>}</div></div>}{slot && <div className="details-fields"><Input placeholder={copy.name} value={form.customerName} onChange={event => update("customerName", event.target.value)} /><Input placeholder={copy.phone} value={form.customerPhone} onChange={event => update("customerPhone", event.target.value)} /><Input type="email" placeholder={copy.email} value={form.customerEmail} onChange={event => update("customerEmail", event.target.value)} /><Textarea className="full-field" placeholder={copy.notes} value={form.notes} onChange={event => update("notes", event.target.value)} /></div>}<div className="booking-footer"><p><MessageCircle size={16} /> {copy.confirmation}</p><Button className="primary-button" disabled={!slot || !form.customerName.trim() || normalizePhone(form.customerPhone).length < 7 || createBooking.isPending} onClick={() => createBooking.mutate({ serviceId: serviceId!, startAt: slot, ...form, customerPhone: normalizePhone(form.customerPhone), language })}>{createBooking.isPending ? copy.confirming : copy.confirm} <MoveUpRight size={17} /></Button></div></>}
  </div>;
}

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [language, setLanguage] = useState<"en" | "ar">(() => {
    const requested = new URLSearchParams(window.location.search).get("lang");
    if (requested === "ar" || requested === "en") return requested;
    const saved = localStorage.getItem("take-more-language");
    if (saved === "ar" || saved === "en") return saved;
    return navigator.language.toLowerCase().startsWith("ar") ? "ar" : "en";
  });
  const [brandMode, setBrandMode] = useState<"blue" | "white">(() => (localStorage.getItem("take-more-mode") as "blue" | "white") || "blue");
  const content = homeCopy[language];
  const services = language === "ar" ? serviceCopyAr : serviceCopy;
  const trust = trustSections[language];

  useEffect(() => {
    document.documentElement.dataset.brandMode = brandMode;
    localStorage.setItem("take-more-mode", brandMode);
  }, [brandMode]);
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    localStorage.setItem("take-more-language", language);
  }, [language]);
  useEffect(() => {
    if (!mobileOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [mobileOpen]);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("book") === "1") setBookingOpen(true);
    const items = document.querySelectorAll(".scroll-reveal");
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    items.forEach(item => observer.observe(item));
    return () => observer.disconnect();
  }, [language]);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return <div className="site-shell" dir={language === "ar" ? "rtl" : "ltr"}>
    <header className="topbar dark-header">
      <a className="brand" href="#home" onClick={() => scrollTo("home")}><img src={brandMode === "white" ? "/assets/take-more-logo-white.png" : "/assets/take-more-logo.png"} alt="Take More — Retail & Web, Made Smarter" /></a>
      <nav id="home-mobile-nav" className={mobileOpen ? "main-nav mobile-open" : "main-nav"}>
        <button onClick={() => scrollTo("home")}>{content.nav.home}</button>
        <a href="/services" onClick={() => setMobileOpen(false)}>{content.nav.services}</a>
        <button onClick={() => scrollTo("work")}>{content.nav.work}</button>
        <button onClick={() => scrollTo("process")}>{content.nav.process}</button>
        <button onClick={() => scrollTo("why")}>{content.nav.why}</button>
        <button onClick={() => scrollTo("contact")}>{content.nav.contact}</button>
        <button className="nav-book" onClick={() => { setBookingOpen(true); setMobileOpen(false); }}>{content.nav.book} <MoveUpRight size={15} /></button>
      </nav>
      <button className="mobile-menu" onClick={() => setMobileOpen(value => !value)} aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={mobileOpen} aria-controls="home-mobile-nav">{mobileOpen ? <X size={23} /> : <Menu size={23} />}</button>
      <div className="header-actions">
        <button className="language-switch" onClick={() => setLanguage(value => value === "en" ? "ar" : "en")} aria-label={language === "en" ? "عرض الموقع بالعربية" : "View website in English"}><Languages size={15} /><span>{language === "en" ? "العربية" : "EN"}</span></button>
        <button className="mode-toggle" onClick={() => setBrandMode(value => value === "blue" ? "white" : "blue")} aria-label={brandMode === "blue" ? "Switch to white mode" : "Switch to blue mode"}>{brandMode === "blue" ? <Sun size={15} /> : <Moon size={15} />}<span>{brandMode === "blue" ? content.mode.white : content.mode.blue}</span></button>
        <button className="desktop-book" onClick={() => setBookingOpen(true)}>{content.nav.start} <MoveUpRight size={15} /></button>
      </div>
    </header>
    {mobileOpen && <button className="mobile-nav-backdrop" aria-label="Close navigation menu" onClick={() => setMobileOpen(false)} />}

    <main>
      <section id="home" className="hero container">
        <div className="hero-copy">
          <p className="eyebrow reveal">{content.heroEyebrow}</p>
          <h1 className="reveal delay-1">{content.heroTitleA}<br /><em>{content.heroTitleB}</em><br />{content.heroTitleC}</h1>
          <p className="hero-text reveal delay-2">{content.heroLine}<br />{content.heroText}</p>
          <div className="hero-actions reveal delay-3"><Button className="primary-button" onClick={() => setBookingOpen(true)}>{content.discovery} <MoveUpRight size={17} /></Button><button className="text-link" onClick={() => scrollTo("services")}>{content.explore} <ChevronDown size={16} /></button></div>
        </div>
        <div className="hero-visual reveal delay-2"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="dashboard-card"><div className="dashboard-top"><span className="tiny-dot" /><span>TM / dashboard</span><span className="live-pill">LIVE</span></div><div className="dashboard-number">+38.4% <span>↗</span></div><p>business efficiency</p><div className="mini-bars"><i /><i /><i /><i /><i /><i /><i /></div><div className="dashboard-bottom"><span>ERP</span><span>POS</span><span>CRM</span></div></div><div className="floating-note"><span className="green-check"><Check size={13} /></span><div><strong>{language === "ar" ? "كل الأنظمة تعمل" : "All systems go"}</strong><small>{language === "ar" ? "كل شيء متصل" : "Everything connected"}</small></div></div><div className="hero-sticker">BUILT<br /><span>TO</span><br />GROW</div></div>
      </section>

      <section id="services" className="services-section container"><div className="section-intro"><div><p className="eyebrow">{content.servicesEyebrow}</p><h2>{content.servicesTitleA}<br /><em>{content.servicesTitleB}</em></h2></div><p>{content.servicesText}</p></div><div className="service-grid">{services.map(({ icon: Icon, eyebrow, title, description, bullets, tone }, index) => <article className={`service-card ${tone} scroll-reveal`} key={title}><div className="service-icon"><Icon size={22} /></div><p className="eyebrow">{eyebrow}</p><h3>{title}</h3><p className="service-description">{description}</p><ul>{bullets.map(item => <li key={item}><Check size={15} />{item}</li>)}</ul><button className="card-link" onClick={() => setBookingOpen(true)}>{content.cardCta} <MoveUpRight size={15} /></button><span className="card-number">0{index + 1}</span></article>)}</div></section>

      <section id="work" className="showcase-section container scroll-reveal"><div className="section-intro"><div><p className="eyebrow">{trust.showcaseEyebrow}</p><h2>{trust.showcaseTitleA}<br /><em>{trust.showcaseTitleB}</em></h2></div><p>{trust.showcaseText}</p></div><div className="showcase-grid">{trust.showcaseItems.map(({ icon: Icon, number, title, text: description, tag }) => <article className="showcase-card" key={number}><div className="showcase-card-top"><span className="showcase-icon"><Icon size={22} /></span><span>{number}</span></div><p className="eyebrow">{tag}</p><h3>{title}</h3><p>{description}</p><span className="showcase-arrow"><MoveUpRight size={17} /></span></article>)}</div></section>

      <section id="process" className="process-section container scroll-reveal"><div className="process-heading"><p className="eyebrow">{trust.processEyebrow}</p><h2>{trust.processTitleA}<br /><em>{trust.processTitleB}</em></h2><p>{trust.processText}</p></div><div className="process-grid">{trust.processItems.map(([number, title, description]) => <article className="process-step" key={number}><span>{number}</span><div><h3>{title}</h3><p>{description}</p></div></article>)}</div></section>

      <section id="proof" className="proof-section container scroll-reveal"><div><p className="eyebrow">{trust.proofEyebrow}</p><h2>{trust.proofTitleA}<br /><em>{trust.proofTitleB}</em></h2></div><div className="proof-grid">{trust.proofItems.map(([title, description]) => <article className="proof-card" key={title}><ShieldCheck size={20} /><h3>{title}</h3><p>{description}</p></article>)}</div></section>

      <section id="why" className="why-section why-section-copy container scroll-reveal"><div className="why-copy"><p className="eyebrow">{content.whyEyebrow}</p><h2>{content.whyTitleA}<br /><em>{content.whyTitleB}</em></h2><p>{content.whyText}</p><div className="trust-stats" aria-label="Take More business statistics"><AnimatedStat value={50} suffix="+" label={content.stats[0]} /><AnimatedStat value={120} suffix="+" label={content.stats[1]} /><AnimatedStat value={8} suffix="+" label={content.stats[2]} /><AnimatedStat value={4} label={content.stats[3]} /></div><div className="why-points"><div><span>01</span><strong>{content.clear}</strong><small>{content.clearText}</small></div><div><span>02</span><strong>{content.scale}</strong><small>{content.scaleText}</small></div></div></div></section>

      <section id="contact" className="contact-section scroll-reveal"><div><p className="eyebrow">{content.contactEyebrow}</p><h2>{content.contactTitleA}<br /><em>{content.contactTitleB}</em></h2></div><div className="contact-card"><p>{content.contactText}</p><button className="primary-button" onClick={() => setBookingOpen(true)}>{content.tellUs} <MoveUpRight size={17} /></button><div className="contact-meta"><span><Phone size={14} /> {content.location}</span><a className="email-contact" href="mailto:Info@take-more.com"><Mail size={14} /> Info@take-more.com</a></div><div className="contact-socials"><span>{content.connect}</span><div><a className="contact-social facebook" href="https://www.facebook.com/share/1C6TU1C2ub/?mibextid=wwXIfr" target="_blank" rel="noreferrer" aria-label="Take More on Facebook"><BrandIcon brand="facebook" size={17} /></a><a className="contact-social whatsapp" href="https://wa.me/201153213270" target="_blank" rel="noreferrer" aria-label="Chat with Take More on WhatsApp" title="WhatsApp"><BrandIcon brand="whatsapp" size={17} /></a><a className="contact-social instagram" href="https://www.instagram.com/takemore.eg?stkn=YzJhYXNpYnJnZnFl&utm_source=qr" target="_blank" rel="noreferrer" aria-label="Take More on Instagram"><BrandIcon brand="instagram" size={17} /></a><a className="contact-social linkedin disabled" href="#contact" aria-label="LinkedIn link coming soon" onClick={event => event.preventDefault()}><BrandIcon brand="linkedin" size={17} /></a></div></div></div></section>
    </main>

    <footer className="footer container"><a className="brand" href="#home"><img src={brandMode === "white" ? "/assets/take-more-logo-white.png" : "/assets/take-more-logo.png"} alt="Take More — Retail & Web, Made Smarter" /></a><p>{content.footer}</p><div className="footer-links"><a className="social-link facebook" href="https://www.facebook.com/share/1C6TU1C2ub/?mibextid=wwXIfr" target="_blank" rel="noreferrer"><BrandIcon brand="facebook" size={16} /><span>Facebook</span></a><a className="social-link instagram" href="https://www.instagram.com/takemore.eg?stkn=YzJhYXNpYnJnZnFl&utm_source=qr" target="_blank" rel="noreferrer"><BrandIcon brand="instagram" size={16} /><span>Instagram</span></a><a className="social-link linkedin" href="https://www.linkedin.com/" target="_blank" rel="noreferrer"><BrandIcon brand="linkedin" size={16} /><span>LinkedIn</span></a><Link href="/admin">Admin</Link></div></footer>
    <a className="floating-whatsapp" href="https://wa.me/201153213270" target="_blank" rel="noreferrer" aria-label="Chat with Take More on WhatsApp"><BrandIcon brand="whatsapp" size={25} /><span>{content.chat}</span></a>
    {bookingOpen && <div className="modal-backdrop" onClick={event => { if (event.target === event.currentTarget) setBookingOpen(false); }}><BookingPanel onClose={() => setBookingOpen(false)} /></div>}
  </div>;
}
