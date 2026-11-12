import "server-only";
import { getSql } from "./db";
import { profiliIm } from "./lejet";

export type GjendjaPreferimeve = {
  perdoruesiKycur: boolean;
  udhetimet: string[];
  numer: number;
};

export async function lexoGjendjenEPreferimeve(): Promise<GjendjaPreferimeve> {
  const profili = await profiliIm();
  if (!profili) return { perdoruesiKycur: false, udhetimet: [], numer: 0 };

  const sql = getSql();
  const rows = await sql`
    SELECT udhetim_id FROM preferimet WHERE github_id = ${profili.id}
  `;
  const udhetimet = rows.map((row) => String(row.udhetim_id));
  return { perdoruesiKycur: true, udhetimet, numer: udhetimet.length };
}

export async function ruajPreferimin(udhetimId: string) {
  const profili = await profiliIm();
  if (!profili) return { ok: false as const, arsyeja: "hyr" as const };
  if (!/^\d+$/.test(udhetimId)) return { ok: false as const, arsyeja: "udhetim" as const };

  // Simulimi refuzon shtimin para shkrimit; heqja mbetet e disponueshme.
  if (process.env.SIMULO_GABIM_PREFERIMI === "1") {
    return { ok: false as const, arsyeja: "ruajtje" as const };
  }

  const sql = getSql();
  const exists = await sql`SELECT id FROM udhetimet WHERE id = ${udhetimId}`;
  if (exists.length === 0) return { ok: false as const, arsyeja: "udhetim" as const };

  await sql`
    INSERT INTO preferimet (github_id, udhetim_id)
    VALUES (${profili.id}, ${udhetimId})
    ON CONFLICT (github_id, udhetim_id) DO NOTHING
  `;

  const count = await sql`SELECT COUNT(*)::int AS numer FROM preferimet WHERE github_id = ${profili.id}`;
  return { ok: true as const, numer: Number(count[0]?.numer ?? 0) };
}
