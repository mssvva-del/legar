"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const TIKTOK_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;

type ConsentPayload = {
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
};

function getMarketingConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem("legar_cookie_consent_v2");
    const parsed = raw ? (JSON.parse(raw) as ConsentPayload) : null;
    return parsed?.marketing === true;
  } catch {
    return false;
  }
}

/** Tracks Meta Pixel PageView on route changes */
function MetaPixelRouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!getMarketingConsent()) return;
    const w = window as unknown as Record<string, unknown>;
    if (typeof w.fbq === "function") {
      (w.fbq as (...args: unknown[]) => void)("track", "PageView");
    }
  }, [pathname, searchParams]);

  return null;
}

export function MetaPixel() {
  if (!PIXEL_ID) return null;

  return (
    <>
      <Script id="meta-pixel-init" strategy="lazyOnload">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');

          try {
            var stored = JSON.parse(localStorage.getItem('legar_cookie_consent_v2') || 'null');
            if (stored && stored.marketing) {
              fbq('init', '${PIXEL_ID}');
              fbq('track', 'PageView');
            } else {
              // Init without tracking until consent given
              fbq('init', '${PIXEL_ID}');
            }
          } catch(e) {}
        `}
      </Script>

      {/* TikTok Pixel */}
      {TIKTOK_ID && (
        <Script id="tiktok-pixel-init" strategy="lazyOnload">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;
              var ttq=w[t]=w[t]||[];
              ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
              ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
              for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
              ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
              ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src=i+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

              try {
                var s = JSON.parse(localStorage.getItem('legar_cookie_consent_v2') || 'null');
                if (s && s.marketing) {
                  ttq.load('${TIKTOK_ID}');
                  ttq.page();
                }
              } catch(e) {}
            }(window, document, 'ttq');
          `}
        </Script>
      )}

      <Suspense fallback={null}>
        <MetaPixelRouteTracker />
      </Suspense>
    </>
  );
}
