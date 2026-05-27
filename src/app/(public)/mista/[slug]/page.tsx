import { notFound } from "next/navigation";

/**
 * Fallback-маршрут для міст без окремого статичного page.tsx.
 * Усі 5 основних міст (kyiv, lviv, dnipro, kharkiv, odesa)
 * обслуговуються статичними сторінками у /mista/<slug>/page.tsx.
 * generateStaticParams повертає [] — не конфліктує з ними.
 */

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return [];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function CityFallbackPage(_props: PageProps) {
  notFound();
}
