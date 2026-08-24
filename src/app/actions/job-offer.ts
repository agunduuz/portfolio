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

/**
 * İş teklifi formu (PRD §9).
 *
 * Dört alan da zorunlu ve serbest metin — "job type" için `<select>` bilinçli
 * olarak kullanılmadı, tasarımda dördü de metin kutusu.
 */
const JobOfferSchema = z.object({
  location: z.string().trim().min(2, "Lokasyon en az 2 karakter olmalı."),
  type: z.string().trim().min(2, "İş tipini yaz (ör. tam zamanlı, freelance)."),
  technology: z.string().trim().min(2, "Kullanılacak teknolojiyi yaz."),
  amount: z.string().trim().min(1, "Teklif tutarını yaz."),
});

export async function sendJobOffer(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  // Bota yakalandığını söylemeyiz; sessizce başarı.
  if (looksAutomated(formData)) {
    return { status: "success", message: COPY.jobOffers.success };
  }

  const limited = await guard("job-offer");
  if (limited) return limited;

  const parsed = JobOfferSchema.safeParse({
    location: formData.get("location"),
    type: formData.get("type"),
    technology: formData.get("technology"),
    amount: formData.get("amount"),
  });

  if (!parsed.success) return fieldErrors(parsed.error);

  const { location, type, technology, amount } = parsed.data;

  const failure = await sendMail({
    subject: `İş teklifi — ${type} · ${location}`,
    text: [
      `Lokasyon : ${location}`,
      `Tip      : ${type}`,
      `Teknoloji: ${technology}`,
      `Tutar    : ${amount}`,
    ].join("\n"),
  });

  if (failure) return failure;

  return { status: "success", message: COPY.jobOffers.success };
}
