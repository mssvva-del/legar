import type { Metadata } from "next";
import { CITIES_CONTENT } from "@/lib/cities-content";
import { CityPageLayout } from "@/components/cities/CityPageLayout";
import { COMPANY } from "@/lib/constants";

const content = CITIES_CONTENT["odesa"];

export const metadata: Metadata = {
  title: content.meta.title,
  description: content.meta.description,
  keywords: content.meta.keywords,
  alternates: { canonical: `${COMPANY.url}/mista/odesa` },
  openGraph: {
    title: content.meta.title,
    description: content.meta.description,
    url: `${COMPANY.url}/mista/odesa`,
    type: "website",
  },
};

export default function OdesaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Головна", item: COMPANY.url },
          { "@type": "ListItem", position: 2, name: "Міста", item: `${COMPANY.url}/mista` },
          { "@type": "ListItem", position: 3, name: "Одеса", item: `${COMPANY.url}/mista/odesa` },
        ],
      },
      {
        "@type": ["LegalService", "LocalBusiness"],
        "@id": `${COMPANY.url}/mista/odesa#service`,
        name: "LEGAR — військовий адвокат в Одесі",
        description: content.meta.description,
        url: `${COMPANY.url}/mista/odesa`,
        telephone: "+380800357288",
        priceRange: "від 1 200 грн",
        areaServed: [
          { "@type": "City", name: "Одеса" },
          { "@type": "City", name: "Чорноморськ" },
          { "@type": "City", name: "Южне" },
        ],
        address: { "@type": "PostalAddress", addressLocality: "Одеса", addressCountry: "UA" },
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
