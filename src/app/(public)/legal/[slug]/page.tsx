import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { LEGAL_PAGES } from "@/lib/constants";
import { LEGAL_CONTENT } from "@/lib/legal-content";
import { COMPANY } from "@/lib/constants";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return LEGAL_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = LEGAL_PAGES.find((p) => p.slug === slug);
  if (!page) return { title: "Документ не знайдено" };
  const content = LEGAL_CONTENT[slug];
  return {
    title: content?.title ?? page.title,
    description: content?.subtitle ?? `${page.title} — LEGAR`,
    alternates: { canonical: `${COMPANY.url}/legal/${slug}` },
    robots: { index: false, follow: true },
  };
}

export default async function LegalPage({ params }: PageProps) {
  const { slug } = await params;
  const page = LEGAL_PAGES.find((p) => p.slug === slug);
  if (!page) notFound();

  const content = LEGAL_CONTENT[slug];

  if (!content) {
    return (
      <main className="min-h-screen bg-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-[var(--color-ink)] mb-4">{page.title}</h1>
          <p className="text-gray-500">
            Документ готується. Фінальна редакція з'явиться найближчим часом.
            Для термінових запитів — пишіть на{" "}
            <a href="mailto:mail@legar.com.ua" className="text-[var(--color-primary)] hover:underline">
              mail@legar.com.ua
            </a>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[var(--color-ink)] text-white pt-14 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-white">Головна</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-300">Юридичні документи</span>
            <span className="mx-2">/</span>
            <span className="text-white">{content.title}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">{content.title}</h1>
          {content.subtitle && (
            <p className="text-gray-300">{content.subtitle}</p>
          )}
          <p className="text-sm text-gray-400 mt-4">
            Остання редакція: {content.lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Quick nav */}
          {content.sections.filter((s) => s.heading).length > 2 && (
            <div className="bg-[var(--color-bg-200)] rounded-2xl p-5 mb-10 border border-[var(--color-bg-300)]">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Зміст</p>
              <ul className="space-y-1">
                {content.sections
                  .filter((s) => s.heading)
                  .map((s) => (
                    <li key={s.heading}>
                      <a
                        href={`#${s.heading!.replace(/\s+/g, "-").toLowerCase()}`}
                        className="text-sm text-[var(--color-primary)] hover:underline"
                      >
                        {s.heading}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Sections */}
          <div className="space-y-8">
            {content.sections.map((section, i) => (
              <div key={i} id={section.heading?.replace(/\s+/g, "-").toLowerCase()}>
                {section.heading && (
                  <h2 className="text-lg font-extrabold text-[var(--color-ink)] mb-3">
                    {section.heading}
                  </h2>
                )}
                <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                  {section.body}
                </div>
              </div>
            ))}
          </div>

          {/* Related docs */}
          <div className="mt-12 pt-8 border-t border-[var(--color-bg-300)]">
            <p className="text-sm font-bold text-gray-400 mb-3">Інші юридичні документи</p>
            <div className="flex flex-wrap gap-2">
              {LEGAL_PAGES.filter((p) => p.slug !== slug).map((p) => (
                <Link
                  key={p.slug}
                  href={`/legal/${p.slug}`}
                  className="text-sm text-[var(--color-primary)] hover:underline border border-[var(--color-bg-300)] rounded-lg px-3 py-1.5"
                >
                  {p.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
