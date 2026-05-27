"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) { toast.error(error.message); return; }
      setSent(true);
    } catch {
      toast.error("Помилка. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--color-bg-300)] text-center">
          <CheckCircle2 size={48} className="text-[var(--color-success)] mx-auto mb-4" />
          <h2 className="text-xl font-extrabold text-[var(--color-ink)] mb-2">Лист надіслано</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Перевірте пошту <strong>{email}</strong> та перейдіть за посиланням для скидання пароля.
          </p>
          <Link
            href="/login"
            className="mt-6 block w-full text-center bg-[var(--color-primary)] text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity text-sm"
          >
            До входу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--color-bg-300)]">
        <h1 className="text-2xl font-extrabold text-[var(--color-ink)] mb-1">Скидання пароля</h1>
        <p className="text-sm text-gray-500 mb-6">
          Введіть email — надішлемо посилання для встановлення нового пароля.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full border border-[var(--color-bg-300)] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--color-primary)] text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 text-sm"
          >
            {loading ? "Надсилаємо…" : "Скинути пароль"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          <Link href="/login" className="text-[var(--color-primary)] font-semibold hover:underline">
            ← Назад до входу
          </Link>
        </p>
      </div>
    </div>
  );
}
