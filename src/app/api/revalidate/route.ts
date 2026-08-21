import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { githubEnv } from "@/lib/env.server";
import { GITHUB_TAG } from "@/lib/github";

/**
 * GitHub push webhook'u → `revalidateTag("github")` (ARCHITECTURE §5).
 *
 * **İmza doğrulanmadan hiçbir şey yapılmaz.** Bu uç herkese açık; imza tek
 * kapı. Doğrulama `timingSafeEqual` ile yapılır çünkü `===` karşılaştırması
 * ilk farklı byte'ta döner ve saldırgana imzayı byte byte tahmin etme imkânı
 * verir (timing attack).
 *
 * Node runtime şart: `node:crypto` Edge'de yok.
 */
export const runtime = "nodejs";

/** Uzunluk farkı `timingSafeEqual`'ı fırlatır; önce onu eleriz. */
function verify(
  signature: string | null,
  body: string,
  secret: string,
): boolean {
  if (!signature) return false;

  const expected = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);

  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request): Promise<Response> {
  let secret: string;
  try {
    secret = githubEnv().GITHUB_WEBHOOK_SECRET;
  } catch {
    // Sır tanımlı değilse uç kapalıdır. Hangi değişkenin eksik olduğunu
    // dışarıya söylemeyiz.
    return new Response("Not configured", { status: 503 });
  }

  // Gövde HAM metin olarak okunmalı: imza byte'lar üzerinden hesaplandı,
  // JSON.parse edip yeniden stringify etmek imzayı bozar.
  const body = await request.text();

  if (!verify(request.headers.get("x-hub-signature-256"), body, secret)) {
    return new Response("Invalid signature", { status: 401 });
  }

  // Ping, GitHub'ın webhook kurulumunda gönderdiği el sıkışmadır.
  if (request.headers.get("x-github-event") === "ping") {
    return Response.json({ ok: true, pong: true });
  }

  // Next 16'da ikinci argüman zorunlu: cacheLife profili. "max" purge sonrası
  // yeniden doğrulama yapılırken bayat veriyi servis etmeye izin verir, yani
  // webhook anında kimse boş sayfa görmez.
  revalidateTag(GITHUB_TAG, "max");
  return Response.json({ ok: true, revalidated: GITHUB_TAG });
}
