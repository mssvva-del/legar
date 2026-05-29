import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { ARTICLES } from "@/lib/blog-content";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const PREVIEW_COUNT = 3;

export function BlogPreview() {
  const articles = ARTICLES.slice(0, PREVIEW_COUNT);

  return (
    <section
      aria-labelledby="blog-preview-heading"
      className="bg-[var(--color-bg-200)] py-16 md:py-24"
    >
      <div className="container-legar">
        {/* Header */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Корисні матеріали
            </p>
            <h2
              id="blog-preview-heading"
              className="mt-2 font-[family-name:var(--font-manrope)] text-[28px] font-extrabold leading-tight text-[var(--color-ink)] md:text-[36px]"
            >
              Блог LEGAR: ТЦК, ВЛК, СЗЧ
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden shrink-0 items-center gap-1.5 text-[14px] font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-600)] sm:flex"
            aria-label="Усі статті блогу"
          >
            Усі статті
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Grid */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}` as `/blog/${string}`}
              className="group flex h-full flex-col rounded-[var(--radius-card)] border border-[var(--color-bg-300)] bg-white p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
            >
              <span className="inline-flex w-fit items-center rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                {article.category}
              </span>
              <h3 className="mt-4 font-[family-name:var(--font-manrope)] text-[18px] font-extrabold leading-snug text-[var(--color-ink)]">
                {article.title}
              </h3>
              <p className="mt-2 flex-1 text-[14px] leading-relaxed text-[var(--color-ink)]/65">
                {article.excerpt}
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-[var(--color-bg-300)] pt-4 text-[12px] text-[var(--color-ink)]/50">
                <span className="inline-flex items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                    <time dateTime={article.publishedAt}>
                      {formatDate(article.publishedAt)}
                    </time>
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

        {/* Mobile "all" link */}
        <div className="mt-6 sm:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--color-primary)]"
          >
            Усі статті
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
