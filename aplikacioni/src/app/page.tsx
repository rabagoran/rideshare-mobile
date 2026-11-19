import Link from "next/link";
import KartaUdhetimi from "@/components/KartaUdhetimi";
import { lexoUdhetimet, type Udhetim } from "@/lib/udhetimet";
import { lexoGjendjenEPreferimeve } from "@/lib/preferimet";
import RifreskoUdhetimet from "@/components/RifreskoUdhetimet";

export const dynamic = "force-dynamic";

export default async function Home() {
  let udhetimet: Udhetim[];

  try {
    udhetimet = await lexoUdhetimet();
  } catch {
    return (
      <main>
        <h1>RideShare</h1>
        <p><Link href="/panel">Hyr / Paneli im</Link></p>
        <p role="alert">Nuk u lidhëm me databazën. Provo përsëri.</p>
        <Link className="action" href="/">Provo përsëri</Link>
      </main>
    );
  }

  let preferimet = { perdoruesiKycur: false, udhetimet: [] as string[], numer: 0 };
  try { preferimet = await lexoGjendjenEPreferimeve(); } catch { /* Lista mbetet e përdorshme nëse tabela e preferimeve mungon. */ }

  return (
    <main>
      <RifreskoUdhetimet gjendjaFillestare={JSON.stringify(udhetimet.map(({ id, vende, ora }) => [id, vende, ora]))} />
      <h1>RideShare · Udhëtimet për AAB</h1>
      <p><Link href="/panel">Hyr / Paneli im</Link></p>
      <p>Burimi: Neon · të dhëna fiktive për ushtrime</p>
      {udhetimet.length === 0 ? (
        <p>Nuk ka udhëtime për momentin.</p>
      ) : (
        <div className="trip-list">
          {udhetimet.map((udhetim) => (
            <KartaUdhetimi key={udhetim.id} udhetim={udhetim}
              iRuajtur={preferimet.udhetimet.includes(udhetim.id)} numerPreferimesh={preferimet.numer}
              perdoruesiKycur={preferimet.perdoruesiKycur} />
          ))}
        </div>
      )}
    </main>
  );
}
