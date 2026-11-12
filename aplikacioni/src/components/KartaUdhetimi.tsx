import Link from "next/link";
import type { Udhetim } from "@/lib/udhetimet";
import Preferimi from "@/components/Preferimi";

export default function KartaUdhetimi({ udhetim, iRuajtur, numerPreferimesh, perdoruesiKycur }: {
  udhetim: Udhetim; iRuajtur: boolean; numerPreferimesh: number; perdoruesiKycur: boolean;
}) {
  return (
    <article className="trip-card">
      <h2>
        {udhetim.nisja} – {udhetim.destinacioni}
      </h2>
      <p>
        Ora: {udhetim.ora} · Vende të lira: {udhetim.vende}
      </p>
      <Preferimi udhetimId={udhetim.id} iRuajtur={iRuajtur} numerFillestar={numerPreferimesh} perdoruesiKycur={perdoruesiKycur} />
      <Link className="action" href={`/udhetimi/${udhetim.id}`}>
        Shiko detajet
      </Link>
    </article>
  );
}
