import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { ARTICLES } from "@/lib/blog-content";
import type { ServiceSlug } from "@/lib/services-content";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface ServiceRelatedArticlesProps {
  serviceSlug: ServiceSlug;
}

/**
 * Показує статті блогу, що мають цю послугу у relatedServices.
 * Зв'язок service → blog через інверсію вже наявного поля.
 */
export function ServiceRelatedArticles({ serviceSlug }: ServiceRelatedArticlesProps) {
  const articles = ARTICLES.filter((a) =>
    a.relatedServices.includes(serviceSlug),
  ).slice(0, 3);

  if (articles.length === 0) return null;

  return (
    <section
      aria-labelledby="service-articles-heading"
      className="bg-[var(--color-bg-200)] py-14 md:py-20"
    >
      <div className="container-legar">
        <div className="flex items-center justify-between">
          <h2
            id="service-articles-heading"
            className="font-[family-name:var(--font-manrope)] text-[24px] font-extrabold text-[var(--color-ink)] md:text-[32px]"
          >
            Читайте також
          </h2>
          <Link
            href="/blog"
            className="hidden items-center gap-1.5 text-[14px] font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-600)] sm:flex"
          >
            Усі матеріали
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}` as `/blog/${string}`}
              className="group flex flex-col rounded-[var(--radius-card)] border border-[var(--color-bg-300)] bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
            >
              <span className="inline-flex w-fit items-center rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                {article.category}
              </span>
              <h3 className="mt-3 font-[family-name:var(--font-manrope)] text-[17px] font-extrabold leading-snug text-[var(--color-ink)]">
                {article.title}
              </h3>
              <p className="mt-2 flex-1 text-[14px] leading-relaxed text-[var(--color-ink)]/65">
                {article.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-3 border-t border-[var(--color-bg-300)] pt-3 text-[12px] text-[var(--color-ink)]/50">
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
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 sm:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--color-primary)]"
          >
            Усі матеріали
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
