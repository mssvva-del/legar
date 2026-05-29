import { SERVICES } from "@/lib/constants";
import type { ServiceContent } from "@/lib/services-content";
import { ServiceBreadcrumbs } from "./ServiceBreadcrumbs";
import { ServiceHero } from "./ServiceHero";
import { ForWhomSection } from "./ForWhomSection";
import { ProblemSection } from "./ProblemSection";
import { SolutionSection } from "./SolutionSection";
import { WhatsIncludedList } from "./WhatsIncludedList";
import { HowItWorksSteps } from "./HowItWorksSteps";
import { PricingBlock } from "./PricingBlock";
import { TimingBlock } from "./TimingBlock";
import { CasesGrid } from "./CasesGrid";
import { ServiceFAQ } from "./ServiceFAQ";
import { RelatedServices } from "./RelatedServices";
import { ServiceRelatedArticles } from "./ServiceRelatedArticles";
import { ServiceFinalCTA } from "./ServiceFinalCTA";

interface ServicePageLayoutProps {
  content: ServiceContent;
}

export function ServicePageLayout({ content }: ServicePageLayoutProps) {
  const service = SERVICES.find((s) => s.slug === content.slug);
  const priceLabel = service?.priceLabel ?? content.pricing.mainPrice;
  const serviceName = service?.shortTitle ?? content.slug;

  return (
    <>
      {/* Breadcrumbs */}
      <div className="container-legar">
        <ServiceBreadcrumbs
          crumbs={[
            { label: "Послуги", href: "/poslugy" },
            { label: serviceName },
          ]}
        />
      </div>

      {/* Hero */}
      <ServiceHero hero={content.hero} priceLabel={priceLabel} slug={content.slug} />

      {/* For whom */}
      <ForWhomSection scenarios={content.forWhom} />

      {/* Problem */}
      <ProblemSection problem={content.problem} />

      {/* Solution */}
      <SolutionSection solution={content.solution} />

      {/* What's included */}
      <WhatsIncludedList items={content.whatsIncluded} />

      {/* How it works */}
      <HowItWorksSteps steps={content.howItWorks} />

      {/* Pricing */}
      <PricingBlock pricing={content.pricing} slug={content.slug} />

      {/* Timing */}
      <TimingBlock timing={content.timing} />

      {/* Cases */}
      <CasesGrid cases={content.cases} />

      {/* FAQ */}
      <ServiceFAQ items={content.faq} />

      {/* Extra disclaimer */}
      {content.extraDisclaimer && (
        <div className="container-legar py-6">
          <p className="rounded-[8px] border border-[var(--color-warning)]/30 bg-[var(--color-warning)]/5 px-5 py-4 text-[13px] text-[var(--color-ink)]/65">
            ⚠️ {content.extraDisclaimer}
          </p>
        </div>
      )}

      {/* Related blog articles */}
      <ServiceRelatedArticles serviceSlug={content.slug} />

      {/* Related services */}
      <RelatedServices slugs={content.relatedServices} />

      {/* Final CTA */}
      <ServiceFinalCTA
        serviceName={serviceName}
        ctaLabel={content.hero.ctaLabel}
        slug={content.slug}
      />
    </>
  );
}
