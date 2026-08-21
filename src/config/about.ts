/**
 * `/hakkimda` ana bölgesinin içeriği (CONTENT-MODEL §7).
 *
 * ⚠ BURASI DOLDURULMAYI BEKLİYOR. Aşağıdakiler yer tutucu DEĞİL, boş —
 * çünkü uydurma biyografi yazmak lorem ipsum yazmaktan beterdir: lorem
 * ipsum'un sahte olduğu bellidir, uydurma iş geçmişi ise yalandır.
 *
 * `summary` 2–3 paragraf gerçek biyografi. `jobHistory` her kayıtta şirket,
 * rol, tarih aralığı ve TEK SATIR çıktı ister — "ne yaptım" değil "ne değişti".
 *
 * Tasarımda yetenek rozetleri ve eğitim yok. İstenirse aynı kartın içine
 * `Skills` / `Education` başlığı eklenir, yeni kart açılmaz. Yetenek seviyesi
 * yüzdesi kullanma — uydurma veridir.
 */

export type Job = {
  company: string;
  role: string;
  /** "YYYY-MM" biçimi. */
  from: string;
  /** `null` → "Günümüz". */
  to: string | null;
  /** Tek satır çıktı. Görev listesi değil, sonuç. */
  outcome: string;
};

export const ABOUT = {
  /** Her eleman bir paragraf. */
  summary: [] as string[],
  jobHistory: [] as Job[],
};

const MONTHS = [
  "Oca",
  "Şub",
  "Mar",
  "Nis",
  "May",
  "Haz",
  "Tem",
  "Ağu",
  "Eyl",
  "Eki",
  "Kas",
  "Ara",
];

/** "2023-01" → "Oca 2023". Biçim tek yerde, iki yerde ayrışmasın. */
export function formatMonth(value: string): string {
  const [year, month] = value.split("-");
  const index = Number(month) - 1;
  return MONTHS[index] ? `${MONTHS[index]} ${year}` : value;
}

/** "Oca 2023 — Günümüz" */
export function formatRange(from: string, to: string | null): string {
  return `${formatMonth(from)} — ${to ? formatMonth(to) : "Günümüz"}`;
}
