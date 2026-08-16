import Image from "next/image";
import { SITE } from "@/config/site";

/**
 * Hero avatarı (DESIGN-SYSTEM §6).
 *
 * `src` yoksa `bg-elevated` düz daire kalır — kırık görsel ikonu gösterme.
 * Gerçek avatar Faz 3'te GitHub profilinden (`avatarUrl`) gelir; o güne
 * kadar fallback daire tasarımdaki gri dairenin ta kendisidir.
 */
export function Avatar({
  src,
  size,
}: {
  src?: string | null;
  /** Kenar uzunluğu px — `sizes` doğru olsun diye sayı isteniyor. */
  size: number;
}) {
  return (
    <div
      style={{ width: size, height: size }}
      className="bg-elevated rounded-pill relative shrink-0 overflow-hidden"
    >
      {src && (
        <Image
          src={src}
          alt={SITE.name}
          fill
          sizes={`${size}px`}
          className="object-cover"
          priority
        />
      )}
    </div>
  );
}
