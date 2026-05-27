import type { Metadata } from "next";
import { CITIES_CONTENT } from "@/lib/cities-content";
import { CityPageLayout } from "@/components/cities/CityPageLayout";
import { COMPANY } from "@/lib/constants";

const content = CITIES_CONTENT["lviv"];

export const metadata: Metadata = {
  title: content.meta.title,
  description: content.meta.description,
  keywords: content.meta.keywords,
  alternates: { canonical: `${COMPANY.url}/mista/lviv` },
  openGraph: {
    title: content.meta.title,
    description: content.meta.description,
    url: `${COMPANY.url}/mista/lviv`,
    type: "website",
  },
};

export default function LvivPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Головна", item: COMPANY.url },
          { "@type": "ListItem", position: 2, name: "Міста", item: `${COMPANY.url}/mista` },
          { "@type": "ListItem", position: 3, name: "Львів", item: `${COMPANY.url}/mista/lviv` },
        ],
      },
      {
        "@type": ["LegalService", "LocalBusiness"],
        "@id": `${COMPANY.url}/mista/lviv#service`,
        name: "LEGAR — військовий адвокат у Львові",
        description: content.meta.description,
        url: `${COMPANY.url}/mista/lviv`,
        telephone: "+380800357288",
        priceRange: "від 1 200 грн",
        areaServed: [
          { "@type": "City", name: "Львів" },
          { "@type": "City", name: "Винники" },
          { "@type": "City", name: "Трускавець" },
        ],
        address: { "@type": "PostalAddress", addressLocality: "Львів", addressCountry: "UA" },
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
