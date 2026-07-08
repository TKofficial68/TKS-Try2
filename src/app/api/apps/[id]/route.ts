import { db } from "@/db";
import { apps } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

const ADMIN_PASSWORD = "TKStore.v2";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const appId = Number(id);
    const body = await request.json();

    if (body?.password !== ADMIN_PASSWORD) {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    let type = body.type ? String(body.type).toLowerCase() : undefined;
    const rawTags = String(body.tags ?? "").toLowerCase();
    if (rawTags.includes("#game")) type = "game";
    else if (rawTags.includes("#app")) type = "app";

    const screenshots = body.screenshots
      ? Array.isArray(body.screenshots)
        ? body.screenshots.filter((s: unknown) => typeof s === "string" && s.trim())
        : String(body.screenshots)
            .split(/[\n,]/)
            .map((s: string) => s.trim())
            .filter(Boolean)
      : undefined;

    const update: Record<string, unknown> = {};
    const fields = [
      "name",
      "developer",
      "category",
      "description",
      "iconUrl",
      "bannerUrl",
      "downloadUrl",
      "version",
      "size",
      "downloads",
      "ageRating",
      "accentColor",
    ];
    for (const f of fields) {
      if (body[f] !== undefined) update[f] = String(body[f]);
    }
    if (type) update.type = type === "game" ? "game" : "app";
    if (body.rating !== undefined) update.rating = Number(body.rating);
    if (body.featured !== undefined) update.featured = Boolean(body.featured);
    if (screenshots) update.screenshots = screenshots;

    const [updated] = await db.update(apps).set(update).where(eq(apps.id, appId)).returning();
    if (!updated) {
      return Response.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    return Response.json({ ok: true, app: updated });
  } catch (err) {
    console.error(err);
    return Response.json({ ok: false, error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const appId = Number(id);
    const { searchParams } = new URL(request.url);
    let password = searchParams.get("password");
    if (!password) {
      try {
        const body = await request.json();
        password = body?.password ?? null;
      } catch {
        /* no body */
      }
    }
    if (password !== ADMIN_PASSWORD) {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    await db.delete(apps).where(eq(apps.id, appId));
    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ ok: false, error: "Failed to delete" }, { status: 500 });
  }
}
