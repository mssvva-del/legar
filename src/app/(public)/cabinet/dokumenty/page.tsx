"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FolderOpen, Upload, FileText, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { DocumentRow } from "@/lib/supabase/types";

export default function DokumentyPage() {
  const router = useRouter();
  const [docs, setDocs] = useState<DocumentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);
      // Load documents from all user cases
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: userCases } = await (supabase as any)
        .from("cases").select("id").eq("client_id", user.id);
      const caseIds = (userCases ?? []).map((c: { id: string }) => c.id);
      if (caseIds.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data } = await (supabase as any)
          .from("documents").select("*")
          .in("case_id", caseIds)
          .order("created_at", { ascending: false });
        setDocs(data ?? []);
      }
      setLoading(false);
    });
  }, [router]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    if (file.size > 10 * 1024 * 1024) { toast.error("Файл занадто великий (макс. 10 МБ)"); return; }
    setUploading(true);
    try {
      const supabase = createClient();
      const path = `${userId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(path, file);
      if (uploadError) throw uploadError;
      toast.success("Файл завантажено");
    } catch {
      toast.error("Помилка завантаження. Спробуйте ще раз.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-[var(--color-ink)]">Документи</h1>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 text-sm bg-[var(--color-primary)] text-white px-4 py-2 rounded-xl font-semibold hover:opacity-90 disabled:opacity-60"
        >
          <Upload size={14} />
          {uploading ? "Завантажую…" : "Завантажити"}
        </button>
        <input ref={fileRef} type="file" className="hidden" onChange={handleUpload}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
      </div>

      {/* Dropzone */}
      <div
        className="border-2 border-dashed border-[var(--color-bg-300)] rounded-2xl p-10 text-center mb-6 cursor-pointer hover:border-[var(--color-primary)] transition-colors"
        onClick={() => fileRef.current?.click()}
      >
        <Upload size={32} className="text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Перетягніть файл або натисніть для завантаження</p>
        <p className="text-gray-400 text-xs mt-1">PDF, DOC, JPG — до 10 МБ</p>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-400">Завантаження…</div>
      ) : docs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[var(--color-bg-300)] p-12 text-center">
          <FolderOpen size={40} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Документів ще немає</p>
        </div>
      ) : (
        <div className="space-y-2">
          {docs.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl border border-[var(--color-bg-300)] px-4 py-3 flex items-center gap-3">
              <FileText size={18} className="text-[var(--color-primary)] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--color-ink)] truncate">{doc.file_name}</p>
                <p className="text-xs text-gray-400">
                  {doc.file_size ? `${Math.round(doc.file_size / 1024)} КБ · ` : ""}
                  {new Date(doc.created_at).toLocaleDateString("uk-UA")}
                </p>
              </div>
              <button className="text-gray-300 hover:text-[var(--color-primary)] transition-colors">
                <Download size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
