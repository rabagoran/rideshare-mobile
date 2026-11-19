import { refuzoKerkese } from "@/lib/kerkesa";

export const dynamic = "force-dynamic";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const result = await refuzoKerkese(Number(id));
    const status = result === "hyr" ? 401 : result === "ndaluar" ? 403
      : result === "fushe" ? 400 : result === "nuk_mund" ? 409 : 200;
    return Response.json({ status: result }, { status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ status: "gabim" }, { status: 503 });
  }
}
