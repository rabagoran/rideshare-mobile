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
  if (!/^\d+$/.test(udhetimId)) return { status: "udhetim" as const };

  const sql = getSql();
  const rows = await sql`
    INSERT INTO kerkesat (udhetim_id, udhetar_id, emri, status)
    SELECT u.id, ${profili.id}, ${profili.emri}, 'ne_pritje'
    FROM udhetimet u
    WHERE u.id = ${udhetimId} AND u.vende > 0 AND u.shofer_id IS DISTINCT FROM ${profili.id}
    ON CONFLICT (udhetim_id, udhetar_id) DO NOTHING
    RETURNING id, status
  `;
  if (rows.length) return { status: String(rows[0].status) as "ne_pritje", id: Number(rows[0].id) };

  const existing = await sql`
    SELECT k.id, k.status, u.vende
    FROM kerkesat k JOIN udhetimet u ON u.id = k.udhetim_id
    WHERE k.udhetim_id = ${udhetimId} AND k.udhetar_id = ${profili.id}
  `;
  if (!existing.length) return { status: "pa_vende" as const };
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
      SELECT k.id, k.udhetim_id
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
    ), prano AS (
      UPDATE kerkesat k SET status = 'pranuar', perditesuar_ne = NOW()
      FROM candidate c, zbrit_vendet z
      WHERE k.id = c.id AND k.status = 'ne_pritje'
      RETURNING k.id
    )
    SELECT id FROM prano
  `;
  if (rows.length) return "pranuar";
  const current = await sql`SELECT status FROM kerkesat WHERE id = ${id}`;
  return current[0]?.status === "pranuar" ? "pranuar" : "nuk_mund";
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
    FROM udhetimet WHERE shofer_id = ${githubId} ORDER BY id
  ` as { id: string; nisja: string; destinacioni: string; ora: string; vendtakimi: string; vende: number }[];
}
