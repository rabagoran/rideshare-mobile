import Link from "next/link";
import { notFound } from "next/navigation";
import { gjejUdhetimin } from "@/lib/udhetimet";
import { profiliIm } from "@/lib/lejet";
import Hyrja from "@/components/Hyrja";
import KerkesaLive from "@/components/KerkesaLive";

export const dynamic = "force-dynamic";

export default async function Kerkesa({
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
        <p role="alert">Nuk u lidhëm me databazën. Provo përsëri.</p>
        <Link href="/">← Kthehu te lista</Link>
      </main>
    );
  }

  if (!udhetim) notFound();
  let profili = null;
  try { profili = await profiliIm(); } catch { /* The live form reports a temporary database failure. */ }

  return (
    <main>
      <Link href={`/udhetimi/${id}`}>← Kthehu te detajet</Link>
      <h1>Kërko vend: {udhetim.nisja} – {udhetim.destinacioni}</h1>
      <Hyrja brenda={Boolean(profili)} />
      {!profili ? <p>Hyr me GitHub për të dërguar kërkesë.</p>
        : profili.roli !== "udhetar" ? <p>Kërkesat mund t’i dërgojnë llogaritë me rolin udhëtar.</p>
        : <KerkesaLive udhetimId={udhetim.id} vendeFillestare={udhetim.vende} />}
    </main>
  );
}
