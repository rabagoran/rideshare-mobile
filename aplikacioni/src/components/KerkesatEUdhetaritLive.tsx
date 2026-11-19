"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type KerkesaIme = {
  id: number;
  udhetim_id: string;
  status: "ne_pritje" | "pranuar" | "refuzuar";
  nisja: string;
  destinacioni: string;
  ora: string;
  vende: number;
  shofer_emri: string | null;
};

export default function KerkesatEUdhetaritLive() {
  const [kerkesat, setKerkesat] = useState<KerkesaIme[]>([]);
  const [lidhur, setLidhur] = useState(false);

  useEffect(() => {
    let aktiv = true;
    async function lexo() {
      try {
        const response = await fetch("/api/kerkesat", { cache: "no-store" });
        if (!response.ok) throw new Error("leximi dështoi");
        const data = await response.json() as { requests: KerkesaIme[] };
        if (aktiv) {
          setKerkesat(data.requests);
          setLidhur(true);
        }
      } catch {
        if (aktiv) setLidhur(false);
      }
    }
    void lexo();
    const timer = window.setInterval(lexo, 4000);
    return () => {
      aktiv = false;
      window.clearInterval(timer);
    };
  }, []);

  return <section className="traveler-requests" aria-live="polite">
    <h2>Kërkesat e mia</h2>
    <p className="live-connection" role="status">{lidhur ? "Statusi i kërkesave po përditësohet." : "Lidhja u ndërpre. Po rilidhemi…"}</p>
    {kerkesat.length === 0 ? <p>Nuk ke kërkesa për udhëtim.</p> : <ul>
      {kerkesat.map((kerkesa) => <li key={kerkesa.id}>
        <Link href={`/udhetimi/${kerkesa.udhetim_id}`}>
          {kerkesa.nisja} – {kerkesa.destinacioni}, {kerkesa.ora}
        </Link>
        {" · "}
        {kerkesa.status === "ne_pritje" ? "Në pritje të shoferit" : kerkesa.status === "pranuar" ? "U pranua" : "U refuzua"}
        {kerkesa.shofer_emri ? ` · Shoferi: ${kerkesa.shofer_emri}` : ""}
        {` · Vende të lira: ${kerkesa.vende}`}
      </li>)}
    </ul>}
  </section>;
}
