/**
 * Vitrindeki PUBLIC repo'lar — açıklaması, kapağı ve rozetleri GitHub'dan
 * gelsin istenen projeler (CONTENT-MODEL §3).
 *
 * ⚠ Sıra numaraları `curated-projects.ts`'teki `order` ile **AYNI HAVUZU**
 * paylaşır. Aynı numarayı iki projeye verme.
 *
 * Slot dağılımı (`/projeler`): 1 → Last Project · 2 ve 3 → repo ızgarası.
 *
 * `live` yalnızca GitHub'daki `homepageUrl` boşsa devreye girer; ikisi de
 * boşsa "Go to Live" satırı hiç render edilmez.
 *
 * `lib/github.ts` bu dosyayı iki yerde okur: sıralama ve API çöktüğündeki
 * fallback.
 */
export type FeaturedEntry = {
  repo: string;
  live: string | null;
  order: number;
};

/**
 * **ŞU AN BOŞ** — dört vitrin projesinin dördü de `curated-projects.ts`'te
 * elle yazılmış durumda, çünkü oradaki açıklama ve ekran görüntüsü
 * GitHub'daki repo açıklamasından iyi.
 *
 * Bir projeyi buraya taşımak "metni ve kapağı GitHub belirlesin" demektir.
 * İkisine birden yazma: `OVERRIDDEN_REPOS` tekrarı eler ama iki ayrı `order`
 * değeri kafa karıştırır.
 *
 * Tip açıkça yazılıyor — boş bir `as const` dizide `.map` geri çağrıları
 * `never` alır ve derlenmez.
 */
export const FEATURED: readonly FeaturedEntry[] = [];
