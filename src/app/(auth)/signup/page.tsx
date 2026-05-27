"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, User, Phone, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { CITIES } from "@/lib/constants";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    city: "",
    password: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (form.full_name.trim().length < 3) e.full_name = "Вкажіть ім'я";
    if (!form.email.includes("@")) e.email = "Невірний email";
    if (!/^(?:\+?380\d{9}|0\d{9})$/.test(form.phone)) e.phone = "Формат: 0XXXXXXXXX";
    if (form.password.length < 8) e.password = "Мінімум 8 символів";
    if (!form.consent) e.consent = "Необхідна згода";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.full_name, phone: form.phone, city: form.city },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/cabinet`,
        },
      });
      if (error) { toast.error(error.message); return; }
      setDone(true);
    } catch {
      toast.error("Помилка реєстрації. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--color-bg-300)] text-center">
          <CheckCircle2 size={48} className="text-[var(--color-success)] mx-auto mb-4" />
          <h2 className="text-xl font-extrabold text-[var(--color-ink)] mb-2">
            Підтвердьте email
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Ми надіслали листа на <strong>{form.email}</strong>.
            Перейдіть за посиланням у листі, щоб активувати акаунт.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="mt-6 w-full bg-[var(--color-primary)] text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity text-sm"
          >
            До сторінки входу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--color-bg-300)]">
        <h1 className="text-2xl font-extrabold text-[var(--color-ink)] mb-1">Реєстрація</h1>
        <p className="text-sm text-gray-500 mb-6">Створіть акаунт LEGAR</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">Ім'я *</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="Іван Петренко"
                className="w-full border border-[var(--color-bg-300)] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
            {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">Email *</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full border border-[var(--color-bg-300)] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">Телефон *</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="0XXXXXXXXX"
                className="w-full border border-[var(--color-bg-300)] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">Місто</label>
            <select
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full border border-[var(--color-bg-300)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
            >
              <option value="">Оберіть місто</option>
              {CITIES.map((c) => (
                <option key={c.slug} value={c.nameUk}>{c.nameUk}</option>
              ))}
              <option value="Інше">Інше</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">
              Пароль * (мін. 8 символів)
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full border border-[var(--color-bg-300)] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Consent */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="signup-consent"
              checked={form.consent}
              onChange={(e) => setForm({ ...form, consent: e.target.checked })}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-[var(--color-primary)]"
            />
            <label htmlFor="signup-consent" className="text-xs text-gray-500 leading-relaxed">
              Погоджуюсь з{" "}
              <Link href="/legal/oferta" className="text-[var(--color-primary)] hover:underline">
                Офертою
              </Link>
              ,{" "}
              <Link href="/legal/pryvatnist" className="text-[var(--color-primary)] hover:underline">
                Політикою конфіденційності
              </Link>{" "}
              та{" "}
              <Link href="/legal/zgoda-pd" className="text-[var(--color-primary)] hover:underline">
                Згодою на обробку ПД
              </Link>
            </label>
          </div>
          {errors.consent && <p className="text-red-500 text-xs">{errors.consent}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--color-primary)] text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 text-sm"
          >
            {loading ? "Реєструємо…" : "Створити акаунт"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Вже є акаунт?{" "}
          <Link href="/login" className="text-[var(--color-primary)] font-semibold hover:underline">
            Увійти
          </Link>
        </p>
      </div>
    </div>
  );
}
