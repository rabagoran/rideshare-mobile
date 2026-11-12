"use server";
import { ruajPreferimin } from "@/lib/preferimet";

export async function ruajUdhetimin(udhetimId: string) {
  try { return await ruajPreferimin(udhetimId); }
  catch { return { ok: false as const, arsyeja: "ruajtje" as const }; }
}
