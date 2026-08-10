"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePass } from "./layout";

type Lead = { id: number; status: string; created_at: string; utm_source: string | null; message: string };

const STAGES = [
  { key: "new", label: "Нові", color: "#F5B301" },
  { key: "call", label: "Дзвонимо", color: "#3B82F6" },
  { key: "consult", label: "Консультація", color: "#8B5CF6" },
  { key: "service", label: "Хоче послугу", color: "#0EA5E9" },
  { key: "paid", label: "Оплатив", color: "#16A34A" },
  { key: "lost", label: "Відмова", color: "#94A3B8" },
];

export default function AdminOverview() {
  const pass = usePass();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [apps, setApps] = useState<unknown[]>([]);

  useEffect(() => {
    if (!pass) return;
    fetch("/api/board", { headers: { "x-board-pass": pass } })
      .then((r) => (r.ok ? r.json() : { leads: [] })).then((d) => setLeads(d.leads ?? []));
    fetch("/api/board?type=applications", { headers: { "x-board-pass": pass } })
      .then((r) => (r.ok ? r.json() : { applications: [] })).then((d) => setApps(d.applications ?? []));
  }, [pass]);

  const day = 86400000;
  const today = leads.filter((l) => Date.now() - new Date(l.created_at).getTime() < day).length;
  const week = leads.filter((l) => Date.now() - new Date(l.created_at).getTime() < 7 * day).length;
  const count = (k: string) => leads.filter((l) => l.status === k).length;

  const box = (label: string, value: string | number, color?: string) => (
    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "12px 14px" }}>
      <div style={{ fontSize: 12, color: "#64748B" }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: color ?? "#0E1420" }}>{value}</div>
    </div>
  );

  return (
    <>
      <h1 style={{ margin: "0 0 14px", fontSize: 20, fontWeight: 800 }}>Огляд</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10, marginBottom: 18 }}>
        {box("Лідів усього", leads.length)}
        {box("За сьогодні", today)}
        {box("За тиждень", week)}
        {box("Оплатили", count("paid"), "#16A34A")}
        {box("Заявки адвокатів", apps.length)}
      </div>

      <h2 style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 700 }}>По етапах</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10, marginBottom: 18 }}>
        {STAGES.map((s) => (
          <div key={s.key} style={{ background: "#fff", border: "1px solid #E2E8F0", borderTop: `3px solid ${s.color}`, borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ fontSize: 12, color: "#64748B" }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{count(s.key)}</div>
          </div>
        ))}
      </div>

      <Link href="/admin/leads" style={{ display: "inline-block", padding: "10px 16px", background: "#0E1420", color: "#fff", borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: 14 }}>
        Відкрити дошку лідів →
      </Link>
    </>
  );
}
