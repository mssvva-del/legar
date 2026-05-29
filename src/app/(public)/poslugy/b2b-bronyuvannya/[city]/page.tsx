import type { Metadata } from "next";
import { cityParamsForService } from "@/lib/service-city-content";
import { ServiceCityView, buildServiceCityMetadata } from "@/components/service-city/ServiceCityView";

const SERVICE = "b2b-bronyuvannya";

interface PageProps {
  params: Promise<{ city: string }>;
}

export function generateStaticParams() {
  return cityParamsForService();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params;
  return buildServiceCityMetadata(SERVICE, city);
}

export default async function Page({ params }: PageProps) {
  const { city } = await params;
  return <ServiceCityView serviceSlug={SERVICE} citySlug={city} />;
}
