import Link from "next/link";
import {
  Sparkles, Shield, FileCheck, Users, Gavel, Phone, Building2,
  ArrowRight, CheckCircle2, Clock, MapPin, type LucideIcon,
} from "lucide-react";
import { CONTACTS } from "@/lib/constants";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import type { ServiceCityContent } from "@/lib/service-city-content";

const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles, Shield, FileCheck, Users, Gavel, Phone, Building2,
};

interface ServiceCityPageLayoutProps {
  content: ServiceCityContent;
}

export function ServiceCityPageLayout({ content }: ServiceCityPageLayoutProps) {
  const Icon = ICON_MAP[content.serviceIcon] ?? Shield;

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[var(--color-ink)] py-16 md:py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-primary) 1px,transparent 1px),linear-gradient(90deg,var(--color-primary) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="container-legar relative z-10">
          <div className="mx-auto max-w-[760px]">
            <nav aria-label="Хлібні крихти" className="mb-6">
              <ol className="flex flex-wrap items-center gap-1.5 text-[12px] text-white/40">
                <li><Link href="/" className="transition-colors hover:text-white/70">Головна</Link></li>
                <li className="text-white/25">›</li>
                <li><Link href="/poslugy" className="transition-colors hover:text-white/70">Послуги</Link></li>
                <li className="text-white/25">›</li>
                <li>
                  <Link
                    href={`/poslugy/${content.serviceSlug}` as `/poslugy/${string}`}
                    className="transition-colors hover:text-white/70"
                  >
                    {content.serviceShortTitle}
                  </Link>
                </li>
                <li className="text-white/25">›</li>
                <li className="text-white/60">{content.cityNameUk}</li>
              </ol>
            </nav>

            <span className="inline-flex h-12 w-12 items-center justify-center rounded-[10px] bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </span>

            <h1 className="mt-4 font-[family-name:var(--font-manrope)] text-[32px] font-extrabold leading-[1.12] text-white md:text-[46px]">
              {content.h1}
            </h1>
            <p className="mt-5 text-[17px] leading-relaxed text-white/70 md:text-[19px]">
              {content.heroSub}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/poslugy/ai-diagnostyka"
                className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-[8px] bg-[var(--color-primary)] px-7 text-[15px] font-semibold text-white transition-all hover:bg-[var(--color-primary-600)] hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
              >
                <Sparkles className="h-5 w-5" aria-hidden="true" />
                Пройти AI-Діагностику
              </Link>
              <a
                href={CONTACTS.phoneTel}
                className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-[8px] border-2 border-white/25 bg-transparent px-6 text-[15px] font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
                {CONTACTS.phone}
              </a>
            </div>

            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-[13px] font-semibold text-[var(--color-accent)]">
              {content.priceLabel}
            </p>
          </div>
        </div>
      </section>

      {/* ── INTRO ─────────────────────────────────────────────────────────── */}
      <section className="py-14 md:py-20">
        <div className="container-legar">
          <div className="mx-auto max-w-[760px]">
            {content.intro.map((p, i) => (
              <p
                key={i}
                className={`text-[16px] leading-relaxed text-[var(--color-ink)]/75 ${i > 0 ? "mt-4" : ""}`}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ───────────────────────────────────────────────── */}
      <section aria-labelledby="sc-included" className="bg-[var(--color-bg-200)] py-14 md:py-20">
        <div className="container-legar">
          <div className="mx-auto max-w-[860px]">
            <h2
              id="sc-included"
              className="font-[family-name:var(--font-manrope)] text-[24px] font-extrabold text-[var(--color-ink)] md:text-[30px]"
            >
              Що входить у послугу
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {content.included.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-[var(--radius-card)] border border-[var(--color-bg-300)] bg-white p-5"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
                  <div>
                    <p className="font-[family-name:var(--font-manrope)] text-[15px] font-bold text-[var(--color-ink)]">
                      {item.title}
                    </p>
                    {item.description && (
                      <p className="mt-1 text-[14px] leading-relaxed text-[var(--color-ink)]/60">
                        {item.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── LOCAL COVERAGE ────────────────────────────────────────────────── */}
      <section aria-labelledby="sc-local" className="py-14 md:py-20">
        <div className="container-legar">
          <div className="mx-auto max-w-[860px]">
            <h2
              id="sc-local"
              className="font-[family-name:var(--font-manrope)] text-[24px] font-extrabold text-[var(--color-ink)] md:text-[30px]"
            >
              Покриття {content.cityNameInflected} та області
            </h2>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-[14px] text-[var(--color-ink)]/70">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-bg-200)] px-4 py-1.5">
                <Clock className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
                Виїзд адвоката за {content.reactionTck}
              </span>
            </div>
            <ul className="mt-6 flex flex-wrap gap-2">
              {content.districts.map((d) => (
                <li
                  key={d}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-bg-300)] px-3 py-1.5 text-[13px] text-[var(--color-ink)]/70"
                >
                  <MapPin className="h-3.5 w-3.5 text-[var(--color-primary)]" aria-hidden="true" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <ServiceFAQ items={content.faq} />

      {/* ── CROSS-LINKS ───────────────────────────────────────────────────── */}
      <section className="bg-[var(--color-bg-200)] py-12">
        <div className="container-legar">
          <div className="mx-auto grid max-w-[860px] gap-4 sm:grid-cols-2">
            <Link
              href={`/poslugy/${content.serviceSlug}` as `/poslugy/${string}`}
              className="group flex items-center justify-between rounded-[var(--radius-card)] border border-[var(--color-bg-300)] bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
            >
              <span className="text-[15px] font-semibold text-[var(--color-ink)]">
                Детальніше про послугу «{content.serviceShortTitle}»
              </span>
              <ArrowRight className="h-4 w-4 flex-shrink-0 text-[var(--color-primary)] transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link
              href={`/mista/${content.citySlug}` as `/mista/${string}`}
              className="group flex items-center justify-between rounded-[var(--radius-card)] border border-[var(--color-bg-300)] bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
            >
              <span className="text-[15px] font-semibold text-[var(--color-ink)]">
                Усі послуги {content.cityNameInflected}
              </span>
              <ArrowRight className="h-4 w-4 flex-shrink-0 text-[var(--color-primary)] transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── DISCLAIMER ────────────────────────────────────────────────────── */}
      <div className="container-legar py-8">
        <div className="mx-auto max-w-[860px] rounded-[var(--radius-card)] border border-[var(--color-bg-300)] bg-[var(--color-bg-200)] p-5">
          <p className="text-[13px] leading-relaxed text-[var(--color-ink)]/55">
            Матеріал має інформаційний характер і не є індивідуальною юридичною
            консультацією. Норми законодавства можуть змінюватися. Для оцінки
            саме вашої ситуації зверніться до адвоката-партнера LEGAR (НААУ).
          </p>
        </div>
      </div>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section aria-labelledby="sc-cta" className="bg-[var(--color-accent)] py-16 md:py-20">
        <div className="container-legar text-center">
          <div className="mx-auto max-w-[680px]">
            <h2
              id="sc-cta"
              className="font-[family-name:var(--font-manrope)] text-[26px] font-extrabold leading-[1.1] text-[var(--color-ink)] md:text-[36px]"
            >
              {content.serviceShortTitle} {content.cityNameInflected} — почніть сьогодні
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[var(--color-ink)]/70">
              Пройдіть AI-Діагностику за 5–10 хвилин або зателефонуйте на
              цілодобову гарячу лінію.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/poslugy/ai-diagnostyka"
                className="inline-flex h-[56px] w-full items-center justify-center gap-2 rounded-[8px] bg-[var(--color-primary)] px-8 text-[16px] font-semibold text-white transition-all hover:bg-[var(--color-primary-600)] hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
              >
                <Sparkles className="h-5 w-5" aria-hidden="true" />
                Пройти AI-Діагностику
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
