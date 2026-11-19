"use client";

import { useEffect, useState } from "react";
import type { Kerkese, PamjaLive } from "@/lib/kerkesa";

type Udhetim = { id: string; nisja: string; destinacioni: string; vende: number };

export default function ShoferiLive({ udhetimet }: { udhetimet: Udhetim[] }) {
  return <section className="driver-trips">
    <h2>Kërkesat për udhëtimet e mia</h2>
    {udhetimet.length === 0 ? <p>Nuk ke udhëtime të caktuara si shofer. Caktoje shoferin te Neon sipas udhëzimit të Java 10.</p>
      : udhetimet.map((udhetim) => <UdhetimiIShoferit key={udhetim.id} udhetim={udhetim} />)}
  </section>;
}

function UdhetimiIShoferit({ udhetim }: { udhetim: Udhetim }) {
  const [vende, setVende] = useState(udhetim.vende);
  const [kerkesat, setKerkesat] = useState<Kerkese[]>([]);
  const [lidhja, setLidhja] = useState<"po_lidhet" | "lidhur" | "rilidhje">("po_lidhet");
  const [dukeVepruar, setDukeVepruar] = useState<number | null>(null);
  const [mesazh, setMesazh] = useState("");

  useEffect(() => {
    const source = new EventSource(`/api/realtime?udhetimId=${encodeURIComponent(udhetim.id)}`);
    source.onopen = () => setLidhja("lidhur");
    source.onmessage = (event) => {
      const pamja = JSON.parse(event.data) as PamjaLive;
      setVende(pamja.vende);
      setKerkesat(pamja.kerkesat);
      setLidhja("lidhur");
    };
    source.onerror = () => setLidhja("rilidhje");
    source.addEventListener("connection", () => setLidhja("rilidhje"));
    return () => source.close();
  }, [udhetim.id]);

  async function pergjigju(id: number, veprimi: "prano" | "refuzo") {
    setDukeVepruar(id);
    setMesazh("");
    try {
      const response = await fetch(`/api/kerkesat/${id}/${veprimi === "prano" ? "prano" : "refuzo"}`, { method: "POST" });
      const result = await response.json() as { status: string };
      setMesazh(result.status === "pranuar" ? "Kërkesa u pranua." : result.status === "refuzuar" ? "Kërkesa u refuzua." : result.status === "nuk_mund" ? "Kërkesa nuk mund të ndryshohet më." : "Nuk u ruajt përgjigjja. Provo sërish.");
    } catch {
      setMesazh("Lidhja dështoi. Po rilidhemi; statusi i fundit shihet sërish pas rilidhjes.");
    } finally {
      setDukeVepruar(null);
    }
  }

  return <article className="driver-trip" aria-live="polite">
    <h3>{udhetim.nisja} – {udhetim.destinacioni}</h3>
    <p>Vende të lira: <strong>{vende}</strong></p>
    <p className="live-connection" role="status">
      {lidhja === "rilidhje" ? "Lidhja u ndërpre. Po rilidhemi…" : lidhja === "lidhur" ? "Përditësimet live janë aktive." : "Po lidhemi me përditësimet…"}
    </p>
    {mesazh && <p role="status">{mesazh}</p>}
    {kerkesat.length === 0 ? <p>Nuk ka kërkesë.</p> : <ul>
      {kerkesat.map((kerkes) => <li key={kerkes.id}>
        {kerkes.emri}: {kerkes.status === "ne_pritje" ? "në pritje" : kerkes.status === "pranuar" ? "pranuar" : "refuzuar"}
        {kerkes.status === "ne_pritje" && <span className="request-actions">
          <button type="button" disabled={dukeVepruar !== null || vende < 1} onClick={() => pergjigju(kerkes.id, "prano")}>
            {dukeVepruar === kerkes.id ? "Po ruhet…" : vende < 1 ? "Nuk ka vende" : "Prano"}
          </button>
          <button type="button" disabled={dukeVepruar !== null} onClick={() => pergjigju(kerkes.id, "refuzo")}>Refuzo</button>
        </span>}
      </li>)}
    </ul>}
  </article>;
}
