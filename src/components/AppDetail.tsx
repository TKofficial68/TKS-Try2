"use client";

import { useEffect } from "react";
import type { AppItem } from "@/lib/types";
import AppIcon from "./AppIcon";
import { StarRow } from "./AppCard";

export default function AppDetail({
  app,
  onClose,
}: {
  app: AppItem;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm fade-in sm:items-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass slide-up relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border-t border-white/10 no-scrollbar sm:max-w-lg sm:rounded-3xl"
      >
        {/* Banner header */}
        <div
          className="relative z-0 h-40 w-full"
          style={{
            background: app.bannerUrl
              ? undefined
              : `linear-gradient(135deg, ${app.accentColor}, #0b1020)`,
          }}
        >
          {app.bannerUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={app.bannerUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#101426] via-[#101426]/30 to-transparent" />
          <button
            onClick={onClose}
            className="btn-3d absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-lg text-white backdrop-blur"
          >
            ✕
          </button>
        </div>

        <div className="relative z-10 px-5 pb-8">
          <div className="relative z-10 -mt-10 flex items-end gap-4">
            <div className="rounded-[22px] ring-4 ring-[#101426] shadow-2xl shadow-black/60">
              <AppIcon app={app} size={84} radius={22} />
            </div>
            <div className="pb-1">
              <h2 className="text-xl font-extrabold text-white">{app.name}</h2>
              <p className="text-sm font-medium grad-text">{app.developer}</p>
            </div>
          </div>

          {/* stat row */}
          <div className="mt-5 grid grid-cols-4 divide-x divide-white/10 rounded-2xl bg-white/5 py-3 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 text-sm font-bold text-white">
                {app.rating.toFixed(1)}
              </div>
              <StarRow rating={app.rating} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{app.downloads}</p>
              <p className="text-[10px] text-slate-400">Downloads</p>
            </div>
            <div>
              <p className="text-sm font-bold text-white">{app.ageRating}</p>
              <p className="text-[10px] text-slate-400">Age</p>
            </div>
            <div>
              <p className="text-sm font-bold text-white">{app.size}</p>
              <p className="text-[10px] text-slate-400">Size</p>
            </div>
          </div>

          {/* download button */}
          <a
            href={app.downloadUrl || "#"}
            target={app.downloadUrl ? "_blank" : undefined}
            rel="noreferrer"
            onClick={(e) => {
              if (!app.downloadUrl) e.preventDefault();
            }}
            className="btn-3d mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-emerald-400 to-emerald-600 py-3.5 text-base font-bold text-white shadow-lg shadow-emerald-900/50"
          >
            <span>⬇</span> {app.downloadUrl ? "Install" : "Coming soon"}
          </a>

          {/* screenshots */}
          {app.screenshots.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-2 text-sm font-bold text-white">Preview</h3>
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {app.screenshots.map((s, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={s}
                    alt={`screenshot ${i + 1}`}
                    className="h-56 w-auto shrink-0 rounded-2xl border border-white/10 object-cover"
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          )}

          {/* about */}
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-bold text-white">About this {app.type}</h3>
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300">
              {app.description || "No description provided."}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 text-[11px]">
            <span className="rounded-full bg-white/5 px-3 py-1 text-slate-300">
              #{app.type === "game" ? "game" : "App"}
            </span>
            <span className="rounded-full bg-white/5 px-3 py-1 text-slate-300">{app.category}</span>
            <span className="rounded-full bg-white/5 px-3 py-1 text-slate-300">v{app.version}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
