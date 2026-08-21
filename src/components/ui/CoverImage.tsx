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
  /** Last Project kare, ızgara geniş (DESIGN-SYSTEM §6). */
  ratio?: "square" | "wide";
  sizes: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`bg-elevated rounded-media relative w-full shrink-0 overflow-hidden ${
        ratio === "square" ? "aspect-square" : "aspect-[16/7]"
      }`}
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
