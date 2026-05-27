"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FileText, Filter } from "lucide-react";
import type { CaseRow } from "@/lib/supabase/types";

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

type Filter = "all" | "active" | "closed";

export default function SpravyPage() {
  const router = useRouter();
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any)
        .from("cases").select("*")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });
      setCases(data ?? []);
      setLoading(false);
    });
  }, [router]);

  const ACTIVE_STATUSES = ["lead", "contract", "paid", "in_progress"];
  const filtered = filter === "all" ? cases
    : filter === "active" ? cases.filter((c) => ACTIVE_STATUSES.includes(c.status))
    : cases.filter((c) => c.status === "closed" || c.status === "refunded");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-[var(--color-ink)]">Мої справи</h1>
        <Link href="/poslugy" className="text-sm bg-[var(--color-primary)] text-white px-4 py-2 rounded-xl font-semibold hover:opacity-90">
          + Нова справа
        </Link>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {(["all", "active", "closed"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              filter === f
                ? "bg-[var(--color-primary)] text-white"
                : "bg-white text-gray-600 border border-[var(--color-bg-300)] hover:bg-[var(--color-bg-200)]"
            }`}
          >
            {f === "all" ? "Усі" : f === "active" ? "Активні" : "Закриті"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Завантаження…</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[var(--color-bg-300)] p-12 text-center">
          <FileText size={40} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Справ не знайдено</p>
          <Link href="/poslugy" className="text-[var(--color-primary)] font-semibold text-sm hover:underline">
            Замовити послугу →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-[var(--color-bg-300)] p-5 flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-[var(--color-ink)]">{c.service_title}</h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[c.status]}`}>
                    {STATUS_LABELS[c.status]}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Відкрито {new Date(c.created_at).toLocaleDateString("uk-UA")}
                  {c.city && ` · ${c.city}`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[var(--color-primary)]">
                  {c.price_uah > 0 ? `${c.price_uah.toLocaleString()} грн` : "—"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 text-center mt-8">
        * LEGAR — інформаційно-консультаційна платформа. Юридичні послуги надають адвокати-партнери НААУ.
      </p>
    </div>
  );
}
