"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ndryshoOren } from "@/lib/lejet";
import { ndryshoRolin } from "@/lib/lejet";
import { krijoUdhetim } from "@/lib/udhetimet";

export async function ruajOren(formData: FormData) {
  let mesazh: string;
  try {
    mesazh = await ndryshoOren(String(formData.get("id") ?? ""), String(formData.get("ora") ?? ""));
  } catch {
    mesazh = "databaza";
  }
  if (mesazh === "ruajtur") {
    revalidatePath("/");
    revalidatePath(`/udhetimi/${String(formData.get("id") ?? "")}`);
  }
  redirect("/panel?m=" + mesazh);
}

export async function ruajRolin(formData: FormData) {
  let mesazh: string;
  try { mesazh = await ndryshoRolin(String(formData.get("roli") ?? "")); }
  catch { mesazh = "databaza"; }
  revalidatePath("/panel");
  redirect("/panel?m=" + mesazh);
}

export async function ruajUdhetimin(formData: FormData) {
  let mesazh: string;
  try {
    const result = await krijoUdhetim({
      nisja: String(formData.get("nisja") ?? ""),
      destinacioni: String(formData.get("destinacioni") ?? ""),
      ora: String(formData.get("ora") ?? ""),
      vendtakimi: String(formData.get("vendtakimi") ?? ""),
      vende: Number(formData.get("vende") ?? 0),
    });
    mesazh = result.status;
  } catch { mesazh = "databaza"; }
  if (mesazh === "udhetim_krijuar") {
    revalidatePath("/");
    revalidatePath("/panel");
  }
  redirect("/panel?m=" + mesazh);
}
