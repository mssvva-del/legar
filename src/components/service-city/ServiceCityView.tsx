import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COMPANY } from "@/lib/constants";
import { getServiceCityContent } from "@/lib/service-city-content";
import { ServiceCityPageLayout } from "./ServiceCityPageLayout";

export function buildServiceCityMetadata(
  serviceSlug: string,
  citySlug: string,
): Metadata {
  const content = getServiceCityContent(serviceSlug, citySlug);
  if (!content) return {};

  const url = `${COMPANY.url}/poslugy/${content.serviceSlug}/${content.citySlug}`;
  return {
    title: content.metaTitle,
    description: content.metaDescription,
    keywords: content.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url,
      type: "website",
    },
  };
}

interface ServiceCityViewProps {
  serviceSlug: string;
  citySlug: string;
}

export function ServiceCityView({ serviceSlug, citySlug }: ServiceCityViewProps) {
  const content = getServiceCityContent(serviceSlug, citySlug);
  if (!content) notFound();

  const url = `${COMPANY.url}/poslugy/${content.serviceSlug}/${content.citySlug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Головна", item: COMPANY.url },
          { "@type": "ListItem", position: 2, name: "Послуги", item: `${COMPANY.url}/poslugy` },
          {
            "@type": "ListItem",
            position: 3,
            name: content.serviceShortTitle,
            item: `${COMPANY.url}/poslugy/${content.serviceSlug}`,
          },
          { "@type": "ListItem", position: 4, name: content.cityNameUk, item: url },
        ],
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: content.h1,
        description: content.metaDescription,
        provider: {
          "@type": "LegalService",
          name: COMPANY.name,
          url: COMPANY.url,
        },
        areaServed: { "@type": "City", name: content.cityNameUk },
        offers: {
          "@type": "Offer",
          price: String(content.priceUah),
          priceCurrency: "UAH",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: String(content.priceUah),
            priceCurrency: "UAH",
          },
          availability: "https://schema.org/InStock",
          url,
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
      <ServiceCityPageLayout content={content} />
    </>
  );
}
