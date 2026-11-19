import Link from "next/link";
import Hyrja from "@/components/Hyrja";
import ShoferiLive from "@/components/ShoferiLive";
import KerkesatEUdhetaritLive from "@/components/KerkesatEUdhetaritLive";
import { profiliIm } from "@/lib/lejet";
import { lexoUdhetimetEShoferit } from "@/lib/kerkesa";
import { ruajOren, ruajRolin, ruajUdhetimin } from "./actions";

export const dynamic = "force-dynamic";

const mesazhet: Record<string, string> = {
  hyr: "Hyr me GitHub për të vazhduar.",
  ndaluar: "Ky veprim nuk lejohet për rolin ose udhëtimin tënd.",
  fushe: "Kontrollo fushat dhe provo përsëri.",
  ruajtur: "Ora u ruajt me sukses.",
  roli_ruajtur: "Roli u përditësua.",
  udhetim_krijuar: "Udhëtimi u publikua dhe tani shfaqet në listë.",
  databaza: "Nuk u lidhëm me databazën. Kontrollo konfigurimin e serverit dhe provo përsëri.",
};

export default async function Panel({ searchParams }: { searchParams: Promise<{ m?: string }> }) {
  const { m } = await searchParams;
  let profili;
  let udhetimet: Awaited<ReturnType<typeof lexoUdhetimetEShoferit>> = [];
  try {
    profili = await profiliIm();
    if (profili?.roli === "shofer") udhetimet = await lexoUdhetimetEShoferit(profili.id);
  } catch {
    return <main className="app-shell"><h1>Paneli im</h1><p role="alert">{mesazhet.databaza}</p><Link href="/panel">Provo përsëri</Link></main>;
  }

  return <main className="app-shell">
    <h1>Paneli im</h1>
    {m && mesazhet[m] && <p role="status">{mesazhet[m]}</p>}
    {!profili ? <p>Hyr me llogarinë tënde GitHub. Në hyrjen e parë profili krijohet automatikisht.</p> : <>
      <p>Përshëndetje, {profili.emri}. Roli yt: <strong>{profili.roli === "shofer" ? "shofer" : "udhëtar"}</strong>.</p>
      <form action={ruajRolin} className="role-form">
        <label htmlFor="roli">Zgjidh rolin për këtë llogari</label>
        <select id="roli" name="roli" defaultValue={profili.roli}>
          <option value="udhetar">Udhëtar</option>
          <option value="shofer">Shofer</option>
        </select>
        <button type="submit">Ruaj rolin</button>
      </form>
    </>}
    <Hyrja brenda={Boolean(profili)} />

    {profili?.roli === "shofer" ? <>
      <section className="create-trip">
        <h2>Krijo udhëtim</h2>
        <form action={ruajUdhetimin}>
          <label htmlFor="nisja">Nisja</label>
          <input id="nisja" name="nisja" maxLength={100} required />
          <label htmlFor="destinacioni">Destinacioni</label>
          <input id="destinacioni" name="destinacioni" maxLength={100} required />
          <label htmlFor="ora">Ora e nisjes</label>
          <input id="ora" name="ora" type="time" required />
          <label htmlFor="vendtakimi">Vendtakimi</label>
          <input id="vendtakimi" name="vendtakimi" maxLength={160} required />
          <label htmlFor="vende">Vende të lira</label>
          <input id="vende" name="vende" type="number" min="1" max="8" defaultValue="3" required />
          <button type="submit">Publiko udhëtimin</button>
        </form>
      </section>
      {udhetimet.length > 0 && <form action={ruajOren} className="edit-trip-time">
        <h2>Ndrysho orën e udhëtimit</h2>
        <label htmlFor="udhetim-ora">Udhëtimi</label>
        <select id="udhetim-ora" name="id">
          {udhetimet.map((u) => <option key={u.id} value={u.id}>{u.nisja} – {u.destinacioni}</option>)}
        </select>
        <label htmlFor="ora-re">Ora e re</label>
        <input id="ora-re" name="ora" type="time" defaultValue={udhetimet[0].ora} required />
        <button type="submit">Ruaj orën</button>
      </form>}
      <ShoferiLive udhetimet={udhetimet} />
    </> : profili ? <KerkesatEUdhetaritLive /> : null}

    <p><Link href="/">Kthehu te udhëtimet</Link></p>
  </main>;
}
