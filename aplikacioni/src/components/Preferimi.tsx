"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { ruajUdhetimin } from "@/app/preferimet-actions";

export default function Preferimi({ udhetimId, iRuajtur, numerFillestar, perdoruesiKycur }: {
  udhetimId: string; iRuajtur: boolean; numerFillestar: number; perdoruesiKycur: boolean;
}) {
  const [ruajtur, setRuajtur] = useState(iRuajtur);
  const [numer, setNumer] = useState(numerFillestar);
  const [mesazhi, setMesazhi] = useState("");
  const [nePritje, startTransition] = useTransition();
  function kliko() {
    if (!perdoruesiKycur) { setMesazhi("Hyr me GitHub që ta ruash këtë udhëtim."); return; }
    if (ruajtur || nePritje) return;
    const numerMePare = numer;
    setRuajtur(true);
    setNumer((v) => v + 1);
    setMesazhi("Po ruhet…");
    startTransition(async () => {
      const rezultat = await ruajUdhetimin(udhetimId);
      if (rezultat.ok) {
        setNumer(rezultat.numer);
        setMesazhi("U ruajt te të preferuarat.");
      } else {
        setRuajtur(false);
        setNumer(numerMePare);
        setMesazhi(rezultat.arsyeja === "hyr" ? "Hyr me GitHub që ta ruash këtë udhëtim." : "Nuk u ruajt. Provo përsëri.");
      }
    });
  }
  return <section className="favorite-box" aria-label="Të preferuarat">
    <button className="favorite-button" type="button" onClick={kliko} disabled={nePritje || ruajtur}>
      <span aria-hidden="true">{ruajtur ? "★" : "☆"}</span>{" "}{nePritje ? "Po ruhet…" : ruajtur ? "I ruajtur" : "Ruaj udhëtimin"}
    </button>
    <p><strong>Të preferuarat: {numer}</strong></p>
    <p className="favorite-note">Preferim personal · jo rezervim</p>
    {mesazhi && <p role="status" aria-live="polite">{mesazhi}{!perdoruesiKycur && <> <Link href="/panel">Hyr me GitHub</Link></>}</p>}
  </section>;
}
