import "server-only";
import { getSql } from "./db";

export type Njoftim = {
  id: number;
  kerkesa_id: number;
  tipi: "pranuar" | "refuzuar";
  created_at: string;
  read_at: string | null;
  udhetim_id: string;
  status: "ne_pritje" | "pranuar" | "refuzuar";
  emri: string;
  nisja: string;
  destinacioni: string;
  ora: string;
};

export async function lexoNjoftimet(udhetarId: string): Promise<Njoftim[]> {
  const sql = getSql();
  return await sql`
    SELECT n.id, n.kerkesa_id, n.tipi, n.created_at, n.read_at,
      k.udhetim_id, k.status, k.emri, u.nisja, u.destinacioni, u.ora
    FROM njoftimet n
    JOIN kerkesat k ON k.id = n.kerkesa_id AND k.udhetar_id = n.udhetar_id
    JOIN udhetimet u ON u.id = k.udhetim_id
    WHERE n.udhetar_id = ${udhetarId}
    ORDER BY n.created_at DESC, n.id DESC
  ` as Njoftim[];
}

export async function lexoDheShenoNjoftimin(id: number, udhetarId: string) {
  const sql = getSql();
  const rows = await sql`
    WITH njoftim_i_hapur AS (
      UPDATE njoftimet n SET read_at = COALESCE(n.read_at, NOW())
      WHERE n.id = ${id} AND n.udhetar_id = ${udhetarId}
        AND EXISTS (
          SELECT 1 FROM kerkesat k
          WHERE k.id = n.kerkesa_id AND k.udhetar_id = n.udhetar_id
        )
      RETURNING n.id, n.kerkesa_id, n.tipi, n.created_at, n.read_at
    )
    SELECT n.id AS njoftim_id, n.kerkesa_id, n.tipi, n.created_at, n.read_at,
      k.udhetim_id, k.status, k.emri, u.nisja, u.destinacioni, u.ora
    FROM njoftim_i_hapur n
    JOIN kerkesat k ON k.id = n.kerkesa_id AND k.udhetar_id = ${udhetarId}
    JOIN udhetimet u ON u.id = k.udhetim_id
  `;
  return rows[0] ?? null;
}
