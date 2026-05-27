"use client";

import Script from "next/script";
import { useEffect } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA4_ID;

type ConsentPayload = {
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
};

function getConsent(): ConsentPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("legar_cookie_consent_v2");
    return raw ? (JSON.parse(raw) as ConsentPayload) : null;
  } catch {
    return null;
  }
}

export function GoogleAnalytics() {
  useEffect(() => {
    // Update consent after banner sets it
    const handler = () => {
      const consent = getConsent();
      if (!consent) return;
      const w = window as unknown as Record<string, unknown>;
      if (typeof w.gtag === "function") {
        (w.gtag as (...args: unknown[]) => void)(
          "consent",
          "update",
          {
            analytics_storage: consent.analytics ? "granted" : "denied",
            ad_storage: consent.marketing ? "granted" : "denied",
            ad_user_data: consent.marketing ? "granted" : "denied",
            ad_personalization: consent.marketing ? "granted" : "denied",
          }
        );
      }
    };

    window.addEventListener("cookie_consent_updated" as keyof WindowEventMap, handler);
    return () => window.removeEventListener("cookie_consent_updated" as keyof WindowEventMap, handler);
  }, []);

  if (!GA_ID) return null;

  return (
    <>
      {/* Google tag (gtag.js) with Consent Mode v2 defaults */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          // Consent Mode v2 — default denied until user accepts
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500
          });

          // Apply stored consent immediately if available
          try {
            var stored = JSON.parse(localStorage.getItem('legar_cookie_consent_v2') || 'null');
            if (stored) {
              gtag('consent', 'update', {
                analytics_storage: stored.analytics ? 'granted' : 'denied',
                ad_storage: stored.marketing ? 'granted' : 'denied',
                ad_user_data: stored.marketing ? 'granted' : 'denied',
                ad_personalization: stored.marketing ? 'granted' : 'denied'
              });
            }
          } catch(e) {}

          gtag('config', '${GA_ID}', {
            send_page_view: true,
            anonymize_ip: true
          });
        `}
      </Script>
    </>
  );
}
