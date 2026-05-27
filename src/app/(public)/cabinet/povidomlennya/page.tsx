"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { MessageSquare, Send } from "lucide-react";
import type { MessageRow, CaseRow } from "@/lib/supabase/types";

export default function PovidomlennyaPage() {
  const router = useRouter();
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [selectedCase, setSelectedCase] = useState<CaseRow | null>(null);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any)
        .from("cases").select("*")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });
      const caseList = data ?? [];
      setCases(caseList);
      if (caseList.length > 0) setSelectedCase(caseList[0]);
      setLoading(false);
    });
  }, [router]);

  useEffect(() => {
    if (!selectedCase) return;
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any).from("messages").select("*")
      .eq("case_id", selectedCase.id)
      .order("created_at", { ascending: true })
      .then(({ data }: { data: MessageRow[] }) => setMessages(data ?? []));
  }, [selectedCase]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!newMsg.trim() || !selectedCase || !userId) return;
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any).from("messages")
      .insert({ case_id: selectedCase.id, sender_id: userId, body: newMsg.trim() })
      .select().single();
    if (data) {
      setMessages((prev) => [...prev, data]);
      setNewMsg("");
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold text-[var(--color-ink)] mb-6">Повідомлення</h1>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Завантаження…</div>
      ) : cases.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[var(--color-bg-300)] p-12 text-center">
          <MessageSquare size={40} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Справ ще немає — чат з'явиться після відкриття справи</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4 h-[500px]">
          {/* Case list */}
          <div className="bg-white rounded-2xl border border-[var(--color-bg-300)] overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--color-bg-300)]">
              <p className="text-xs font-bold text-gray-400 uppercase">Справи</p>
            </div>
            <div className="overflow-y-auto">
              {cases.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCase(c)}
                  className={`w-full text-left px-4 py-3 hover:bg-[var(--color-bg-200)] transition-colors border-b border-[var(--color-bg-300)] last:border-0 ${
                    selectedCase?.id === c.id ? "bg-[var(--color-bg-200)]" : ""
                  }`}
                >
                  <p className="text-sm font-semibold text-[var(--color-ink)] truncate">{c.service_title}</p>
                  <p className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString("uk-UA")}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-[var(--color-bg-300)] flex flex-col">
            <div className="px-4 py-3 border-b border-[var(--color-bg-300)]">
              <p className="font-semibold text-[var(--color-ink)] text-sm">
                {selectedCase?.service_title ?? "Оберіть справу"}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">
                  Повідомлень ще немає. Напишіть адвокату!
                </div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.sender_id === userId ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        m.sender_id === userId
                          ? "bg-[var(--color-primary)] text-white rounded-br-sm"
                          : "bg-[var(--color-bg-200)] text-[var(--color-ink)] rounded-bl-sm"
                      }`}
                    >
                      {m.body}
                    </div>
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>
            <div className="p-3 border-t border-[var(--color-bg-300)] flex gap-2">
              <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Напишіть повідомлення…"
                className="flex-1 border border-[var(--color-bg-300)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              <button
                onClick={sendMessage}
                className="bg-[var(--color-primary)] text-white p-2.5 rounded-xl hover:opacity-90 transition-opacity"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
