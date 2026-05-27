import type { Metadata } from "next";
import { CITIES_CONTENT } from "@/lib/cities-content";
import { CityPageLayout } from "@/components/cities/CityPageLayout";
import { COMPANY } from "@/lib/constants";

const content = CITIES_CONTENT["kharkiv"];

export const metadata: Metadata = {
  title: content.meta.title,
  description: content.meta.description,
  keywords: content.meta.keywords,
  alternates: { canonical: `${COMPANY.url}/mista/kharkiv` },
  openGraph: {
    title: content.meta.title,
    description: content.meta.description,
    url: `${COMPANY.url}/mista/kharkiv`,
    type: "website",
  },
};

export default function KharkivPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Головна", item: COMPANY.url },
          { "@type": "ListItem", position: 2, name: "Міста", item: `${COMPANY.url}/mista` },
          { "@type": "ListItem", position: 3, name: "Харків", item: `${COMPANY.url}/mista/kharkiv` },
        ],
      },
      {
        "@type": ["LegalService", "LocalBusiness"],
        "@id": `${COMPANY.url}/mista/kharkiv#service`,
        name: "LEGAR — військовий адвокат у Харкові",
        description: content.meta.description,
        url: `${COMPANY.url}/mista/kharkiv`,
        telephone: "+380800357288",
        priceRange: "від 1 200 грн",
        areaServed: { "@type": "City", name: "Харків" },
        address: { "@type": "PostalAddress", addressLocality: "Харків", addressCountry: "UA" },
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
