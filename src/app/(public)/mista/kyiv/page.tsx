import type { Metadata } from "next";
import { CITIES_CONTENT } from "@/lib/cities-content";
import { CityPageLayout } from "@/components/cities/CityPageLayout";
import { COMPANY } from "@/lib/constants";

const content = CITIES_CONTENT["kyiv"];

export const metadata: Metadata = {
  title: content.meta.title,
  description: content.meta.description,
  keywords: content.meta.keywords,
  alternates: { canonical: `${COMPANY.url}/mista/kyiv` },
  openGraph: {
    title: content.meta.title,
    description: content.meta.description,
    url: `${COMPANY.url}/mista/kyiv`,
    type: "website",
  },
};

export default function KyivPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Головна", item: COMPANY.url },
          { "@type": "ListItem", position: 2, name: "Міста", item: `${COMPANY.url}/mista` },
          { "@type": "ListItem", position: 3, name: "Київ", item: `${COMPANY.url}/mista/kyiv` },
        ],
      },
      {
        "@type": ["LegalService", "LocalBusiness"],
        "@id": `${COMPANY.url}/mista/kyiv#service`,
        name: "LEGAR — військовий адвокат у Києві",
        description: content.meta.description,
        url: `${COMPANY.url}/mista/kyiv`,
        telephone: "+380800357288",
        priceRange: "від 1 200 грн",
        areaServed: [
          { "@type": "City", name: "Київ" },
          { "@type": "City", name: "Бориспіль" },
          { "@type": "City", name: "Бровари" },
          { "@type": "City", name: "Ірпінь" },
        ],
        address: { "@type": "PostalAddress", addressLocality: "Київ", addressCountry: "UA" },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Військово-юридичні послуги у Києві",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI-Діагностика справи" }, price: "1200", priceCurrency: "UAH" },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Антиштраф ТЦК 360°" }, price: "8000", priceCurrency: "UAH" },
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
