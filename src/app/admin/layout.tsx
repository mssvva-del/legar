"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, createContext, useContext } from "react";

const PASS_KEY = "legar_board_pass";

const NAV = [
  { href: "/admin", label: "Огляд" },
  { href: "/admin/leads", label: "Ліди" },
  { href: "/admin/applications", label: "Заявки адвокатів" },
];

/** Пароль доступу — доступний усім сторінкам адмінки. */
export const PassCtx = createContext<string>("");
export const usePass = () => useContext(PassCtx);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [pass, setPass] = useState("");
  const [input, setInput] = useState("");
  const [err, setErr] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(PASS_KEY);
    if (saved) setPass(saved);
    setReady(true);
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const r = await fetch("/api/board", { headers: { "x-board-pass": input } });
    if (r.ok) { localStorage.setItem(PASS_KEY, input); setPass(input); }
    else setErr("Невірний пароль");
  }

  if (!ready) return null;

  if (!pass) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#0E1420", padding: 20 }}>
        <form onSubmit={login} style={{ background: "#fff", padding: 28, borderRadius: 16, width: "100%", maxWidth: 360 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>LEGAR — адмінка</h1>
          <p style={{ color: "#64748B", fontSize: 14, margin: "8px 0 18px" }}>Введіть пароль доступу</p>
          <input type="password" value={input} onChange={(e) => setInput(e.target.value)} autoFocus placeholder="Пароль"
            style={{ width: "100%", padding: "12px 14px", fontSize: 16, border: "1px solid #E2E8F0", borderRadius: 8 }} />
          {err && <p style={{ color: "#DC2626", fontSize: 13, marginTop: 10 }}>{err}</p>}
          <button type="submit" style={{ width: "100%", marginTop: 14, padding: 12, fontSize: 16, fontWeight: 700, color: "#fff", background: "#0E1420", border: 0, borderRadius: 8, cursor: "pointer" }}>
            Увійти
          </button>
        </form>
      </div>
    );
  }

  return (
    <PassCtx.Provider value={pass}>
      <div style={{ minHeight: "100vh", background: "#F1F5F9" }}>
        <nav style={{ background: "#0E1420", padding: "10px 16px", display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ color: "#F5B301", fontWeight: 800, fontSize: 16, marginRight: 10 }}>LEGAR</span>
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <Link key={n.href} href={n.href}
                style={{ color: active ? "#0E1420" : "#CBD5E1", background: active ? "#F5B301" : "transparent",
                  padding: "7px 12px", borderRadius: 8, fontSize: 14, fontWeight: active ? 700 : 500, textDecoration: "none" }}>
                {n.label}
              </Link>
            );
          })}
          <button
            onClick={() => { localStorage.removeItem(PASS_KEY); setPass(""); }}
            style={{ marginLeft: "auto", background: "none", border: "1px solid #334155", color: "#94A3B8", padding: "6px 10px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>
            Вийти
          </button>
        </nav>
        <main style={{ padding: 16 }}>{children}</main>
      </div>
    </PassCtx.Provider>
  );
}
