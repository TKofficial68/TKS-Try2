import { db } from "@/db";
import { apps, type NewApp } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

const ADMIN_PASSWORD = "TKStore.v2";

export async function GET() {
  try {
    const rows = await db.select().from(apps).orderBy(desc(apps.createdAt));
    return Response.json({ ok: true, apps: rows });
  } catch (err) {
    console.error(err);
    return Response.json({ ok: false, error: "Failed to load apps" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body?.password !== ADMIN_PASSWORD) {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const name = String(body.name ?? "").trim();
    if (!name) {
      return Response.json({ ok: false, error: "Name is required" }, { status: 400 });
    }

    // Determine type from explicit type OR from tags like #App / #game
    let type = String(body.type ?? "app").toLowerCase();
    const rawTags = String(body.tags ?? "").toLowerCase();
    if (rawTags.includes("#game")) type = "game";
    else if (rawTags.includes("#app")) type = "app";
    if (type !== "app" && type !== "game") type = "app";

    const screenshots = Array.isArray(body.screenshots)
      ? body.screenshots.filter((s: unknown) => typeof s === "string" && s.trim().length > 0)
      : String(body.screenshots ?? "")
          .split(/[\n,]/)
          .map((s: string) => s.trim())
          .filter(Boolean);

    const values: NewApp = {
      name,
      developer: String(body.developer ?? "TK Studio").trim() || "TK Studio",
      type,
      category: String(body.category ?? "General").trim() || "General",
      description: String(body.description ?? ""),
      iconUrl: String(body.iconUrl ?? ""),
      bannerUrl: String(body.bannerUrl ?? ""),
      screenshots,
      downloadUrl: String(body.downloadUrl ?? ""),
      version: String(body.version ?? "1.0.0"),
      size: String(body.size ?? "24 MB"),
      rating: Number.isFinite(Number(body.rating)) ? Number(body.rating) : 4.5,
      downloads: String(body.downloads ?? "1K+"),
      ageRating: String(body.ageRating ?? "3+"),
      featured: Boolean(body.featured),
      accentColor: String(body.accentColor ?? "#7c3aed"),
    };

    const [created] = await db.insert(apps).values(values).returning();
    return Response.json({ ok: true, app: created });
  } catch (err) {
    console.error(err);
    return Response.json({ ok: false, error: "Failed to create app" }, { status: 500 });
  }
}
