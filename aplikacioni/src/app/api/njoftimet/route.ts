import { lexoNjoftimet } from "@/lib/njoftimet";
import { profiliIm } from "@/lib/lejet";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const profile = await profiliIm();
    if (!profile) return Response.json({ error: "Hyr me GitHub." }, { status: 401 });
    if (profile.roli !== "udhetar") {
      return Response.json({ error: "Vetëm udhëtari i sheh njoftimet e veta." }, { status: 403 });
    }
    const notifications = await lexoNjoftimet(profile.id);
    return Response.json({ notifications }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Njoftimet nuk mund të lexohen tani." }, { status: 503 });
  }
}
