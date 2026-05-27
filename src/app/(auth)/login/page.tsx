"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, LogIn, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message === "Invalid login credentials"
          ? "Невірний email або пароль"
          : error.message);
        return;
      }
      router.push("/cabinet");
      router.refresh();
    } catch {
      toast.error("Помилка входу. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/cabinet`,
        },
      });
      if (error) { toast.error(error.message); return; }
      setMagicSent(true);
    } catch {
      toast.error("Помилка. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  }

  if (magicSent) {
    return (
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--color-bg-300)] text-center">
          <Mail size={48} className="text-[var(--color-primary)] mx-auto mb-4" />
          <h2 className="text-xl font-extrabold text-[var(--color-ink)] mb-2">
            Перевірте пошту
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Ми надіслали посилання для входу на <strong>{email}</strong>.
            Посилання дійсне 15 хвилин.
          </p>
          <button
            onClick={() => { setMagicSent(false); setMode("password"); }}
            className="mt-6 text-sm text-[var(--color-primary)] hover:underline"
          >
            Спробувати інакше
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--color-bg-300)]">
        <h1 className="text-2xl font-extrabold text-[var(--color-ink)] mb-1">Вхід у LEGAR</h1>
        <p className="text-sm text-gray-500 mb-6">Особистий кабінет</p>

        {/* Mode switch */}
        <div className="flex bg-[var(--color-bg-200)] rounded-xl p-1 mb-6">
          <button
            type="button"
            onClick={() => setMode("password")}
            className={`flex-1 text-sm font-semibold py-2 rounded-lg transition-colors ${
              mode === "password"
                ? "bg-white text-[var(--color-ink)] shadow-sm"
                : "text-gray-500"
            }`}
          >
            Пароль
          </button>
          <button
            type="button"
            onClick={() => setMode("magic")}
            className={`flex-1 text-sm font-semibold py-2 rounded-lg transition-colors ${
              mode === "magic"
                ? "bg-white text-[var(--color-ink)] shadow-sm"
                : "text-gray-500"
            }`}
          >
            Magic Link
          </button>
        </div>

        {mode === "password" ? (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">
                Email
              </label>
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
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-[var(--color-ink)]">Пароль</label>
                <Link href="/forgot-password" className="text-xs text-[var(--color-primary)] hover:underline">
                  Забули пароль?
                </Link>
              </div>
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
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              <LogIn size={16} />
              {loading ? "Входимо…" : "Увійти"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleMagicLink} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">
                Email
              </label>
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
              <p className="text-xs text-gray-400 mt-1.5">
                Надішлемо посилання для входу без пароля
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              <Sparkles size={16} />
              {loading ? "Надсилаємо…" : "Надіслати Magic Link"}
            </button>
          </form>
        )}

        <p className="text-sm text-center text-gray-500 mt-6">
          Немає акаунта?{" "}
          <Link href="/signup" className="text-[var(--color-primary)] font-semibold hover:underline">
            Зареєструватися
          </Link>
        </p>
      </div>
    </div>
  );
}
