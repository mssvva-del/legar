import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield, CheckCircle2, Phone, Clock, Star, ChevronDown,
  AlertTriangle, BadgeCheck, Stethoscope,
} from "lucide-react";
import { CONTACTS, COMPANY } from "@/lib/constants";
import { LandingLeadForm } from "@/components/landing/LandingLeadForm";

export const metadata: Metadata = {
  title: "Оскаржити висновок ВЛК — перевірка адвокатом | LEGAR",
  description:
    "Не згодні з висновком ВЛК? Адвокати НААУ перевіряють висновок і кажуть шанси на оскарження. Консультація 490 грн. ВЛК Pro від 14 000 грн під ключ.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Оскаржити висновок ВЛК — консультація 490 грн",
    description: "Адвокати НААУ. Апеляційна ВЛК і суд. Без передоплати.",
    url: `${COMPANY.url}/landing/vlk`,
    type: "website",
  },
};

const TRUST_ITEMS = [
  { icon: BadgeCheck, label: "Адвокати НААУ", sub: "офіційна реєстрація" },
  { icon: Stethoscope, label: "від 14 000 грн", sub: "апеляційна ВЛК + суд під ключ" },
  { icon: Shield, label: "Без передоплати", sub: "спочатку оцінка — потім рішення" },
  { icon: CheckCircle2, label: "Медичний пакет", sub: "допомагаємо зібрати документи" },
];

const HOW_IT_WORKS = [
  { n: "1", title: "Заповнюєте форму", desc: "Ім'я, телефон і коротко — з чим не згодні. 2 хвилини." },
  { n: "2", title: "Адвокат перевіряє висновок", desc: "Аналізує висновок ВЛК і медичні документи на консультації (490 грн)." },
  { n: "3", title: "Отримуєте план і ціну", desc: "Реальні шанси, план оскарження, фіксована вартість. Рішення — за вами." },
];

const CHECKS = [
  "Чи відповідає категорія придатності вашим діагнозам за Розкладом хвороб",
  "Чи всі медичні документи були враховані комісією",
  "Чи дотримана процедура проведення огляду",
  "Чи правильно оформлений сам висновок (підписи, печатки, строки)",
  "Чи є підстави для направлення на додаткові обстеження",
  "Чи не пропущені строки оскарження — і як їх поновити",
];

const MISTAKES = [
  {
    icon: AlertTriangle,
    title: "Підписали не читаючи",
    desc: "Підпис під висновком без ознайомлення ускладнює оскарження. Але не позбавляє права — оскаржити можна.",
  },
  {
    icon: Clock,
    title: "Чекають «само розсмокчеться»",
    desc: "Строки оскарження обмежені. Що більше часу минає — то складніше зібрати докази і поновити строк.",
  },
  {
    icon: AlertTriangle,
    title: "Йдуть на повторну ВЛК без підготовки",
    desc: "Без повного медичного пакета повторна комісія майже завжди дублює перший висновок.",
  },
];

const FAQS = [
  {
    q: "Скільки коштує оскарження висновку ВЛК?",
    a: "«ВЛК Pro» — від 14 000 грн під ключ: аналіз висновку, допомога зі збором медичних документів, скарга до апеляційної ВЛК, за потреби — суд. Спочатку консультація 490 грн (зараховується у вартість), потім — рішення.",
  },
  {
    q: "Чи можна оскаржити, якщо визнали «придатним»?",
    a: "Так. Якщо є діагнози, які за Розкладом хвороб дають іншу категорію, — висновок оскаржується через апеляційну ВЛК, а далі через суд. Ключове — повний медичний пакет.",
  },
  {
    q: "Я вже підписав висновок. Пізно?",
    a: "Ні. Підпис означає ознайомлення, а не згоду. Строки оскарження обмежені, але за поважних причин їх можна поновити — адвокат підкаже, як саме у вашому випадку.",
  },
  {
    q: "Чи обов'язково приїжджати до офісу?",
    a: "Ні. Працюємо дистанційно по всій Україні: документи — онлайн, стратегія — по телефону або відео. За потреби адвокат представляє вас на комісії.",
  },
  {
    q: "Яка у вас гарантія?",
    a: "Чесна оцінка: якщо адвокат не бачить підстав для оскарження — скаже одразу, і ви не платите нічого. Умови співпраці фіксуються в договорі.",
  },
];

export default function VlkLandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[var(--color-ink)] pb-16 pt-12 md:pb-24 md:pt-16">
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
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)]/15 px-4 py-1.5 text-[13px] font-bold uppercase tracking-wide text-[var(--color-accent)]">
                <Stethoscope className="h-4 w-4" aria-hidden="true" />
                ВЛК Pro
              </span>

              <h1 className="mt-5 font-[family-name:var(--font-manrope)] text-[32px] font-extrabold leading-[1.1] text-white md:text-[44px]">
                Не згодні з висновком ВЛК?{" "}
                <span className="text-[var(--color-accent)]">
                  Дізнайтесь, чи можна його оскаржити
                </span>
              </h1>

              <p className="mt-5 text-[17px] leading-relaxed text-white/70 md:text-[19px]">
                Адвокати НААУ перевіряють висновок ВЛК і медичні
                документи та кажуть реальні шанси на оскарження.
              </p>

              <div className="mt-8 flex flex-wrap gap-6">
                {[
                  { num: "2", label: "інстанції: апеляційна ВЛК і суд" },
                  { num: "14 000", label: "грн — супровід під ключ" },
                  { num: "0 грн", label: "перевірка висновку адвокатом" },
                ].map(({ num, label }) => (
                  <div key={num} className="flex flex-col gap-0.5">
                    <span className="font-[family-name:var(--font-manrope)] text-[28px] font-extrabold leading-none text-[var(--color-accent)]">
                      {num}
                    </span>
                    <span className="max-w-[150px] text-[12px] leading-snug text-white/55">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-2 text-[14px] text-white/40 lg:hidden">
                <ChevronDown className="h-4 w-4 animate-bounce" />
                Заповніть форму нижче
              </div>
            </div>

            <div className="w-full">
              <LandingLeadForm
                formId="hero"
                ctaLabel="Отримати консультацію"
                service="vlk-pro"
                sourceLabel="Лендинг ВЛК"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ───────────────────────────────────────────────────── */}
      <section className="border-b border-[var(--color-bg-300)] bg-[var(--color-bg-200)]">
        <div className="mx-auto grid max-w-5xl grid-cols-2 divide-x divide-[var(--color-bg-300)] px-4 sm:grid-cols-4">
          {TRUST_ITEMS.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex flex-col items-center gap-1 py-5 text-center">
              <Icon className="h-6 w-6 text-[var(--color-primary)]" aria-hidden="true" />
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

      {/* ── MISTAKES ────────────────────────────────────────────────────── */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mx-auto max-w-[640px] text-center">
            <h2 className="font-[family-name:var(--font-manrope)] text-[26px] font-extrabold text-[var(--color-ink)] md:text-[34px]">
              Три помилки після ВЛК
            </h2>
            <p className="mt-3 text-[16px] text-[var(--color-ink)]/65">
              Які коштують категорії придатності
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {MISTAKES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-[16px] border border-[var(--color-danger)]/20 bg-[var(--color-danger)]/[0.03] p-6">
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

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
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
                <p className="text-[14px] leading-relaxed text-[var(--color-ink)]/65">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHECKS ──────────────────────────────────────────────────────── */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-[family-name:var(--font-manrope)] text-[26px] font-extrabold text-[var(--color-ink)] md:text-[34px]">
                Що адвокат перевіряє у висновку ВЛК
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-[var(--color-ink)]/65">
                Висновок — це документ, який має відповідати Розкладу хвороб і
                процедурі. Розбіжність діагнозів і категорії — підстава для
                оскарження.
              </p>
              <ul className="mt-6 space-y-3">
                {CHECKS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] leading-snug text-[var(--color-ink)]/75">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[16px] bg-[var(--color-ink)] p-8 text-white">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[var(--color-accent)] text-[var(--color-accent)]" />
                ))}
              </div>
              <p className="mt-4 text-[17px] leading-relaxed text-white/85">
                «ВЛК визнала придатним попри грижі й протрузії. Адвокат LEGAR
                допоміг зібрати повний пакет від нейрохірурга — апеляційна ВЛК
                змінила категорію.»
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)]/20 font-bold text-[var(--color-accent)]">
                  В
                </div>
                <div>
                  <p className="font-semibold text-white">Віталій, Дніпро</p>
                  <p className="text-[13px] text-white/45">Березень 2026</p>
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
              <div key={q} className="rounded-[12px] border border-[var(--color-bg-300)] bg-white p-6">
                <h3 className="font-[family-name:var(--font-manrope)] text-[16px] font-extrabold text-[var(--color-ink)]">
                  {q}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-ink)]/65">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ──────────────────────────────────────────────────── */}
      <section className="bg-[var(--color-accent)] py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_420px]">
            <div>
              <h2 className="font-[family-name:var(--font-manrope)] text-[28px] font-extrabold leading-tight text-[var(--color-ink)] md:text-[40px]">
                Маєте висновок ВЛК на руках?
              </h2>
              <p className="mt-4 text-[17px] leading-relaxed text-[var(--color-ink)]/75">
                Заповніть форму — адвокат зателефонує і скаже, чи є
                підстави для оскарження.
              </p>
              <p className="mt-3 inline-flex items-center gap-2 rounded-[8px] bg-[var(--color-ink)]/[0.06] px-3 py-2 text-[14px] font-semibold text-[var(--color-ink)]">
                <Clock className="h-4 w-4" aria-hidden="true" />
                Строки оскарження обмежені — не зволікайте.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <a href={CONTACTS.phoneTel} className="inline-flex items-center gap-2 text-[16px] font-semibold text-[var(--color-ink)]">
                  <Phone className="h-5 w-5" aria-hidden="true" />
                  {CONTACTS.phone}
                </a>
                <span className="text-[var(--color-ink)]/30">·</span>
                <a href="https://t.me/legarukr" target="_blank" rel="noopener noreferrer" className="text-[16px] font-semibold text-[var(--color-ink)]">
                  @legarukr
                </a>
              </div>
            </div>
            <LandingLeadForm
              formId="bottom"
              ctaLabel="Отримати консультацію"
              service="vlk-pro"
              sourceLabel="Лендинг ВЛК"
            />
          </div>
        </div>
      </section>

      {/* ── MINI FOOTER ─────────────────────────────────────────────────── */}
      <footer className="bg-[var(--color-ink)] py-8">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-white/40">
            <Link href="/legal/pryvatnist" className="transition-colors hover:text-white/70">Політика конфіденційності</Link>
            <Link href="/legal/oferta" className="transition-colors hover:text-white/70">Публічна оферта</Link>
            <Link href="/legal/disclaimer" className="transition-colors hover:text-white/70">Дисклеймер</Link>
            <Link href="/" className="transition-colors hover:text-white/70">legar.com.ua</Link>
          </div>
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
