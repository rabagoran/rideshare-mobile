"use client";

import { useState } from "react";

export default function Vendtakimi() {
  const [teksti, setTeksti] = useState("");
  const [vendtakimi, setVendtakimi] = useState("");
  const [dukeKerkuar, setDukeKerkuar] = useState(false);
  const [mesazhi, setMesazhi] = useState("");

  function konfirmo() {
    const iPastruar = teksti.trim();
    if (!iPastruar) {
      setMesazhi("Shkruaj vendtakimin para konfirmimit.");
      return;
    }
    setVendtakimi(iPastruar);
    setMesazhi("Vendtakimi u konfirmua në këtë telefon.");
  }

  function perdorVendndodhjen() {
    if (!navigator.geolocation) {
      setMesazhi("Ky shfletues nuk e mbështet vendndodhjen. Shkruaj vendtakimin vetë.");
      return;
    }

    setDukeKerkuar(true);
    setMesazhi("Po kërkojmë vendndodhjen…");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setDukeKerkuar(false);
        setMesazhi(`Pozicioni u mor. Saktësia: rreth ${Math.round(position.coords.accuracy)} m.`);
      },
      (error) => {
        setDukeKerkuar(false);
        if (error.code === 1) setMesazhi("Leja u refuzua. Shkruaj vendtakimin vetë.");
        else if (error.code === 2) setMesazhi("Pozicioni nuk është i disponueshëm. Shkruaj vendtakimin vetë.");
        else if (error.code === 3) setMesazhi("Koha mbaroi. Provo sërish ose shkruaj vendtakimin vetë.");
        else setMesazhi("Vendndodhja nuk u mor. Shkruaj vendtakimin vetë.");
      },
      { timeout: 10000 },
    );
  }

  return (
    <section className="trip-card" aria-labelledby="vendtakimi-title" data-testid="vendtakimi">
      <h2 id="vendtakimi-title">Zgjidh vendtakimin</h2>
      <label htmlFor="vendtakimi-input">Shkruaj vendtakimin</label>
      <input id="vendtakimi-input" data-testid="vendtakimi-input" value={teksti} onChange={(event) => setTeksti(event.target.value)} placeholder="p.sh. Biblioteka" />
      <div className="meeting-actions">
        <button className="action" type="button" onClick={konfirmo} data-testid="konfirmo-vendtakimin">Konfirmo në telefon</button>
        <button className="action secondary-action" type="button" onClick={perdorVendndodhjen} disabled={dukeKerkuar} data-testid="perdor-vendndodhjen">
          {dukeKerkuar ? "Po kërkojmë vendndodhjen…" : "Përdor vendndodhjen time"}
        </button>
      </div>
      <p role="status" aria-live="polite" data-testid="vendtakimi-status">{mesazhi || "Vendndodhja kërkohet vetëm kur shtyp butonin."}</p>
      <p data-testid="vendtakimi-konfirmuar">Vendtakimi i konfirmuar: <strong>{vendtakimi || "Ende nuk është zgjedhur"}</strong></p>
    </section>
  );
}
