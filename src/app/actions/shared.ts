import "server-only";
import { z } from "zod";
import { Resend } from "resend";
import { mailEnv } from "@/lib/env.server";
import { isRateLimited } from "@/lib/rate-limit";
import { HONEYPOT_FIELD, TIMESTAMP_FIELD, type FormState } from "./form-state";

/**
 * İki formun ortak zemini (PRD §9, ARCHITECTURE §7).
 *
 * Güvenlik üç katmanlı ve hiçbiri CAPTCHA değil:
 *  1. Honeypot — botların doldurduğu, insanların göremediği alan
 *  2. Zaman eşiği — 2 saniyeden hızlı gönderim insan değildir
 *  3. IP başına saatte 5 istek (Upstash)
 *
 * İlk ikisi sessizce BAŞARI döner. Bota "yakalandın" demek, ona bir sonraki
 * denemede neyi değiştireceğini öğretmektir.
 */

export { HONEYPOT_FIELD, TIMESTAMP_FIELD } from "./form-state";
export type { FormState } from "./form-state";

const MIN_SUBMIT_MS = 2000;

/** Bot mu? Öyleyse çağıran sessizce başarı dönmeli. */
export function looksAutomated(formData: FormData): boolean {
  if (formData.get(HONEYPOT_FIELD)) return true;

  const started = Number(formData.get(TIMESTAMP_FIELD));
  if (!Number.isFinite(started)) return true;

  return Date.now() - started < MIN_SUBMIT_MS;
}

export async function guard(scope: string): Promise<FormState | null> {
  if (await isRateLimited(scope)) {
    return {
      status: "error",
      message: "Çok fazla deneme. Bir saat sonra tekrar dene.",
    };
  }
  return null;
}

export function fieldErrors(error: z.ZodError): FormState {
  return {
    status: "error",
    message: "Bazı alanlar eksik ya da hatalı.",
    fieldErrors: z.flattenError(error).fieldErrors as Record<string, string[]>,
  };
}

/**
 * Resend yapılandırılmamışsa gönderim yapılmaz ve bunu KULLANICIYA SÖYLERİZ.
 * Sessizce "gönderildi" demek yalan olurdu — kullanıcı cevap bekler, gelmez.
 */
export async function sendMail(options: {
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<FormState | null> {
  let env;
  try {
    env = mailEnv();
  } catch {
    return {
      status: "error",
      message:
        "E-posta servisi henüz bağlı değil. Bu arada anil.gundduz@gmail.com adresine yazabilirsin.",
    };
  }

  try {
    const resend = new Resend(env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "Portfolyo <onboarding@resend.dev>",
      to: env.CONTACT_EMAIL,
      subject: options.subject,
      text: options.text,
      ...(options.replyTo ? { replyTo: options.replyTo } : {}),
    });

    if (error) throw new Error(error.message);
    return null;
  } catch {
    return {
      status: "error",
      message:
        "E-posta gönderilemedi. Birkaç saniye sonra dene veya anil.gundduz@gmail.com adresine yaz.",
    };
  }
}
