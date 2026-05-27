import type { Metadata } from "next";
import { CITIES_CONTENT } from "@/lib/cities-content";
import { CityPageLayout } from "@/components/cities/CityPageLayout";
import { COMPANY } from "@/lib/constants";

const content = CITIES_CONTENT["dnipro"];

export const metadata: Metadata = {
  title: content.meta.title,
  description: content.meta.description,
  keywords: content.meta.keywords,
  alternates: { canonical: `${COMPANY.url}/mista/dnipro` },
  openGraph: {
    title: content.meta.title,
    description: content.meta.description,
    url: `${COMPANY.url}/mista/dnipro`,
    type: "website",
  },
};

export default function DniproPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Головна", item: COMPANY.url },
          { "@type": "ListItem", position: 2, name: "Міста", item: `${COMPANY.url}/mista` },
          { "@type": "ListItem", position: 3, name: "Дніпро", item: `${COMPANY.url}/mista/dnipro` },
        ],
      },
      {
        "@type": ["LegalService", "LocalBusiness"],
        "@id": `${COMPANY.url}/mista/dnipro#service`,
        name: "LEGAR — військовий адвокат у Дніпрі",
        description: content.meta.description,
        url: `${COMPANY.url}/mista/dnipro`,
        telephone: "+380800357288",
        priceRange: "від 1 200 грн",
        areaServed: [
          { "@type": "City", name: "Дніпро" },
          { "@type": "City", name: "Кам'янське" },
          { "@type": "City", name: "Новомосковськ" },
        ],
        address: { "@type": "PostalAddress", addressLocality: "Дніпро", addressCountry: "UA" },
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
