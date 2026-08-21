import NextLink from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Tasarımın iki bağlantı kalıbı (DESIGN-SYSTEM §2, CONTENT-MODEL §5).
 * İkisi de tek yerde durur ki "Go to Live" ile "Go to Profile" ayrışmasın.
 */

const FOCUS =
  "focus-visible:ring-accent focus-visible:ring-offset-surface rounded-inner focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none";

/**
 * `Go to **Live**` — "Go to" gri, hedef kelime beyaz ve bold.
 * Tüm bağlantı tıklanabilir, sadece bold kısım değil.
 */
export function GoTo({
  href,
  target,
  external = false,
}: {
  href: string;
  /** Bold yazılan hedef kelime: "Live", "Writing.", "Detail", "Profile". */
  target: string;
  external?: boolean;
}) {
  const className = `text-label text-text-3 hover:text-text-2 group inline-flex w-fit items-center gap-1 transition-colors duration-(--dur-micro) ${FOCUS}`;
  const content = (
    <>
      Go to <strong className="text-text font-semibold">{target}</strong>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <NextLink href={href} className={className}>
      {content}
    </NextLink>
  );
}

/**
 * Private projelerde `Repository ›` linkinin yerini alır.
 *
 * Link değil, etiket: private repo sayfası ziyaretçide 404 verir. Boş bırakmak
 * yerine sebebini söylüyoruz — kullanıcı linkin neden bazı kartlarda olup
 * bazılarında olmadığını anlasın.
 */
export function PrivateTag({ className = "" }: { className?: string }) {
  return (
    <span
      className={`text-micro text-text-3 border-border rounded-inner border px-2 py-0.5 ${className}`}
    >
      Private
    </span>
  );
}

/**
 * `More ›` · `Repository ›` · `Detail ›` — kart altında ortalanmış alt link.
 * Ok hover'da 2px kayar; `group` sınıfı bunun için.
 */
export function ArrowLink({
  href,
  external = false,
  className = "",
  children,
}: {
  href: string;
  external?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const cls = `text-micro text-text-3 hover:text-text group inline-flex items-center gap-1 transition-colors duration-(--dur-micro) ${FOCUS} ${className}`;
  const content = (
    <>
      {children}
      <ChevronRight
        aria-hidden
        className="size-3.5 transition-transform duration-(--dur-micro) group-hover:translate-x-0.5"
      />
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {content}
      </a>
    );
  }

  return (
    <NextLink href={href} className={cls}>
      {content}
    </NextLink>
  );
}
