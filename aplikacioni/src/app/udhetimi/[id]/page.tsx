import Link from "next/link";
import { notFound } from "next/navigation";
import { gjejUdhetimin } from "@/lib/udhetimet";

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

  return (
    <main>
      <Link href="/">← Kthehu te lista</Link>

      <h1>
        {udhetim.nisja} – {udhetim.destinacioni}
      </h1>

      <p>Ora: {udhetim.ora}</p>
      <p>Vendtakimi: {udhetim.vendtakimi}</p>
      <p>Vende të lira: {udhetim.vende}</p>

      {udhetim.vende > 0 ? (
        <Link
          className="action"
          href={`/udhetimi/${id}/kerkesa`}
        >
          Kërko vend
        </Link>
      ) : (
        <button className="action" disabled>
          Nuk ka vende të lira
        </button>
      )}
    </main>
  );
}
