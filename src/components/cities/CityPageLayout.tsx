import Link from "next/link";
import {
  Sparkles, Shield, FileCheck, Users, Gavel, Phone, Building2, Scale,
  ArrowRight, CheckCircle2, Clock, MapPin, Quote, type LucideIcon,
} from "lucide-react";
import { SERVICES, CONTACTS, CITIES } from "@/lib/constants";
import { ARTICLES } from "@/lib/blog-content";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import type { CityContent } from "@/lib/cities-content";

const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles, Shield, FileCheck, Users, Gavel, Phone, Building2, Scale,
};

interface CityPageLayoutProps {
  content: CityContent;
}

export function CityPageLayout({ content }: CityPageLayoutProps) {
  return (
    <>
      {/* ── 1. HERO ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[var(--color-ink)] py-20 md:py-28">
        {/* grid bg */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-primary) 1px,transparent 1px),linear-gradient(90deg,var(--color-primary) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-primary)] opacity-[0.08] blur-[80px]"
          aria-hidden="true"
        />
        <div className="container-legar relative z-10">
          <div className="mx-auto max-w-[820px]">
            {/* Breadcrumbs */}
            <nav aria-label="Хлібні крихти" className="mb-6">
              <ol className="flex flex-wrap items-center gap-1.5 text-[12px] text-white/40">
                <li><Link href="/" className="hover:text-white/70 transition-colors">Головна</Link></li>
                <li className="text-white/25">›</li>
                <li><Link href="/mista" className="hover:text-white/70 transition-colors">Міста</Link></li>
                <li className="text-white/25">›</li>
                <li className="text-white/60">{content.nameUk}</li>
              </ol>
            </nav>

            <h1 className="font-[family-name:var(--font-manrope)] text-[34px] font-extrabold leading-[1.1] text-white md:text-[52px]">
              {content.hero.h1}
            </h1>
            <p className="mt-5 text-[17px] leading-relaxed text-white/70 md:text-[19px]">
              {content.hero.sub}
            </p>

            {/* Trust tags */}
            <div className="mt-6 flex flex-wrap gap-2">
              {content.hero.trustTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[13px] text-white/80"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/poslugy/ai-diagnostyka"
                className="inline-flex h-[56px] items-center justify-center gap-2 rounded-[8px] bg-[var(--color-accent)] px-7 text-[16px] font-semibold text-[var(--color-ink)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="h-5 w-5" aria-hidden="true" />
                Безкоштовна AI-Діагностика
              </Link>
              <a
                href={CONTACTS.phoneTel}
                className="inline-flex h-[56px] items-center justify-center gap-2 rounded-[8px] border-2 border-white/30 bg-transparent px-7 text-[16px] font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
                {CONTACTS.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. СТАТИСТИКА ──────────────────────────────────────────────────── */}
      <section aria-label="Статистика регіону" className="bg-[var(--color-bg-200)] py-12">
        <div className="container-legar">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {content.stats.map((stat, i) => (
              <div
                key={i}
                className="rounded-[var(--radius-card)] border border-[var(--color-bg-300)] bg-white p-6 text-center"
              >
                <p className="font-[family-name:var(--font-manrope)] text-[30px] font-extrabold text-[var(--color-primary)]">
                  {stat.value}
                </p>
                <p className="mt-1.5 text-[12px] leading-snug text-[var(--color-ink)]/55">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. ЛОКАЛЬНІ ПРОБЛЕМИ ───────────────────────────────────────────── */}
      <section aria-labelledby="problems-heading" className="py-16 md:py-20">
        <div className="container-legar">
          <div className="mx-auto max-w-[860px]">
            <h2
              id="problems-heading"
              className="font-[family-name:var(--font-manrope)] text-[28px] font-extrabold text-[var(--color-ink)] md:text-[36px]"
            >
              {content.problems.heading}
            </h2>
            <div className="mt-6 space-y-4">
              {content.problems.paragraphs.map((p, i) => (
                <p key={i} className="text-[16px] leading-relaxed text-[var(--color-ink)]/70">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. УСІ ПОСЛУГИ ─────────────────────────────────────────────────── */}
      <section aria-labelledby="services-heading" className="bg-[var(--color-bg-200)] py-16 md:py-20">
        <div className="container-legar">
          <h2
            id="services-heading"
            className="font-[family-name:var(--font-manrope)] text-[28px] font-extrabold text-[var(--color-ink)] md:text-[34px]"
          >
            Послуги LEGAR доступні {content.nameInflected}
          </h2>
          <p className="mt-3 text-[15px] text-[var(--color-ink)]/55">
            Повний спектр військово-правового захисту — онлайн або з виїздом адвоката.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {SERVICES.map((service) => {
              const Icon = ICON_MAP[service.icon] ?? Shield;
              return (
                <Link
                  key={service.slug}
                  href={`/poslugy/${service.slug}` as `/poslugy/${string}`}
                  className="group flex flex-col rounded-[var(--radius-card)] border border-[var(--color-bg-300)] bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-[var(--color-bg-200)] text-[var(--color-primary)] transition-colors group-hover:bg-[var(--color-primary)] group-hover:text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-3 font-[family-name:var(--font-manrope)] text-[16px] font-bold text-[var(--color-ink)]">
                    {service.shortTitle}
                  </h3>
                  <p className="mt-1 flex-1 text-[13px] leading-relaxed text-[var(--color-ink)]/55">
                    {service.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t border-[var(--color-bg-300)] pt-3">
                    <span className="text-[14px] font-bold text-[var(--color-ink)]">
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

      {/* ── 5. ВИЇЗД АДВОКАТА ──────────────────────────────────────────────── */}
      <section aria-labelledby="visit-heading" className="py-16 md:py-20">
        <div className="container-legar">
          <h2
            id="visit-heading"
            className="font-[family-name:var(--font-manrope)] text-[28px] font-extrabold text-[var(--color-ink)] md:text-[34px]"
          >
            {content.lawyerVisit.heading}
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* Reaction times */}
            <div className="rounded-[var(--radius-card)] border border-[var(--color-bg-300)] bg-white p-7">
              <h3 className="font-[family-name:var(--font-manrope)] text-[18px] font-bold text-[var(--color-ink)]">
                Час реагування
              </h3>
              <div className="mt-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                    <Clock className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[13px] text-[var(--color-ink)]/55">Виїзд на ТЦК</p>
                    <p className="font-[family-name:var(--font-manrope)] text-[20px] font-extrabold text-[var(--color-ink)]">
                      {content.lawyerVisit.reactionTck}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-danger)]/10 text-[var(--color-danger)]">
                    <Phone className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[13px] text-[var(--color-ink)]/55">Виїзд при затриманні</p>
                    <p className="font-[family-name:var(--font-manrope)] text-[20px] font-extrabold text-[var(--color-ink)]">
                      {content.lawyerVisit.reactionDetention}
                    </p>
                  </div>
                </div>
              </div>

              {/* Partners */}
              <div className="mt-6 border-t border-[var(--color-bg-300)] pt-5">
                <p className="text-[13px] font-semibold text-[var(--color-ink)]/55">
                  Адвокати-партнери {content.nameInflected}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {content.lawyerVisit.partners.map((p) => (
                    <span
                      key={p}
                      className="rounded-full bg-[var(--color-bg-200)] px-3 py-1 text-[13px] font-medium text-[var(--color-ink)]/70"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {content.lawyerVisit.note && (
                <p className="mt-4 text-[12px] italic text-[var(--color-ink)]/45">
                  * {content.lawyerVisit.note}
                </p>
              )}
            </div>

            {/* Districts */}
            <div className="rounded-[var(--radius-card)] border border-[var(--color-bg-300)] bg-white p-7">
              <h3 className="font-[family-name:var(--font-manrope)] text-[18px] font-bold text-[var(--color-ink)]">
                Покриті райони
              </h3>
              <ul className="mt-5 grid grid-cols-2 gap-2">
                {content.lawyerVisit.districts.map((district) => (
                  <li key={district} className="flex items-center gap-2 text-[13px] text-[var(--color-ink)]/70">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
                    {district}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. КЕЙСИ ───────────────────────────────────────────────────────── */}
      <section aria-labelledby="cases-heading" className="bg-[var(--color-bg-200)] py-16 md:py-20">
        <div className="container-legar">
          <h2
            id="cases-heading"
            className="font-[family-name:var(--font-manrope)] text-[28px] font-extrabold text-[var(--color-ink)] md:text-[34px]"
          >
            Реальні кейси {content.nameInflected}
          </h2>
          <p className="mt-2 text-[14px] text-[var(--color-ink)]/50">
            Всі деталі анонімізовані за бажанням клієнтів.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {content.cases.map((c, i) => (
              <article
                key={i}
                className="flex flex-col rounded-[var(--radius-card)] border border-[var(--color-bg-300)] bg-white p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <Quote className="h-5 w-5 flex-shrink-0 text-[var(--color-primary)]/25" aria-hidden="true" />
                  <div className="flex flex-wrap justify-end gap-1.5">
                    <span className="rounded-full bg-[var(--color-bg-200)] px-2 py-0.5 text-[11px] text-[var(--color-ink)]/55">
                      {c.district}
                    </span>
                    <span className="rounded-full bg-[var(--color-primary)]/10 px-2 py-0.5 text-[11px] font-medium text-[var(--color-primary)]">
                      {c.type}
                    </span>
                  </div>
                </div>
                <p className="mt-4 flex-1 text-[14px] leading-relaxed text-[var(--color-ink)]/70">
                  {c.summary}
                </p>
                <div className="mt-5 rounded-[8px] border border-[var(--color-success)]/20 bg-[var(--color-success)]/5 p-3.5">
                  <p className="text-[12px] font-semibold text-[var(--color-success)]">Результат</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-[var(--color-ink)]/70">
                    {c.result}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6b. ПОСЛУГИ В ЦЬОМУ МІСТІ ──────────────────────────────────────── */}
      <section aria-labelledby="city-services-heading" className="bg-[var(--color-bg-200)] py-14 md:py-20">
        <div className="container-legar">
          <h2
            id="city-services-heading"
            className="font-[family-name:var(--font-manrope)] text-[24px] font-extrabold text-[var(--color-ink)] md:text-[32px]"
          >
            Послуги LEGAR {content.nameInflected}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => {
              const ServiceIcon = ICON_MAP[service.icon] ?? Shield;
              return (
                <Link
                  key={service.slug}
                  href={`/poslugy/${service.slug}/${content.slug}` as `/poslugy/${string}`}
                  className="group flex flex-col rounded-[var(--radius-card)] border border-[var(--color-bg-300)] bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-[var(--color-bg-200)] text-[var(--color-primary)] transition-colors group-hover:bg-[var(--color-primary)] group-hover:text-white">
                    <ServiceIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-[family-name:var(--font-manrope)] text-[17px] font-extrabold text-[var(--color-ink)]">
                    {service.shortTitle} {content.nameInflected}
                  </h3>
                  <p className="mt-1.5 flex-1 text-[14px] leading-relaxed text-[var(--color-ink)]/60">
                    {service.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-[var(--color-bg-300)] pt-3">
                    <span className="font-[family-name:var(--font-manrope)] text-[15px] font-extrabold text-[var(--color-ink)]">
                      {service.priceLabel}
                    </span>
                    <ArrowRight className="h-4 w-4 text-[var(--color-primary)] transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 6c. КОРИСНІ МАТЕРІАЛИ ─────────────────────────────────────────── */}
      <section aria-labelledby="city-articles-heading" className="py-14 md:py-20">
        <div className="container-legar">
          <div className="flex items-center justify-between">
            <h2
              id="city-articles-heading"
              className="font-[family-name:var(--font-manrope)] text-[24px] font-extrabold text-[var(--color-ink)] md:text-[30px]"
            >
              Корисні матеріали
            </h2>
            <Link
              href="/blog"
              className="hidden items-center gap-1 text-[13px] font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-600)] sm:flex"
            >
              Усі статті
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ARTICLES.slice(0, 3).map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}` as `/blog/${string}`}
                className="group flex flex-col rounded-[var(--radius-card)] border border-[var(--color-bg-300)] bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
              >
                <span className="inline-flex w-fit items-center rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                  {article.category}
                </span>
                <h3 className="mt-3 font-[family-name:var(--font-manrope)] text-[16px] font-extrabold leading-snug text-[var(--color-ink)]">
                  {article.title}
                </h3>
                <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-[var(--color-ink)]/60">
                  {article.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-end border-t border-[var(--color-bg-300)] pt-3">
                  <ArrowRight className="h-4 w-4 text-[var(--color-primary)] transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. FAQ ─────────────────────────────────────────────────────────── */}
      <ServiceFAQ items={content.faq} />

      {/* ── DISCLAIMER ─────────────────────────────────────────────────────── */}
      <div className="container-legar py-4">
        <p className="text-center text-[12px] text-[var(--color-ink)]/40">
          LEGAR — інформаційно-консультаційна платформа. Юридичні послуги надають адвокати-партнери, члени НААУ.
        </p>
      </div>

      {/* ── 8. FINAL CTA ───────────────────────────────────────────────────── */}
      <section
        aria-labelledby="city-cta-heading"
        className="bg-[var(--color-accent)] py-20 md:py-24"
      >
        <div className="container-legar text-center">
          <div className="mx-auto max-w-[680px]">
            <h2
              id="city-cta-heading"
              className="font-[family-name:var(--font-manrope)] text-[30px] font-extrabold leading-[1.1] text-[var(--color-ink)] md:text-[42px]"
            >
              Потрібен адвокат {content.nameInflected}?
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[var(--color-ink)]/70">
              Залиште заявку — менеджер зв'яжеться протягом 15 хвилин і підбере
              адвоката-партнера у вашому місті.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/poslugy/ai-diagnostyka"
                className="inline-flex h-[56px] w-full items-center justify-center gap-2 rounded-[8px] bg-[var(--color-primary)] px-8 text-[16px] font-semibold text-white shadow-sm transition-all hover:bg-[var(--color-primary-600)] hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
              >
                <Sparkles className="h-5 w-5" aria-hidden="true" />
                AI-Діагностика безкоштовно
              </Link>
              <a
                href={CONTACTS.phoneTel}
                className="inline-flex h-[56px] w-full items-center justify-center gap-2 rounded-[8px] border-2 border-[var(--color-ink)] bg-transparent px-7 text-[16px] font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-accent)] sm:w-auto"
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
                {CONTACTS.phone}
              </a>
            </div>

            {/* What's included */}
            <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[
                "Адвокат НААУ",
                "Договір онлайн",
                "Кабінет справи",
                "Прозора ціна",
                "SOS 24/7",
                `${CITIES.length} міст покриття`,
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-[13px] text-[var(--color-ink)]/70">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[var(--color-ink)]/50" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
