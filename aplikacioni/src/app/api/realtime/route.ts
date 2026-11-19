import { profiliIm } from "@/lib/lejet";
import { lexoPamjenLive } from "@/lib/kerkesa";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const prit = (ms: number, signal: AbortSignal) => new Promise<void>((resolve) => {
  const mbaro = () => {
    clearTimeout(timer);
    signal.removeEventListener("abort", mbaro);
    resolve();
  };
  const timer = setTimeout(mbaro, ms);
  signal.addEventListener("abort", mbaro, { once: true });
});

export async function GET(request: Request) {
  const profile = await profiliIm();
  if (!profile) return Response.json({ error: "Hyr me GitHub." }, { status: 401 });
  const udhetimId = new URL(request.url).searchParams.get("udhetimId") ?? "";
  if (!/^[a-zA-Z0-9-]{1,80}$/.test(udhetimId)) return Response.json({ error: "ID e pavlefshme." }, { status: 400 });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let mbyllur = false;
      const mbyll = () => {
        if (mbyllur) return;
        mbyllur = true;
        try { controller.close(); } catch { /* stream was already cancelled */ }
      };
      request.signal.addEventListener("abort", mbyll, { once: true });
      try {
        while (!mbyllur && !request.signal.aborted) {
          try {
            const pamja = await lexoPamjenLive(udhetimId, profile.id);
            if (!pamja) {
              controller.enqueue(encoder.encode(`event: unavailable\ndata: {}\n\n`));
              mbyll();
              break;
            }
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(pamja)}\n\n`));
          } catch {
            controller.enqueue(encoder.encode(`event: connection\ndata: {"online":false}\n\n`));
          }
          await prit(1500, request.signal);
        }
      } catch {
        mbyll();
      }
    },
    cancel() {},
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
