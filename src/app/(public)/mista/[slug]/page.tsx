import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CITIES_CONTENT,
  ALL_CITY_SLUGS,
  type CitySlug,
} from "@/lib/cities-content";
import { CityPageLayout } from "@/components/cities/CityPageLayout";
import { COMPANY } from "@/lib/constants";

/**
 * Динамічний маршрут для міст без окремого статичного page.tsx.
 * 5 основних міст (kyiv, lviv, dnipro, kharkiv, odesa) обслуговуються
 * статичними сторінками у /mista/<slug>/page.tsx — їх виключено з
 * generateStaticParams, щоб уникнути конфлікту маршрутів.
 */

const STATIC_SLUGS: CitySlug[] = ["kyiv", "lviv", "dnipro", "kharkiv", "odesa"];

const DYNAMIC_SLUGS = ALL_CITY_SLUGS.filter((s) => !STATIC_SLUGS.includes(s));

interface PageProps {
  params: Promise<{ slug: string }>;
}

function resolveCity(slug: string) {
  if (!DYNAMIC_SLUGS.includes(slug as CitySlug)) return null;
  return CITIES_CONTENT[slug as CitySlug] ?? null;
}

export function generateStaticParams() {
  return DYNAMIC_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = resolveCity(slug);
  if (!content) return {};

  const url = `${COMPANY.url}/mista/${content.slug}`;
  return {
    title: content.meta.title,
    description: content.meta.description,
    keywords: content.meta.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: content.meta.title,
      description: content.meta.description,
      url,
      type: "website",
    },
  };
}

export default async function CityPage({ params }: PageProps) {
  const { slug } = await params;
  const content = resolveCity(slug);
  if (!content) notFound();

  const url = `${COMPANY.url}/mista/${content.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Головна", item: COMPANY.url },
          { "@type": "ListItem", position: 2, name: "Міста", item: `${COMPANY.url}/mista` },
          { "@type": "ListItem", position: 3, name: content.nameUk, item: url },
        ],
      },
      {
        "@type": ["LegalService", "LocalBusiness"],
        "@id": `${url}#service`,
        name: `LEGAR — військовий адвокат ${content.nameInflected}`,
        description: content.meta.description,
        url,
        telephone: "+380800357288",
        priceRange: "від 1 200 грн",
        areaServed: { "@type": "City", name: content.nameUk },
        address: {
          "@type": "PostalAddress",
          addressLocality: content.nameUk,
          addressCountry: "UA",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `Військово-юридичні послуги ${content.nameInflected}`,
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI-Діагностика справи" }, price: "1200", priceCurrency: "UAH" },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Антиштраф ТЦК 360°" }, price: "8500", priceCurrency: "UAH" },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "ВЛК Pro" }, price: "14000", priceCurrency: "UAH" },
          ],
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: content.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CityPageLayout content={content} />
    </>
  );
}
