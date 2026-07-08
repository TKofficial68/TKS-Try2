import type { AppItem } from "@/lib/types";

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}

export default function AppIcon({
  app,
  size = 56,
  radius = 16,
}: {
  app: Pick<AppItem, "name" | "iconUrl" | "accentColor">;
  size?: number;
  radius?: number;
}) {
  if (app.iconUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={app.iconUrl}
        alt={app.name}
        width={size}
        height={size}
        loading="lazy"
        style={{ width: size, height: size, borderRadius: radius }}
        className="object-cover shadow-lg shadow-black/40"
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: `linear-gradient(135deg, ${app.accentColor}, #111827)`,
        fontSize: size * 0.36,
      }}
      className="flex items-center justify-center font-black text-white shadow-lg shadow-black/40"
    >
      {initials(app.name)}
    </div>
  );
}
