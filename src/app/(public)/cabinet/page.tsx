"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  MessageSquare,
  User,
  LogOut,
  Sparkles,
  Phone,
  Upload,
  Shield,
  ChevronRight,
  Bell,
} from "lucide-react";
import { CONTACTS } from "@/lib/constants";
import type { ProfileRow, CaseRow } from "@/lib/supabase/types";

const STATUS_COLORS: Record<string, string> = {
  lead: "bg-yellow-100 text-yellow-700",
  contract: "bg-blue-100 text-blue-700",
  paid: "bg-purple-100 text-purple-700",
  in_progress: "bg-indigo-100 text-indigo-700",
  closed: "bg-green-100 text-green-700",
  refunded: "bg-gray-100 text-gray-500",
};

const STATUS_LABELS: Record<string, string> = {
  lead: "Нова заявка",
  contract: "Підписання",
  paid: "Сплачено",
  in_progress: "В роботі",
  closed: "Закрито",
  refunded: "Повернення",
};

const NAV_LINKS = [
  { href: "/cabinet", label: "Дашборд", icon: LayoutDashboard },
  { href: "/cabinet/spravy", label: "Мої справи", icon: FileText },
  { href: "/cabinet/dokumenty", label: "Документи", icon: FolderOpen },
  { href: "/cabinet/povidomlennya", label: "Повідомлення", icon: MessageSquare },
  { href: "/cabinet/profil", label: "Профіль", icon: User },
];

export default function CabinetPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: prof } = await (supabase as any)
        .from("profiles").select("*").eq("id", user.id).single();
      setProfile(prof);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: caseData } = await (supabase as any)
        .from("cases").select("*").eq("client_id", user.id)
        .order("created_at", { ascending: false }).limit(3);
      setCases(caseData ?? []);
      setLoading(false);
    });
  }, [router]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const activeCases = cases.filter((c) => c.status === "in_progress" || c.status === "paid" || c.status === "contract");
  const displayName = profile?.full_name ?? "Клієнт";

  return (
    <div className="min-h-screen bg-[var(--color-bg-200)]">
      <div className="max-w-6xl mx-auto flex gap-0 md:gap-6 px-0 md:px-4 py-0 md:py-8">

        {/* ── SIDEBAR (desktop) ── */}
        <aside className="hidden md:flex flex-col w-60 flex-shrink-0">
          <div className="bg-white rounded-2xl p-4 border border-[var(--color-bg-300)] sticky top-8">
            {/* User info */}
            <div className="flex items-center gap-3 p-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-[var(--color-ink)] text-sm truncate">{displayName}</p>
                <p className="text-xs text-gray-400">Клієнт</p>
              </div>
            </div>

            {/* Nav */}
            <nav className="space-y-1">
              {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                const isActive = typeof window !== "undefined" && window.location.pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-[var(--color-primary)] text-white"
                        : "text-gray-600 hover:bg-[var(--color-bg-200)]"
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors w-full mt-4"
            >
              <LogOut size={16} />
              Вийти
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="flex-1 min-w-0 px-4 md:px-0 py-6 md:py-0">
          {loading ? (
            <div className="flex items-center justify-center h-60">
              <div className="w-8 h-8 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-extrabold text-[var(--color-ink)]">
                    Вітаємо, {displayName.split(" ")[0]}!
                  </h1>
                  <p className="text-gray-500 text-sm">Ваш особистий кабінет LEGAR</p>
                </div>
                <Link href="/cabinet/povidomlennya">
                  <Bell size={20} className="text-gray-400" />
                </Link>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Активних справ", value: activeCases.length, color: "text-[var(--color-primary)]" },
                  { label: "Повідомлень", value: 0, color: "text-orange-500" },
                  { label: "Документів", value: 0, color: "text-purple-600" },
                  { label: "Сплачено", value: "—", color: "text-green-600" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-white rounded-2xl p-4 border border-[var(--color-bg-300)]">
                    <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* Next action */}
              <div className="bg-[var(--color-primary)] text-white rounded-2xl p-5 mb-6">
                <div className="flex items-start gap-3">
                  <Shield size={20} className="flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    {activeCases.length > 0 ? (
                      <>
                        <p className="font-bold mb-1">Є активна справа</p>
                        <p className="text-sm text-blue-100">{activeCases[0].service_title}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-bold mb-1">Немає активних справ</p>
                        <p className="text-sm text-blue-100">Замовте послугу або пройдіть AI-Діагностику</p>
                      </>
                    )}
                  </div>
                  {activeCases.length > 0 && (
                    <Link href="/cabinet/spravy" className="text-xs bg-white/20 px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap hover:bg-white/30">
                      Деталі →
                    </Link>
                  )}
                </div>
              </div>

              {/* Recent cases */}
              <div className="bg-white rounded-2xl border border-[var(--color-bg-300)] mb-6">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-bg-300)]">
                  <h2 className="font-extrabold text-[var(--color-ink)]">Останні справи</h2>
                  <Link href="/cabinet/spravy" className="text-sm text-[var(--color-primary)] hover:underline">
                    Всі →
                  </Link>
                </div>
                {cases.length === 0 ? (
                  <div className="px-5 py-8 text-center text-gray-400 text-sm">
                    Справ ще немає
                  </div>
                ) : (
                  <div className="divide-y divide-[var(--color-bg-300)]">
                    {cases.map((c) => (
                      <Link
                        key={c.id}
                        href={`/cabinet/spravy`}
                        className="flex items-center gap-3 px-5 py-3.5 hover:bg-[var(--color-bg-200)] transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[var(--color-ink)] text-sm truncate">{c.service_title}</p>
                          <p className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString("uk-UA")}</p>
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[c.status]}`}>
                          {STATUS_LABELS[c.status]}
                        </span>
                        <ChevronRight size={14} className="text-gray-300" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick actions */}
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { label: "Замовити послугу", icon: Sparkles, href: "/poslugy", color: "bg-[var(--color-primary)] text-white" },
                  { label: "Завантажити документ", icon: Upload, href: "/cabinet/dokumenty", color: "bg-white text-[var(--color-ink)] border border-[var(--color-bg-300)]" },
                  { label: "Написати повідомлення", icon: MessageSquare, href: "/cabinet/povidomlennya", color: "bg-white text-[var(--color-ink)] border border-[var(--color-bg-300)]" },
                  { label: "Гаряча лінія", icon: Phone, href: CONTACTS.phoneTel, color: "bg-white text-[var(--color-ink)] border border-[var(--color-bg-300)]" },
                ].map(({ label, icon: Icon, href, color }) => (
                  <Link
                    key={label}
                    href={href}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-opacity hover:opacity-80 ${color}`}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {/* ── BOTTOM NAV (mobile) ── */}
      <nav className="fixed bottom-0 inset-x-0 md:hidden bg-white border-t border-[var(--color-bg-300)] flex z-30">
        {NAV_LINKS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center py-3 text-gray-400 hover:text-[var(--color-primary)] transition-colors"
          >
            <Icon size={20} />
            <span className="text-[10px] mt-1">{label.split(" ")[0]}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
