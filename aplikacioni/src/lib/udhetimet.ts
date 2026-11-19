import "server-only";
import { randomUUID } from "node:crypto";
import { getSql } from "./db";
import { profiliIm } from "./lejet";

export type Udhetim = {
  id: string;
  nisja: string;
  destinacioni: string;
  ora: string;
  vendtakimi: string;
  vende: number;
};

export async function lexoUdhetimet(): Promise<Udhetim[]> {
  const sql = getSql();

  const rows = await sql`
    SELECT id, nisja, destinacioni, ora, vendtakimi, vende
    FROM udhetimet
    ORDER BY id
  `;

  return rows as Udhetim[];
}

export async function gjejUdhetimin(
  id: string
): Promise<Udhetim | undefined> {
  const sql = getSql();

  const rows = await sql`
    SELECT id, nisja, destinacioni, ora, vendtakimi, vende
    FROM udhetimet
    WHERE id = ${id}
  `;

  return rows[0] as Udhetim | undefined;
}

export async function krijoUdhetim(input: {
  nisja: string;
  destinacioni: string;
  ora: string;
  vendtakimi: string;
  vende: number;
}) {
  const p = await profiliIm();
  if (!p) return { status: "hyr" as const };
  if (p.roli !== "shofer") return { status: "ndaluar" as const };

  const nisja = input.nisja.trim();
  const destinacioni = input.destinacioni.trim();
  const vendtakimi = input.vendtakimi.trim();
  if (!nisja || !destinacioni || !vendtakimi || nisja.length > 100 || destinacioni.length > 100 || vendtakimi.length > 160
    || !/^([01]\d|2[0-3]):[0-5]\d$/.test(input.ora) || !Number.isInteger(input.vende) || input.vende < 1 || input.vende > 8) {
    return { status: "fushe" as const };
  }

  const id = randomUUID();
  const sql = getSql();
  const rows = await sql`
    INSERT INTO udhetimet (id, nisja, destinacioni, ora, vendtakimi, vende, shofer_id)
    SELECT ${id}, ${nisja}, ${destinacioni}, ${input.ora}, ${vendtakimi}, ${input.vende}, p.github_id
    FROM profilet p
    WHERE p.github_id = ${p.id} AND p.roli = 'shofer'
    RETURNING id
  `;
  return rows.length === 1 ? { status: "udhetim_krijuar" as const, id } : { status: "ndaluar" as const };
}
