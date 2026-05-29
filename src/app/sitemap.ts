import type { MetadataRoute } from "next";
import {
  COMPANY,
  SERVICES,
  CITIES,
  COMPANY_PAGES,
  LEGAL_PAGES,
} from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || COMPANY.url;
  const now = new Date();

  const root = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly" as const, priority: 1 },
    { url: `${base}/poslugy`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${base}/mista`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
  ];

  const company = COMPANY_PAGES.map((p) => ({
    url: `${base}/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const services = SERVICES.map((s) => ({
    url: `${base}/poslugy/${s.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const cities = CITIES.map((c) => ({
    url: `${base}/mista/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const legal = LEGAL_PAGES.map((p) => ({
    url: `${base}/legal/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.3,
  }));

  return [...root, ...company, ...services, ...cities, ...legal];
}
