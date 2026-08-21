import type { TechId } from "./tech-icons";

/**
 * Private repo'lardan gösterilecek projeler — **elle küratörlük**.
 *
 * Neden API değil: GitHub API'sinden private repo çekmek "hepsini al, sonra
 * ele" demektir; bir gün bir topic eklemeyi unutursan istemediğin bir şey
 * public HTML'e basılır. Bu dosya tam tersi çalışır — **yalnızca buraya
 * yazdığın çıkar.** Private veri için doğru varsayılan budur.
 *
 * API zaten işe yaramazdı: private repo'nun kapak görseli jenerik GitHub
 * placeholder'ı olarak gelir ve repo linki ziyaretçide 404 verir.
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
   * yarışır. `featured-projects.ts`'te adı geçiyorsa bu alan görmezden gelinir.
   */
  updated: string;
};

/**
 * Boş bırakılabilir — boşken hiçbir şey değişmez, site public repo'larla çalışır.
 *
 * Örnek (kopyala, doldur, yorumu kaldır):
 *
 * {
 *   name: "Klinik Randevu Paneli",
 *   description:
 *     "Çok şubeli bir klinik için randevu ve hasta takip paneli. Rol bazlı yetki, takvim senkronizasyonu ve SMS hatırlatma.",
 *   liveUrl: "https://ornek.vercel.app",
 *   tech: ["nextjs", "typescript", "tailwind"],
 *   cover: "/projects/klinik-panel.jpg",
 *   updated: "2026-06-01",
 * },
 */
export const PRIVATE_PROJECTS: PrivateProject[] = [];
