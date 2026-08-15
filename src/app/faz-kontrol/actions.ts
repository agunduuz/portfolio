"use server";

import { revalidatePath } from "next/cache";
import { toggleItem, type ToggleResult } from "./roadmap";

/** GEÇİCİ — Faz Kontrol paneli. Proje bitince bu klasör silinir. */

export async function toggleTask(
  line: number,
  expectedText: string,
): Promise<ToggleResult> {
  if (process.env.NODE_ENV === "production") {
    return { ok: false, error: "Faz Kontrol yalnızca geliştirmede çalışır." };
  }

  const result = await toggleItem(line, expectedText);
  if (result.ok) revalidatePath("/faz-kontrol");
  return result;
}
