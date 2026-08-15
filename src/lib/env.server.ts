import "server-only";
import { z } from "zod";

/**
 * Sunucu sırları. İlk kullanımda parse edilir — Faz 3 (GitHub) ve Faz 6 (formlar)
 * gelene kadar bu değişkenler okunmaz, dolayısıyla eksik olmaları geliştirmeyi
 * kilitlemez. Kullanan modül import edildiği anda eksik değişken hata verir.
 */
const serverSchema = z.object({
  GITHUB_TOKEN: z.string().min(1),
  GITHUB_USERNAME: z.string().min(1),
  GITHUB_WEBHOOK_SECRET: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  CONTACT_EMAIL: z.email(),
  UPSTASH_REDIS_REST_URL: z.url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
});

export type ServerEnv = z.infer<typeof serverSchema>;

let cached: ServerEnv | null = null;

export function serverEnv(): ServerEnv {
  if (cached) return cached;

  const parsed = serverSchema.safeParse({
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    GITHUB_USERNAME: process.env.GITHUB_USERNAME,
    GITHUB_WEBHOOK_SECRET: process.env.GITHUB_WEBHOOK_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_EMAIL: process.env.CONTACT_EMAIL,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  if (!parsed.success) {
    // Yalnızca eksik/hatalı anahtarların ADLARI loglanır, değerleri asla.
    const keys = parsed.error.issues.map((i) => i.path.join(".")).join(", ");
    throw new Error(
      `Eksik veya hatalı ortam değişkeni: ${keys}. .env.example dosyasına bak.`,
    );
  }

  cached = parsed.data;
  return cached;
}
