import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { ARTICLES } from "@/lib/blog-content";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Блог про ТЦК, ВЛК, СЗЧ та мобілізацію",
  description:
    "Експертні гайди від адвокатів-партнерів LEGAR (НААУ): як оскаржити штраф ТЦК і висновок ВЛК, захист по СЗЧ (ст. 407 ККУ), бронювання та відстрочка від мобілізації.",
  alternates: { canonical: `${COMPANY.url}/blog` },
  openGraph: {
    title: "Блог LEGAR — ТЦК, ВЛК, СЗЧ, мобілізація",
    description:
      "Практичні інструкції з військово-правових питань від адвокатів-партнерів НААУ.",
    url: `${COMPANY.url}/blog`,
    type: "website",
  },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Головна", item: COMPANY.url },
          { "@type": "ListItem", position: 2, name: "Блог", item: `${COMPANY.url}/blog` },
        ],
      },
      {
        "@type": "Blog",
        "@id": `${COMPANY.url}/blog#blog`,
        name: "Блог LEGAR",
        description:
          "Експертні матеріали з військово-правових питань: ТЦК, ВЛК, СЗЧ, бронювання, мобілізація.",
        url: `${COMPANY.url}/blog`,
        inLanguage: "uk-UA",
        publisher: {
          "@type": "Organization",
          name: COMPANY.name,
          url: COMPANY.url,
          logo: `${COMPANY.url}/favicon.svg`,
        },
        blogPost: ARTICLES.map((a) => ({
          "@type": "BlogPosting",
          headline: a.title,
          description: a.excerpt,
          url: `${COMPANY.url}/blog/${a.slug}`,
          datePublished: a.publishedAt,
          dateModified: a.updatedAt,
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

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="bg-[var(--color-ink)] py-16 md:py-24">
        <div className="container-legar">
          <div className="mx-auto max-w-[760px]">
            <nav aria-label="Хлібні крихти" className="mb-6">
              <ol className="flex flex-wrap items-center gap-1.5 text-[12px] text-white/40">
                <li><Link href="/" className="transition-colors hover:text-white/70">Головна</Link></li>
                <li className="text-white/25">›</li>
                <li className="text-white/60">Блог</li>
              </ol>
            </nav>
            <h1 className="font-[family-name:var(--font-manrope)] text-[36px] font-extrabold leading-[1.1] text-white md:text-[52px]">
              Блог LEGAR
            </h1>
            <p className="mt-5 text-[17px] leading-relaxed text-white/70 md:text-[19px]">
              Практичні гайди з ТЦК, ВЛК, СЗЧ, бронювання та мобілізації від
              адвокатів-партнерів НААУ. Без води — лише корисні дії.
            </p>
          </div>
        </div>
      </section>

      {/* ── ARTICLES GRID ─────────────────────────────────────────────────── */}
      <section aria-label="Статті" className="py-14 md:py-20">
        <div className="container-legar">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ARTICLES.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}` as `/blog/${string}`}
                className="group flex h-full flex-col rounded-[var(--radius-card)] border border-[var(--color-bg-300)] bg-white p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
              >
                <span className="inline-flex w-fit items-center rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-[12px] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                  {article.category}
                </span>
                <h2 className="mt-4 font-[family-name:var(--font-manrope)] text-[20px] font-extrabold leading-snug text-[var(--color-ink)]">
                  {article.title}
                </h2>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-[var(--color-ink)]/65">
                  {article.excerpt}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-[var(--color-bg-300)] pt-4 text-[12px] text-[var(--color-ink)]/50">
                  <span className="inline-flex items-center gap-3">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                      <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      {article.readingMinutes} хв
                    </span>
                  </span>
                  <ArrowRight
                    className="h-4 w-4 text-[var(--color-primary)] transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
