import Link from "next/link";
import {
  Sparkles, Shield, FileCheck, Users, Gavel, Phone, Building2, Scale,
  ArrowRight, Clock, Calendar, CheckCircle2, type LucideIcon,
} from "lucide-react";
import { SERVICES, CONTACTS, CITIES } from "@/lib/constants";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import { LeadForm } from "@/components/shared/LeadForm";
import type { Article } from "@/lib/blog-content";

const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles, Shield, FileCheck, Users, Gavel, Phone, Building2, Scale,
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface ArticleLayoutProps {
  article: Article;
}

export function ArticleLayout({ article }: ArticleLayoutProps) {
  const related = SERVICES.filter((s) =>
    article.relatedServices.includes(s.slug),
  );

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
            {/* Breadcrumbs */}
            <nav aria-label="Хлібні крихти" className="mb-6">
              <ol className="flex flex-wrap items-center gap-1.5 text-[12px] text-white/40">
                <li><Link href="/" className="transition-colors hover:text-white/70">Головна</Link></li>
                <li className="text-white/25">›</li>
                <li><Link href="/blog" className="transition-colors hover:text-white/70">Блог</Link></li>
                <li className="text-white/25">›</li>
                <li className="text-white/60">{article.category}</li>
              </ol>
            </nav>

            <span className="inline-flex items-center rounded-full bg-[var(--color-accent)]/15 px-3 py-1 text-[12px] font-semibold uppercase tracking-wide text-[var(--color-accent)]">
              {article.category}
            </span>

            <h1 className="mt-4 font-[family-name:var(--font-manrope)] text-[32px] font-extrabold leading-[1.12] text-white md:text-[46px]">
              {article.title}
            </h1>
            <p className="mt-5 text-[17px] leading-relaxed text-white/70 md:text-[19px]">
              {article.heroSub}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-[13px] text-white/45">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" aria-hidden="true" />
                {article.readingMinutes} хв читання
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── BODY ──────────────────────────────────────────────────────────── */}
      <article className="py-14 md:py-20">
        <div className="container-legar">
          <div className="mx-auto max-w-[760px]">
            {article.sections.map((section, i) => (
              <section key={i} className={i > 0 ? "mt-12" : ""}>
                <h2 className="font-[family-name:var(--font-manrope)] text-[24px] font-extrabold leading-tight text-[var(--color-ink)] md:text-[30px]">
                  {section.heading}
                </h2>

                {section.paragraphs?.map((p, j) => (
                  <p key={j} className="mt-4 text-[16px] leading-relaxed text-[var(--color-ink)]/75">
                    {p}
                  </p>
                ))}

                {section.bullets && (
                  <ul className="mt-5 space-y-3">
                    {section.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-3 text-[16px] leading-relaxed text-[var(--color-ink)]/75">
                        <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.steps && (
                  <ol className="mt-5 space-y-3">
                    {section.steps.map((s, j) => (
                      <li key={j} className="flex items-start gap-3 text-[16px] leading-relaxed text-[var(--color-ink)]/75">
                        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-[13px] font-bold text-white">
                          {j + 1}
                        </span>
                        <span className="pt-0.5">{s}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </section>
            ))}

            {/* Disclaimer */}
            <div className="mt-12 rounded-[var(--radius-card)] border border-[var(--color-bg-300)] bg-[var(--color-bg-200)] p-5">
              <p className="text-[13px] leading-relaxed text-[var(--color-ink)]/55">
                Матеріал має інформаційний характер і не є індивідуальною юридичною
                консультацією. Норми законодавства можуть змінюватися. Для оцінки
                саме вашої ситуації зверніться до адвоката-партнера LEGAR (НААУ).
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* ── RELATED SERVICES ──────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="bg-[var(--color-bg-200)] py-14 md:py-20">
          <div className="container-legar">
            <h2
              id="related-heading"
              className="font-[family-name:var(--font-manrope)] text-[24px] font-extrabold text-[var(--color-ink)] md:text-[32px]"
            >
              Послуги LEGAR за темою
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((service) => {
                const Icon = ICON_MAP[service.icon] ?? Shield;
                return (
                  <Link
                    key={service.slug}
                    href={`/poslugy/${service.slug}` as `/poslugy/${string}`}
                    className="group flex flex-col rounded-[var(--radius-card)] border border-[var(--color-bg-300)] bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
                  >
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-[10px] bg-[var(--color-bg-200)] text-[var(--color-primary)] transition-colors group-hover:bg-[var(--color-primary)] group-hover:text-white">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 font-[family-name:var(--font-manrope)] text-[18px] font-extrabold text-[var(--color-ink)]">
                      {service.shortTitle}
                    </h3>
                    <p className="mt-1.5 flex-1 text-[14px] leading-relaxed text-[var(--color-ink)]/60">
                      {service.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-[var(--color-bg-300)] pt-3">
                      <span className="font-[family-name:var(--font-manrope)] text-[16px] font-extrabold text-[var(--color-ink)]">
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
      )}

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <ServiceFAQ items={article.faq} />

      {/* ── CITIES DISCOVERY ──────────────────────────────────────────────── */}
      <section aria-labelledby="article-cities-heading" className="py-14 md:py-20">
        <div className="container-legar">
          <h2
            id="article-cities-heading"
            className="font-[family-name:var(--font-manrope)] text-[22px] font-extrabold text-[var(--color-ink)] md:text-[28px]"
          >
            Знайдіть адвоката у вашому місті
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-ink)]/65">
            Адвокати-партнери LEGAR працюють у {CITIES.length} містах України.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {CITIES.map((city) => {
              const primaryService = article.relatedServices[0];
              const href = primaryService
                ? (`/poslugy/${primaryService}/${city.slug}` as `/poslugy/${string}`)
                : (`/mista/${city.slug}` as `/mista/${string}`);
              return (
                <li key={city.slug}>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-bg-300)] bg-white px-4 py-2 text-[13px] font-medium text-[var(--color-ink)]/75 transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                  >
                    {city.nameUk}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section aria-labelledby="article-cta-heading" className="bg-[var(--color-accent)] py-16 md:py-20">
        <div className="container-legar">
          <div className="mx-auto max-w-[720px]">
            <div className="text-center mb-8">
              <h2
                id="article-cta-heading"
                className="font-[family-name:var(--font-manrope)] text-[28px] font-extrabold leading-[1.1] text-[var(--color-ink)] md:text-[38px]"
              >
                Маєте схожу ситуацію?
              </h2>
              <p className="mt-3 text-[17px] leading-relaxed text-[var(--color-ink)]/75">
                Залиште заявку — адвокат зв'яжеться протягом 15 хвилин.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <LeadForm variant="compact" source={`blog-${article.slug}`} />
            </div>
            <div className="mt-5 text-center">
              <a
                href={CONTACTS.phoneTel}
                className="inline-flex items-center gap-2 text-[15px] font-semibold text-[var(--color-ink)] transition-colors hover:text-[var(--color-primary)]"
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
