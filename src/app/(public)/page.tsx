import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { ProblemSection } from "@/components/home/ProblemSection";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhyLegar } from "@/components/home/WhyLegar";
import { B2BTeaser } from "@/components/home/B2BTeaser";
import { CasesCarousel } from "@/components/home/CasesCarousel";
import { FAQ } from "@/components/home/FAQ";
import { FinalCTA } from "@/components/home/FinalCTA";
import { COMPANY, CONTACTS, SERVICES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "LEGAR — Юридичний щит. Адвокати НААУ 24/7",
  description:
    "Перша цифрова військово-правова платформа України. ТЦК, ВЛК, СЗЧ, бронювання. AI-діагностика за 5 хв. Гаряча лінія 0 800 357 288. Адвокати-партнери НААУ.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: COMPANY.name,
    description: COMPANY.description,
    url: COMPANY.url,
    telephone: CONTACTS.phoneFormatted,
    email: CONTACTS.email,
    areaServed: "UA",
    sameAs: [
      CONTACTS.telegram,
      CONTACTS.instagram,
      CONTACTS.youtube,
      CONTACTS.facebook,
      CONTACTS.tiktok,
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Послуги LEGAR",
      itemListElement: SERVICES.map((s, i) => ({
        "@type": "Offer",
        position: i + 1,
        name: s.title,
        description: s.description,
        priceCurrency: "UAH",
        price: s.priceUah,
        url: `${COMPANY.url}/poslugy/${s.slug}`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <Hero />
      <TrustBar />
      <ProblemSection />
      <ServicesGrid />
      <HowItWorks />
      <WhyLegar />
      <B2BTeaser />
      <CasesCarousel />
      <FAQ />
      <FinalCTA />
    </>
  );
}
