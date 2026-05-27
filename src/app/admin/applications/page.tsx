"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Search, Phone, Mail, MapPin, CheckCircle2, XCircle, Clock, RefreshCw } from "lucide-react";
import { toast } from "sonner";

type Application = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  naau_certificate: string;
  years_practice: number;
  specializations: string[];
  monthly_capacity: number | null;
  has_military_practice: boolean | null;
  comment: string | null;
  status: string;
  created_at: string;
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-yellow-100 text-yellow-700 border-yellow-200",
  reviewing: "bg-blue-100 text-blue-700 border-blue-200",
  approved: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
};

const STATUS_UA: Record<string, string> = {
  new: "Нова",
  reviewing: "На розгляді",
  approved: "Прийнята",
  rejected: "Відхилена",
};

const STATUSES = ["new", "reviewing", "approved", "rejected"];

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    loadApps();
  }, []);

  async function loadApps() {
    setLoading(true);
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from("lawyer_applications")
      .select("*")
      .order("created_at", { ascending: false });
    setApps(data ?? []);
    setLoading(false);
  }

  async function updateStatus(appId: number, newStatus: string) {
    setUpdatingId(appId);
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("lawyer_applications")
      .update({ status: newStatus })
      .eq("id", appId);
    if (error) {
      toast.error("Помилка оновлення статусу");
    } else {
      setApps((prev) => prev.map((a) => a.id === appId ? { ...a, status: newStatus } : a));
      toast.success(newStatus === "approved" ? "Заявку прийнято" : "Статус оновлено");
    }
    setUpdatingId(null);
  }

  const filtered = useMemo(() => {
    let list = apps;
    if (filterStatus !== "all") list = list.filter((a) => a.status === filterStatus);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((a) =>
        a.full_name.toLowerCase().includes(q) ||
        a.phone.includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.naau_certificate.toLowerCase().includes(q)
      );
    }
    return list;
  }, [apps, filterStatus, search]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--color-ink)]">Заявки адвокатів</h1>
          <p className="text-gray-500 text-sm mt-1">{apps.length} заявок всього</p>
        </div>
        <button
          onClick={loadApps}
          disabled={loading}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-[var(--color-primary)] transition-colors"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Оновити
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Пошук за ім'ям, email, свідоцтвом..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-[var(--color-bg-300)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
          />
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterStatus("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            filterStatus === "all"
              ? "bg-[var(--color-primary)] text-white"
              : "bg-white border border-[var(--color-bg-300)] text-gray-600 hover:bg-[var(--color-bg-200)]"
          }`}
        >
          Всі ({apps.length})
        </button>
        {STATUSES.map((s) => {
          const count = apps.filter((a) => a.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterStatus === s
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-white border border-[var(--color-bg-300)] text-gray-600 hover:bg-[var(--color-bg-200)]"
              }`}
            >
              {STATUS_UA[s]} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-7 h-7 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[var(--color-bg-300)] p-12 text-center text-gray-400 text-sm">
          Заявок не знайдено
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((app) => (
            <div key={app.id} className="bg-white rounded-2xl border border-[var(--color-bg-300)] overflow-hidden">
              {/* Row header */}
              <div
                className="px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-[var(--color-bg-200)] transition-colors"
                onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
              >
                <span className="text-xs font-mono text-gray-400 w-8 flex-shrink-0">#{app.id}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--color-ink)] text-sm">{app.full_name}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Phone size={10} />
                      {app.phone}
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <Mail size={10} />
                      {app.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={10} />
                      {app.city}
                    </span>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-gray-500 font-mono">{app.naau_certificate}</p>
                  <p className="text-xs text-gray-400">{app.years_practice} р. стажу</p>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${STATUS_COLORS[app.status]}`}>
                  {STATUS_UA[app.status] ?? app.status}
                </span>
                <span className="text-xs text-gray-400 flex-shrink-0 hidden md:block">
                  {new Date(app.created_at).toLocaleDateString("uk-UA")}
                </span>
              </div>

              {/* Expanded */}
              {expandedId === app.id && (
                <div className="px-5 pb-5 border-t border-[var(--color-bg-300)] pt-4">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Спеціалізації</p>
                      <div className="flex flex-wrap gap-1">
                        {app.specializations.map((s) => (
                          <span key={s} className="text-xs bg-[var(--color-bg-200)] text-gray-700 px-2 py-0.5 rounded-lg">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Деталі</p>
                      <p className="text-xs text-gray-600">
                        Місячна ємність: {app.monthly_capacity ?? "—"} справ/міс
                        <br />
                        Військове право: {app.has_military_practice === null ? "—" : app.has_military_practice ? "Так" : "Ні"}
                      </p>
                    </div>
                    {app.comment && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Коментар</p>
                        <p className="text-xs text-gray-600">{app.comment}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      disabled={app.status === "approved" || updatingId === app.id}
                      onClick={() => updateStatus(app.id, "approved")}
                      className="flex items-center gap-1.5 text-sm font-semibold bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 disabled:opacity-40 transition-colors"
                    >
                      <CheckCircle2 size={14} />
                      Прийняти
                    </button>
                    <button
                      disabled={app.status === "reviewing" || updatingId === app.id}
                      onClick={() => updateStatus(app.id, "reviewing")}
                      className="flex items-center gap-1.5 text-sm font-semibold bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 disabled:opacity-40 transition-colors"
                    >
                      <Clock size={14} />
                      На розгляд
                    </button>
                    <button
                      disabled={app.status === "rejected" || updatingId === app.id}
                      onClick={() => updateStatus(app.id, "rejected")}
                      className="flex items-center gap-1.5 text-sm font-semibold bg-red-50 text-red-500 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-100 disabled:opacity-40 transition-colors"
                    >
                      <XCircle size={14} />
                      Відхилити
                    </button>
                    <a
                      href={`mailto:${app.email}`}
                      className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[var(--color-primary)] transition-colors ml-auto"
                    >
                      <Mail size={14} />
                      Написати
                    </a>
                    <a
                      href={`tel:${app.phone}`}
                      className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[var(--color-primary)] transition-colors"
                    >
                      <Phone size={14} />
                      Подзвонити
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
