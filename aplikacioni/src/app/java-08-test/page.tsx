import Link from "next/link";
import Vendtakimi from "@/components/Vendtakimi";

export default function Java08Test() {
  return (
    <main>
      <Link href="/">← Kthehu te lista</Link>
      <h1>Java 8 · Prova e vendtakimit</h1>
      <p>Udhëtim prove · Ferizaj → AAB · 08:15</p>
      <p>Të dhëna fiktive. Zgjedhja ruhet vetëm në këtë faqe dhe nuk i dërgohet shoferit.</p>
      <Vendtakimi />
    </main>
  );
}
