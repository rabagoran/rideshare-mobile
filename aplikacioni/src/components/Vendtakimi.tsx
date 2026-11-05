"use client";

import { useState } from "react";

export default function Vendtakimi() {
  const [teksti, setTeksti] = useState("");
  const [vendtakimi, setVendtakimi] = useState("");
  const [gabimiTekstit, setGabimiTekstit] = useState("");
  const [gjendja, setGjendja] = useState<"idle" | "loading" | "success" | "denied" | "timeout" | "unavailable">("idle");
  const [mesazhiVendndodhjes, setMesazhiVendndodhjes] = useState("");
  const [saktesia, setSaktesia] = useState<number | null>(null);

  function konfirmo() {
    const iPastruar = teksti.trim();
    if (!iPastruar) {
      setGabimiTekstit("Shkruaj vendtakimin para konfirmimit.");
      return;
    }
    setVendtakimi(iPastruar);
    setGabimiTekstit("");
  }

  function perdorVendndodhjen() {
    if (!navigator.geolocation) {
      setGjendja("unavailable");
      setMesazhiVendndodhjes("Ky shfletues nuk e mbështet vendndodhjen. Shkruaj vendtakimin vetë.");
      return;
    }

    setGjendja("loading");
    setMesazhiVendndodhjes("Po kërkojmë vendndodhjen…");
    setSaktesia(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const metra = Math.round(position.coords.accuracy);
        setGjendja("success");
        setMesazhiVendndodhjes("Pozicioni u mor.");
        setSaktesia(metra);
      },
      (error) => {
        if (error.code === 1) {
          setGjendja("denied");
          setMesazhiVendndodhjes("Leja u refuzua. Shkruaj vendtakimin vetë.");
        } else if (error.code === 3) {
          setGjendja("timeout");
          setMesazhiVendndodhjes("Koha mbaroi. Provo sërish ose shkruaj vendtakimin vetë.");
        } else {
          setGjendja("unavailable");
          setMesazhiVendndodhjes("Pozicioni nuk është i disponueshëm. Shkruaj vendtakimin vetë.");
        }
      },
      { timeout: 10000 },
    );
  }

  return (
    <section className="trip-card" aria-labelledby="vendtakimi-title" data-testid="vendtakimi">
      <h2 id="vendtakimi-title">Zgjidh vendtakimin</h2>
      <label htmlFor="vendtakimi-input">Shkruaj vendtakimin</label>
      <input id="vendtakimi-input" data-testid="meeting-input" value={teksti} onChange={(event) => setTeksti(event.target.value)} placeholder="p.sh. Biblioteka" />
      <div className="meeting-actions">
        <button className="action" type="button" onClick={konfirmo} data-testid="confirm-meeting">Konfirmo në telefon</button>
        <button className="action secondary-action" type="button" onClick={perdorVendndodhjen} disabled={gjendja === "loading"} data-testid="locate-me">
          {gjendja === "loading" ? "Po kërkojmë vendndodhjen…" : "Përdor vendndodhjen time"}
        </button>
      </div>
      <p role="alert" aria-live="polite" data-testid="meeting-error">{gabimiTekstit}</p>
      <p role="status" aria-live="polite" data-testid="location-status" data-state={gjendja}>{mesazhiVendndodhjes || "Vendndodhja kërkohet vetëm kur shtyp butonin."}</p>
      <p data-testid="location-accuracy">{saktesia === null ? "" : `Saktësia: rreth ${saktesia} m.`}</p>
      <p data-testid="confirmed-meeting">Vendtakimi i konfirmuar: <strong>{vendtakimi || "Ende nuk është zgjedhur"}</strong></p>
    </section>
  );
}
