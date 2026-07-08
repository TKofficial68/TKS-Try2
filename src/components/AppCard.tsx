"use client";

import type { AppItem } from "@/lib/types";
import AppIcon from "./AppIcon";

export function StarRow({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-400" style={{ fontSize: size }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className={i < Math.round(rating) ? "opacity-100" : "opacity-25"}>
          ★
        </span>
      ))}
    </span>
  );
}

/* Small vertical card used in grids */
export function AppCard({ app, onOpen }: { app: AppItem; onOpen: (a: AppItem) => void }) {
  return (
    <button
      onClick={() => onOpen(app)}
      className="btn-3d group flex w-24 flex-col items-center gap-2 text-center sm:w-28"
    >
      <div className="relative">
        <AppIcon app={app} size={72} radius={20} />
        <div className="pointer-events-none absolute inset-0 rounded-[20px] ring-1 ring-white/10 group-hover:ring-white/25" />
      </div>
      <div className="w-full">
        <p className="truncate text-[13px] font-semibold text-slate-100">{app.name}</p>
        <div className="mt-0.5 flex items-center justify-center gap-1 text-[10px] text-slate-400">
          <span>{app.rating.toFixed(1)}</span>
          <span className="text-amber-400">★</span>
        </div>
      </div>
    </button>
  );
}

/* Wide horizontal list row */
export function AppRow({ app, onOpen }: { app: AppItem; onOpen: (a: AppItem) => void }) {
  return (
    <button
      onClick={() => onOpen(app)}
      className="btn-3d glass flex w-full items-center gap-3 rounded-2xl p-3 text-left"
    >
      <AppIcon app={app} size={56} radius={16} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-100">{app.name}</p>
        <p className="truncate text-xs text-slate-400">{app.category} · {app.developer}</p>
        <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            {app.rating.toFixed(1)} <span className="text-amber-400">★</span>
          </span>
          <span>·</span>
          <span>{app.size}</span>
        </div>
      </div>
      <span className="rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-emerald-900/40">
        Get
      </span>
    </button>
  );
}

/* Big featured banner card */
export function FeatureCard({ app, onOpen }: { app: AppItem; onOpen: (a: AppItem) => void }) {
  return (
    <button
      onClick={() => onOpen(app)}
      className="btn-3d relative h-44 w-72 shrink-0 overflow-hidden rounded-3xl text-left sm:h-52 sm:w-80"
      style={{
        background: app.bannerUrl
          ? undefined
          : `linear-gradient(135deg, ${app.accentColor}, #0b1020)`,
      }}
    >
      {app.bannerUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={app.bannerUrl}
          alt={app.name}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-4">
        <AppIcon app={app} size={52} radius={14} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold text-white">{app.name}</p>
          <p className="truncate text-xs text-white/70">{app.category}</p>
        </div>
        <span className="rounded-full bg-white/95 px-4 py-1.5 text-xs font-bold text-slate-900">
          Get
        </span>
      </div>
      <span className="absolute left-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/90 backdrop-blur">
        {app.type === "game" ? "🎮 Featured Game" : "✨ Featured"}
      </span>
    </button>
  );
}
