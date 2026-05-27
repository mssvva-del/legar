"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Users, FileText, UserCheck, TrendingUp, Clock, CheckCircle2, AlertCircle, Briefcase } from "lucide-react";

type Stats = {
  leads_total: number;
  leads_new: number;
  cases_total: number;
  cases_active: number;
  applications_total: number;
  applications_new: number;
  users_total: number;
};

type RecentLead = {
  id: number;
  name: string;
  phone: string;
  service: string | null;
  status: string;
  created_at: string;
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-yellow-100 text-yellow-700",
  contacted: "bg-blue-100 text-blue-700",
  qualified: "bg-purple-100 text-purple-700",
  converted: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-500",
};

const STATUS_UA: Record<string, string> = {
  new: "Нова",
  contacted: "Контакт",
  qualified: "Кваліфікована",
  converted: "Конвертована",
  closed: "Закрита",
};

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any).from("leads").select("status", { count: "exact" }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any).from("leads").select("status", { count: "exact" }).eq("status", "new"),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any).from("cases").select("status", { count: "exact" }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any).from("cases").select("status", { count: "exact" }).in("status", ["in_progress", "paid", "contract"]),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any).from("lawyer_applications").select("status", { count: "exact" }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any).from("lawyer_applications").select("status", { count: "exact" }).eq("status", "new"),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any).from("profiles").select("id", { count: "exact" }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any).from("leads").select("id,name,phone,service,status,created_at")
        .order("created_at", { ascending: false }).limit(10),
    ]).then(([leads, leadsNew, cases, casesActive, apps, appsNew, users, recent]) => {
      setStats({
        leads_total: leads.count ?? 0,
        leads_new: leadsNew.count ?? 0,
        cases_total: cases.count ?? 0,
        cases_active: casesActive.count ?? 0,
        applications_total: apps.count ?? 0,
        applications_new: appsNew.count ?? 0,
        users_total: users.count ?? 0,
      });
      setRecentLeads(recent.data ?? []);
      setLoading(false);
    });
  }, []);

  const METRIC_CARDS = stats ? [
    {
      label: "Лідів всього",
      value: stats.leads_total,
      sub: `${stats.leads_new} нових`,
      icon: TrendingUp,
      color: "text-[var(--color-primary)]",
      bg: "bg-blue-50",
    },
    {
      label: "Активних справ",
      value: stats.cases_active,
      sub: `${stats.cases_total} всього`,
      icon: Briefcase,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Заявок адвокатів",
      value: stats.applications_total,
      sub: `${stats.applications_new} нових`,
      icon: UserCheck,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Користувачів",
      value: stats.users_total,
      sub: "профілі LEGAR",
      icon: Users,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
  ] : [];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[var(--color-ink)]">Огляд</h1>
        <p className="text-gray-500 text-sm mt-1">Панель керування LEGAR</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-60">
          <div className="w-8 h-8 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {METRIC_CARDS.map(({ label, value, sub, icon: Icon, color, bg }) => (
              <div key={label} className="bg-white rounded-2xl border border-[var(--color-bg-300)] p-5">
                <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon size={18} className={color} />
                </div>
                <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
                <p className="text-sm font-semibold text-[var(--color-ink)] mt-0.5">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>

          {/* Status indicators */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-[var(--color-bg-300)] p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={16} className="text-yellow-500" />
                <h3 className="font-bold text-sm text-[var(--color-ink)]">Потребують уваги</h3>
              </div>
              <div className="space-y-2">
                {stats && stats.leads_new > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Нових лідів</span>
                    <span className="font-bold text-yellow-600">{stats.leads_new}</span>
                  </div>
                )}
                {stats && stats.applications_new > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Заявок адвокатів</span>
                    <span className="font-bold text-yellow-600">{stats.applications_new}</span>
                  </div>
                )}
                {stats && stats.leads_new === 0 && stats.applications_new === 0 && (
                  <p className="text-sm text-gray-400">Нічого нового</p>
                )}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-[var(--color-bg-300)] p-5">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} className="text-blue-500" />
                <h3 className="font-bold text-sm text-[var(--color-ink)]">В процесі</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Активних справ</span>
                  <span className="font-bold text-blue-600">{stats?.cases_active ?? 0}</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-[var(--color-bg-300)] p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={16} className="text-green-500" />
                <h3 className="font-bold text-sm text-[var(--color-ink)]">Завершено</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Закрито справ</span>
                  <span className="font-bold text-green-600">{(stats?.cases_total ?? 0) - (stats?.cases_active ?? 0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent leads */}
          <div className="bg-white rounded-2xl border border-[var(--color-bg-300)]">
            <div className="px-6 py-4 border-b border-[var(--color-bg-300)] flex items-center justify-between">
              <h2 className="font-extrabold text-[var(--color-ink)]">Останні ліди</h2>
              <a href="/admin/lidy" className="text-sm text-[var(--color-primary)] hover:underline">Всі →</a>
            </div>
            {recentLeads.length === 0 ? (
              <div className="px-6 py-10 text-center text-gray-400 text-sm">Лідів ще немає</div>
            ) : (
              <div className="divide-y divide-[var(--color-bg-300)]">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="px-6 py-3.5 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-xl bg-[var(--color-bg-200)] flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                      #{lead.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--color-ink)] truncate">{lead.name}</p>
                      <p className="text-xs text-gray-400">{lead.phone}{lead.service ? ` · ${lead.service}` : ""}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[lead.status] ?? "bg-gray-100 text-gray-500"}`}>
                      {STATUS_UA[lead.status] ?? lead.status}
                    </span>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {new Date(lead.created_at).toLocaleDateString("uk-UA")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
