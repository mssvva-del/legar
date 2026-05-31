import type { Metadata, Viewport } from "next";
import { Manrope, Inter } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";
import { CookieBanner } from "@/components/shared/CookieBanner";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import { COMPANY, CONTACTS } from "@/lib/constants";
import "./globals.css";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

const manrope = Manrope({
  variable: "--font-manrope-var",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter-var",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || COMPANY.url;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "LEGAR — Юридичний щит. Адвокати НААУ 24/7",
    template: "%s | LEGAR",
  },
  description:
    "LEGAR — інформаційно-консультаційна платформа військово-правового захисту. ТЦК, ВЛК, СЗЧ, бронювання. Гаряча лінія 0 800 357 288. Адвокати-партнери НААУ.",
  keywords: [
    "військовий адвокат",
    "ТЦК",
    "ВЛК",
    "СЗЧ",
    "бронювання",
    "юрист онлайн",
    "AI юрист",
    "оскарження ВЛК",
    "штраф ТЦК",
    "стаття 407",
    "мобілізація",
    "відстрочка",
    "юридична консультація",
    "АІ-діагностика",
    "LEGAR",
  ],
  authors: [{ name: "LEGAR", url: SITE_URL }],
  creator: COMPANY.legalName,
  publisher: COMPANY.legalName,
  applicationName: "LEGAR",
  category: "legal",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: SITE_URL,
    siteName: "LEGAR",
    title: "LEGAR — Юридичний щит. Адвокати НААУ 24/7",
    description:
      "Перша цифрова військово-правова платформа України. AI-діагностика, прозорі ціни, гаряча лінія 24/7.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "LEGAR — Юридичний щит",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LEGAR — Юридичний щит",
    description:
      "Перша цифрова військово-правова платформа України. AI-діагностика, адвокати НААУ, гаряча лінія 24/7.",
    images: ["/og-image.svg"],
    site: "@legarukr",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "telegram:channel": CONTACTS.telegramHandle,
    language: "uk",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1B4DFF",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="uk"
      className={`${manrope.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        {GTM_ID && (
          <Script id="gtm-head" strategy="beforeInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}
      </head>
      <body className="min-h-full flex flex-col bg-white text-[var(--color-ink)] font-sans">
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {children}
        <Toaster
          position="top-center"
          richColors
          closeButton
          toastOptions={{
            style: {
              fontFamily: "var(--font-inter)",
              borderRadius: "12px",
            },
          }}
        />
        <CookieBanner />
        <GoogleAnalytics />
        <MetaPixel />
      </body>
    </html>
  );
}
