"use server";

import { z } from "zod";
import { COPY } from "@/config/site";
import {
  fieldErrors,
  guard,
  looksAutomated,
  sendMail,
  type FormState,
} from "./shared";

const SubscribeSchema = z.object({
  email: z.email("Geçerli bir e-posta yaz."),
});

/**
 * Abonelik formu (PRD §9).
 *
 * **Çift kayıt sessizce başarı döner.** "Bu adres zaten kayıtlı" demek, bir
 * e-postanın listede olup olmadığını üçüncü kişiye sızdırmaktır.
 */
export async function subscribe(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (looksAutomated(formData)) {
    return { status: "success", message: COPY.subscribe.success };
  }

  const limited = await guard("subscribe");
  if (limited) return limited;

  const parsed = SubscribeSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return fieldErrors(parsed.error);

  const failure = await sendMail({
    subject: "Yeni abone",
    text: parsed.data.email,
    replyTo: parsed.data.email,
  });

  if (failure) return failure;

  return { status: "success", message: COPY.subscribe.success };
}
