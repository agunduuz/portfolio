import type { TechId } from "./tech-icons";

/**
 * Elle yazılmış proje bilgileri — **bu dosya GitHub'ı EZER**.
 *
 * Başlangıçta yalnızca private repo'lar içindi. Artık asıl gerekçe farklı:
 * buradaki metin, ekran görüntüsü ve teknoloji listesi sahibinin kendi
 * yazdığı içerik ve GitHub'daki repo açıklamasından daha iyi. Bir proje hem
 * burada hem GitHub'da varsa (`repo` alanı) API kopyası ELENİR, bu kayıt kazanır.
 *
 * `repo` verilmeyen kayıtlar yalnızca burada yaşar — private bir repo ya da
 * hiç repo'su olmayan bir iş olabilir. O durumda "Repository ›" linki
 * render edilmez, çünkü gösterilecek bir adres yok.
 *
 * ⚠ BURAYA YAZDIĞIN HER ŞEY YAYINDA GÖRÜNÜR.
 *   - Müşteri adı, iç kod adı, NDA kapsamındaki detay yazma.
 *   - Açıklamayı repo'daki iç metinden kopyalama; public kitleye yeniden yaz.
 *   - Emin değilsen yazma. Bir projeyi göstermemek, yanlış şeyi göstermekten
 *     her zaman ucuzdur.
 */
export type PrivateProject = {
  /**
   * Kartta görünen ad. Repo adı olmak zorunda değil.
   *
   * **Kısa tut — 20 karakteri geçme.** Uydu kart 1 kolon (~290px) ve mono
   * fontla yazılıyor; daha uzun ad iki satıra sarıyor ve altındaki açıklamayı
   * kartın dışına itiyor. Ölçüldü, tahmin değil.
   */
  name: string;
  /** Public kitle için yazılmış açıklama. */
  description: string;
  /**
   * Bu projenin GitHub repo adı — **varsa**.
   *
   * İki iş yapar:
   *  1. API'den gelen aynı repo'yu ELER; yoksa proje listede iki kez çıkar
   *  2. "Repository ›" linkini üretir
   *
   * Repo private ya da yoksa bu alanı boş bırak; link render edilmez.
   */
  repo?: string;
  /** Canlı dağıtım adresi — "Go to Live" bundan çıkar. Yoksa satır render edilmez. */
  liveUrl: string | null;
  /** Rozet ikonları. Public repo'larda topic'lerden türer, burada elle verilir. */
  tech: TechId[];
  /**
   * `public/` altındaki kapak görseli, ör. "/projects/foo.jpg".
   * Verilmezse kart düz `bg-elevated` blok gösterir — kırık görsel değil.
   * Private repo için GitHub kapak veremediğinden tek yol budur.
   */
  cover?: string;
  /**
   * Sıralama için ISO tarih. Public repo'ların `pushedAt`'i ile aynı listede
   * yarışır. `order` verilmişse bu alan sıralamada görmezden gelinir.
   */
  updated: string;
  /**
   * Vitrin sırası — `featured-projects.ts`'teki `order` ile AYNI havuzu
   * paylaşır. Public ve private projeler tek bir sırada yarışır:
   * 1 → Last Project, 2 ve 3 → repo ızgarası.
   *
   * Verilmezse proje vitrin dışıdır ve `updated` tarihine göre sıralanır.
   */
  order?: number;
};

export const PRIVATE_PROJECTS: PrivateProject[] = [
  {
    name: "RefTakip",
    description:
      "Referral-tracking SaaS for salons and clinics — unique links track every referral from lead to reward.",
    liveUrl: "https://reftakip.com",
    tech: ["nextjs", "typescript", "tailwind", "react"],
    cover: "/projects/reftakip.png",
    order: 1,
    updated: "2026-07-25",
  },
  {
    name: "Codworks",
    repo: "codworks",
    description:
      "An in-depth, Turkish-language reference for modern web development, covering React, JavaScript, and Next.js.",
    liveUrl: "https://codworks.vercel.app",
    tech: ["nextjs", "typescript", "tailwind", "react"],
    cover: "/projects/codworks.png",
    order: 2,
    updated: "2026-09-02",
  },
  {
    name: "Vega PDR",
    repo: "vega-pdr-website",
    description:
      "SEO-optimized business site for a car dent-repair shop, with services, gallery, blog and WhatsApp booking.",
    liveUrl: "https://samsunboyasizgocukduzeltme.com",
    tech: ["nextjs", "typescript", "tailwind"],
    cover: "/projects/vega-pdr.png",
    order: 3,
    updated: "2026-09-05",
  },
  {
    name: "Gündüz Wedding",
    repo: "gunduz-wedding",
    description:
      "A time-locked wedding photo and video sharing app with server-verified countdown and secure guest uploads.",
    liveUrl: "https://gunduz-wedding.vercel.app/anilzeynep",
    tech: ["nextjs", "typescript", "tailwind"],
    cover: "/projects/gunduz-wedding.png",
    order: 4,
    updated: "2026-09-05",
  },
];
