"use client";

import { useEffect, useState } from "react";
import type { AppItem } from "@/lib/types";
import AppIcon from "./AppIcon";

type FormState = {
  name: string;
  developer: string;
  type: "app" | "game";
  category: string;
  description: string;
  iconUrl: string;
  bannerUrl: string;
  screenshots: string;
  downloadUrl: string;
  version: string;
  size: string;
  rating: string;
  downloads: string;
  ageRating: string;
  accentColor: string;
  featured: boolean;
  tags: string;
};

const emptyForm: FormState = {
  name: "",
  developer: "TK Studio",
  type: "app",
  category: "General",
  description: "",
  iconUrl: "",
  bannerUrl: "",
  screenshots: "",
  downloadUrl: "",
  version: "1.0.0",
  size: "24 MB",
  rating: "4.5",
  downloads: "1K+",
  ageRating: "3+",
  accentColor: "#7c3aed",
  featured: false,
  tags: "#App",
};

export default function AdminPanel({
  apps,
  onClose,
  onChanged,
}: {
  apps: AppItem[];
  onClose: () => void;
  onChanged: () => void;
}) {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  async function tryLogin() {
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
    } else {
      setLoginError("❌ Wrong password. Access denied.");
    }
  }

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  // keep tags in sync with type selector
  function setType(t: "app" | "game") {
    setForm((f) => ({ ...f, type: t, tags: t === "game" ? "#game" : "#App" }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function submit() {
    if (!form.name.trim()) {
      setMsg("⚠️ App name is required");
      return;
    }
    setBusy(true);
    setMsg("");
    const payload = {
      ...form,
      rating: Number(form.rating),
      screenshots: form.screenshots,
      password,
    };
    const url = editingId ? `/api/apps/${editingId}` : "/api/apps";
    const method = editingId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    if (res.ok) {
      setMsg(editingId ? "✅ Updated!" : "✅ Uploaded to store!");
      resetForm();
      onChanged();
      setTimeout(() => setMsg(""), 2500);
    } else {
      const d = await res.json().catch(() => ({}));
      setMsg(`❌ ${d.error ?? "Failed"}`);
    }
  }

  function startEdit(a: AppItem) {
    setEditingId(a.id);
    setForm({
      name: a.name,
      developer: a.developer,
      type: a.type === "game" ? "game" : "app",
      category: a.category,
      description: a.description,
      iconUrl: a.iconUrl,
      bannerUrl: a.bannerUrl,
      screenshots: a.screenshots.join("\n"),
      downloadUrl: a.downloadUrl,
      version: a.version,
      size: a.size,
      rating: String(a.rating),
      downloads: a.downloads,
      ageRating: a.ageRating,
      accentColor: a.accentColor,
      featured: a.featured,
      tags: a.type === "game" ? "#game" : "#App",
    });
    document.getElementById("admin-scroll")?.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(id: number) {
    if (!confirm("Delete this item from the store?")) return;
    const res = await fetch(`/api/apps/${id}?password=${encodeURIComponent(password)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      onChanged();
      if (editingId === id) resetForm();
    }
  }

  // ===== LOGIN GATE =====
  if (!authed) {
    return (
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-6 backdrop-blur-md fade-in"
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="glass pop-in w-full max-w-sm rounded-3xl p-7 text-center"
        >
          <div className="rgb-logo floaty mx-auto flex h-20 w-20 items-center justify-center rounded-3xl text-2xl font-black text-white shadow-2xl">
            TK
          </div>
          <h2 className="mt-5 text-xl font-extrabold text-white">Admin Access</h2>
          <p className="mt-1 text-sm text-slate-400">Enter the secret password to manage TK Store.</p>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && tryLogin()}
            placeholder="Password"
            className="mt-5 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-center text-white outline-none focus:border-violet-500"
          />
          {loginError && <p className="mt-2 text-xs text-rose-400">{loginError}</p>}
          <button
            onClick={tryLogin}
            className="btn-3d mt-4 w-full rounded-2xl bg-gradient-to-b from-violet-500 to-fuchsia-600 py-3 font-bold text-white shadow-lg shadow-fuchsia-900/40"
          >
            Unlock Panel
          </button>
          <button onClick={onClose} className="mt-3 text-xs text-slate-500 hover:text-slate-300">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // ===== PANEL =====
  const inputCls =
    "w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500";

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 backdrop-blur-sm fade-in sm:items-center">
      <div
        id="admin-scroll"
        className="glass slide-up max-h-[94vh] w-full overflow-y-auto rounded-t-3xl border-t border-white/10 no-scrollbar sm:max-w-2xl sm:rounded-3xl"
      >
        {/* header */}
        <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-white/10 bg-[#101426]/90 px-5 py-4 backdrop-blur">
          <div className="rgb-logo flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black text-white">
            TK
          </div>
          <div className="flex-1">
            <h2 className="text-base font-extrabold text-white">TK Store · Admin Panel</h2>
            <p className="text-[11px] text-emerald-400">● Authenticated</p>
          </div>
          <button
            onClick={onClose}
            className="btn-3d flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white"
          >
            ✕
          </button>
        </div>

        <div className="p-5">
          <h3 className="mb-3 text-sm font-bold text-white">
            {editingId ? "✏️ Edit item" : "⬆️ Upload new app / game via link"}
          </h3>

          {/* type toggle */}
          <div className="mb-4 grid grid-cols-2 gap-2">
            <button
              onClick={() => setType("app")}
              className={`btn-3d rounded-xl py-2.5 text-sm font-bold ${
                form.type === "app"
                  ? "bg-gradient-to-b from-violet-500 to-fuchsia-600 text-white"
                  : "bg-white/5 text-slate-300"
              }`}
            >
              #App
            </button>
            <button
              onClick={() => setType("game")}
              className={`btn-3d rounded-xl py-2.5 text-sm font-bold ${
                form.type === "game"
                  ? "bg-gradient-to-b from-cyan-500 to-blue-600 text-white"
                  : "bg-white/5 text-slate-300"
              }`}
            >
              #game
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-slate-400">App / Game name *</label>
              <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">Developer</label>
              <input className={inputCls} value={form.developer} onChange={(e) => set("developer", e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">Category</label>
              <input className={inputCls} value={form.category} onChange={(e) => set("category", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-slate-400">Download / APK link</label>
              <input className={inputCls} placeholder="https://..." value={form.downloadUrl} onChange={(e) => set("downloadUrl", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-slate-400">Icon image URL</label>
              <input className={inputCls} placeholder="https://.../icon.png" value={form.iconUrl} onChange={(e) => set("iconUrl", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-slate-400">Banner image URL</label>
              <input className={inputCls} placeholder="https://.../banner.jpg" value={form.bannerUrl} onChange={(e) => set("bannerUrl", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-slate-400">Screenshot URLs (one per line or comma)</label>
              <textarea rows={3} className={inputCls} value={form.screenshots} onChange={(e) => set("screenshots", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-slate-400">Description</label>
              <textarea rows={4} className={inputCls} value={form.description} onChange={(e) => set("description", e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">Version</label>
              <input className={inputCls} value={form.version} onChange={(e) => set("version", e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">Size</label>
              <input className={inputCls} value={form.size} onChange={(e) => set("size", e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">Rating (0-5)</label>
              <input type="number" step="0.1" min="0" max="5" className={inputCls} value={form.rating} onChange={(e) => set("rating", e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">Downloads</label>
              <input className={inputCls} value={form.downloads} onChange={(e) => set("downloads", e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">Age rating</label>
              <input className={inputCls} value={form.ageRating} onChange={(e) => set("ageRating", e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">Accent color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.accentColor} onChange={(e) => set("accentColor", e.target.value)} className="h-10 w-12 rounded-lg border border-white/10 bg-transparent" />
                <input className={inputCls} value={form.accentColor} onChange={(e) => set("accentColor", e.target.value)} />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4 accent-violet-500" />
                Show in Featured banner
              </label>
            </div>
          </div>

          {msg && <p className="mt-3 text-sm font-medium text-white">{msg}</p>}

          <div className="mt-4 flex gap-2">
            <button
              onClick={submit}
              disabled={busy}
              className="btn-3d flex-1 rounded-2xl bg-gradient-to-b from-emerald-400 to-emerald-600 py-3 font-bold text-white shadow-lg shadow-emerald-900/40 disabled:opacity-50"
            >
              {busy ? "Saving..." : editingId ? "Save changes" : "Upload to Store"}
            </button>
            {editingId && (
              <button onClick={resetForm} className="btn-3d rounded-2xl bg-white/10 px-5 font-bold text-white">
                Cancel
              </button>
            )}
          </div>

          {/* Existing items */}
          <h3 className="mb-3 mt-8 text-sm font-bold text-white">
            Manage store ({apps.length})
          </h3>
          <div className="space-y-2">
            {apps.map((a) => (
              <div key={a.id} className="glass flex items-center gap-3 rounded-xl p-2.5">
                <AppIcon app={a} size={44} radius={12} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{a.name}</p>
                  <p className="text-[11px] text-slate-400">
                    {a.type === "game" ? "🎮 #game" : "📱 #App"} · {a.category}
                  </p>
                </div>
                <button onClick={() => startEdit(a)} className="btn-3d rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
                  Edit
                </button>
                <button onClick={() => remove(a.id)} className="btn-3d rounded-lg bg-rose-500/80 px-3 py-1.5 text-xs font-semibold text-white">
                  Delete
                </button>
              </div>
            ))}
            {apps.length === 0 && <p className="text-sm text-slate-500">No items yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
