"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { leadFormSchema, type LeadFormValues } from "@/lib/validations";
import { CITIES, SERVICES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

interface LeadFormProps {
  variant?: "compact" | "full";
  defaultService?: string;
  source?: string;
  onSuccess?: (leadId: number) => void;
  className?: string;
}

export function LeadForm({
  variant = "full",
  defaultService,
  source = "form",
  onSuccess,
  className,
}: LeadFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      city: "",
      service: defaultService ?? "",
      message: "",
      consent: undefined as unknown as true,
    },
  });

  const onSubmit = async (data: LeadFormValues) => {
    setServerError(null);

    // Збираємо UTM з URL — пасивно, не блокує submit якщо їх нема.
    const params =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : new URLSearchParams();

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          utm_source: params.get("utm_source") ?? undefined,
          utm_medium: params.get("utm_medium") ?? undefined,
          utm_campaign: params.get("utm_campaign") ?? undefined,
        }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload?.error ?? "Не вдалося надіслати заявку");
      }

      const { leadId } = (await res.json()) as { leadId: number };

      trackEvent({
        name: "lead_submitted",
        service: data.service,
        city: data.city,
      });

      toast.success(`Дякуємо! Заявка №${leadId}`, {
        description:
          "Менеджер зателефонує впродовж 15 хвилин. У робочий час — швидше.",
        icon: <CheckCircle2 className="h-5 w-5 text-[var(--color-success)]" />,
      });
      reset();
      onSuccess?.(leadId);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Сталася помилка. Спробуйте ще раз.";
      setServerError(message);
      toast.error("Помилка надсилання", { description: message });
    }
  };

  const inputBase =
    "w-full rounded-[8px] border bg-white px-4 py-3 text-[16px] text-[var(--color-ink)] placeholder:text-[var(--color-ink)]/40 transition-shadow focus:outline-none focus:ring-[3px] focus:ring-[var(--color-primary)]/15 disabled:opacity-50";
  const inputDefault = "border-[var(--color-bg-300)] focus:border-[var(--color-primary)]";
  const inputError =
    "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]/15";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className={cn(
        "flex flex-col gap-4",
        variant === "compact" && "gap-3",
        className,
      )}
      aria-label="Форма заявки на консультацію"
    >
      {/* Name */}
      <Field
        label="Ім'я"
        error={errors.name?.message}
        htmlFor="lead-name"
        required
      >
        <input
          {...register("name")}
          id="lead-name"
          type="text"
          autoComplete="name"
          placeholder="Сергій"
          className={cn(inputBase, errors.name ? inputError : inputDefault)}
          disabled={isSubmitting}
        />
      </Field>

      {/* Phone */}
      <Field
        label="Телефон"
        error={errors.phone?.message}
        htmlFor="lead-phone"
        required
      >
        <input
          {...register("phone")}
          id="lead-phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="0501234567 або +380501234567"
          className={cn(inputBase, errors.phone ? inputError : inputDefault)}
          disabled={isSubmitting}
        />
      </Field>

      {variant === "full" && (
        <>
          {/* Email */}
          <Field
            label="E-mail"
            hint="опційно — для письмових відповідей та документів"
            error={errors.email?.message}
            htmlFor="lead-email"
          >
            <input
              {...register("email")}
              id="lead-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={cn(inputBase, errors.email ? inputError : inputDefault)}
              disabled={isSubmitting}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* City */}
            <Field
              label="Місто"
              error={errors.city?.message}
              htmlFor="lead-city"
            >
              <select
                {...register("city")}
                id="lead-city"
                className={cn(inputBase, errors.city ? inputError : inputDefault)}
                disabled={isSubmitting}
              >
                <option value="">Оберіть місто</option>
                {CITIES.map((c) => (
                  <option key={c.slug} value={c.nameUk}>
                    {c.nameUk}
                  </option>
                ))}
                <option value="Інше">Інше</option>
              </select>
            </Field>

            {/* Service */}
            <Field
              label="Послуга"
              error={errors.service?.message}
              htmlFor="lead-service"
            >
              <select
                {...register("service")}
                id="lead-service"
                className={cn(inputBase, errors.service ? inputError : inputDefault)}
                disabled={isSubmitting}
              >
                <option value="">Не визначився</option>
                {SERVICES.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.shortTitle}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </>
      )}

      {/* Message */}
      <Field
        label="Коротко про вашу ситуацію"
        error={errors.message?.message}
        htmlFor="lead-message"
        required
      >
        <textarea
          {...register("message")}
          id="lead-message"
          rows={variant === "compact" ? 3 : 5}
          placeholder="Опишіть, що сталося і в чому потрібна допомога. Чим більше деталей — тим точніша рекомендація."
          className={cn(
            inputBase,
            "resize-y",
            errors.message ? inputError : inputDefault,
          )}
          disabled={isSubmitting}
        />
      </Field>

      {/* Consent */}
      <label
        htmlFor="lead-consent"
        className="flex cursor-pointer items-start gap-3 text-sm text-[var(--color-ink)]/75"
      >
        <input
          {...register("consent")}
          id="lead-consent"
          type="checkbox"
          className="mt-1 h-4 w-4 flex-shrink-0 cursor-pointer accent-[var(--color-primary)]"
          disabled={isSubmitting}
        />
        <span>
          Я погоджуюсь з{" "}
          <a
            href="/legal/pryvatnist"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[var(--color-primary)] underline underline-offset-2"
          >
            Політикою конфіденційності
          </a>{" "}
          та{" "}
          <a
            href="/legal/oferta"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[var(--color-primary)] underline underline-offset-2"
          >
            Договором публічної оферти
          </a>
          .
        </span>
      </label>
      {errors.consent && (
        <p
          role="alert"
          className="flex items-center gap-1.5 text-sm text-[var(--color-danger)]"
        >
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          {errors.consent.message}
        </p>
      )}

      {/* Server error */}
      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-[8px] border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/5 p-3 text-sm text-[var(--color-danger)]"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
          <div>
            <p className="font-medium">{serverError}</p>
            <p className="mt-1 text-xs opacity-80">
              Якщо помилка повторюється — зателефонуйте 0 800 357 288.
            </p>
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || isSubmitSuccessful}
        data-source={source}
        className="mt-1 inline-flex h-[52px] items-center justify-center gap-2 rounded-[8px] bg-[var(--color-primary)] px-6 text-[16px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[var(--color-primary-600)] hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            Надсилаю…
          </>
        ) : (
          "Залишити заявку"
        )}
      </button>

      <p className="text-center text-xs text-[var(--color-ink)]/55">
        Відповідь упродовж 15 хвилин у робочий час. Дані захищені TLS 1.3.
      </p>
    </form>
  );
}

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ label, htmlFor, error, hint, required, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-sm font-semibold text-[var(--color-ink)]"
      >
        {label}
        {required && (
          <span className="ml-0.5 text-[var(--color-danger)]" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p
          role="alert"
          className="flex items-center gap-1 text-xs text-[var(--color-danger)]"
        >
          <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-[var(--color-ink)]/55">{hint}</p>
      ) : null}
    </div>
  );
}
