import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield, CheckCircle2, Phone, Clock, Star, ChevronDown,
  AlertTriangle, BadgeCheck, Gavel, Sparkles, FileCheck,
  Users, Building2, Scale, ArrowRight,
} from "lucide-react";
import { CONTACTS, COMPANY, SERVICES } from "@/lib/constants";
import { LandingLeadForm } from "@/components/landing/LandingLeadForm";
import type { LucideIcon } from "lucide-react";

const SERVICE_ICON_MAP: Record<string, LucideIcon> = {
  Sparkles, Shield, FileCheck, Users, Gavel, Phone, Building2, Scale,
};

export const metadata: Metadata = {
  title: "Оскаржити штраф ТЦК — безкоштовна оцінка від адвоката | LEGAR",
  description:
    "Отримали постанову ТЦК? Дізнайтесь за 15 хвилин, чи можна її скасувати. Адвокати НААУ. Антиштраф ТЦК 360° від 8 000 грн. Без передоплати.",
  robots: { index: false, follow: false }, // лендинг не індексується
  openGraph: {
    title: "Оскаржити штраф ТЦК — безкоштовна оцінка",
    description: "Адвокати НААУ перевіряють постанову. Без передоплати.",
    url: `${COMPANY.url}/landing/antishtraf`,
    type: "website",
  },
};

const TRUST_ITEMS = [
  { icon: BadgeCheck, label: "Адвокати НААУ", sub: "офіційна реєстрація" },
  { icon: Gavel, label: "від 8 000 грн", sub: "без прихованих платежів" },
  { icon: Shield, label: "Без передоплати", sub: "спочатку оцінка — потім рішення" },
];

const HOW_IT_WORKS = [
  {
    n: "1",
    title: "Заповнюєте форму",
    desc: "Ім'я, телефон та коротко — що сталося. Займає 2 хвилини.",
  },
  {
    n: "2",
    title: "Адвокат перевіряє постанову",
    desc: "Безкоштовно аналізує процесуальні підстави для скасування.",
  },
  {
    n: "3",
    title: "Отримуєте план і ціну",
    desc: "Чіткий план дій і фіксована вартість. Ви самі вирішуєте — продовжувати чи ні.",
  },
];

const CHECKS = [
  "Чи правильно оформлений протокол і чи вказані коректні дані",
  "Чи належним чином вручили постанову — і чи є ваш підпис",
  "Чи дотримані строки складання протоколу і строк давності",
  "Чи є ваше пояснення або відмітка про відмову від пояснень",
  "Чи правильно кваліфіковане правопорушення (стаття та обставини)",
  "Чи є підстави для поновлення строку оскарження",
];

const MISTAKES = [
  {
    icon: AlertTriangle,
    title: "Сплата = визнання",
    desc: "Заплатити «щоб не морочитися» — це юридично визнати факт порушення. Оскарження після цього стає набагато складнішим.",
  },
  {
    icon: Clock,
    title: "10 днів — і все",
    desc: "Строк оскарження — лише 10 днів з дня вручення. Після — право на оскарження втрачається без поважної причини.",
  },
  {
    icon: AlertTriangle,
    title: "Процесуальні помилки",
    desc: "У більшості постанов є порушення порядку — неналежне вручення, відсутність пояснення, помилкова кваліфікація.",
  },
];

const FAQS = [
  {
    q: "Чи можна не платити штраф під час оскарження?",
    a: "Так. Подання скарги у встановлений строк зупиняє виконання постанови. Штраф не стягується до завершення розгляду — якщо вчасно подати документи.",
  },
  {
    q: "Скільки коштує послуга «Антиштраф ТЦК 360°»?",
    a: "Від 8 000 грн — повний юридичний супровід: аналіз справи, скарга, досудовий та судовий етапи під ключ. Спочатку безкоштовна оцінка, потім — рішення.",
  },
  {
    q: "Що якщо я не отримував постанову, але дізнався про штраф?",
    a: "Неналежне вручення — одна з найсильніших підстав для скасування. Потрібно отримати копію матеріалів і подати скаргу з клопотанням про поновлення строку.",
  },
  {
    q: "Чи обов'язково я повинен приходити до офісу?",
    a: "Ні. Ми ведемо справи дистанційно по всій Україні. Всі документи — онлайн або поштою. Адвокат може виїхати до ТЦК замість вас.",
  },
];

export default function AntishtrafLandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[var(--color-ink)] pb-16 pt-12 md:pb-24 md:pt-16">
        {/* Grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-primary) 1px,transparent 1px),linear-gradient(90deg,var(--color-primary) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative mx-auto max-w-5xl px-4">
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_420px]">

            {/* Left: copy */}
            <div className="pt-2">
              {/* Badge */}
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)]/15 px-4 py-1.5 text-[13px] font-bold uppercase tracking-wide text-[var(--color-accent)]">
                <Shield className="h-4 w-4" aria-hidden="true" />
                Антиштраф ТЦК
              </span>

              {/* H1 */}
              <h1 className="mt-5 font-[family-name:var(--font-manrope)] text-[32px] font-extrabold leading-[1.1] text-white md:text-[44px]">
                Отримали штраф від ТЦК?{" "}
                <span className="text-[var(--color-accent)]">
                  Дізнайтесь, чи можна його скасувати
                </span>
              </h1>

              <p className="mt-5 text-[17px] leading-relaxed text-white/70 md:text-[19px]">
                Адвокати НААУ безкоштовно перевіряють постанову на процесуальні
                помилки та повідомляють про шанси на оскарження — за 15 хвилин.
              </p>

              {/* Stats row */}
              <div className="mt-8 flex flex-wrap gap-6">
                {[
                  { num: "38%", label: "постанов скасовують на досудовому етапі" },
                  { num: "10", label: "днів строку на оскарження" },
                  { num: "8 000", label: "грн — послуга під ключ" },
                ].map(({ num, label }) => (
                  <div key={num} className="flex flex-col gap-0.5">
                    <span className="font-[family-name:var(--font-manrope)] text-[28px] font-extrabold leading-none text-[var(--color-accent)]">
                      {num}
                    </span>
                    <span className="max-w-[140px] text-[12px] leading-snug text-white/55">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Mobile CTA arrow */}
              <div className="mt-8 flex items-center gap-2 text-[14px] text-white/40 lg:hidden">
                <ChevronDown className="h-4 w-4 animate-bounce" />
                Заповніть форму нижче
              </div>
            </div>

            {/* Right: Form */}
            <div className="w-full">
              <LandingLeadForm
                formId="hero"
                ctaLabel="Отримати безкоштовну оцінку"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ───────────────────────────────────────────────────── */}
      <section className="border-b border-[var(--color-bg-300)] bg-[var(--color-bg-200)]">
        <div className="mx-auto grid max-w-5xl grid-cols-3 divide-x divide-[var(--color-bg-300)] px-4">
          {TRUST_ITEMS.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex flex-col items-center gap-1 py-5 text-center">
              <Icon
                className="h-6 w-6 text-[var(--color-primary)]"
                aria-hidden="true"
              />
              <span className="font-[family-name:var(--font-manrope)] text-[14px] font-extrabold text-[var(--color-ink)] sm:text-[16px]">
                {label}
              </span>
              <span className="hidden text-[12px] text-[var(--color-ink)]/55 sm:block">
                {sub}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── УСІ ПОСЛУГИ LEGAR ───────────────────────────────────────────── */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-10 text-center">
            <h2 className="font-[family-name:var(--font-manrope)] text-[26px] font-extrabold text-[var(--color-ink)] md:text-[34px]">
              Усі послуги LEGAR
            </h2>
            <p className="mt-3 text-[16px] text-[var(--color-ink)]/60">
              Вирішуємо будь-яке питання з ТЦК, ВЛК, СЗЧ та бронювання — під ключ
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => {
              const Icon = SERVICE_ICON_MAP[service.icon] ?? Shield;
              const isMain = service.slug === "antyshtraf-tck-360";
              return (
                <Link
                  key={service.slug}
                  href={`/poslugy/${service.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex flex-col rounded-[16px] border p-6 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] ${
                    isMain
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)]/[0.04] ring-1 ring-[var(--color-primary)]/20"
                      : "border-[var(--color-bg-300)] bg-white"
                  }`}
                >
                  {/* Icon */}
                  <span
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-[10px] transition-colors ${
                      isMain
                        ? "bg-[var(--color-primary)] text-white"
                        : "bg-[var(--color-bg-200)] text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>

                  {/* Title + badge */}
                  <div className="mt-4 flex items-start justify-between gap-2">
                    <h3 className="font-[family-name:var(--font-manrope)] text-[16px] font-extrabold leading-snug text-[var(--color-ink)]">
                      {service.shortTitle}
                    </h3>
                    {isMain && (
                      <span className="flex-shrink-0 rounded-full bg-[var(--color-accent)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--color-ink)]">
                        Рекомендуємо
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-[var(--color-ink)]/60">
                    {service.description}
                  </p>

                  {/* Price + arrow */}
                  <div className="mt-4 flex items-center justify-between border-t border-[var(--color-bg-300)] pt-3">
                    <span className="font-[family-name:var(--font-manrope)] text-[15px] font-extrabold text-[var(--color-ink)]">
                      {service.priceLabel}
                    </span>
                    <ArrowRight
                      className="h-4 w-4 text-[var(--color-primary)] transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ЧИ НЕ РОБІТЬ ЦИХ ПОМИЛОК ───────────────────────────────────── */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mx-auto max-w-[640px] text-center">
            <h2 className="font-[family-name:var(--font-manrope)] text-[26px] font-extrabold text-[var(--color-ink)] md:text-[34px]">
              Три помилки, які роблять 9 з 10
            </h2>
            <p className="mt-3 text-[16px] text-[var(--color-ink)]/65">
              І які коштують права на оскарження
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {MISTAKES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-[16px] border border-[var(--color-danger)]/20 bg-[var(--color-danger)]/[0.03] p-6"
              >
                <Icon className="h-7 w-7 text-[var(--color-danger)]" aria-hidden="true" />
                <h3 className="mt-3 font-[family-name:var(--font-manrope)] text-[17px] font-extrabold text-[var(--color-ink)]">
                  {title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink)]/65">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ЯК ЦЕ ПРАЦЮЄ ────────────────────────────────────────────────── */}
      <section className="bg-[var(--color-bg-200)] py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center font-[family-name:var(--font-manrope)] text-[26px] font-extrabold text-[var(--color-ink)] md:text-[34px]">
            Як це працює
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {HOW_IT_WORKS.map(({ n, title, desc }) => (
              <div key={n} className="relative flex flex-col gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)] text-[20px] font-extrabold text-white">
                  {n}
                </div>
                <h3 className="font-[family-name:var(--font-manrope)] text-[18px] font-extrabold text-[var(--color-ink)]">
                  {title}
                </h3>
                <p className="text-[14px] leading-relaxed text-[var(--color-ink)]/65">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ЩО МИ ПЕРЕВІРЯЄМО ──────────────────────────────────────────── */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-[family-name:var(--font-manrope)] text-[26px] font-extrabold text-[var(--color-ink)] md:text-[34px]">
                Що адвокат перевіряє у постанові
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-[var(--color-ink)]/65">
                У більшості справ про штрафи ТЦК є процесуальні порушення.
                Навіть якщо факт порушення обліку був — постанову можна скасувати
                за формальними підставами.
              </p>
              <ul className="mt-6 space-y-3">
                {CHECKS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] leading-snug text-[var(--color-ink)]/75">
                    <CheckCircle2
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--color-primary)]"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quote card */}
            <div className="rounded-[16px] bg-[var(--color-ink)] p-8 text-white">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[var(--color-accent)] text-[var(--color-accent)]" />
                ))}
              </div>
              <p className="mt-4 text-[17px] leading-relaxed text-white/85">
                «Отримав штраф 17 000 грн за неоновлення даних.
                Адвокат LEGAR знайшов, що протокол склали з порушенням строків.
                Постанову скасували на досудовому етапі.»
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)]/20 font-bold text-[var(--color-accent)]">
                  О
                </div>
                <div>
                  <p className="font-semibold text-white">Олексій, Київ</p>
                  <p className="text-[13px] text-white/45">Листопад 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section className="bg-[var(--color-bg-200)] py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-center font-[family-name:var(--font-manrope)] text-[26px] font-extrabold text-[var(--color-ink)] md:text-[34px]">
            Часті запитання
          </h2>
          <div className="mt-8 space-y-4">
            {FAQS.map(({ q, a }) => (
              <div
                key={q}
                className="rounded-[12px] border border-[var(--color-bg-300)] bg-white p-6"
              >
                <h3 className="font-[family-name:var(--font-manrope)] text-[16px] font-extrabold text-[var(--color-ink)]">
                  {q}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-ink)]/65">
                  {a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA FORM ─────────────────────────────────────────────── */}
      <section className="bg-[var(--color-accent)] py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_420px]">
            <div>
              <h2 className="font-[family-name:var(--font-manrope)] text-[28px] font-extrabold leading-tight text-[var(--color-ink)] md:text-[40px]">
                Маєте постанову ТЦК?
              </h2>
              <p className="mt-4 text-[17px] leading-relaxed text-[var(--color-ink)]/75">
                Заповніть форму — адвокат зателефонує за 15 хвилин і
                безкоштовно оцінить шанси на скасування.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <a
                  href={CONTACTS.phoneTel}
                  className="inline-flex items-center gap-2 text-[16px] font-semibold text-[var(--color-ink)]"
                >
                  <Phone className="h-5 w-5" aria-hidden="true" />
                  {CONTACTS.phone}
                </a>
                <span className="text-[var(--color-ink)]/30">·</span>
                <a
                  href="https://t.me/legarukr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[16px] font-semibold text-[var(--color-ink)]"
                >
                  @legarukr
                </a>
              </div>
            </div>

            <LandingLeadForm
              formId="bottom"
              ctaLabel="Залишити заявку — безкоштовно"
            />
          </div>
        </div>
      </section>

      {/* ── MINI FOOTER ─────────────────────────────────────────────────── */}
      <footer className="bg-[var(--color-ink)] py-8">
        <div className="mx-auto max-w-5xl px-4">
          {/* Legal links */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-white/40">
            <Link href="/legal/pryvatnist" className="hover:text-white/70 transition-colors">
              Політика конфіденційності
            </Link>
            <Link href="/legal/oferta" className="hover:text-white/70 transition-colors">
              Публічна оферта
            </Link>
            <Link href="/legal/disclaimer" className="hover:text-white/70 transition-colors">
              Дисклеймер
            </Link>
            <Link href="/" className="hover:text-white/70 transition-colors">
              legar.com.ua
            </Link>
          </div>

          {/* Disclaimer */}
          <p className="mx-auto mt-5 max-w-2xl text-center text-[12px] leading-relaxed text-white/30">
            Матеріали сайту мають інформаційний характер і не є індивідуальною
            юридичною консультацією. LEGAR — інформаційно-консультаційна
            платформа. Адвокати-партнери зареєстровані у реєстрі НААУ.
            {" "}© {new Date().getFullYear()} {COMPANY.legalName}.
          </p>
        </div>
      </footer>

    </div>
  );
}
