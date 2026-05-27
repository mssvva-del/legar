"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Search, Filter, Phone, Mail, MapPin, RefreshCw } from "lucide-react";
import { toast } from "sonner";

type Lead = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  city: string | null;
  service: string | null;
  message: string;
  status: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  created_at: string;
};

const STATUSES = ["new", "contacted", "qualified", "converted", "closed"];

const STATUS_COLORS: Record<string, string> = {
  new: "bg-yellow-100 text-yellow-700 border-yellow-200",
  contacted: "bg-blue-100 text-blue-700 border-blue-200",
  qualified: "bg-purple-100 text-purple-700 border-purple-200",
  converted: "bg-green-100 text-green-700 border-green-200",
  closed: "bg-gray-100 text-gray-500 border-gray-200",
};

const STATUS_UA: Record<string, string> = {
  new: "Нова",
  contacted: "Контакт",
  qualified: "Кваліфікована",
  converted: "Конвертована",
  closed: "Закрита",
};

export default function AdminLidyPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    setLoading(true);
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    setLeads(data ?? []);
    setLoading(false);
  }

  async function updateStatus(leadId: number, newStatus: string) {
    setUpdatingId(leadId);
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("leads")
      .update({ status: newStatus })
      .eq("id", leadId);
    if (error) {
      toast.error("Помилка оновлення статусу");
    } else {
      setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, status: newStatus } : l));
      toast.success("Статус оновлено");
    }
    setUpdatingId(null);
  }

  const filtered = useMemo(() => {
    let list = leads;
    if (filterStatus !== "all") list = list.filter((l) => l.status === filterStatus);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((l) =>
        l.name.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        (l.email ?? "").toLowerCase().includes(q) ||
        (l.service ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [leads, filterStatus, search]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--color-ink)]">Ліди</h1>
          <p className="text-gray-500 text-sm mt-1">{leads.length} заявок всього</p>
        </div>
        <button
          onClick={loadLeads}
          disabled={loading}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-[var(--color-primary)] transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Оновити
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Пошук за ім'ям, телефоном, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-[var(--color-bg-300)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-gray-400 flex-shrink-0" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-[var(--color-bg-300)] rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="all">Всі статуси</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_UA[s]}</option>
            ))}
          </select>
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
          Всі ({leads.length})
        </button>
        {STATUSES.map((s) => {
          const count = leads.filter((l) => l.status === s).length;
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
          Лідів не знайдено
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((lead) => (
            <div key={lead.id} className="bg-white rounded-2xl border border-[var(--color-bg-300)] overflow-hidden">
              {/* Row */}
              <div
                className="px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-[var(--color-bg-200)] transition-colors"
                onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
              >
                <span className="text-xs font-mono text-gray-400 w-8 flex-shrink-0">#{lead.id}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--color-ink)] text-sm">{lead.name}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Phone size={10} />
                      {lead.phone}
                    </span>
                    {lead.email && (
                      <span className="flex items-center gap-1 truncate">
                        <Mail size={10} />
                        {lead.email}
                      </span>
                    )}
                    {lead.city && (
                      <span className="flex items-center gap-1">
                        <MapPin size={10} />
                        {lead.city}
                      </span>
                    )}
                  </div>
                </div>
                {lead.service && (
                  <span className="text-xs text-gray-500 bg-[var(--color-bg-200)] px-2 py-1 rounded-lg hidden sm:block max-w-[140px] truncate">
                    {lead.service}
                  </span>
                )}
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${STATUS_COLORS[lead.status]}`}>
                  {STATUS_UA[lead.status] ?? lead.status}
                </span>
                <span className="text-xs text-gray-400 flex-shrink-0 hidden sm:block">
                  {new Date(lead.created_at).toLocaleDateString("uk-UA")}
                </span>
              </div>

              {/* Expanded detail */}
              {expandedId === lead.id && (
                <div className="px-5 pb-4 border-t border-[var(--color-bg-300)] pt-4">
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Повідомлення</p>
                      <p className="text-sm text-[var(--color-ink)]">{lead.message}</p>
                    </div>
                    {(lead.utm_source || lead.utm_medium || lead.utm_campaign) && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">UTM</p>
                        <p className="text-xs font-mono text-gray-500">
                          {[lead.utm_source, lead.utm_medium, lead.utm_campaign].filter(Boolean).join(" / ")}
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Змінити статус</p>
                    <div className="flex flex-wrap gap-2">
                      {STATUSES.map((s) => (
                        <button
                          key={s}
                          disabled={lead.status === s || updatingId === lead.id}
                          onClick={() => updateStatus(lead.id, s)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-40 ${
                            lead.status === s
                              ? STATUS_COLORS[s]
                              : "border-[var(--color-bg-300)] text-gray-600 hover:bg-[var(--color-bg-200)]"
                          }`}
                        >
                          {STATUS_UA[s]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <a
                      href={`tel:${lead.phone}`}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)] hover:underline"
                    >
                      <Phone size={12} />
                      Подзвонити
                    </a>
                    {lead.email && (
                      <a
                        href={`mailto:${lead.email}`}
                        className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)] hover:underline"
                      >
                        <Mail size={12} />
                        Написати
                      </a>
                    )}
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
