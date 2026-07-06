"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Sparkles,
  Shield,
  FileCheck,
  Users,
  Gavel,
  Phone,
  Building2,
  Scale,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { SERVICES, CONTACTS } from "@/lib/constants";
import { SERVICES_CONTENT } from "@/lib/services-content";
import { cn } from "@/lib/utils";

// ─── Icon map ────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles,
  Shield,
  FileCheck,
  Users,
  Gavel,
  Phone,
  Building2,
  Scale,
};

// ─── Category filter config ───────────────────────────────────────────────────
type Category = "all" | "ai" | "tck" | "vlk" | "szch" | "sos" | "b2b";

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "all", label: "Всі" },
  { id: "tck", label: "ТЦК" },
  { id: "vlk", label: "ВЛК" },
  { id: "szch", label: "Кримінал" },
  { id: "sos", label: "SOS" },
  { id: "b2b", label: "B2B" },
  { id: "ai", label: "AI" },
];

// Map slug → category
const SLUG_CATEGORY: Record<string, Category> = {
  "ai-diagnostyka": "ai",
  "antyshtraf-tck-360": "tck",
  "vlk-pro": "vlk",
  "tck-suprovid": "tck",
  "szch-zahyst": "szch",
  "sos-24-7": "sos",
  "b2b-bronyuvannya": "b2b",
};

// ─── FAQ data ─────────────────────────────────────────────────────────────────
const FAQ = [
  {
    q: "З чого починається робота з LEGAR?",
    a: "Найкраще — з AI-Діагностики. За 5–10 хвилин отримаєте чіткий аналіз ситуації і рекомендацію яку послугу обрати. Якщо ситуація термінова — телефонуйте на гарячу лінію або підключайте SOS 24/7.",
  },
  {
    q: "Чи можна замовити кілька послуг одразу?",
    a: "Так. Наприклад, Супровід ТЦК + Антиштраф ТЦК 360° часто замовляють разом. Менеджер LEGAR допоможе скласти оптимальний пакет зі знижкою.",
  },
  {
    q: "Чи є знижки?",
    a: "Так: вартість AI-Діагностики (1 200 грн) зараховується у будь-яку пакетну послугу. При замовленні 2+ оскаржень постанов — знижка 20%. B2B-клієнтам — індивідуальні умови.",
  },
  {
    q: "Де фізично знаходяться адвокати LEGAR?",
    a: "Адвокати-партнери LEGAR розташовані у Києві, Харкові, Дніпрі, Одесі та Львові. Юридичний супровід — онлайн по всій Україні.",
  },
  {
    q: "Чи підписуєте договір?",
    a: "Так. Договір підписується онлайн (Дія / eSign / КЕП). Ніяких усних домовленостей — тільки офіційний документ.",
  },
];

export default function PoslugyPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredServices = SERVICES.filter((s) => {
    if (activeCategory === "all") return true;
    return SLUG_CATEGORY[s.slug] === activeCategory;
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Головна", item: "https://legar.com.ua" },
          { "@type": "ListItem", position: 2, name: "Послуги", item: "https://legar.com.ua/poslugy" },
        ],
      },
      {
        "@type": "ItemList",
        name: "Послуги LEGAR",
        description: "Повний перелік військово-правових послуг LEGAR",
        itemListElement: SERVICES.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `https://legar.com.ua/poslugy/${s.slug}`,
          name: s.title,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <header className="bg-[var(--color-ink)] py-20 md:py-28">
        <div className="container-legar text-center">
          <div className="mx-auto max-w-[760px]">
            <h1 className="font-[family-name:var(--font-manrope)] text-[40px] font-extrabold leading-tight text-white md:text-[56px]">
              Всі послуги LEGAR
            </h1>
            <p className="mt-5 text-[18px] leading-relaxed text-white/65">
              Закриваємо весь військово-правовий спектр. Прозорі фіксовані ціни,
              договір онлайн, адвокат НААУ на кожній справі.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {[
                "Не знаєте з чого почати?",
                "Не знаєте яка послуга підходить?",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-[13px] text-white/70"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* AI-Діагностика CTA */}
            <Link
              href="/poslugy/ai-diagnostyka"
              className="mt-7 inline-flex h-[52px] items-center gap-2 rounded-[8px] bg-[var(--color-accent)] px-7 text-[15px] font-semibold text-[var(--color-ink)] transition-all hover:scale-[1.02]"
            >
              <Sparkles className="h-5 w-5" aria-hidden="true" />
              Пройти AI-діагностику — від 1 200 грн
            </Link>
          </div>
        </div>
      </header>

      {/* ── Category filter + grid ────────────────────────────────────────── */}
      <section aria-labelledby="services-list-heading" className="py-16 md:py-20">
        <div className="container-legar">
          <h2
            id="services-list-heading"
            className="sr-only"
          >
            Список послуг
          </h2>

          {/* Filters */}
          <div
            role="group"
            aria-label="Фільтр категорій"
            className="flex flex-wrap gap-2"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-[14px] font-medium transition-all",
                  activeCategory === cat.id
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-bg-200)] text-[var(--color-ink)]/65 hover:bg-[var(--color-bg-300)]",
                )}
                aria-pressed={activeCategory === cat.id}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => {
              const Icon = ICON_MAP[service.icon] ?? Shield;
              const content = SERVICES_CONTENT[service.slug as keyof typeof SERVICES_CONTENT];
              return (
                <Link
                  key={service.slug}
                  href={`/poslugy/${service.slug}` as `/poslugy/${string}`}
                  className="group flex h-full flex-col rounded-[var(--radius-card)] border border-[var(--color-bg-300)] bg-white p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
                >
                  {/* Icon */}
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-[12px] bg-[var(--color-bg-200)] text-[var(--color-primary)] transition-colors group-hover:bg-[var(--color-primary)] group-hover:text-white">
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </span>

                  {/* Title */}
                  <h3 className="mt-5 font-[family-name:var(--font-manrope)] text-[22px] font-extrabold leading-tight text-[var(--color-ink)]">
                    {service.shortTitle}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 flex-1 text-[15px] leading-relaxed text-[var(--color-ink)]/65">
                    {service.description}
                  </p>

                  {/* Trust tags */}
                  {content?.hero?.trustTags && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {content.hero.trustTags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-[var(--color-bg-200)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--color-ink)]/55"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price + arrow */}
                  <div className="mt-5 flex items-center justify-between border-t border-[var(--color-bg-300)] pt-4">
                    <span className="font-[family-name:var(--font-manrope)] text-[18px] font-extrabold text-[var(--color-ink)]">
                      {service.priceLabel}
                    </span>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-bg-200)] text-[var(--color-primary)] transition-all group-hover:translate-x-1 group-hover:bg-[var(--color-primary)] group-hover:text-white">
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Empty state */}
          {filteredServices.length === 0 && (
            <div className="mt-8 rounded-[12px] border border-[var(--color-bg-300)] bg-white p-12 text-center">
              <p className="text-[var(--color-ink)]/55">Немає послуг у цій категорії</p>
            </div>
          )}
        </div>
      </section>

      {/* ── "Не знаєте що обрати" block ──────────────────────────────────── */}
      <section
        aria-labelledby="ai-promo-heading"
        className="bg-[var(--color-primary)] py-16"
      >
        <div className="container-legar">
          <div className="mx-auto max-w-[680px] text-center">
            <Sparkles className="mx-auto h-10 w-10 text-white/40" aria-hidden="true" />
            <h2
              id="ai-promo-heading"
              className="mt-4 font-[family-name:var(--font-manrope)] text-[28px] font-extrabold text-white md:text-[36px]"
            >
              Не знаєте яка послуга вам потрібна?
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-white/70">
              Пройдіть AI-Діагностику — за 5–10 хвилин отримаєте персональну рекомендацію,
              оцінку шансів і покроковий план дій. Від 1 200 грн. Вартість зараховується у пакет.
            </p>
            <Link
              href="/poslugy/ai-diagnostyka"
              className="mt-7 inline-flex h-[52px] items-center gap-2 rounded-[8px] bg-white px-7 text-[15px] font-semibold text-[var(--color-primary)] transition-all hover:bg-[var(--color-accent)] hover:text-[var(--color-ink)] hover:scale-[1.02]"
            >
              <Sparkles className="h-5 w-5" aria-hidden="true" />
              Пройти AI-Діагностику
            </Link>
          </div>
        </div>
      </section>

      {/* ── B2B block ─────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="b2b-heading"
        className="py-16 md:py-20"
      >
        <div className="container-legar">
          <div className="overflow-hidden rounded-[20px] border border-[var(--color-bg-300)] bg-[var(--color-ink)]">
            <div className="flex flex-col gap-8 p-8 md:flex-row md:items-center md:p-12">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="flex h-20 w-20 items-center justify-center rounded-[16px] bg-[var(--color-accent)]">
                  <Building2 className="h-10 w-10 text-[var(--color-ink)]" aria-hidden="true" />
                </div>
              </div>
              {/* Text */}
              <div className="flex-1">
                <p className="text-[12px] font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                  Для бізнесу
                </p>
                <h2
                  id="b2b-heading"
                  className="mt-2 font-[family-name:var(--font-manrope)] text-[28px] font-extrabold text-white md:text-[34px]"
                >
                  B2B Бронювання команди
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-white/65">
                  Захищаємо критично важливих спеціалістів від мобілізації. Повний юридичний
                  супровід процедури бронювання: від аудиту підстав до рішення Мінекономіки.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["IT", "Фармацевтика", "Агро", "Виробництво", "Телеком"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[12px] text-white/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              {/* CTA */}
              <div className="flex-shrink-0">
                <Link
                  href="/poslugy/b2b-bronyuvannya"
                  className="inline-flex h-[52px] items-center gap-2 rounded-[8px] bg-[var(--color-accent)] px-7 text-[15px] font-semibold text-[var(--color-ink)] transition-all hover:scale-[1.02]"
                >
                  Дізнатись більше
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
                <p className="mt-2 text-center text-[12px] text-white/45">від 50 000 грн</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="hub-faq-heading"
        className="bg-[var(--color-bg-200)] py-16 md:py-20"
      >
        <div className="container-legar">
          <div className="mx-auto max-w-[760px]">
            <h2
              id="hub-faq-heading"
              className="font-[family-name:var(--font-manrope)] text-[28px] font-extrabold text-[var(--color-ink)] md:text-[36px]"
            >
              Часті запитання
            </h2>

            <dl className="mt-8 space-y-3">
              {FAQ.map((item, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={i}
                    className="overflow-hidden rounded-[12px] border border-[var(--color-bg-300)] bg-white"
                  >
                    <dt>
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left"
                        aria-expanded={isOpen}
                      >
                        <span className="font-[family-name:var(--font-manrope)] text-[15px] font-bold text-[var(--color-ink)]">
                          {item.q}
                        </span>
                        <span
                          aria-hidden="true"
                          className={cn(
                            "mt-0.5 flex-shrink-0 text-[var(--color-primary)] transition-transform duration-200 text-xl leading-none",
                            isOpen && "rotate-45",
                          )}
                        >
                          +
                        </span>
                      </button>
                    </dt>
                    {isOpen && (
                      <dd className="px-6 pb-5 text-[14px] leading-relaxed text-[var(--color-ink)]/70">
                        {item.a}
                      </dd>
                    )}
                  </div>
                );
              })}
            </dl>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="poslugy-cta-heading"
        className="bg-[var(--color-accent)] py-20 md:py-24"
      >
        <div className="container-legar text-center">
          <div className="mx-auto max-w-[680px]">
            <h2
              id="poslugy-cta-heading"
              className="font-[family-name:var(--font-manrope)] text-[32px] font-extrabold text-[var(--color-ink)] md:text-[42px]"
            >
              Не чекайте — кожен день має значення
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-[var(--color-ink)]/70">
              Залиште заявку зараз. Менеджер LEGAR зв'яжеться протягом 15 хвилин.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/poslugy/ai-diagnostyka"
                className="inline-flex h-[56px] w-full items-center justify-center gap-2 rounded-[8px] bg-[var(--color-primary)] px-8 text-[16px] font-semibold text-white shadow-sm transition-all hover:bg-[var(--color-primary-600)] hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
              >
                <Sparkles className="h-5 w-5" aria-hidden="true" />
                Пройти AI-діагностику
              </Link>
              <a
                href={CONTACTS.phoneTel}
                className="inline-flex h-[56px] w-full items-center justify-center gap-2 rounded-[8px] border-2 border-[var(--color-ink)] bg-transparent px-7 text-[16px] font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-accent)] sm:w-auto"
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
                {CONTACTS.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
