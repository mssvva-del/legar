import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  Shield,
  Users,
  Target,
  Heart,
  Zap,
  Lock,
  CheckCircle2,
  Phone,
  Scale,
  TrendingUp,
  Globe,
} from "lucide-react";
import { COMPANY, CONTACTS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Про LEGAR — Перша цифрова військово-правова платформа України",
  description:
    "LEGAR — інформаційно-консультаційна платформа військово-правового захисту. Місія, команда, принципи роботи та плани розвитку.",
  keywords: ["про LEGAR", "військовий адвокат платформа", "legar.com.ua", "юридичний захист військових"],
  alternates: { canonical: `${COMPANY.url}/pro-legar` },
  openGraph: {
    title: "Про LEGAR — Перша цифрова військово-правова платформа України",
    description: "LEGAR — інформаційно-консультаційна платформа військово-правового захисту.",
    url: `${COMPANY.url}/pro-legar`,
    type: "website",
  },
};

const NUMBERS = [
  { value: "5 000+", label: "консультацій проведено" },
  { value: "94%", label: "позитивних результатів" },
  { value: "47", label: "адвокати-партнери НААУ" },
  { value: "5", label: "міст присутності" },
];

const VALUES = [
  {
    icon: Shield,
    title: "Захист без компромісів",
    desc: "Кожен громадянин має право на кваліфікований юридичний захист — незалежно від свого статусу чи достатку.",
  },
  {
    icon: Lock,
    title: "Конфіденційність — абсолют",
    desc: "Дані клієнтів зашифровані. Ми не передаємо і не продаємо персональні дані. Ніколи. Ні за яких умов.",
  },
  {
    icon: Zap,
    title: "Швидкість вирішує",
    desc: "У правових кризах кожна година має значення. Наш стандарт — перший контакт з адвокатом упродовж 2 годин.",
  },
  {
    icon: Heart,
    title: "Людяність",
    desc: "Ми спілкуємось зрозумілою мовою, без юридичного сленгу. Клієнт завжди знає, що відбувається у справі.",
  },
  {
    icon: Target,
    title: "Прозорість цін",
    desc: "Фіксовані пакети «під ключ». Жодних погодинних рахунків із сюрпризами — вартість відома до початку роботи.",
  },
  {
    icon: Scale,
    title: "Незалежність",
    desc: "LEGAR не має жодної affiliation з ТЦК або державними органами. Ми захищаємо тільки інтереси клієнта.",
  },
];

const USPS = [
  "Єдиний кабінет: всі документи, повідомлення, хронологія справи в одному місці",
  "AI попередня діагностика за 5–10 хвилин з персональним PDF-звітом",
  "Реальні адвокати НААУ з 5+ роками практики у військовому праві",
  "Прозорі фіксовані ціни — без годинних рахунків і прихованих платежів",
  "SOS-реакція 24/7 — виїзд адвоката до 30 хвилин у межах міста",
  "B2B пакети для бронювання критичних співробітників компанії",
];

const PLANS_2026 = [
  { q1: "Q1 2026", text: "Запуск мобільного застосунку iOS / Android" },
  { q1: "Q2 2026", text: "Розширення на 10 нових міст" },
  { q1: "Q3 2026", text: "AI-асистент у особистому кабінеті (підготовка клопотань)" },
  { q1: "Q4 2026", text: "Партнерство з НААУ — офіційний реєстр адвокатів" },
];

export default function ProLegarPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Головна", item: COMPANY.url },
          { "@type": "ListItem", position: 2, name: "Про LEGAR", item: `${COMPANY.url}/pro-legar` },
        ],
      },
      {
        "@type": "Organization",
        "@id": `${COMPANY.url}/#org`,
        name: COMPANY.name,
        legalName: COMPANY.legalName,
        url: COMPANY.url,
        description: COMPANY.description,
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+380800357288",
          contactType: "customer support",
          availableLanguage: "Ukrainian",
        },
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
            <span className="text-white">Про LEGAR</span>
          </nav>
          <div className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <Sparkles size={14} />
            Перша цифрова платформа
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 max-w-3xl">
            LEGAR — юридичний щит для кожного українця
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
            Ми створили інформаційно-консультаційну платформу, яка з&apos;єднує людей у правовій кризі
            з перевіреними адвокатами НААУ — швидко, прозоро, за фіксованою ціною.
          </p>
        </div>
      </section>

      {/* ── NUMBERS ── */}
      <section className="bg-[var(--color-primary)] py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {NUMBERS.map(({ value, label }) => (
            <div key={label} className="text-center text-white">
              <div className="text-3xl md:text-4xl font-extrabold text-[var(--color-accent)] mb-1">{value}</div>
              <div className="text-sm text-blue-100">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-[var(--color-ink)] mb-4">Наша місія</h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-6">
                Зробити кваліфікований правовий захист доступним для кожного — незалежно від регіону,
                рівня доходу або юридичної грамотності.
              </p>
              <p className="text-gray-600 leading-relaxed">
                У воєнний час правова система стала складнішою, а ставки — вищими. ТЦК, ВЛК, СЗЧ —
                мільйони українців потрапляють у ситуації, де без адвоката не обійтись, але не знають,
                до кого звернутись. LEGAR — відповідь на це.
              </p>
            </div>
            <div className="bg-[var(--color-bg-200)] rounded-3xl p-8">
              <Globe size={40} className="text-[var(--color-primary)] mb-4" />
              <h3 className="text-xl font-extrabold text-[var(--color-ink)] mb-3">Модель платформи</h3>
              <p className="text-gray-600 leading-relaxed text-sm mb-4">
                LEGAR — це не юридична фірма. Це цифрова платформа, яка:
              </p>
              <ul className="space-y-2">
                {[
                  "Діагностує ситуацію через AI",
                  "Підбирає профільного адвоката НААУ",
                  "Забезпечує захищений кабінет для ведення справи",
                  "Контролює якість і дотримання стандартів",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 size={16} className="text-[var(--color-success)] flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-gray-400 italic">
                Юридичні послуги надають адвокати-партнери НААУ в рамках договору між адвокатом і клієнтом.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── USPs ── */}
      <section className="bg-[var(--color-bg-200)] py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-extrabold text-[var(--color-ink)] mb-8 text-center">
            Чому LEGAR — це інакше
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {USPS.map((item) => (
              <div key={item} className="flex items-start gap-3 bg-white rounded-2xl px-5 py-4 border border-[var(--color-bg-300)]">
                <CheckCircle2 size={18} className="text-[var(--color-success)] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-extrabold text-[var(--color-ink)] mb-2 text-center">Наші цінності</h2>
          <p className="text-gray-500 text-center mb-10">Принципи, від яких ми не відступаємо</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-[var(--color-bg-200)] rounded-2xl p-6">
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm">
                  <Icon size={20} className="text-[var(--color-primary)]" />
                </div>
                <h3 className="font-extrabold text-[var(--color-ink)] mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEGAL POSITION ── */}
      <section className="bg-[var(--color-bg-200)] py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-extrabold text-[var(--color-ink)] mb-6">Правовий статус LEGAR</h2>
          <div className="bg-white rounded-2xl p-6 border border-[var(--color-bg-300)] space-y-4 text-sm text-gray-600 leading-relaxed">
            <p>
              <strong className="text-[var(--color-ink)]">{COMPANY.legalName}</strong> — суб&apos;єкт
              підприємницької діяльності, зареєстрований в Україні. LEGAR є виключно
              <strong className="text-[var(--color-ink)]"> інформаційно-консультаційною платформою</strong>.
            </p>
            <p>
              Юридичні послуги (представництво у ТЦК, ВЛК, суді, кримінальний захист) надаються
              <strong className="text-[var(--color-ink)]"> адвокатами-партнерами НААУ</strong> у рамках
              договору між адвокатом та клієнтом. LEGAR забезпечує платформу, підбір і контроль якості.
            </p>
            <p>
              LEGAR не є підрозділом і не має жодної організаційної залежності від ТЦК, ВЛК,
              Міністерства оборони, прокуратури чи суду. Ми захищаємо виключно інтереси клієнта.
            </p>
          </div>
        </div>
      </section>

      {/* ── PLANS 2026 ── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp size={24} className="text-[var(--color-primary)]" />
            <h2 className="text-2xl font-extrabold text-[var(--color-ink)]">Плани на 2026 рік</h2>
          </div>
          <div className="relative pl-8">
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-[var(--color-bg-300)]" />
            <div className="space-y-6">
              {PLANS_2026.map(({ q1, text }) => (
                <div key={q1} className="relative">
                  <div className="absolute -left-5 w-3 h-3 rounded-full bg-[var(--color-primary)] mt-1" />
                  <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wide">{q1}</span>
                  <p className="text-gray-700 mt-0.5">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── LAWYER TEAM CTA ── */}
      <section className="bg-[var(--color-bg-200)] py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl p-8 border border-[var(--color-bg-300)] text-center">
            <Users size={36} className="text-[var(--color-primary)] mx-auto mb-4" />
            <h2 className="text-xl font-extrabold text-[var(--color-ink)] mb-3">Адвокати-партнери</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Мережа LEGAR включає 47 адвокатів НААУ з підтвердженою спеціалізацією у військовому,
              адміністративному та кримінальному праві. Кожен партнер проходить перевірку кваліфікації
              та дотримується стандартів LEGAR.
            </p>
            <Link
              href="/dlya-advokativ"
              className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              Стати адвокатом-партнером
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-[var(--color-primary)] py-16 px-4">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-3xl font-extrabold mb-4">Потрібен захист прямо зараз?</h2>
          <p className="text-blue-100 mb-8">
            AI-Діагностика за 5 хвилин покаже вашу ситуацію та ціну захисту. Або зателефонуйте — відповімо одразу.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/poslugy/ai-diagnostyka"
              className="inline-flex items-center justify-center gap-2 bg-[var(--color-accent)] text-[var(--color-ink)] font-bold px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity"
            >
              <Sparkles size={18} />
              Безкоштовна консультація
            </Link>
            <a
              href={CONTACTS.phoneTel}
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/20 transition-colors border border-white/20"
            >
              <Phone size={18} />
              {CONTACTS.phone}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
