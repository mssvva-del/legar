"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Lock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { toast.error("Мінімум 8 символів"); return; }
    if (password !== confirm) { toast.error("Паролі не збігаються"); return; }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) { toast.error(error.message); return; }
      setDone(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      toast.error("Помилка. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--color-bg-300)] text-center">
          <CheckCircle2 size={48} className="text-[var(--color-success)] mx-auto mb-4" />
          <h2 className="text-xl font-extrabold text-[var(--color-ink)] mb-2">Пароль змінено!</h2>
          <p className="text-gray-500 text-sm">Перенаправляємо до входу…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--color-bg-300)]">
        <h1 className="text-2xl font-extrabold text-[var(--color-ink)] mb-1">Новий пароль</h1>
        <p className="text-sm text-gray-500 mb-6">Встановіть новий пароль для входу</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">
              Новий пароль (мін. 8 символів)
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-[var(--color-bg-300)] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">
              Повторити пароль
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
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
            {loading ? "Зберігаємо…" : "Зберегти пароль"}
          </button>
        </form>
      </div>
    </div>
  );
}
