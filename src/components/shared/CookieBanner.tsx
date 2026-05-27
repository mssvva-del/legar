"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, ChevronDown, ChevronUp, Cookie, Shield, BarChart3, Megaphone } from "lucide-react";

type ConsentPayload = {
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
};

const STORAGE_KEY = "legar_cookie_consent_v2";

function getStored(): ConsentPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ConsentPayload) : null;
  } catch {
    return null;
  }
}

function pushConsentToGtm(payload: ConsentPayload) {
  if (typeof window === "undefined") return;
  // Google Consent Mode v2
  const w = window as unknown as Record<string, unknown>;
  if (typeof w.gtag === "function") {
    (w.gtag as (...args: unknown[]) => void)(
      "consent",
      "update",
      {
        analytics_storage: payload.analytics ? "granted" : "denied",
        ad_storage: payload.marketing ? "granted" : "denied",
        ad_user_data: payload.marketing ? "granted" : "denied",
        ad_personalization: payload.marketing ? "granted" : "denied",
      }
    );
  }
  // Push to dataLayer for GTM
  const dl = (w.dataLayer ?? []) as unknown[];
  (w.dataLayer as unknown[]) = dl;
  dl.push({
    event: "cookie_consent_updated",
    cookie_consent_analytics: payload.analytics,
    cookie_consent_marketing: payload.marketing,
  });
}

export function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = getStored();
    if (!stored) {
      setVisible(true);
    } else {
      // Re-push existing consent on mount (for SPA navigations)
      pushConsentToGtm(stored);
    }
  }, []);

  function save(analyticsV: boolean, marketingV: boolean) {
    const payload: ConsentPayload = {
      analytics: analyticsV,
      marketing: marketingV,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    pushConsentToGtm(payload);
    setVisible(false);
    setShowModal(false);
  }

  function acceptAll() { save(true, true); }
  function acceptEssential() { save(false, false); }
  function saveCustom() { save(analytics, marketing); }

  if (!mounted || !visible) return null;

  return (
    <>
      {/* ── MAIN BANNER ── */}
      {!showModal && (
        <div
          role="region"
          aria-label="Налаштування cookies"
          className="fixed inset-x-0 bottom-0 z-[60] bg-[var(--color-ink)] text-white shadow-[0_-12px_32px_rgba(10,15,31,0.3)]"
        >
          <div className="container-legar py-5 md:py-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              <div className="flex items-start gap-3 flex-1">
                <Cookie size={18} className="flex-shrink-0 mt-0.5 text-[var(--color-accent)]" />
                <p className="text-sm leading-relaxed text-white/85">
                  <span className="font-semibold text-white">Ми використовуємо cookies </span>
                  для коректної роботи сайту, аналітики та персоналізації реклами.{" "}
                  <Link
                    href="/legal/cookies"
                    className="underline underline-offset-2 hover:text-[var(--color-accent)] transition-colors"
                  >
                    Дізнатись більше
                  </Link>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 md:flex-nowrap md:flex-shrink-0">
                <button
                  type="button"
                  onClick={acceptEssential}
                  className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  Лише необхідні
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="rounded-xl border border-white/30 px-4 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  Налаштувати
                </button>
                <button
                  type="button"
                  onClick={acceptAll}
                  className="rounded-xl bg-[var(--color-accent)] px-5 py-2.5 text-sm font-bold text-[var(--color-ink)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Прийняти все
                </button>
                <button
                  type="button"
                  onClick={acceptEssential}
                  aria-label="Закрити банер"
                  className="ml-1 hidden rounded-full p-2 text-white/40 transition-colors hover:bg-white/10 hover:text-white md:inline-flex"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SETTINGS MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-bg-300)]">
              <div className="flex items-center gap-2">
                <Cookie size={18} className="text-[var(--color-primary)]" />
                <h2 className="font-extrabold text-[var(--color-ink)]">Налаштування cookies</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                aria-label="Закрити"
                className="p-2 rounded-xl text-gray-400 hover:bg-[var(--color-bg-200)] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-gray-500 leading-relaxed">
                Оберіть, які cookie-файли ви дозволяєте. Необхідні завжди активні, бо без них сайт не може працювати.
              </p>

              {/* Essential — always on */}
              <div className="flex items-start gap-4 p-4 bg-[var(--color-bg-200)] rounded-xl">
                <Shield size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm text-[var(--color-ink)]">Необхідні</p>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Завжди увімк.</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Сесія, авторизація, CSRF-захист. Без них сайт не функціонує.
                  </p>
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-start gap-4 p-4 border border-[var(--color-bg-300)] rounded-xl">
                <BarChart3 size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm text-[var(--color-ink)]">Аналітика</p>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={analytics}
                        onChange={(e) => setAnalytics(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Google Analytics 4 — розуміємо, як відвідувачі використовують сайт (анонімно).
                  </p>
                </div>
              </div>

              {/* Marketing */}
              <div className="flex items-start gap-4 p-4 border border-[var(--color-bg-300)] rounded-xl">
                <Megaphone size={18} className="text-orange-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm text-[var(--color-ink)]">Маркетинг</p>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={marketing}
                        onChange={(e) => setMarketing(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Meta Pixel, TikTok Pixel — персоналізована реклама на соцмережах.
                  </p>
                </div>
              </div>

              {/* Details toggle */}
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showDetails ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                {showDetails ? "Приховати деталі" : "Детальна інформація"}
              </button>

              {showDetails && (
                <div className="text-xs text-gray-500 space-y-2 leading-relaxed bg-[var(--color-bg-200)] p-4 rounded-xl">
                  <p><strong>Необхідні:</strong> supabase-auth-token, __Host-LEGAR-session, CSRF (1 рік)</p>
                  <p><strong>Аналітика:</strong> _ga, _ga_XXXXXX (Google Analytics 4, 2 роки)</p>
                  <p><strong>Маркетинг:</strong> _fbp (Meta Pixel, 3 міс.), ttclid (TikTok Pixel, 1 рік)</p>
                  <p>
                    Детальніше:{" "}
                    <Link href="/legal/cookies" className="underline hover:text-[var(--color-primary)]">
                      Політика cookies
                    </Link>{" "}
                    та{" "}
                    <Link href="/legal/pryvatnist" className="underline hover:text-[var(--color-primary)]">
                      Політика конфіденційності
                    </Link>
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[var(--color-bg-300)] flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={acceptEssential}
                className="flex-1 py-2.5 rounded-xl border border-[var(--color-bg-300)] text-sm font-semibold text-gray-600 hover:bg-[var(--color-bg-200)] transition-colors"
              >
                Лише необхідні
              </button>
              <button
                type="button"
                onClick={saveCustom}
                className="flex-1 py-2.5 rounded-xl bg-[var(--color-ink)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Зберегти вибір
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="flex-1 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-bold hover:opacity-90 transition-opacity"
              >
                Прийняти все
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
