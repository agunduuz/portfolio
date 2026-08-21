import type { ReactNode } from "react";

/**
 * Ana bölge çapraz geçişi (INTERACTIONS §3.5).
 *
 * `template.tsx` her route değişiminde yeniden mount olur — animasyonun her
 * geçişte yeniden çalışmasını sağlayan şey budur (`layout.tsx` olsaydı olmazdı).
 *
 * **Geçiş neden CSS, neden Motion değil.** Önce `motion.div` + `initial/animate`
 * kullanılıyordu. Faz 3'te sayfalar `async` olunca Next onları Suspense'e sardı;
 * akış sırasında Motion'ın giriş animasyonu iptal edilip bir daha çalışmadı ve
 * eleman `initial` hâlinde — yani `opacity: 0` — kaldı. Sonuç: dört ekranda da
 * ana bölge tamamen görünmez. Üretim build'inde de tekrarlandı, dev artığı değildi.
 *
 * CSS animasyonunu React'in yeniden render'ı iptal edemez. Yan faydası:
 * bu dosya artık Server Component, istemci paketi küçüldü.
 *
 * Yapma: blur filtresi (GPU'da pahalı), 3D rotate, sayfa boyu slide.
 * Ray 500 ms'de kayarken ana bölge 380 ms'de solar — üç şey aynı anda hareket etmez.
 */
export default function DeckTemplate({ children }: { children: ReactNode }) {
  return <div className="deck-main-enter min-h-0 flex-1">{children}</div>;
}
