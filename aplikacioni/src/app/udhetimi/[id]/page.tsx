import Link from "next/link";
import { notFound } from "next/navigation";
import { gjejUdhetimin } from "@/lib/udhetimet";
import Vendtakimi from "@/components/Vendtakimi";
import Preferimi from "@/components/Preferimi";
import UdhetimiLive from "@/components/UdhetimiLive";
import { lexoGjendjenEPreferimeve } from "@/lib/preferimet";

export const dynamic = "force-dynamic";

export default async function Detajet({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let udhetim;

  try {
    udhetim = await gjejUdhetimin(id);
  } catch {
    return (
      <main>
        <h1>RideShare</h1>
        <p role="alert">Detajet nuk u ngarkuan sepse databaza nuk u lidh.</p>
        <p>Kontrollo lidhjen dhe provo përsëri, ose kthehu te lista.</p>
        <p><Link className="action" href={`/udhetimi/${id}`} prefetch={false}>Provo përsëri</Link></p>
        <Link href="/">← Kthehu te lista</Link>
      </main>
    );
  }

  if (!udhetim) notFound();

  let preferimet = { perdoruesiKycur: false, udhetimet: [] as string[], numer: 0 };
  try { preferimet = await lexoGjendjenEPreferimeve(); } catch { /* Faqja e udhëtimit mbetet e lexueshme nëse tabela mungon. */ }

  return (
    <main>
      <Link href="/">← Kthehu te lista</Link>

      <h1>
        {udhetim.nisja} – {udhetim.destinacioni}
      </h1>

      <p>Ora: {udhetim.ora}</p>
      <p>Vendtakimi: {udhetim.vendtakimi}</p>
      <UdhetimiLive udhetimId={udhetim.id} vendeFillestare={udhetim.vende} />

      <Preferimi udhetimId={udhetim.id} iRuajtur={preferimet.udhetimet.includes(udhetim.id)}
        numerFillestar={preferimet.numer} perdoruesiKycur={preferimet.perdoruesiKycur} />

      <Vendtakimi />

    </main>
  );
}
