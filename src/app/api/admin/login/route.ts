export const dynamic = "force-dynamic";

const ADMIN_PASSWORD = "TKStore.v2";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body?.password === ADMIN_PASSWORD) {
      return Response.json({ ok: true });
    }
    return Response.json({ ok: false, error: "Wrong password" }, { status: 401 });
  } catch {
    return Response.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}
