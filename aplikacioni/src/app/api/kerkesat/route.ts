import { krijoKerkese } from "@/lib/kerkesa";

export const dynamic = "force-dynamic";

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
