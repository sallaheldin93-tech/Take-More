import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { CalendarDays, Check, ChevronDown, Clock3, Facebook, Instagram, Languages, Linkedin, Layers3, Loader2, Menu, MessageCircle, Mail, Moon, MoveUpRight, Phone, ShieldCheck, Sparkles, Sun, X, Zap } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { applySeo } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SiteHeader } from "@/components/home/SiteHeader";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { WorkGallery } from "@/components/home/WorkGallery";
import { CapabilitiesSection } from "@/components/home/CapabilitiesSection";
import { ClosingSection, FaqSection, PlaceSection, StatementSection } from "@/components/home/StudioSections";

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
  { icon: Layers3, eyebrow: "01 / OPERATIONS", title: "ERP Solutions", description: "Connect finance, inventory, purchasing and daily operations in one clear system built around the way your business works.", bullets: ["Finance & accounting", "Inventory and purchasing", "Reports and dashboards"], tone: "lime" },
  { icon: Zap, eyebrow: "02 / SALES", title: "POS & Retail Systems", description: "Keep every sale, invoice and branch under control with a reliable point-of-sale experience for growing businesses.", bullets: ["Sales and billing", "Multi-branch control", "Daily reconciliation"], tone: "sky" },
  { icon: Sparkles, eyebrow: "03 / DIGITAL", title: "Websites & E-commerce", description: "Build a fast, credible digital presence that explains your offer clearly and turns visits into real conversations.", bullets: ["Corporate websites", "Online stores", "SEO-ready foundation"], tone: "ice" },
  { icon: ShieldCheck, eyebrow: "04 / GROWTH", title: "CRM & Automation", description: "Organize leads, follow-ups and internal workflows so your team spends less time chasing tasks and more time growing.", bullets: ["Lead management", "Automated follow-ups", "Sales pipeline"], tone: "blue" },
  { icon: Layers3, eyebrow: "05 / DATA", title: "Dashboards & Reporting", description: "Turn scattered business data into practical dashboards that help you see performance and act faster.", bullets: ["KPI dashboards", "Management reports", "Connected data views"], tone: "lime" },
  { icon: Sparkles, eyebrow: "06 / BRAND", title: "Brand & UI/UX Design", description: "Create a consistent visual identity and an intuitive experience that makes your business easier to trust and use.", bullets: ["Brand direction", "UI/UX systems", "Conversion-focused pages"], tone: "ice" },
  { icon: ShieldCheck, eyebrow: "07 / SUPPORT", title: "Hosting & Maintenance", description: "Keep your digital tools secure, stable and updated with practical support after launch.", bullets: ["Performance monitoring", "Security updates", "Technical support"], tone: "blue" },
  { icon: Zap, eyebrow: "08 / STRATEGY", title: "Business Consultation", description: "Start with a clear roadmap that prioritizes the right technology, avoids wasted spend and supports measurable progress.", bullets: ["Needs assessment", "Technology roadmap", "Growth priorities"], tone: "sky" },
] as const;

const serviceCopyAr = [
  { icon: Layers3, eyebrow: "01 / العمليات", title: "حلول ERP", description: "اربط الحسابات والمخزون والمشتريات والعمليات اليومية داخل نظام واضح مصمم حول طريقة عمل نشاطك.", bullets: ["الحسابات والمالية", "المخزون والمشتريات", "التقارير ولوحات المتابعة"], tone: "lime" },
  { icon: Zap, eyebrow: "02 / المبيعات", title: "نقاط البيع والتجزئة", description: "تحكم في المبيعات والفواتير والفروع من خلال تجربة نقاط بيع موثوقة تناسب الأعمال المتنامية.", bullets: ["المبيعات والفواتير", "إدارة الفروع", "التسويات اليومية"], tone: "sky" },
  { icon: Sparkles, eyebrow: "03 / الحضور الرقمي", title: "المواقع والمتاجر الإلكترونية", description: "ابنِ حضورًا رقميًا سريعًا واحترافيًا يشرح خدمتك بوضوح ويحوّل الزيارات إلى محادثات حقيقية.", bullets: ["مواقع الشركات", "المتاجر الإلكترونية", "تهيئة لمحركات البحث"], tone: "ice" },
  { icon: ShieldCheck, eyebrow: "04 / النمو", title: "CRM وأتمتة الأعمال", description: "نظّم العملاء المحتملين والمتابعات وسير العمل حتى يوفر فريقك الوقت ويركز على النمو.", bullets: ["إدارة العملاء المحتملين", "المتابعات الآلية", "خط سير المبيعات"], tone: "blue" },
  { icon: Layers3, eyebrow: "05 / البيانات", title: "لوحات البيانات والتقارير", description: "حوّل بيانات نشاطك المتفرقة إلى لوحات عملية تساعدك على فهم الأداء واتخاذ القرار أسرع.", bullets: ["مؤشرات الأداء", "تقارير الإدارة", "رؤية موحدة للبيانات"], tone: "lime" },
  { icon: Sparkles, eyebrow: "06 / الهوية", title: "الهوية و��صميم UI/UX", description: "صمّم هوية متناسقة وتجربة استخدام سهلة تجعل نشاطك أكثر وضوحًا وثقة في عين العميل.", bullets: ["توجيه الهوية", "أنظمة واجهات", "صفحات تركز على التحويل"], tone: "ice" },
  { icon: ShieldCheck, eyebrow: "07 / الدعم", title: "الاستضافة والصيانة", description: "حافظ على أدواتك الرقمية آمنة ومستقرة ومحدثة من خلال دعم عملي بعد الإطلاق.", bullets: ["متابعة الأداء", "تحديثات الأمان", "الدعم ��لفني"], tone: "blue" },
  { icon: Zap, eyebrow: "08 / الاستراتيجية", title: "استشارات الأعمال", description: "ابدأ بخارطة طريق واضحة تحدد التقنية المناسبة وتقلل الإنفاق غير الضروري وتدعم التقدم القابل للقياس.", bullets: ["تحليل الاحتياجات", "خارطة تقنية", "أولويات النمو"], tone: "sky" },
] as const;

const homeCopy = {
  en: {
    nav: { home: "Home", services: "Services", work: "Solutions", process: "How we work", why: "Why us", faq: "FAQ", contact: "Contact", book: "Book a call", start: "Get started" },
    mode: { white: "White", blue: "Blue" },
    heroEyebrow: "SOFTWARE FOR THE REAL WORLD", heroTitleA: "Software that runs", heroTitleB: "your entire", heroTitleC: "business.", heroLine: "ERP • POS • Websites • Business & CRM Automation.", heroText: "Helping businesses simplify operations and grow smarter.", discovery: "Book a discovery call", explore: "Explore services",
    servicesEyebrow: "WHAT WE DO", servicesTitleA: "One partner for", servicesTitleB: "your business software.", servicesText: "From daily operations to customer growth — we deliver the systems your business runs on.", cardCta: "Get started",
    whyEyebrow: "WHY TAKE MORE", whyTitleA: "Results you can", whyTitleB: "build confidence on.", whyText: "We combine technical know-how with business thinking to deliver connected systems that create measurable value and support sustainable growth.", stats: ["Connected operations", "Clear next steps", "Practical support", "Core solutions"], clear: "Clear thinking", clearText: "Solutions designed around your reality.", scale: "Built to scale", scaleText: "Systems that grow with your ambition.",
    contactEyebrow: "READY TO SIMPLIFY?", contactTitleA: "Let's make your", contactTitleB: "next move smarter.", contactText: "Tell us about your business and we will recommend the right software and automation for your growth.", tellUs: "Tell us about your business", connect: "Connect with us", location: "Cairo, Egypt", footer: "Smart Business Solutions — Helping businesses simplify operations and grow smarter.", chat: "Chat with us"
  },
  ar: {
    nav: { home: "الرئيسية", services: "خدماتنا", work: "حلولنا", process: "كيف نعمل", why: "لماذا نحن", faq: "الأسئلة الشائعة", contact: "تواصل معنا", book: "احجز مكالمة", start: "ابدأ الآن" },
    mode: { white: "أبيض", blue: "أزرق" },
    heroEyebrow: "حلول برمجية تناسب أعمالك", heroTitleA: "برمجيات تدير", heroTitleB: "كل تفاصيل", heroTitleC: "أعمالك.", heroLine: "ERP • POS • المواقع • أتمتة الأعمال وCRM.", heroText: "نساعد الشركات على تبسيط عملياتها وتحقيق نمو أذكى.", discovery: "احجز مكالمة استكشافية", explore: "استكشف خدماتنا",
    servicesEyebrow: "ماذا نقدم", servicesTitleA: "شريك واحد لكل", servicesTitleB: "حلول أعمالك التقنية.", servicesText: "من العمليات اليومية إلى نمو العملاء — نوفر الأنظمة التي يعتمد عليها نشاطك.", cardCta: "ابدأ الآن",
    whyEyebrow: "لماذا TAKE MORE", whyTitleA: "نتائج تمنحك", whyTitleB: "ثقة أكبر.", whyText: "نجمع بين الخبرة التقنية والفهم التجاري لنقدم أنظمة مترابطة تحقق قيمة قابلة للقياس وتدعم نمو أعمالك بثبات.", stats: ["عمليات مترابطة", "خطوات واضحة", "دعم عملي", "حلول أساسية"], clear: "رؤية واضحة", clearText: "حلول مصممة وفق احتياجات نشاطك.", scale: "جاهز للتوسع", scaleText: "أنظمة تنمو مع طموحاتك.",
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
      { icon: Zap, number: "02", title: "��عاملات أسرع", text: "أنشئ تجربة نقاط بيع موثوقة تحافظ على انسيابية المبيعات والفواتير والتقارير.", tag: "POS / التجزئة" },
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

const faqCopy = {
  en: [
    ["What can Take More help us with?", "We help businesses organize operations, improve their digital presence and automate repetitive work through practical software solutions."],
    ["Do you work with small and growing businesses?", "Yes. We start with the most important business need and shape a solution that can expand as your team and operations grow."],
    ["How do we start?", "Book a discovery call, tell us what is slowing your business down, and we will recommend a focused next step."],
    ["Can you improve an existing website or system?", "Yes. We can review the current experience, identify friction and improve the design, performance or workflow without starting blindly from zero."],
    ["Do you provide support after launch?", "Yes. We can continue with maintenance, improvements, monitoring and technical support based on your needs."],
  ],
  ar: [
    ["ما الذي يمكن أن تساعدنا فيه Take More؟", "نساعد الشركات على تنظيم العمليات، وتحسين حضورها الرقمي، وأتمتة المهام المتكررة من خلال حلول برمجية عملية."],
    ["هل تعملون مع الشركات الصغيرة والنامية؟", "نعم. نبدأ من الاحتياج الأهم لنشاطك ونبني حلًا قابلًا للتوسع مع نمو فريقك وعملياتك."],
    ["كيف نبدأ؟", "احجز مكالمة استكشافية، حدثنا عن أكثر ما يعطل نشاطك، وسنقترح عليك خطوة عملية واضحة."],
    ["هل يمكنكم تطوير موقع أو نظام موجود؟", "نعم. نراجع التجربة الحالية، ونحدد نقاط التعطيل، ثم نحسن التصميم أو الأداء أو سير العمل دون البدء من الصفر بشكل عشوائي."],
    ["هل تقدمون دعمًا بعد الإطلاق؟", "نعم. نوفر الصيانة والتحسينات والمتابعة والدعم الفني حسب احتياجات نشاطك."],
  ],
} as const;

const testimonialCopy = {
  en: [
    ["A clearer way to work", "Take More helps us see the connection between daily operations, customer experience and the next stage of growth."],
    ["Practical from day one", "The conversation started with our real business problem, not with a list of unnecessary features."],
    ["Built around the business", "The strongest part is the focus on a solution that our team can actually use and improve over time."],
  ],
  ar: [
    ["طريقة أوضح للعمل", "ساعدتنا Take More على رؤية العلاقة بين العمليات اليومية وتجربة العميل وخطوتنا التالية للنمو."],
    ["عملية من اليوم الأول", "بدأ الحوار من مشكلة حقيقية في نشاطنا، وليس من قائمة خصائص لا نحتاجها."],
    ["حل حول واقع النشاط", "أكثر ما يميز التجربة هو التركيز على حل يستطيع فريقنا استخدامه وتطويره مع الوقت."],
  ],
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

const fallbackBookingServices = [
  { id: 1, name: "ERP Solutions", durationMinutes: 60 },
  { id: 2, name: "POS Systems", durationMinutes: 45 },
  { id: 3, name: "Websites", durationMinutes: 45 },
  { id: 4, name: "Business & CRM Automation", durationMinutes: 60 },
] as const;

function BookingPanel({ onClose }: { onClose?: () => void }) {
  const config = trpc.booking.config.useQuery(undefined, { staleTime: 5 * 60 * 1000, retry: 1 });
  const bookingServices = config.data?.services ?? fallbackBookingServices;
  const [language, setLanguage] = useState<"en" | "ar">(() => (localStorage.getItem("take-more-language") as "en" | "ar") || (navigator.language.toLowerCase().startsWith("ar") ? "ar" : "en"));
  const [serviceId, setServiceId] = useState<number | undefined>(() => Number(new URLSearchParams(window.location.search).get("service")) || undefined);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [success, setSuccess] = useState<{ bookingCode: string; serviceName: string; whatsappSent: boolean } | null>(null);
  const [form, setForm] = useState({ customerName: "", customerPhone: "", customerEmail: "", notes: "" });
  const slots = trpc.booking.availableSlots.useQuery({ serviceId: serviceId || 1, date }, { enabled: Boolean(serviceId && date) });
  const copy = language === "ar" ? {
    eyebrow: "احجز مكالمة استكشافية", title: "اختر الموعد المناسب لك.", service: "ما الخدمة التي تحتاجها؟", choose: "اختر خدمة", date: "التاريخ المفضل", available: "المواعيد المتاحة", session: "دقيقة للجلسة", checking: "جارٍ التحقق من المواعيد…", empty: "لا توجد مواعيد متاحة في هذا اليوم.", name: "الاسم بالكامل", phone: "رقم WhatsApp مع كود الدولة", email: "البريد الإلكترون�� (اختي��ري)", notes: "حدثنا عن نشاطك التجاري (اختياري)", confirmation: "سيتم إرسال التأكيد إلى WhatsApp الخاص بك.", confirm: "تأكيد الحجز", confirming: "جارٍ التأكيد…", successTitle: "تم تأكيد حجزك بنجاح!", successText: "شكرًا لك. تم إرسال تفاصيل الحجز إلى WhatsApp وسنتواصل معك قريبًا.", successTextNoWhatsApp: "تم تسجيل الحجز بنجاح، لكن تعذر إرسال رسالة WhatsApp تلقائيًا. احتفظ برقم الحجز وسنتواصل معك.", code: "رقم الحجز", done: "تم", newBooking: "حجز موعد آخر", close: "إغلاق"
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
  const selectedService = bookingServices.find(item => item.id === serviceId);
  const minDate = useMemo(() => new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10), []);
  const update = (field: keyof typeof form, value: string) => setForm(current => ({ ...current, [field]: value }));
  return <div className="booking-panel" id="book" dir={language === "ar" ? "rtl" : "ltr"}>
    <div className="booking-panel-heading"><div><p className="eyebrow">{copy.eyebrow}</p><h3>{success ? copy.successTitle : copy.title}</h3></div><div className="booking-heading-actions"><button className="language-toggle" onClick={() => setLanguage(value => value === "en" ? "ar" : "en")} aria-label="Switch language">{language === "en" ? "العربية" : "English"}</button>{onClose && <button className="icon-button" onClick={onClose} aria-label={copy.close}><X size={18} /></button>}</div></div>
    {success ? <div className="booking-success"><div className="success-icon"><Check size={30} /></div><p>{success.whatsappSent ? copy.successText : copy.successTextNoWhatsApp}</p><div className="booking-code"><small>{copy.code}</small><strong>{success.bookingCode}</strong><span>{success.serviceName}</span></div><div className="success-actions"><Button className="primary-button" onClick={() => setSuccess(null)}>{copy.newBooking} <CalendarDays size={16} /></Button><button className="success-close" onClick={onClose}>{copy.done}</button></div></div> : <><div className="booking-steps"><span className={serviceId ? "step active" : "step"}>01 <b>{language === "ar" ? "الخدمة" : "Service"}</b></span><span className={date ? "step active" : "step"}>02 <b>{language === "ar" ? "الموعد" : "Date & time"}</b></span><span className={slot ? "step active" : "step"}>03 <b>{language === "ar" ? "بياناتك" : "Your details"}</b></span></div><div className="booking-grid"><label>{copy.service}<select value={serviceId ?? ""} onChange={event => { setServiceId(Number(event.target.value)); setSlot(""); }}><option value="">{copy.choose}</option>{bookingServices.map(service => <option key={service.id} value={service.id}>{service.name} · {service.durationMinutes} {language === "ar" ? "دقيقة" : "min"}</option>)}</select></label><label>{copy.date}<input className="booking-date-input" type="date" min={minDate} value={date} onClick={event => { const input = event.currentTarget; if (typeof input.showPicker === "function") { try { input.showPicker(); } catch { /* Embedded previews may block showPicker; native input behavior remains available. */ } } }} onChange={event => { setDate(event.target.value); setSlot(""); }} /></label></div>{serviceId && date && <div className="slot-section"><div className="field-heading"><span>{copy.available}</span><small>{selectedService?.durationMinutes} {copy.session}</small></div><div className="slot-grid">{slots.isLoading ? <span className="muted slot-loading"><Loader2 size={15} /> {copy.checking}</span> : slots.data?.length ? slots.data.map(value => { const time = new Date(value).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Cairo" }); return <button type="button" key={value} className={slot === value ? "slot selected" : "slot"} onClick={() => setSlot(value)}>{time}</button>; }) : <span className="muted">{copy.empty}</span>}</div></div>}{slot && <div className="details-fields"><Input placeholder={copy.name} value={form.customerName} onChange={event => update("customerName", event.target.value)} /><Input placeholder={copy.phone} value={form.customerPhone} onChange={event => update("customerPhone", event.target.value)} /><Input type="email" placeholder={copy.email} value={form.customerEmail} onChange={event => update("customerEmail", event.target.value)} /><Textarea className="full-field" placeholder={copy.notes} value={form.notes} onChange={event => update("notes", event.target.value)} /></div>}<div className="booking-footer"><p><MessageCircle size={16} /> {copy.confirmation}</p><Button className="primary-button" disabled={!slot || !form.customerName.trim() || normalizePhone(form.customerPhone).length < 7 || createBooking.isPending} onClick={() => createBooking.mutate({ serviceId: serviceId!, startAt: slot, ...form, customerPhone: normalizePhone(form.customerPhone), language })}>{createBooking.isPending ? copy.confirming : copy.confirm} <MoveUpRight size={17} /></Button></div></>}
  </div>;
}

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
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
    const seo = language === "ar"
      ? { title: "Take More | حلول ERP ونقاط البيع والمواقع في مصر", description: "Take More تقدم حلول ERP، أنظمة نقاط البيع، تصميم المواقع والمتاجر الإلكترونية، CRM وأتمتة الأعمال لمساعدة الشركات على النمو بوضوح.", keywords: "حلول ERP مصر, نقاط البيع, تصميم مواقع مصر, CRM, أتمتة الأعمال" }
      : { title: "Take More | Smart Business Software in Egypt", description: "Take More delivers ERP, POS, websites, e-commerce, CRM and business automation solutions that help companies operate and grow with clarity.", keywords: "ERP Egypt, POS Egypt, business software, website development, CRM automation" };
    applySeo({ ...seo, lang: language, path: "/", services: services.map((service, index) => ({ name: service.title, description: service.description, slug: `/services#service-${index < 4 ? ["erp", "pos", "websites", "crm"][index] : "solutions"}` })) });
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
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return <div className="site-shell sd-page" dir={language === "ar" ? "rtl" : "ltr"}>
    <SiteHeader language={language} activeSection={activeSection} mobileOpen={mobileOpen} onToggleMobile={() => setMobileOpen(value => !value)} onNavigate={scrollTo} onToggleLanguage={() => setLanguage(value => value === "en" ? "ar" : "en")} onStart={() => { setBookingOpen(true); setMobileOpen(false); }} />
    {mobileOpen && <button className="mobile-nav-backdrop" aria-label="Close navigation menu" onClick={() => setMobileOpen(false)} />}

    <main>
      <HeroSection language={language} onTalk={() => setBookingOpen(true)} onExplore={() => scrollTo("services")} />

      <WorkGallery language={language} />
      <CapabilitiesSection language={language} />
      <StatementSection language={language} />
      <ServicesSection language={language} />
      <PlaceSection language={language} />
      <FaqSection language={language} items={faqCopy[language]} />
      <ClosingSection language={language} onBook={() => setBookingOpen(true)} />
    </main>


    <footer className="footer container"><a className="brand" href="#home"><img src="/assets/take-more-logo.png" alt="Take More — Retail & Web, Made Smarter" /></a><p>{content.footer}</p><div className="footer-links"><a className="social-link facebook" href="https://www.facebook.com/share/1C6TU1C2ub/?mibextid=wwXIfr" target="_blank" rel="noreferrer"><BrandIcon brand="facebook" size={16} /><span>Facebook</span></a><a className="social-link instagram" href="https://www.instagram.com/takemore.eg?stkn=YzJhYXNpYnJnZnFl&utm_source=qr" target="_blank" rel="noreferrer"><BrandIcon brand="instagram" size={16} /><span>Instagram</span></a><a className="social-link linkedin" href="https://www.linkedin.com/" target="_blank" rel="noreferrer"><BrandIcon brand="linkedin" size={16} /><span>LinkedIn</span></a><Link href="/admin">Admin</Link></div></footer>
    <a className="floating-whatsapp" href="https://wa.me/201153213270" target="_blank" rel="noreferrer" aria-label="Chat with Take More on WhatsApp"><BrandIcon brand="whatsapp" size={25} /><span>{content.chat}</span></a>
    {bookingOpen && <div className="modal-backdrop" onClick={event => { if (event.target === event.currentTarget) setBookingOpen(false); }}><BookingPanel onClose={() => setBookingOpen(false)} /></div>}
  </div>;
}
