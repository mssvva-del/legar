"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Users,
  FileText,
  Briefcase,
  UserCheck,
  Settings,
  LogOut,
  Shield,
  ChevronRight,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Огляд", icon: LayoutDashboard },
  { href: "/admin/lidy", label: "Ліди", icon: Users },
  { href: "/admin/applications", label: "Заявки адвокатів", icon: UserCheck },
  { href: "/admin/spravy", label: "Справи", icon: Briefcase },
  { href: "/admin/korystuvachy", label: "Користувачі", icon: FileText },
  { href: "/admin/nalashtuvannya", label: "Налаштування", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: prof } = await (supabase as any)
        .from("profiles").select("role,full_name").eq("id", user.id).single();
      if (!prof || prof.role !== "admin") { router.push("/"); return; }
      if (prof.full_name) setAdminName(prof.full_name);
      setChecking(false);
    });
  }, [router]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-200)]">
        <div className="w-8 h-8 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-200)] flex">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-[var(--color-ink)] text-white flex flex-col">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-[var(--color-accent)]" />
            <span className="font-extrabold text-lg tracking-tight">LEGAR</span>
            <span className="text-xs bg-[var(--color-accent)] text-[var(--color-ink)] font-bold px-1.5 py-0.5 rounded-md ml-auto">ADMIN</span>
          </div>
        </div>

        {/* Admin info */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-sm font-bold">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold">{adminName}</p>
              <p className="text-xs text-white/50">Адміністратор</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={16} />
                {label}
                {isActive && <ChevronRight size={14} className="ml-auto opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white/50 hover:text-red-400 hover:bg-white/5 transition-colors w-full"
          >
            <LogOut size={16} />
            Вийти
          </button>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-white/40 hover:text-white/60 transition-colors mt-1"
          >
            ← Повернутись на сайт
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  );
}
