"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Njoftim } from "@/lib/njoftimet";

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
  const [njoftimet, setNjoftimet] = useState<Njoftim[]>([]);
  const [lidhur, setLidhur] = useState(false);
  const [njoftimiRi, setNjoftimiRi] = useState("");
  const idsENjohura = useRef(new Set<number>());
  const uNgarkuaFillimisht = useRef(false);
  const toastTimer = useRef<number | null>(null);

  useEffect(() => {
    let aktiv = true;
    let dukeLexuar = false;
    async function lexo() {
      if (dukeLexuar) return;
      dukeLexuar = true;
      try {
        const [requestsResponse, notificationsResponse] = await Promise.all([
          fetch("/api/kerkesat", { cache: "no-store" }),
          fetch("/api/njoftimet", { cache: "no-store" }),
        ]);
        if (!requestsResponse.ok || !notificationsResponse.ok) throw new Error("leximi dështoi");
        const [requestsData, notificationsData] = await Promise.all([
          requestsResponse.json() as Promise<{ requests: KerkesaIme[] }>,
          notificationsResponse.json() as Promise<{ notifications: Njoftim[] }>,
        ]);
        if (aktiv) {
          const notifications = notificationsData.notifications;
          const teReja = notifications.filter((notification) => !idsENjohura.current.has(notification.id));
          for (const notification of notifications) idsENjohura.current.add(notification.id);
          if (uNgarkuaFillimisht.current && teReja.length > 0) {
            setNjoftimiRi(teReja.map((notification) =>
              `Përgjigje për kërkesën K-${notification.kerkesa_id}`
            ).join(" · "));
            if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
            toastTimer.current = window.setTimeout(() => setNjoftimiRi(""), 5000);
          }
          uNgarkuaFillimisht.current = true;
          setKerkesat(requestsData.requests);
          setNjoftimet(notifications);
          setLidhur(true);
        }
      } catch {
        if (aktiv) setLidhur(false);
      } finally {
        dukeLexuar = false;
      }
    }
    void lexo();
    const timer = window.setInterval(lexo, 4000);
    return () => {
      aktiv = false;
      window.clearInterval(timer);
      if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    };
  }, []);

  return <section className="traveler-requests" aria-live="polite">
    <h2>Kërkesat e mia</h2>
    <p className="live-connection" role="status">{lidhur ? "Statusi i kërkesave po përditësohet." : "Lidhja u ndërpre. Po rilidhemi…"}</p>
    <section id="njoftimet" className="notifications">
      <h3>Njoftimet · {njoftimet.filter((notification) => notification.read_at === null).length} të palexuar</h3>
      {njoftimiRi && <p className="notification-toast" role="status">{njoftimiRi}</p>}
      {njoftimet.length === 0 ? <p>Ende nuk ke njoftime.</p> : <ul>
        {njoftimet.map((notification) => <li key={notification.id}>
          <strong>{notification.read_at === null ? "I palexuar · " : "I lexuar · "}</strong>
          {notification.tipi === "pranuar" ? "Shoferi e pranoi kërkesën" : "Shoferi e refuzoi kërkesën"}
          {` · Kërkesa K-${notification.kerkesa_id} · ${notification.nisja} – ${notification.destinacioni}`}
          {" · "}
          <Link href={`/njoftim/${notification.id}`} prefetch={false}>Hap kërkesën K-{notification.kerkesa_id}</Link>
        </li>)}
      </ul>}
    </section>
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
