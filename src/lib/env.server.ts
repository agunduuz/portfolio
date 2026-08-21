import "server-only";
import { z } from "zod";

/**
 * Sunucu sırları — **faz faz bölünmüş**.
 *
 * Önceki hâli yedi değişkeni tek şemada doğruluyordu; bu, Faz 3'ü Faz 6'nın
 * anahtarlarına bağımlı kılıyordu. GitHub verisini çekmek için Resend ve
 * Upstash anahtarı istemek yanlış: bir grubu okuyan modül yalnızca kendi
 * grubunu doğrulamalı.
 *
 * Her grup ilk kullanımda parse edilir ve sonucu cache'lenir. Eksik değişken
 * yalnızca o gruba dokunulduğunda hata verir.
 */

/** Faz 3 — GitHub verisi ve revalidate webhook'u. */
const githubSchema = z.object({
  GITHUB_TOKEN: z.string().min(1),
  GITHUB_USERNAME: z.string().min(1),
  GITHUB_WEBHOOK_SECRET: z.string().min(1),
});

/** Faz 6 — formlar. */
const mailSchema = z.object({
  RESEND_API_KEY: z.string().min(1),
  CONTACT_EMAIL: z.email(),
  UPSTASH_REDIS_REST_URL: z.url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
});

export type GitHubEnv = z.infer<typeof githubSchema>;
export type MailEnv = z.infer<typeof mailSchema>;

/**
 * Hata mesajı yalnızca eksik anahtarların ADINI taşır. Değer asla loglanmaz —
 * sunucu logları da bir sızıntı yüzeyidir.
 */
function reader<T extends z.ZodType>(schema: T, source: () => unknown) {
  let cached: z.infer<T> | null = null;

  return (): z.infer<T> => {
    if (cached) return cached;

    const parsed = schema.safeParse(source());
    if (!parsed.success) {
      const keys = parsed.error.issues.map((i) => i.path.join(".")).join(", ");
      throw new Error(
        `Eksik veya hatalı ortam değişkeni: ${keys}. .env.example dosyasına bak.`,
      );
    }

    cached = parsed.data;
    return cached;
  };
}

export const githubEnv = reader(githubSchema, () => ({
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  GITHUB_USERNAME: process.env.GITHUB_USERNAME,
  GITHUB_WEBHOOK_SECRET: process.env.GITHUB_WEBHOOK_SECRET,
}));

export const mailEnv = reader(mailSchema, () => ({
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CONTACT_EMAIL: process.env.CONTACT_EMAIL,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
}));

/**
 * GitHub anahtarları var mı? `getGitHub()` bunu sorup yoksa sessizce
 * fallback'e düşer — token'ı olmayan bir geliştirici de siteyi çalıştırabilsin.
 */
export function hasGitHubEnv(): boolean {
  return Boolean(process.env.GITHUB_TOKEN && process.env.GITHUB_USERNAME);
}
