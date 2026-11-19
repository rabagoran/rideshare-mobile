"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PamjaLive } from "@/lib/kerkesa";

export default function UdhetimiLive({ udhetimId, vendeFillestare }: { udhetimId: string; vendeFillestare: number }) {
  const [vende, setVende] = useState(vendeFillestare);
  const [lidhja, setLidhja] = useState<"po_lidhet" | "lidhur" | "rilidhje">("po_lidhet");

  useEffect(() => {
    const source = new EventSource(`/api/realtime?udhetimId=${encodeURIComponent(udhetimId)}`);
    source.onopen = () => setLidhja("lidhur");
    source.onmessage = (event) => {
      const pamja = JSON.parse(event.data) as PamjaLive;
      setVende(pamja.vende);
      setLidhja("lidhur");
    };
    source.onerror = () => setLidhja("rilidhje");
    source.addEventListener("connection", () => setLidhja("rilidhje"));
    return () => source.close();
  }, [udhetimId]);

  return <>
    <p aria-live="polite">Vende të lira: <strong>{vende}</strong></p>
    <p className="live-connection" role="status">
      {lidhja === "rilidhje" ? "Lidhja u ndërpre. Po rilidhemi…" : lidhja === "lidhur" ? "Përditësimet live janë aktive." : "Po lidhemi me përditësimet…"}
    </p>
    {vende > 0 ? <Link className="action" href={`/udhetimi/${udhetimId}/kerkesa`}>Kërko vend</Link>
      : <button className="action" disabled>Nuk ka vende të lira</button>}
  </>;
}
