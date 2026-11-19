import { krijoKerkese, lexoKerkesatEUdhetarit } from "@/lib/kerkesa";
import { profiliIm } from "@/lib/lejet";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const profile = await profiliIm();
    if (!profile) return Response.json({ error: "Hyr me GitHub." }, { status: 401 });
    if (profile.roli !== "udhetar") return Response.json({ error: "Vetem udhetari i sheh kerkesat e veta." }, { status: 403 });
    const requests = await lexoKerkesatEUdhetarit();
    return Response.json({ requests }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Kerkesat nuk mund te lexohen tani." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await krijoKerkese(String(body.udhetimId ?? ""));
    const status = result.status === "hyr" ? 401
      : result.status === "rol" ? 403
      : result.status === "udhetim" ? 400
      : result.status === "pa_vende" ? 409 : 200;
    return Response.json(result, { status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ status: "gabim" }, { status: 503 });
  }
}
