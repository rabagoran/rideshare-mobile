import "server-only";
import { getSql } from "./db";
import { profiliIm } from "./lejet";

export type Kerkese = {
  id: number;
  udhetim_id: string;
  udhetar_id: string;
  emri: string;
  status: "ne_pritje" | "pranuar" | "refuzuar";
  krijuar_ne: string;
};

export type PamjaLive = {
  vende: number;
  kerkesat: Kerkese[];
};

export async function krijoKerkese(udhetimId: string) {
  const profili = await profiliIm();
  if (!profili) return { status: "hyr" as const };
  if (profili.roli !== "udhetar") return { status: "rol" as const };
  if (!/^[a-zA-Z0-9-]{1,80}$/.test(udhetimId)) return { status: "udhetim" as const };

  const sql = getSql();
  const rows = await sql`
    INSERT INTO kerkesat (udhetim_id, udhetar_id, emri, status)
    SELECT u.id, ${profili.id}, ${profili.emri}, 'ne_pritje'
    FROM udhetimet u
    WHERE u.id = ${udhetimId} AND u.vende > 0 AND u.shofer_id IS DISTINCT FROM ${profili.id}
    ON CONFLICT (udhetim_id, udhetar_id) WHERE status IN ('ne_pritje', 'pranuar') DO NOTHING
    RETURNING id, status
  `;
  if (rows.length) return { status: String(rows[0].status) as "ne_pritje", id: Number(rows[0].id) };

  const existing = await sql`
    SELECT k.id, k.status, u.vende
    FROM kerkesat k JOIN udhetimet u ON u.id = k.udhetim_id
    WHERE k.udhetim_id = ${udhetimId} AND k.udhetar_id = ${profili.id}
    ORDER BY k.krijuar_ne DESC LIMIT 1
  `;
  if (!existing.length) {
    const trip = await sql`SELECT vende, shofer_id FROM udhetimet WHERE id = ${udhetimId}`;
    if (!trip.length) return { status: "udhetim" as const };
    if (trip[0].shofer_id === profili.id) return { status: "rol" as const };
    return { status: "pa_vende" as const };
  }
  if (String(existing[0].status) === "refuzuar") return { status: "refuzuar" as const };
  return { status: String(existing[0].status) as "ne_pritje" | "pranuar", id: Number(existing[0].id) };
}

export async function pranoKerkese(id: number) {
  const profili = await profiliIm();
  if (!profili) return "hyr";
  if (profili.roli !== "shofer") return "ndaluar";
  if (!Number.isSafeInteger(id) || id < 1) return "fushe";

  const sql = getSql();
  const rows = await sql`
    WITH candidate AS MATERIALIZED (
      SELECT k.id, k.udhetim_id, k.udhetar_id
      FROM kerkesat k
      JOIN udhetimet u ON u.id = k.udhetim_id
      WHERE k.id = ${id} AND k.status = 'ne_pritje'
        AND u.shofer_id = ${profili.id} AND u.vende > 0
      FOR UPDATE OF k, u
    ), zbrit_vendet AS (
      UPDATE udhetimet u SET vende = u.vende - 1
      FROM candidate c
      WHERE u.id = c.udhetim_id AND u.vende > 0
      RETURNING u.id
    ), pergjigju AS (
      UPDATE kerkesat k SET status = 'pranuar', perditesuar_ne = NOW()
      FROM candidate c, zbrit_vendet z
      WHERE k.id = c.id AND k.status = 'ne_pritje'
      RETURNING k.id, k.udhetar_id, k.status
    ), njofto AS (
      INSERT INTO njoftimet (kerkesa_id, udhetar_id, tipi)
      SELECT id, udhetar_id, status FROM pergjigju
      ON CONFLICT (kerkesa_id) DO NOTHING
      RETURNING id
    )
    SELECT p.id FROM pergjigju p LEFT JOIN njofto n ON TRUE
  `;
  if (rows.length) return "pranuar";
  const current = await sql`SELECT status FROM kerkesat WHERE id = ${id}`;
  return current[0]?.status === "pranuar" ? "pranuar" : "nuk_mund";
}

export async function refuzoKerkese(id: number) {
  const profili = await profiliIm();
  if (!profili) return "hyr";
  if (profili.roli !== "shofer") return "ndaluar";
  if (!Number.isSafeInteger(id) || id < 1) return "fushe";

  const sql = getSql();
  const rows = await sql`
    WITH pergjigju AS (
      UPDATE kerkesat k SET status = 'refuzuar', perditesuar_ne = NOW()
      FROM udhetimet u
      WHERE k.id = ${id} AND k.udhetim_id = u.id AND k.status = 'ne_pritje'
        AND u.shofer_id = ${profili.id}
        AND EXISTS (SELECT 1 FROM profilet p WHERE p.github_id = ${profili.id} AND p.roli = 'shofer')
      RETURNING k.id, k.udhetar_id, k.status
    ), njofto AS (
      INSERT INTO njoftimet (kerkesa_id, udhetar_id, tipi)
      SELECT id, udhetar_id, status FROM pergjigju
      ON CONFLICT (kerkesa_id) DO NOTHING
      RETURNING id
    )
    SELECT p.id FROM pergjigju p LEFT JOIN njofto n ON TRUE
  `;
  if (rows.length) return "refuzuar";
  const current = await sql`SELECT status FROM kerkesat WHERE id = ${id}`;
  return current[0]?.status === "refuzuar" ? "refuzuar" : "nuk_mund";
}

export async function lexoKerkesatEUdhetarit() {
  const p = await profiliIm();
  if (!p || p.roli !== "udhetar") return [];
  const sql = getSql();
  return await sql`
    SELECT k.id, k.udhetim_id, k.status, k.krijuar_ne,
      u.nisja, u.destinacioni, u.ora, u.vende,
      shofer.emri AS shofer_emri
    FROM kerkesat k
    JOIN udhetimet u ON u.id = k.udhetim_id
    LEFT JOIN profilet shofer ON shofer.github_id = u.shofer_id
    WHERE k.udhetar_id = ${p.id}
    ORDER BY k.krijuar_ne DESC
  `;
}

export async function lexoPamjenLive(udhetimId: string, githubId: string): Promise<PamjaLive | null> {
  const sql = getSql();
  const profile = await sql`SELECT roli FROM profilet WHERE github_id = ${githubId}`;
  if (!profile.length) return null;
  const rows = await sql`
    SELECT u.vende, u.shofer_id, p.roli
    FROM udhetimet u CROSS JOIN profilet p
    WHERE u.id = ${udhetimId} AND p.github_id = ${githubId}
  `;
  if (!rows.length) return null;
  const driver = rows[0].shofer_id === githubId && rows[0].roli === "shofer";
  const kerkesat = driver
    ? await sql`SELECT id, udhetim_id, udhetar_id, emri, status, krijuar_ne FROM kerkesat WHERE udhetim_id = ${udhetimId} ORDER BY krijuar_ne DESC`
    : await sql`SELECT id, udhetim_id, udhetar_id, emri, status, krijuar_ne FROM kerkesat WHERE udhetim_id = ${udhetimId} AND udhetar_id = ${githubId} ORDER BY krijuar_ne DESC`;
  return { vende: Number(rows[0].vende), kerkesat: kerkesat as unknown as Kerkese[] };
}

export async function lexoUdhetimetEShoferit(githubId: string) {
  const sql = getSql();
  return await sql`
    SELECT id, nisja, destinacioni, ora, vendtakimi, vende
    FROM udhetimet u
    WHERE u.shofer_id = ${githubId}
      AND EXISTS (SELECT 1 FROM profilet p WHERE p.github_id = ${githubId} AND p.roli = 'shofer')
    ORDER BY id
  ` as { id: string; nisja: string; destinacioni: string; ora: string; vendtakimi: string; vende: number }[];
}
