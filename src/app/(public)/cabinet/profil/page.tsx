"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User, Mail, Phone, MapPin, Lock, Save, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { CITIES } from "@/lib/constants";
import type { ProfileRow } from "@/lib/supabase/types";

export default function ProfilPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "", city: "" });
  const [pwForm, setPwForm] = useState({ password: "", confirm: "" });
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      setEmail(user.email ?? "");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: prof } = await (supabase as any)
        .from("profiles").select("*").eq("id", user.id).single();
      if (prof) {
        setProfile(prof);
        setForm({ full_name: prof.full_name ?? "", phone: prof.phone ?? "", city: prof.city ?? "" });
      }
      setLoading(false);
    });
  }, [router]);

  async function saveProfile() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setSaving(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("profiles").update(form).eq("id", user.id);
      if (error) throw error;
      toast.success("Профіль збережено");
    } catch {
      toast.error("Помилка збереження");
    } finally {
      setSaving(false);
    }
  }

  async function changePassword() {
    if (pwForm.password.length < 8) { toast.error("Мінімум 8 символів"); return; }
    if (pwForm.password !== pwForm.confirm) { toast.error("Паролі не збігаються"); return; }
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: pwForm.password });
    if (error) { toast.error(error.message); return; }
    toast.success("Пароль змінено");
    setPwForm({ password: "", confirm: "" });
  }

  if (loading) return <div className="text-center py-16 text-gray-400">Завантаження…</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-extrabold text-[var(--color-ink)]">Профіль</h1>

      {/* Profile form */}
      <div className="bg-white rounded-2xl border border-[var(--color-bg-300)] p-6 space-y-4">
        <h2 className="font-extrabold text-[var(--color-ink)]">Особисті дані</h2>

        <div>
          <label className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">ПІБ</label>
          <div className="relative">
            <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full border border-[var(--color-bg-300)] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">Email</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={email}
              disabled
              className="w-full border border-[var(--color-bg-300)] rounded-xl pl-10 pr-4 py-3 text-sm bg-[var(--color-bg-200)] text-gray-400"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">Email змінити не можна</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">Телефон</label>
          <div className="relative">
            <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="0XXXXXXXXX"
              className="w-full border border-[var(--color-bg-300)] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">Місто</label>
          <div className="relative">
            <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full border border-[var(--color-bg-300)] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
            >
              <option value="">Оберіть місто</option>
              {CITIES.map((c) => <option key={c.slug} value={c.nameUk}>{c.nameUk}</option>)}
              <option value="Інше">Інше</option>
            </select>
          </div>
        </div>

        <button
          onClick={saveProfile}
          disabled={saving}
          className="flex items-center gap-2 bg-[var(--color-primary)] text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 text-sm"
        >
          <Save size={14} />
          {saving ? "Збереження…" : "Зберегти профіль"}
        </button>
      </div>

      {/* Password change */}
      <div className="bg-white rounded-2xl border border-[var(--color-bg-300)] p-6 space-y-4">
        <h2 className="font-extrabold text-[var(--color-ink)]">Зміна пароля</h2>
        <div>
          <label className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">Новий пароль</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              value={pwForm.password}
              onChange={(e) => setPwForm({ ...pwForm, password: e.target.value })}
              placeholder="мінімум 8 символів"
              className="w-full border border-[var(--color-bg-300)] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-[var(--color-ink)] mb-1.5">Повторити</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              value={pwForm.confirm}
              onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
              placeholder="••••••••"
              className="w-full border border-[var(--color-bg-300)] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>
        <button
          onClick={changePassword}
          className="flex items-center gap-2 bg-[var(--color-ink)] text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity text-sm"
        >
          <Lock size={14} />
          Змінити пароль
        </button>
      </div>

      {/* Delete account */}
      <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={18} className="text-red-500" />
          <h2 className="font-extrabold text-red-700">Видалення акаунта</h2>
        </div>
        <p className="text-sm text-red-600 mb-4">
          Ця дія незворотна. Всі ваші дані та справи будуть видалені.
        </p>
        {!showDelete ? (
          <button
            onClick={() => setShowDelete(true)}
            className="text-sm text-red-500 font-semibold hover:underline"
          >
            Видалити акаунт
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-red-700">
              Для підтвердження напишіть на mail@legar.com.ua з темою «Видалення акаунта».
              Ми видалимо дані протягом 30 днів.
            </p>
            <button
              onClick={() => setShowDelete(false)}
              className="text-sm text-gray-500 hover:underline"
            >
              Скасувати
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
