import type { Metadata } from "next";
import { SERVICES_CONTENT } from "@/lib/services-content";
import { ServicePageLayout } from "@/components/services/ServicePageLayout";
import { COMPANY } from "@/lib/constants";

const content = SERVICES_CONTENT["szch-zahyst"];

export const metadata: Metadata = {
  title: content.meta.title,
  description: content.meta.description,
  keywords: content.meta.keywords,
  alternates: {
    canonical: `${COMPANY.url}/poslugy/szch-zahyst`,
  },
  openGraph: {
    title: content.meta.title,
    description: content.meta.description,
    url: `${COMPANY.url}/poslugy/szch-zahyst`,
    type: "website",
  },
};

export default function SzchZahystPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", position: 1, name: "Головна", item: COMPANY.url },
          { "@type": "ListItem", position: 2, name: "Послуги", item: `${COMPANY.url}/poslugy` },
          { "@type": "ListItem", position: 3, name: "Захист по СЗЧ", item: `${COMPANY.url}/poslugy/szch-zahyst` },
        ],
      },
      {
        "@type": "Service",
        "@id": `${COMPANY.url}/poslugy/szch-zahyst#service`,
        name: "Захист по СЗЧ",
        description: content.meta.description,
        provider: {
          "@type": "LegalService",
          name: COMPANY.name,
          url: COMPANY.url,
        },
        offers: {
          "@type": "Offer",
          price: "30000",
          priceCurrency: "UAH",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "30000",
            priceCurrency: "UAH",
          },
          availability: "https://schema.org/InStock",
          url: `${COMPANY.url}/poslugy/szch-zahyst`,
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
