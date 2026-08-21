/**
 * Vitrin sırası — elle küratörlük (CONTENT-MODEL §3).
 *
 * GitHub'ın `pushedAt` sıralaması "en son dokunulanı" öne çıkarır, "en iyisini"
 * değil. Bu liste o kararı geri alır: burada adı geçen repo'lar sırayla başa
 * gelir, kalanlar arkalarına `pushedAt` desc olarak dizilir.
 *
 * Slot dağılımı (`/projeler`): 1. → Last Project · 2. ve 3. → repo ızgarası.
 *
 * `live` alanı yalnızca GitHub'daki `homepageUrl` boşsa devreye girer;
 * ikisi de boşsa "Go to Live" satırı hiç render edilmez.
 *
 * Faz 3 bu dosyayı iki yerde okur: sıralama ve API çöktüğündeki fallback.
 */
export const FEATURED = [
  {
    repo: "aura-clinic",
    live: "https://aura-clinic-six.vercel.app",
    order: 1,
  },
  {
    repo: "safe-zone",
    live: "https://safe-zone-phi.vercel.app",
    order: 2,
  },
  {
    repo: "nextjs-projects-library",
    live: "https://nextjs-projects-library.vercel.app",
    order: 3,
  },
] as const;

export type FeaturedRepo = (typeof FEATURED)[number]["repo"];
