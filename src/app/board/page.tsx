"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

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
  utm_campaign: string | null;
  created_at: string;
};

const STAGES = [
  { key: "new", label: "Нові", hint: "щойно з реклами", color: "#F5B301" },
  { key: "call", label: "Дзвонимо", hint: "у роботі", color: "#3B82F6" },
  { key: "consult", label: "Консультація", hint: "хоче 490 / 1200", color: "#8B5CF6" },
  { key: "service", label: "Хоче послугу", hint: "8 000+", color: "#0EA5E9" },
  { key: "paid", label: "Оплатив", hint: "гроші отримані", color: "#16A34A" },
  { key: "lost", label: "Відмова", hint: "не цільовий", color: "#94A3B8" },
] as const;

const PASS_KEY = "legar_board_pass";

function timeAgo(iso: string): string {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 60) return `${m} хв тому`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} год тому`;
  return `${Math.floor(h / 24)} дн тому`;
}

/** Гарячий лід — з бота або з позначкою про оплату. */
function heat(l: Lead): string | null {
  if (/ОПЛАТИВ/i.test(l.message)) return "🔥 оплатив";
  if (/ГАРЯЧА СПРАВА/i.test(l.message)) return "🔥 гаряча справа";
  if (/📎 фото/i.test(l.message)) return "📎 є документ";
  return null;
}

export default function BoardPage() {
  const [pass, setPass] = useState("");
  const [authed, setAuthed] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<number | null>(null);
  const [note, setNote] = useState("");

  const load = useCallback(async (p: string) => {
    setLoading(true); setErr("");
    try {
      const r = await fetch("/api/board", { headers: { "x-board-pass": p } });
      if (r.status === 401) { setErr("Невірний пароль"); setAuthed(false); localStorage.removeItem(PASS_KEY); return; }
      if (!r.ok) { setErr("БД недоступна"); return; }
      const d = (await r.json()) as { leads: Lead[] };
      setLeads(d.leads); setAuthed(true); localStorage.setItem(PASS_KEY, p);
    } catch { setErr("Помилка мережі"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(PASS_KEY);
    if (saved) { setPass(saved); load(saved); }
  }, [load]);

  async function move(id: number, status: string) {
    setLeads((s) => s.map((l) => (l.id === id ? { ...l, status } : l)));   // оптимістично
    await fetch("/api/board", { method: "PATCH", headers: { "Content-Type": "application/json", "x-board-pass": pass }, body: JSON.stringify({ id, status }) });
  }

  async function addNote(id: number) {
    if (!note.trim()) return;
    await fetch("/api/board", { method: "PATCH", headers: { "Content-Type": "application/json", "x-board-pass": pass }, body: JSON.stringify({ id, note }) });
    setNote(""); load(pass);
  }

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return leads;
    return leads.filter((l) => [l.name, l.phone, l.city, l.service, l.message].join(" ").toLowerCase().includes(s));
  }, [leads, q]);

  const byStage = useMemo(() => {
    const m: Record<string, Lead[]> = {};
    for (const st of STAGES) m[st.key] = [];
    for (const l of filtered) (m[l.status] ??= m.new).push(l);
    return m;
  }, [filtered]);

  // ── Логін ────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#0E1420", padding: 20 }}>
        <form
          onSubmit={(e) => { e.preventDefault(); load(pass); }}
          style={{ background: "#fff", padding: 28, borderRadius: 16, width: "100%", maxWidth: 360 }}
        >
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>LEGAR — дошка лідів</h1>
          <p style={{ color: "#64748B", fontSize: 14, margin: "8px 0 18px" }}>Введіть пароль доступу</p>
          <input
            type="password" value={pass} onChange={(e) => setPass(e.target.value)} autoFocus
            style={{ width: "100%", padding: "12px 14px", fontSize: 16, border: "1px solid #E2E8F0", borderRadius: 8 }}
            placeholder="Пароль"
          />
          {err && <p style={{ color: "#DC2626", fontSize: 13, marginTop: 10 }}>{err}</p>}
          <button
            type="submit" disabled={loading}
            style={{ width: "100%", marginTop: 14, padding: "12px", fontSize: 16, fontWeight: 700, color: "#fff", background: "#0E1420", border: 0, borderRadius: 8, cursor: "pointer" }}
          >
            {loading ? "Перевіряю…" : "Увійти"}
          </button>
        </form>
      </div>
    );
  }

  // ── Дошка ────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#F1F5F9", padding: "16px 16px 40px" }}>
      <header style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 14 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Ліди LEGAR</h1>
        <span style={{ color: "#64748B", fontSize: 14 }}>{filtered.length} шт</span>
        <input
          value={q} onChange={(e) => setQ(e.target.value)} placeholder="Пошук: імʼя, телефон, місто…"
          style={{ flex: "1 1 220px", padding: "9px 12px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 14 }}
        />
        <button onClick={() => load(pass)} style={{ padding: "9px 14px", border: "1px solid #E2E8F0", background: "#fff", borderRadius: 8, cursor: "pointer", fontSize: 14 }}>
          {loading ? "…" : "Оновити"}
        </button>
      </header>

      {err && <p style={{ color: "#DC2626", fontSize: 14 }}>{err}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, alignItems: "start" }}>
        {STAGES.map((st) => (
          <section
            key={st.key}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { const id = Number(e.dataTransfer.getData("id")); if (id) move(id, st.key); }}
            style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0", minHeight: 120 }}
          >
            <div style={{ padding: "10px 12px", borderBottom: "1px solid #F1F5F9", borderTop: `3px solid ${st.color}`, borderRadius: "12px 12px 0 0" }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>
                {st.label} <span style={{ color: "#94A3B8", fontWeight: 500 }}>{byStage[st.key]?.length ?? 0}</span>
              </div>
              <div style={{ fontSize: 11, color: "#94A3B8" }}>{st.hint}</div>
            </div>

            <div style={{ padding: 8, display: "grid", gap: 8 }}>
              {(byStage[st.key] ?? []).map((l) => {
                const h = heat(l);
                return (
                  <article
                    key={l.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("id", String(l.id))}
                    style={{ border: "1px solid #E2E8F0", borderRadius: 10, padding: 10, background: "#fff", cursor: "grab" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 6 }}>
                      <strong style={{ fontSize: 14 }}>{l.name}</strong>
                      <span style={{ fontSize: 11, color: "#94A3B8", whiteSpace: "nowrap" }}>{timeAgo(l.created_at)}</span>
                    </div>

                    <a href={`tel:${l.phone}`} style={{ display: "inline-block", marginTop: 4, fontSize: 15, fontWeight: 700, color: "#0EA5E9", textDecoration: "none" }}>
                      📞 {l.phone}
                    </a>

                    {h && <div style={{ marginTop: 4, fontSize: 12, fontWeight: 600, color: "#B45309" }}>{h}</div>}

                    <div style={{ marginTop: 4, fontSize: 12, color: "#475569" }}>
                      {[l.service, l.city, l.utm_source].filter(Boolean).join(" · ")}
                    </div>

                    <button
                      onClick={() => { setOpen(open === l.id ? null : l.id); setNote(""); }}
                      style={{ marginTop: 6, fontSize: 12, background: "none", border: 0, color: "#64748B", cursor: "pointer", padding: 0 }}
                    >
                      {open === l.id ? "згорнути ▲" : "деталі ▼"}
                    </button>

                    {open === l.id && (
                      <div style={{ marginTop: 8, borderTop: "1px solid #F1F5F9", paddingTop: 8 }}>
                        <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, color: "#334155", margin: 0, fontFamily: "inherit" }}>{l.message}</pre>
                        <textarea
                          value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Нотатка після дзвінка…"
                          style={{ width: "100%", marginTop: 8, padding: 8, fontSize: 13, border: "1px solid #E2E8F0", borderRadius: 6, resize: "vertical" }}
                        />
                        <button onClick={() => addNote(l.id)} style={{ marginTop: 6, padding: "6px 10px", fontSize: 12, border: 0, borderRadius: 6, background: "#0E1420", color: "#fff", cursor: "pointer" }}>
                          Зберегти нотатку
                        </button>
                      </div>
                    )}

                    <select
                      value={l.status}
                      onChange={(e) => move(l.id, e.target.value)}
                      style={{ width: "100%", marginTop: 8, padding: "6px 8px", fontSize: 12, border: "1px solid #E2E8F0", borderRadius: 6, background: "#F8FAFC" }}
                    >
                      {STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                    </select>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
