import Link from "next/link";
import { profiliIm } from "@/lib/lejet";
import { lexoDheShenoNjoftimin } from "@/lib/njoftimet";

export const dynamic = "force-dynamic";

export default async function Njoftimi({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const notificationId = Number(id);
  if (!/^\d+$/.test(id) || !Number.isSafeInteger(notificationId) || notificationId < 1) {
    return <main className="app-shell"><h1>Njoftimi nuk u gjet</h1><Link href="/panel#njoftimet">← Kthehu te njoftimet</Link></main>;
  }

  let profile;
  try {
    profile = await profiliIm();
  } catch {
    return <main className="app-shell">
      <h1>Njoftimi nuk u hap</h1>
      <p role="alert">Nuk u lidhëm me databazën. Provo përsëri.</p>
      <Link href={`/njoftim/${notificationId}`} prefetch={false}>Provo përsëri</Link>
    </main>;
  }

  if (!profile) return <main className="app-shell">
    <h1>Njoftimi personal</h1>
    <p>Hyr me GitHub për të hapur njoftimin.</p>
    <Link href="/panel">Hyr te paneli</Link>
  </main>;

  if (profile.roli !== "udhetar") return <main className="app-shell">
    <h1>Njoftimi personal</h1>
    <p role="alert">Ky njoftim është vetëm për udhëtarin që dërgoi kërkesën.</p>
    <Link href="/panel">Kthehu te paneli</Link>
  </main>;

  let notification;
  try {
    notification = await lexoDheShenoNjoftimin(notificationId, profile.id);
  } catch {
    return <main className="app-shell">
      <h1>Njoftimi nuk u hap</h1>
      <p role="alert">Nuk mundëm ta ruajmë hapjen. Njoftimi mbetet i palexuar; provo përsëri.</p>
      <Link href={`/njoftim/${notificationId}`} prefetch={false}>Provo përsëri</Link>
    </main>;
  }

  if (!notification) return <main className="app-shell">
    <h1>Njoftimi nuk u gjet</h1>
    <p role="alert">Njoftimi nuk ekziston ose nuk ke leje ta hapësh.</p>
    <Link href="/panel#njoftimet">← Kthehu te njoftimet</Link>
  </main>;

  const statusi = notification.status === "pranuar" ? "U pranua"
    : notification.status === "refuzuar" ? "U refuzua" : "Në pritje";

  return <main className="app-shell">
    <Link href="/panel#njoftimet">← Kthehu te njoftimet</Link>
    <h1>Detajet · kërkesa K-{notification.kerkesa_id}</h1>
    <section className="notification-detail">
      <h2>Kërkesa e {notification.emri}</h2>
      <p>{notification.nisja} → {notification.destinacioni} · {notification.ora}</p>
      <p>Statusi i kërkesës: <strong>{statusi}</strong></p>
      <p>Njoftimi u shënua si i lexuar.</p>
    </section>
  </main>;
}
