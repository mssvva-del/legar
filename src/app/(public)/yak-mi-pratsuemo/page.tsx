import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  ClipboardList,
  UserCheck,
  FileText,
  Handshake,
  Gavel,
  CheckCircle2,
  Trophy,
  Shield,
  Phone,
  Clock,
  ChevronDown,
} from "lucide-react";
import { COMPANY, CONTACTS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Як ми працюємо — Процес LEGAR від діагностики до результату",
  description:
    "Покрокова схема роботи LEGAR: AI-діагностика, підбір адвоката, захист у ТЦК/суді, результат. Прозоро, поетапно, під вашим контролем.",
  keywords: ["як працює LEGAR", "процес роботи адвоката", "військовий захист кроки", "legar.com.ua"],
  alternates: { canonical: `${COMPANY.url}/yak-mi-pratsuemo` },
  openGraph: {
    title: "Як ми працюємо — Процес LEGAR від діагностики до результату",
    description: "Покрокова схема роботи LEGAR: AI-діагностика → адвокат → результат.",
    url: `${COMPANY.url}/yak-mi-pratsuemo`,
    type: "website",
  },
};

const STEPS = [
  {
    num: "01",
    icon: Sparkles,
    title: "AI-Діагностика (5–10 хвилин)",
    desc: "Заповнюєте інтерактивний опитувальник. Система аналізує ситуацію й формує персональний PDF-звіт: карта ризиків, рекомендовані послуги, попередня оцінка вартості.",
    badge: "Від 1 200 грн",
    note: "Доступно онлайн 24/7",
  },
  {
    num: "02",
    icon: ClipboardList,
    title: "Аналіз справи менеджером",
    desc: "Менеджер LEGAR переглядає ваш AI-звіт і зв'язується впродовж 2 годин. Уточнює деталі, відповідає на запитання, рекомендує оптимальний пакет послуг.",
    badge: "Безкоштовно",
    note: "Реакція до 2 годин",
  },
  {
    num: "03",
    icon: UserCheck,
    title: "Підбір та призначення адвоката",
    desc: "LEGAR підбирає адвоката з профільною спеціалізацією у вашому місті. Ви знайомитесь з його профілем, досвідом та рейтингом. Погоджуєтесь або просите заміну.",
    badge: "Без переплат",
    note: "Тільки НААУ-сертифіковані",
  },
  {
    num: "04",
    icon: FileText,
    title: "Підписання договору",
    desc: "Простий договір між клієнтом та адвокатом. Чітко прописані: послуги, вартість, терміни, зобов'язання. Підписання онлайн або особисто — зручно для вас.",
    badge: "Фіксована ціна",
    note: "Без прихованих пунктів",
  },
  {
    num: "05",
    icon: Handshake,
    title: "Активна робота адвоката",
    desc: "Адвокат починає роботу: збирає документи, готує клопотання, відвідує ТЦК / ВЛК, веде переговори. Усі дії та документи відображаються в особистому кабінеті.",
    badge: "Ви все бачите",
    note: "Кабінет з хронологією",
  },
  {
    num: "06",
    icon: Gavel,
    title: "Судове або досудове рішення",
    desc: "Завершення справи: закрита постанова, позитивний висновок ВЛК, рішення суду, укладена угода. Ви отримуєте оригінали документів і кабінет залишається доступним.",
    badge: "Результат",
    note: "94% позитивних справ",
  },
];

const SCENARIOS = [
  {
    title: "Отримав повістку від ТЦК",
    steps: [
      "AI-Діагностика → визначення законності повістки",
      "Адвокат перевіряє підстави та строки",
      "Підготовка офіційного клопотання",
      "Оскарження або супровід явки",
    ],
    time: "3–7 днів",
    service: "antyshtraf-tck-360",
  },
  {
    title: "ВЛК визнала придатним — не згоден",
    steps: [
      "Аналіз медичних документів через AI",
      "Адвокат ВЛК Pro вивчає справу",
      "Збір незалежних медичних висновків",
      "Адміністративна скарга → суд",
    ],
    time: "14–60 днів",
    service: "vlk-pro",
  },
  {
    title: "Затримали або обшук вдома",
    steps: [
      "SOS-виклик → адвокат прибуває до 30 хвилин",
      "Участь у слідчій дії замість клієнта",
      "Подача заяви про підозру",
      "Кримінальний захист ст. 407 ККУ",
    ],
    time: "від 1 години",
    service: "sos-24-7",
  },
];

const REQUIREMENTS = [
  "Правдива інформація про ситуацію — без прикрашань і замовчувань",
  "Надання наявних документів (повістки, постанови, медвисновки)",
  "Оперативний зв'язок: відповідати на дзвінки адвоката",
  "Дотримання рекомендацій адвоката щодо тактики",
  "Непорушення конфіденційності: не розголошувати тактику захисту",
];

const GUARANTEES = [
  {
    icon: Shield,
    title: "Фіксована ціна",
    desc: "Вартість зафіксована в договорі. Ніяких «раптових» доплат.",
  },
  {
    icon: Clock,
    title: "Терміни",
    desc: "Строки виконання кожного етапу прописані. Запізнення — безкоштовне подовження.",
  },
  {
    icon: CheckCircle2,
    title: "Якість",
    desc: "Якщо результат не досягнуто з вини адвоката — розгляд компенсації.",
  },
];

const HOW_FAQ = [
  {
    q: "Чи обов'язкова AI-Діагностика?",
    a: "Ні, але настійно рекомендуємо. AI-Діагностика за 1 200 грн економить 2–3 години консультацій і дає точну картину ситуації. Ви також можете одразу зателефонувати менеджеру.",
  },
  {
    q: "Скільки часу займає підбір адвоката?",
    a: "Від 2 до 24 годин залежно від міста і спеціалізації. У Києві, Львові, Дніпрі — зазвичай до 4 годин.",
  },
  {
    q: "Чи можу я змінити адвоката в процесі?",
    a: "Так. Якщо ви незадоволені якістю роботи — LEGAR підбирає заміну. Попередня оплата залишається.",
  },
  {
    q: "Як я слідкую за справою?",
    a: "В особистому кабінеті на legar.com.ua — хронологія дій, завантажені документи, повідомлення від адвоката. Також Telegram-чат для оперативного зв'язку.",
  },
  {
    q: "Що якщо я не в Україні?",
    a: "LEGAR повністю підтримує дистанційний формат: онлайн-консультації, електронне підписання, цифровий кабінет. Адвокат представляє вас без вашої фізичної присутності.",
  },
];

function HowFAQItem({ q, a }: { q: string; a: string }) {
  // This is a server component, we use details/summary for accordion
  return (
    <details className="border border-[var(--color-bg-300)] rounded-2xl overflow-hidden group">
      <summary className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-[var(--color-bg-200)] transition-colors list-none">
        <span className="font-semibold text-[var(--color-ink)] pr-4">{q}</span>
        <ChevronDown
          size={20}
          className="text-[var(--color-primary)] flex-shrink-0 transition-transform duration-200 group-open:rotate-180"
        />
      </summary>
      <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-[var(--color-bg-300)] pt-4">
        {a}
      </div>
    </details>
  );
}

export default function HowWeWorkPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Головна", item: COMPANY.url },
          { "@type": "ListItem", position: 2, name: "Як ми працюємо", item: `${COMPANY.url}/yak-mi-pratsuemo` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: HOW_FAQ.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── HERO ── */}
      <section className="bg-[var(--color-ink)] text-white pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-gray-400 mb-8">
            <Link href="/" className="hover:text-white">Головна</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Як ми працюємо</span>
          </nav>
          <div className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <Shield size={14} />
            Прозорий процес під вашим контролем
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 max-w-3xl">
            Від AI-діагностики до результату — 6 зрозумілих кроків
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
            Ви знаєте, що відбувається на кожному етапі. Усі документи, повідомлення та хронологія справи — в особистому кабінеті.
          </p>
        </div>
      </section>

      {/* ── 8-STEP PROCESS ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {STEPS.map(({ num, icon: Icon, title, desc, badge, note }, i) => (
              <div
                key={num}
                className="flex flex-col md:flex-row gap-6 p-6 bg-white border border-[var(--color-bg-300)] rounded-2xl hover:shadow-[var(--shadow-card-hover)] transition-shadow"
              >
                <div className="flex-shrink-0 flex items-start gap-4">
                  <span className="text-4xl font-extrabold text-[var(--color-bg-300)] w-12 text-center leading-none">
                    {num}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                    <Icon size={22} className="text-[var(--color-primary)]" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-extrabold text-[var(--color-ink)] text-lg">{title}</h3>
                    <span className="text-xs font-bold bg-[var(--color-accent)] text-[var(--color-ink)] px-2 py-0.5 rounded-full">
                      {badge}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-2">{desc}</p>
                  <span className="inline-flex items-center gap-1 text-xs text-[var(--color-primary)] font-semibold">
                    <Clock size={12} />
                    {note}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:flex flex-col items-center justify-center text-gray-300">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CABINET MOCKUP ── */}
      <section className="bg-[var(--color-bg-200)] py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl font-extrabold text-[var(--color-ink)] mb-4">
                Ваш особистий кабінет
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Після початку роботи ви отримуєте доступ до захищеного кабінету — єдине місце, де зберігається
                вся інформація про справу.
              </p>
              <ul className="space-y-3">
                {[
                  "Хронологія всіх дій адвоката",
                  "Завантажені документи та клопотання",
                  "Повідомлення та чат з адвокатом",
                  "Поточний статус справи",
                  "Квитанції та рахунки",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-700 text-sm">
                    <CheckCircle2 size={16} className="text-[var(--color-success)] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[var(--color-ink)] rounded-2xl p-6 text-white font-mono text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-bold text-sm text-[var(--color-accent)]">LEGAR Кабінет</span>
                <span className="text-green-400">● Активна справа</span>
              </div>
              <div className="space-y-2 text-gray-300">
                <div className="flex justify-between"><span>Тип справи:</span><span className="text-white">Антиштраф ТЦК 360°</span></div>
                <div className="flex justify-between"><span>Адвокат:</span><span className="text-white">Петренко І. В.</span></div>
                <div className="flex justify-between"><span>Статус:</span><span className="text-[var(--color-accent)]">Підготовка клопотання</span></div>
                <div className="flex justify-between"><span>Документів:</span><span className="text-white">4 / 6</span></div>
              </div>
              <div className="border-t border-white/10 pt-3 space-y-1">
                <div className="text-gray-400">↳ 10:23 Отримано повістку (скан)</div>
                <div className="text-gray-400">↳ 11:45 Адвокат вивчив документ</div>
                <div className="text-green-400">↳ 14:00 Клопотання підготовлено</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TYPICAL SCENARIOS ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-extrabold text-[var(--color-ink)] mb-2 text-center">
            Типові сценарії
          </h2>
          <p className="text-gray-500 text-center mb-10">Як виглядає процес у реальних ситуаціях</p>
          <div className="grid md:grid-cols-3 gap-6">
            {SCENARIOS.map(({ title, steps, time, service }) => (
              <div key={title} className="bg-[var(--color-bg-200)] rounded-2xl p-6">
                <h3 className="font-extrabold text-[var(--color-ink)] mb-4 text-sm leading-snug">{title}</h3>
                <ol className="space-y-2 mb-5">
                  {steps.map((step, i) => (
                    <li key={step} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--color-primary)] text-white text-xs flex items-center justify-center font-bold">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={11} />
                    {time}
                  </span>
                  <Link
                    href={`/poslugy/${service}`}
                    className="text-xs font-bold text-[var(--color-primary)] hover:underline"
                  >
                    Дізнатись більше →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REQUIREMENTS ── */}
      <section className="bg-[var(--color-bg-200)] py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-extrabold text-[var(--color-ink)] mb-6">
            Що потрібно від вас
          </h2>
          <div className="space-y-3">
            {REQUIREMENTS.map((item) => (
              <div key={item} className="flex items-start gap-3 bg-white rounded-xl px-5 py-3 border border-[var(--color-bg-300)]">
                <CheckCircle2 size={18} className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GUARANTEES ── */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-extrabold text-[var(--color-ink)] mb-8 text-center">
            Що гарантує LEGAR
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {GUARANTEES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-[var(--color-bg-200)] rounded-2xl p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Icon size={24} className="text-[var(--color-primary)]" />
                </div>
                <h3 className="font-extrabold text-[var(--color-ink)] mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center">
            <Trophy size={16} className="inline mr-1 text-[var(--color-accent)]" />
            <span className="text-sm text-gray-500">
              94% наших клієнтів отримують позитивний результат по справі
            </span>
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-[var(--color-bg-200)] py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-extrabold text-[var(--color-ink)] mb-8 text-center">
            Питання про процес
          </h2>
          <div className="space-y-3">
            {HOW_FAQ.map(({ q, a }) => (
              <HowFAQItem key={q} q={q} a={a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-[var(--color-primary)] py-16 px-4">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-3xl font-extrabold mb-4">Розпочніть із AI-Діагностики</h2>
          <p className="text-blue-100 mb-8">
            5–10 хвилин — і ви знаєте ситуацію, ризики та точну вартість захисту.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/poslugy/ai-diagnostyka"
              className="inline-flex items-center justify-center gap-2 bg-[var(--color-accent)] text-[var(--color-ink)] font-bold px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity"
            >
              <Sparkles size={18} />
              Почати діагностику — 1 200 грн
            </Link>
            <a
              href={CONTACTS.phoneTel}
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/20 transition-colors border border-white/20"
            >
              <Phone size={18} />
              {CONTACTS.phone}
            </a>
          </div>
          <p className="mt-6 text-sm text-blue-200">
            * LEGAR — інформаційно-консультаційна платформа. Юридичні послуги надають адвокати-партнери НААУ.
          </p>
        </div>
      </section>
    </main>
  );
}
