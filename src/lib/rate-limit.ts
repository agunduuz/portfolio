import "server-only";
import { headers } from "next/headers";

/**
 * IP başına saatte 5 istek (PRD §9). CAPTCHA yok.
 *
 * Upstash REST üzerinden, SDK eklemeden: tek `INCR` + `EXPIRE` çağrısı için
 * bir bağımlılık eklemek performans bütçesine haksızlık olurdu.
 *
 * **Upstash yapılandırılmamışsa sınırlama KAPALIDIR ve `false` döner.** Bu
 * bilinçli: hız sınırı olmadığı için formun hiç çalışmaması, spam'den daha
 * kötü bir başarısızlık. Yayına çıkmadan önce anahtarların girildiğini
 * doğrula (ROADMAP Faz 9).
 */

const WINDOW_SECONDS = 3600;
const MAX_REQUESTS = 5;

function config() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

export function rateLimitConfigured(): boolean {
  return config() !== null;
}

/** Vercel arkasında gerçek istemci IP'si `x-forwarded-for`ın ilk değeridir. */
async function clientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

export async function isRateLimited(scope: string): Promise<boolean> {
  const cfg = config();
  if (!cfg) return false;

  const key = `rl:${scope}:${await clientIp()}`;

  try {
    // Pipeline: INCR ve EXPIRE tek turda. EXPIRE her seferinde çağrılıyor ama
    // NX bayrağı sayesinde yalnızca TTL yoksa uygulanır — pencere kaymaz.
    const res = await fetch(`${cfg.url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, String(WINDOW_SECONDS), "NX"],
      ]),
      cache: "no-store",
    });

    if (!res.ok) return false;

    const data: unknown = await res.json();
    const count = Array.isArray(data) ? Number(data[0]?.result) : NaN;

    return Number.isFinite(count) && count > MAX_REQUESTS;
  } catch {
    // Upstash çökerse formu kapatmıyoruz; sınırlama en iyi çabadır.
    return false;
  }
}
