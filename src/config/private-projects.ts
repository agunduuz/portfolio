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

/**
 * Boş bırakılabilir — boşken hiçbir şey değişmez, site public repo'larla çalışır.
 *
 * Aşağıdaki iki iskelet YORUM İÇİNDE bekliyor. Değerleri doldurup dizinin
 * açılış ve kapanış yorum işaretlerini kaldırdığın an vitrine girerler.
 * Yorumda kaldıkları sürece hiçbir etkileri yok — uydurma metin yayına
 * çıkmasın diye bilerek böyle bırakıldı.
 */
export const PRIVATE_PROJECTS: PrivateProject[] = [
  // ↓↓↓ BU SATIRI SİL (yorumu açar) ↓↓↓
  /*
  {
    // Kartta görünen ad — 20 karakteri geçme (ölçüldü, uzun ad kartı taşırır).
    name: "RefTakip",

    // Public kitle için TEK cümle, ~120 karakter. Repo'daki iç açıklamayı
    // kopyalama; müşteri adı, iç kod adı, NDA detayı yazma.
    description: "BURAYA YAZ",

    // Canlı adres. Yoksa null yaz — "Go to Live" satırı hiç render edilmez.
    liveUrl: "https://BURAYA-YAZ",

    // Rozet ikonları. Geçerli değerler: nextjs · typescript · tailwind ·
    // react · javascript · node · python. Eşleşmeyen teknoloji atlanır.
    tech: ["nextjs", "typescript", "tailwind"],

    // Opsiyonel kapak. public/projects/ altına koy, yolunu buraya yaz.
    // Verilmezse düz gri blok görünür — private repo'da GitHub kapak veremez.
    // cover: "/projects/reftakip.jpg",

    // Vitrin sırası. featured-projects.ts ile AYNI havuz:
    // 1 → Last Project (kare kapak) · 2 ve 3 → repo ızgarası (geniş kapak).
    order: 1,

    // Sıralama için tarih. order verildiyse yalnızca yedek ölçüt.
    updated: "2026-09-01",
  },
  {
    name: "Vega PDR",
    description: "BURAYA YAZ",
    liveUrl: "https://BURAYA-YAZ",
    tech: ["nextjs", "typescript", "tailwind"],
    // cover: "/projects/vega-pdr.jpg",
    order: 2,
    updated: "2026-09-01",
  },
  */
  // ↑↑↑ BU SATIRI DA SİL ↑↑↑
];
