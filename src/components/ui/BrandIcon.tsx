import { BRAND_ICONS, type BrandId } from "@/config/brand-icons";

/**
 * Tek path'lik marka glifi. `<title>` her zaman yazılır — ikon-only
 * bağlantılarda erişilebilirlik zemininin parçası.
 *
 * Dekoratif kullanımda (yanında zaten metin varsa) `decorative` ver:
 * `<title>` düşer, `aria-hidden` biner, ekran okuyucu iki kez okumaz.
 */
export function BrandIcon({
  id,
  className = "size-5",
  decorative = false,
}: {
  id: BrandId;
  className?: string;
  decorative?: boolean;
}) {
  const { title, path } = BRAND_ICONS[id];

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      focusable="false"
    >
      {!decorative && <title>{title}</title>}
      <path d={path} />
    </svg>
  );
}
