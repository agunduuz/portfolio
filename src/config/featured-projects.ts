/**
 * Vitrindeki PUBLIC repo'lar — elle küratörlük (CONTENT-MODEL §3).
 *
 * GitHub'ın `pushedAt` sıralaması "en son dokunulanı" öne çıkarır, "en iyisini"
 * değil. Bu liste o kararı geri alır.
 *
 * ⚠ Sıra numaraları `private-projects.ts`'teki `order` ile **AYNI HAVUZU**
 * paylaşır. İkisi tek listede yarışır; aynı numarayı iki projeye verme.
 *
 * Slot dağılımı (`/projeler`): 1 → Last Project · 2 ve 3 → repo ızgarası.
 *
 * `live` alanı yalnızca GitHub'daki `homepageUrl` boşsa devreye girer;
 * ikisi de boşsa "Go to Live" satırı hiç render edilmez.
 *
 * Faz 3 bu dosyayı iki yerde okur: sıralama ve API çöktüğündeki fallback.
 */
export const FEATURED = [
  {
    repo: "codworks",
    // GitHub'da homepage zaten dolu (codworks.vercel.app); bu yalnızca
    // oradan silinirse devreye giren yedek.
    live: "https://codworks.vercel.app",
    order: 3,
  },
] as const;

export type FeaturedRepo = (typeof FEATURED)[number]["repo"];
