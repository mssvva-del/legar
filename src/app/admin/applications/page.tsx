"use client";

import { useEffect, useState } from "react";
import { usePass } from "../layout";

type App = {
  id: number; full_name: string; email: string; phone: string; city: string;
  naau_certificate: string; years_practice: number; specializations: string[];
  status: string; created_at: string;
};

export default function AdminApplicationsPage() {
  const pass = usePass();
  const [apps, setApps] = useState<App[]>([]);

  useEffect(() => {
    if (!pass) return;
    fetch("/api/board?type=applications", { headers: { "x-board-pass": pass } })
      .then((r) => (r.ok ? r.json() : { applications: [] }))
      .then((d) => setApps(d.applications ?? []));
  }, [pass]);

  return (
    <>
      <h1 style={{ margin: "0 0 14px", fontSize: 20, fontWeight: 800 }}>Заявки адвокатів <span style={{ color: "#64748B", fontWeight: 500, fontSize: 15 }}>{apps.length}</span></h1>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 720 }}>
          <thead>
            <tr style={{ background: "#F8FAFC", textAlign: "left" }}>
              {["ПІБ", "Телефон", "Місто", "НААУ", "Досвід", "Спеціалізація"].map((h) => (
                <th key={h} style={{ padding: "10px 12px", fontSize: 12, color: "#64748B", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {apps.map((a) => (
              <tr key={a.id} style={{ borderTop: "1px solid #F1F5F9" }}>
                <td style={{ padding: "10px 12px" }}>{a.full_name}<div style={{ fontSize: 11, color: "#94A3B8" }}>{a.email}</div></td>
                <td style={{ padding: "10px 12px" }}><a href={`tel:${a.phone}`} style={{ color: "#0EA5E9", fontWeight: 600, textDecoration: "none" }}>{a.phone}</a></td>
                <td style={{ padding: "10px 12px", color: "#475569" }}>{a.city}</td>
                <td style={{ padding: "10px 12px", color: "#475569" }}>{a.naau_certificate}</td>
                <td style={{ padding: "10px 12px", color: "#475569" }}>{a.years_practice} р.</td>
                <td style={{ padding: "10px 12px", color: "#475569" }}>{(a.specializations ?? []).join(", ")}</td>
              </tr>
            ))}
            {!apps.length && <tr><td colSpan={6} style={{ padding: 20, textAlign: "center", color: "#94A3B8" }}>Порожньо</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
