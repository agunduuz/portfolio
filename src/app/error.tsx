"use client";

/**
 * Beklenmeyen hata sınırı. İstemci bileşeni olmak zorunda (Next kuralı).
 *
 * Hata metni ne olduğunu ve nasıl düzeltileceğini söyler, ÖZÜR DİLEMEZ
 * (CONTENT-MODEL §8). `error.message` ekrana basılmaz: üretimde yığın izi
 * ve iç detay sızdırabilir.
 */
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="px-pad-shell flex min-h-dvh flex-col items-center justify-center gap-6 text-center">
      <h1 className="font-display text-display-l text-text">
        Bu sayfa yüklenemedi.
      </h1>

      <p className="text-body text-text-2 max-w-prose">
        Geçici bir sorun olabilir. Yeniden dene; sürerse anasayfadan devam
        edebilirsin.
      </p>

      <button
        type="button"
        onClick={reset}
        className="text-label text-text bg-elevated border-border-strong rounded-inner hover:bg-surface-hover focus-visible:ring-accent focus-visible:ring-offset-bg cursor-pointer border px-4 py-2.5 transition-colors duration-(--dur-micro) focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        Yeniden dene
      </button>
    </main>
  );
}
