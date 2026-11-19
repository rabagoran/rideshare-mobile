"use client";

import { useEffect, useState } from "react";
import type { PamjaLive } from "@/lib/kerkesa";

type Status = "pa_derguar" | "ne_pritje" | "pranuar" | "refuzuar" | "pa_vende" | "hyr" | "gabim";

export default function KerkesaLive({ udhetimId, vendeFillestare }: { udhetimId: string; vendeFillestare: number }) {
  const [vende, setVende] = useState(vendeFillestare);
  const [status, setStatus] = useState<Status>("pa_derguar");
  const [dukeDergaur, setDukeDergaur] = useState(false);
  const [lidhja, setLidhja] = useState<"po_lidhet" | "lidhur" | "rilidhje">("po_lidhet");

  useEffect(() => {
    const source = new EventSource(`/api/realtime?udhetimId=${encodeURIComponent(udhetimId)}`);
    source.onopen = () => setLidhja("lidhur");
    source.onmessage = (event) => {
      const pamja = JSON.parse(event.data) as PamjaLive;
      setVende(pamja.vende);
      const imja = pamja.kerkesat[0];
      if (imja) setStatus(imja.status);
      setLidhja("lidhur");
    };
    source.onerror = () => setLidhja("rilidhje");
    source.addEventListener("connection", () => setLidhja("rilidhje"));
    return () => source.close();
  }, [udhetimId]);

  async function dergo() {
    setDukeDergaur(true);
    try {
      const response = await fetch("/api/kerkesat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ udhetimId }),
      });
      const result = await response.json() as { status: Status };
      setStatus(result.status);
    } catch {
      setStatus("gabim");
    } finally {
      setDukeDergaur(false);
    }
  }

  const mesazhet: Record<Status, string> = {
    pa_derguar: "Dërgo kërkesën te shoferi.",
    ne_pritje: "Kërkesa u dërgua. Po presim përgjigjen e shoferit.",
    pranuar: "Shoferi e pranoi kërkesën. Vendi yt është rezervuar.",
    refuzuar: "Kërkesa u refuzua.",
    pa_vende: "Nuk ka vende të lira.",
    hyr: "Hyr me GitHub për të dërguar kërkesë.",
    gabim: "Kërkesën nuk mundëm ta dërgojmë. Kontrollo lidhjen dhe provo sërish.",
  };

  return <section className="live-request" aria-live="polite">
    <p>Vende të lira: <strong>{vende}</strong></p>
    <p className="live-connection" role="status">
      {lidhja === "rilidhje" ? "Lidhja u ndërpre. Po rilidhemi…" : lidhja === "lidhur" ? "Përditësimet live janë aktive." : "Po lidhemi me përditësimet…"}
    </p>
    <p role="status">{mesazhet[status]}</p>
    {status === "pa_derguar" && <button className="action" type="button" disabled={vende < 1 || dukeDergaur} onClick={dergo}>
      {dukeDergaur ? "Po dërgohet…" : "Dërgo kërkesë"}
    </button>}
    {status === "ne_pritje" && vende > 0 && <button className="action" type="button" disabled={dukeDergaur} onClick={dergo}>Provo sërish</button>}
  </section>;
}
