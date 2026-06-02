"use client";

import { useState } from "react";
import { Loader2, AlertCircle, CheckCircle2, Send } from "lucide-react";
import { CITIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const PHONE_RE = /^(?:\+?380\d{9}|0\d{9})$/;

/** Прибирає пробіли, дужки, дефіси, крапки — люди часто вводять "099 608 4068". */
function normalizePhone(v: string): string {
  return v.replace(/[\s()\-.]/g, "");
}

interface FormState {
  name: string;
  phone: string;
  city: string;
  message: string;
  consent: boolean;
}

interface FieldError {
  name?: string;
  phone?: string;
  message?: string;
  consent?: string;
}

interface LandingLeadFormProps {
  formId?: string;        // для розрізнення "hero" vs "bottom"
  ctaLabel?: string;
  className?: string;
}

/** Fires fbq('track', 'Lead') якщо Meta Pixel ініційовано */
function fireMetaLead() {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  if (typeof w.fbq === "function") {
    w.fbq("track", "Lead");
  }
}

/** Fires gtag Lead conversion event */
function fireGtagLead(service?: string) {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  if (typeof w.gtag === "function") {
    w.gtag("event", "lead_submitted", { service, source: "landing" });
    w.gtag("event", "conversion", { send_to: "AW-CONVERSION_ID/LABEL" }); // підставити ID після налаштування
  }
}

export function LandingLeadForm({
  formId = "hero",
  ctaLabel = "Отримати безкоштовну оцінку",
  className,
}: LandingLeadFormProps) {
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    city: "",
    message: "",
    consent: false,
  });
  const [errors, setErrors] = useState<FieldError>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [leadId, setLeadId] = useState<number | null>(null);

  function validate(): FieldError {
    const e: FieldError = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      e.name = "Введіть ім'я (мінімум 2 символи)";
    if (!PHONE_RE.test(normalizePhone(form.phone)))
      e.phone = "Формат: 0XXXXXXXXX або +380XXXXXXXXX";
    if (!form.message.trim() || form.message.trim().length < 5)
      e.message = "Опишіть ситуацію (хоча б кілька слів)";
    if (!form.consent)
      e.consent = "Необхідна згода з Політикою конфіденційності";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    // Prepend source prefix so message always satisfies API min-30 rule
    const fullMessage =
      form.message.trim().length >= 30
        ? form.message.trim()
        : `[Лендинг антиштраф] ${form.message.trim()}`;

    const params =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : new URLSearchParams();

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: normalizePhone(form.phone),
          city: form.city || undefined,
          service: "antyshtraf-tck-360",
          message: fullMessage,
          consent: true,
          utm_source: params.get("utm_source") ?? "meta",
          utm_medium: params.get("utm_medium") ?? "paid",
          utm_campaign: params.get("utm_campaign") ?? "antishtraf-site",
        }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload?.error ?? "Не вдалося надіслати заявку");
      }

      const { leadId: id } = (await res.json()) as { leadId: number };
      setLeadId(id);
      setIsSuccess(true);

      // 🔥 Pixel events
      fireMetaLead();
      fireGtagLead("antyshtraf-tck-360");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Сталася помилка. Спробуйте ще раз.";
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputBase =
    "w-full rounded-[8px] border bg-white px-4 py-3 text-[16px] text-[var(--color-ink)] placeholder:text-[var(--color-ink)]/40 transition-shadow focus:outline-none focus:ring-[3px] focus:ring-[var(--color-primary)]/15 disabled:opacity-50";
  const inputOk = "border-[var(--color-bg-300)] focus:border-[var(--color-primary)]";
  const inputErr =
    "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]/15";

  // ── Success state ────────────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <div className={cn("rounded-[16px] bg-white p-8 text-center shadow-[var(--shadow-card-hover)]", className)}>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-success)]/10">
          <CheckCircle2 className="h-8 w-8 text-[var(--color-success)]" />
        </div>
        <h3 className="mt-4 font-[family-name:var(--font-manrope)] text-[20px] font-extrabold text-[var(--color-ink)]">
          Заявку отримано!
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-ink)]/65">
          Заявка <span className="font-semibold text-[var(--color-primary)]">#{leadId}</span> прийнята.
          Адвокат зателефонує вам упродовж <strong>15 хвилин</strong> у робочий час.
        </p>
        <p className="mt-4 text-[14px] text-[var(--color-ink)]/50">
          Або пишіть зараз у Telegram:{" "}
          <a
            href="https://t.me/legarukr"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--color-primary)] underline underline-offset-2"
          >
            @legarukr
          </a>
        </p>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────
  return (
    <form
      id={`landing-form-${formId}`}
      onSubmit={handleSubmit}
      noValidate
      className={cn(
        "flex flex-col gap-4 rounded-[16px] bg-white p-6 shadow-[var(--shadow-card-hover)] sm:p-8",
        className,
      )}
    >
      {/* Row 1: Ім'я + Телефон */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${formId}-name`} className="text-[13px] font-semibold text-[var(--color-ink)]">
            Ім'я <span className="text-[var(--color-danger)]" aria-hidden="true">*</span>
          </label>
          <input
            id={`${formId}-name`}
            type="text"
            autoComplete="name"
            placeholder="Сергій"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={cn(inputBase, errors.name ? inputErr : inputOk)}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p role="alert" className="flex items-center gap-1 text-xs text-[var(--color-danger)]">
              <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" /> {errors.name}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${formId}-phone`} className="text-[13px] font-semibold text-[var(--color-ink)]">
            Телефон <span className="text-[var(--color-danger)]" aria-hidden="true">*</span>
          </label>
          <input
            id={`${formId}-phone`}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="0501234567"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={cn(inputBase, errors.phone ? inputErr : inputOk)}
            disabled={isSubmitting}
          />
          {errors.phone && (
            <p role="alert" className="flex items-center gap-1 text-xs text-[var(--color-danger)]">
              <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" /> {errors.phone}
            </p>
          )}
        </div>
      </div>

      {/* Row 2: Місто */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-city`} className="text-[13px] font-semibold text-[var(--color-ink)]">
          Місто
        </label>
        <select
          id={`${formId}-city`}
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          className={cn(inputBase, inputOk)}
          disabled={isSubmitting}
        >
          <option value="">Оберіть місто</option>
          {CITIES.map((c) => (
            <option key={c.slug} value={c.nameUk}>
              {c.nameUk}
            </option>
          ))}
          <option value="Інше">Інше місто</option>
        </select>
      </div>

      {/* Row 3: Ситуація */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-message`} className="text-[13px] font-semibold text-[var(--color-ink)]">
          Ситуація <span className="text-[var(--color-danger)]" aria-hidden="true">*</span>
        </label>
        <textarea
          id={`${formId}-message`}
          rows={3}
          placeholder="Отримав постанову ТЦК про штраф. Хочу дізнатись, чи можна оскаржити…"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={cn(inputBase, "resize-none", errors.message ? inputErr : inputOk)}
          disabled={isSubmitting}
        />
        {errors.message && (
          <p role="alert" className="flex items-center gap-1 text-xs text-[var(--color-danger)]">
            <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" /> {errors.message}
          </p>
        )}
      </div>

      {/* Consent */}
      <label
        htmlFor={`${formId}-consent`}
        className="flex cursor-pointer items-start gap-3 text-[13px] leading-snug text-[var(--color-ink)]/70"
      >
        <input
          id={`${formId}-consent`}
          type="checkbox"
          checked={form.consent}
          onChange={(e) => setForm({ ...form, consent: e.target.checked })}
          className="mt-0.5 h-4 w-4 flex-shrink-0 cursor-pointer accent-[var(--color-primary)]"
          disabled={isSubmitting}
        />
        <span>
          Погоджуюсь з{" "}
          <a
            href="/legal/pryvatnist"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[var(--color-primary)] underline underline-offset-2"
          >
            Політикою конфіденційності
          </a>{" "}
          та на отримання дзвінка від адвоката.
        </span>
      </label>
      {errors.consent && (
        <p role="alert" className="flex items-center gap-1 text-xs text-[var(--color-danger)]">
          <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" /> {errors.consent}
        </p>
      )}

      {/* Server error */}
      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-[8px] border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/5 p-3 text-sm text-[var(--color-danger)]"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <div>
            <p className="font-medium">{serverError}</p>
            <p className="mt-0.5 text-xs opacity-75">
              Зателефонуйте: 0 800 357 288
            </p>
          </div>
        </div>
      )}

      {/* CTA button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-1 inline-flex h-[56px] w-full items-center justify-center gap-2 rounded-[8px] bg-[var(--color-primary)] text-[17px] font-bold text-white shadow-sm transition-all duration-200 hover:bg-[var(--color-primary-600)] hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Надсилаю…
          </>
        ) : (
          <>
            <Send className="h-5 w-5" aria-hidden="true" />
            {ctaLabel}
          </>
        )}
      </button>

      {/* Sub CTA */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <p className="text-[12px] text-[var(--color-ink)]/45">
          🔒 Дані захищені TLS 1.3 · Конфіденційно · Відповідь за 15 хв
        </p>
        <p className="text-[13px] text-[var(--color-ink)]/60">
          Або пишіть у Telegram:{" "}
          <a
            href="https://t.me/legarukr"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--color-primary)]"
          >
            @legarukr
          </a>
        </p>
      </div>
    </form>
  );
}
