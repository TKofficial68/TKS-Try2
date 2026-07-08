"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { AppItem, Tab } from "@/lib/types";
import { AppCard, AppRow, FeatureCard } from "./AppCard";
import AppDetail from "./AppDetail";
import AdminPanel from "./AdminPanel";
import Reveal from "./Reveal";
import AppIcon from "./AppIcon";

export default function Store() {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("apps");
  const [selected, setSelected] = useState<AppItem | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/apps", { cache: "no-store" });
      const data = await res.json();
      if (data.ok) setApps(data.apps as AppItem[]);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const appsOnly = useMemo(() => apps.filter((a) => a.type !== "game"), [apps]);
  const gamesOnly = useMemo(() => apps.filter((a) => a.type === "game"), [apps]);
  const featured = useMemo(() => apps.filter((a) => a.featured), [apps]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    // Support #App and #game filters in search too
    if (q === "#app") return appsOnly;
    if (q === "#game") return gamesOnly;
    return apps.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.developer.toLowerCase().includes(q)
    );
  }, [query, apps, appsOnly, gamesOnly]);

  const open = (a: AppItem) => setSelected(a);

  return (
    <div className="mx-auto min-h-screen max-w-3xl pb-28">
      {/* ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-violet-700/30 blur-3xl" />
        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-cyan-600/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-fuchsia-700/20 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-[#06070f]/80 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="rgb-logo flex h-9 w-9 items-center justify-center rounded-xl text-sm font-black text-white shadow-lg">
            TK
          </div>
          <h1 className="text-lg font-extrabold tracking-tight">
            <span className="rgb-text">TK</span> <span className="text-white">Store</span>
          </h1>
          <button
            onClick={() => setTab("search")}
            className="btn-3d ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white"
            aria-label="Search"
          >
            🔍
          </button>
        </div>
      </header>

      <main className="px-4 pt-4">
        {loading ? (
          <LoadingGrid />
        ) : tab === "apps" ? (
          <ListSection
            title="Apps"
            subtitle="Top picks & essentials"
            featured={featured.filter((a) => a.type !== "game")}
            items={appsOnly}
            onOpen={open}
            emptyText="No apps yet. Add some from the hidden admin panel."
          />
        ) : tab === "games" ? (
          <ListSection
            title="Games"
            subtitle="Play the trending titles"
            featured={featured.filter((a) => a.type === "game")}
            items={gamesOnly}
            onOpen={open}
            emptyText="No games yet. Add some from the hidden admin panel."
            game
          />
        ) : tab === "search" ? (
          <SearchSection
            query={query}
            setQuery={setQuery}
            results={searchResults}
            onOpen={open}
            trending={apps.slice(0, 6)}
          />
        ) : (
          <ProfileSection onOpenAdmin={() => setShowAdmin(true)} count={apps.length} appCount={appsOnly.length} gameCount={gamesOnly.length} />
        )}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-3xl -translate-x-1/2 px-4 pb-4">
        <div className="glass flex items-center justify-around rounded-3xl px-2 py-2 shadow-2xl shadow-black/60">
          <NavBtn icon="📱" label="Apps" active={tab === "apps"} onClick={() => setTab("apps")} />
          <NavBtn icon="🎮" label="Games" active={tab === "games"} onClick={() => setTab("games")} />
          <NavBtn icon="🔍" label="Search" active={tab === "search"} onClick={() => setTab("search")} />
          <NavBtn icon="👤" label="Profile" active={tab === "profile"} onClick={() => setTab("profile")} />
        </div>
      </nav>

      {selected && <AppDetail app={selected} onClose={() => setSelected(null)} />}
      {showAdmin && (
        <AdminPanel apps={apps} onClose={() => setShowAdmin(false)} onChanged={load} />
      )}
    </div>
  );
}

function NavBtn({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`btn-3d flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-2 text-[11px] font-semibold transition-colors ${
        active
          ? "nav-active bg-gradient-to-b from-violet-500 to-fuchsia-600 text-white"
          : "text-slate-400"
      }`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );
}

function ListSection({
  title,
  subtitle,
  featured,
  items,
  onOpen,
  emptyText,
  game,
}: {
  title: string;
  subtitle: string;
  featured: AppItem[];
  items: AppItem[];
  onOpen: (a: AppItem) => void;
  emptyText: string;
  game?: boolean;
}) {
  return (
    <div className="space-y-7">
      <Reveal>
        <div>
          <h2 className="text-2xl font-extrabold text-white">{title}</h2>
          <p className="text-sm text-slate-400">{subtitle}</p>
        </div>
      </Reveal>

      {featured.length > 0 && (
        <Reveal delay={60}>
          <section>
            <h3 className="mb-3 text-sm font-bold text-slate-200">
              {game ? "🎮 Featured Games" : "✨ Featured"}
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {featured.map((a) => (
                <FeatureCard key={a.id} app={a} onOpen={onOpen} />
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {items.length === 0 ? (
        <Reveal>
          <div className="glass rounded-3xl p-10 text-center">
            <div className="floaty mx-auto mb-3 text-4xl">{game ? "🎮" : "📦"}</div>
            <p className="text-sm text-slate-400">{emptyText}</p>
          </div>
        </Reveal>
      ) : (
        <>
          {/* horizontal top grid */}
          <Reveal delay={80}>
            <section>
              <h3 className="mb-3 text-sm font-bold text-slate-200">Popular now</h3>
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {items.slice(0, 10).map((a) => (
                  <AppCard key={a.id} app={a} onOpen={onOpen} />
                ))}
              </div>
            </section>
          </Reveal>

          {/* full list */}
          <section>
            <h3 className="mb-3 text-sm font-bold text-slate-200">All {title.toLowerCase()}</h3>
            <div className="space-y-3">
              {items.map((a, i) => (
                <Reveal key={a.id} delay={Math.min(i * 40, 240)}>
                  <AppRow app={a} onOpen={onOpen} />
                </Reveal>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function SearchSection({
  query,
  setQuery,
  results,
  onOpen,
  trending,
}: {
  query: string;
  setQuery: (v: string) => void;
  results: AppItem[];
  onOpen: (a: AppItem) => void;
  trending: AppItem[];
}) {
  return (
    <div className="space-y-6">
      <Reveal>
        <div className="glass flex items-center gap-2 rounded-2xl px-4 py-3">
          <span className="text-lg">🔍</span>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search apps, games, #App, #game..."
            className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-slate-400">
              ✕
            </button>
          )}
        </div>
      </Reveal>

      {!query && (
        <Reveal delay={60}>
          <div className="flex flex-wrap gap-2">
            {["#App", "#game"].map((t) => (
              <button
                key={t}
                onClick={() => setQuery(t)}
                className="btn-3d rounded-full bg-gradient-to-b from-violet-500/80 to-fuchsia-600/80 px-4 py-1.5 text-sm font-semibold text-white"
              >
                {t}
              </button>
            ))}
          </div>
        </Reveal>
      )}

      {query ? (
        results.length ? (
          <div className="space-y-3">
            {results.map((a, i) => (
              <Reveal key={a.id} delay={Math.min(i * 40, 240)}>
                <AppRow app={a} onOpen={onOpen} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="pt-10 text-center text-sm text-slate-500">No results for “{query}”.</p>
        )
      ) : (
        <div>
          <h3 className="mb-3 text-sm font-bold text-slate-200">Trending searches</h3>
          <div className="space-y-3">
            {trending.map((a, i) => (
              <Reveal key={a.id} delay={Math.min(i * 40, 240)}>
                <AppRow app={a} onOpen={onOpen} />
              </Reveal>
            ))}
            {trending.length === 0 && <p className="text-sm text-slate-500">Nothing here yet.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileSection({
  onOpenAdmin,
  count,
  appCount,
  gameCount,
}: {
  onOpenAdmin: () => void;
  count: number;
  appCount: number;
  gameCount: number;
}) {
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState<NodeJS.Timeout | null>(null);

  function handleLogoClick() {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    // Clear existing timer
    if (clickTimer) {
      clearTimeout(clickTimer);
    }

    // If 3 clicks reached, open admin panel
    if (newCount >= 3) {
      setClickCount(0);
      onOpenAdmin();
      return;
    }

    // Reset counter after 1 second if not enough clicks
    const timer = setTimeout(() => {
      setClickCount(0);
    }, 1000);
    setClickTimer(timer);
  }

  return (
    <div className="space-y-6">
      <Reveal>
        <div className="glass flex items-center gap-4 rounded-3xl p-5">
          {/* Hidden admin trigger: triple click on TK RGB logo (no visual feedback) */}
          <button
            onClick={handleLogoClick}
            title="TK"
            aria-label="TK"
            className="rgb-logo floaty flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-black text-white shadow-xl"
          >
            TK
          </button>
          <div>
            <h2 className="text-lg font-extrabold text-white">TK Store User</h2>
            <p className="text-sm text-slate-400">Welcome back 👋</p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={60}>
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Items" value={count} />
          <StatCard label="Apps" value={appCount} />
          <StatCard label="Games" value={gameCount} />
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div className="space-y-2">
          {[
            { icon: "⬇️", label: "My downloads" },
            { icon: "❤️", label: "Wishlist" },
            { icon: "⭐", label: "My reviews" },
            { icon: "⚙️", label: "Settings" },
            { icon: "ℹ️", label: "About TK Store" },
          ].map((row) => (
            <button
              key={row.label}
              className="btn-3d glass flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left"
            >
              <span className="text-lg">{row.icon}</span>
              <span className="flex-1 text-sm font-semibold text-slate-100">{row.label}</span>
              <span className="text-slate-500">›</span>
            </button>
          ))}
        </div>
      </Reveal>

      <Reveal delay={140}>
        <p className="pt-2 text-center text-[11px] text-slate-600">
          TK Store v2 · Tap the RGB TK logo above to manage the store
        </p>
      </Reveal>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass rounded-2xl p-4 text-center">
      <p className="grad-text text-2xl font-extrabold">{value}</p>
      <p className="text-[11px] text-slate-400">{label}</p>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="space-y-3 pt-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="glass flex animate-pulse items-center gap-3 rounded-2xl p-3">
          <div className="h-14 w-14 rounded-2xl bg-white/10" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/2 rounded bg-white/10" />
            <div className="h-2.5 w-1/3 rounded bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
