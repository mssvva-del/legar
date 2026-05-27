import type { Metadata } from "next";
import { SERVICES_CONTENT } from "@/lib/services-content";
import { ServicePageLayout } from "@/components/services/ServicePageLayout";
import { COMPANY } from "@/lib/constants";

const content = SERVICES_CONTENT["b2b-bronyuvannya"];

export const metadata: Metadata = {
  title: content.meta.title,
  description: content.meta.description,
  keywords: content.meta.keywords,
  alternates: {
    canonical: `${COMPANY.url}/poslugy/b2b-bronyuvannya`,
  },
  openGraph: {
    title: content.meta.title,
    description: content.meta.description,
    url: `${COMPANY.url}/poslugy/b2b-bronyuvannya`,
    type: "website",
  },
};

export default function B2bBronyuvannyaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", position: 1, name: "Головна", item: COMPANY.url },
          { "@type": "ListItem", position: 2, name: "Послуги", item: `${COMPANY.url}/poslugy` },
          { "@type": "ListItem", position: 3, name: "B2B Бронювання", item: `${COMPANY.url}/poslugy/b2b-bronyuvannya` },
        ],
      },
      {
        "@type": "Service",
        "@id": `${COMPANY.url}/poslugy/b2b-bronyuvannya#service`,
        name: "B2B Бронювання",
        description: content.meta.description,
        provider: {
          "@type": "LegalService",
          name: COMPANY.name,
          url: COMPANY.url,
        },
        offers: {
          "@type": "Offer",
          price: "65000",
          priceCurrency: "UAH",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "65000",
            priceCurrency: "UAH",
          },
          availability: "https://schema.org/InStock",
          url: `${COMPANY.url}/poslugy/b2b-bronyuvannya`,
        },
        areaServed: { "@type": "Country", name: "Україна" },
      },
      {
        "@type": "FAQPage",
        mainEntity: content.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
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
      <ServicePageLayout content={content} />
    </>
  );
}
