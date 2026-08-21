import Image from "next/image";

/**
 * Repo kapak görseli (DESIGN-SYSTEM §6).
 *
 * `bg-elevated` blok her zaman altta durur: görsel yüklenene kadar ya da hiç
 * gelmezse kırık görsel ikonu değil, düz bir blok görünür. `alt` metni
 * tasarımın kararı değil, erişilebilirlik zemininin parçası.
 *
 * `src` null olabilir: private projelerde GitHub kapak veremez, `public/`
 * altına kendi görselini koymadıysan düz blok kalır (config'te `cover`).
 */
export function CoverImage({
  src,
  repo,
  ratio = "wide",
  sizes,
  priority = false,
}: {
  src: string | null;
  /** `alt` metni bundan türer — iki yerde ayrı yazılmasın. */
  repo: string;
  /**
   * Last Project kare, ızgara geniş (DESIGN-SYSTEM §6).
   *
   * `fill`: en-boy oranı yok, ebeveynin verdiği kutuyu doldurur.
   * Gerekçe dikey bütçe: `aspect-[16/7]` yüksekliği GENİŞLİKTEN türetir, yani
   * viewport kısaldığında kapak küçülmez ve kart taşar. `fill` modunda
   * yüksekliği ebeveyn (`min-h-0 flex-1`) belirler, görsel `object-cover` ile
   * kırpılır — tasarım uzun ekranda korunur, kısa ekranda çökmez.
   */
  ratio?: "square" | "wide" | "fill";
  sizes: string;
  priority?: boolean;
}) {
  const shape =
    ratio === "square"
      ? "aspect-square shrink-0"
      : ratio === "wide"
        ? "aspect-[16/7] shrink-0"
        : "h-full";

  return (
    <div
      className={`bg-elevated rounded-media relative w-full overflow-hidden ${shape}`}
    >
      {src && (
        <Image
          src={src}
          alt={`${repo} önizleme görseli`}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      )}
    </div>
  );
}
