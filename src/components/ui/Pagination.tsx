import Link from "next/link";

/**
 * Sayfalama (DESIGN-SYSTEM §6, PRD §7).
 *
 * Gerçek `<Link>`'ler — JS kapalıyken de çalışır. Sınırdaki yön **gizlenir**,
 * disabled edilmez: tıklanamayan bir kontrol göstermek kullanıcıya yalan
 * söylemektir, aynı "Go to Live" kuralı gibi.
 */
export function Pagination({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  if (total <= 1) return null;

  const pages = Array.from({ length: total }, (_, i) => i + 1);
  const href = (page: number) => (page === 1 ? "/blog" : `/blog?page=${page}`);

  return (
    <nav
      aria-label="Sayfalama"
      className="flex shrink-0 items-center justify-center gap-4"
    >
      {current > 1 && (
        <Link href={href(current - 1)} className={ARROW}>
          ‹ Önceki
        </Link>
      )}

      <ul className="flex items-center gap-3">
        {pages.map((page) => {
          const active = page === current;

          return (
            <li key={page}>
              <Link
                href={href(page)}
                aria-current={active ? "page" : undefined}
                className={`text-micro rounded-inner focus-visible:ring-accent focus-visible:ring-offset-surface px-1 py-1 tabular-nums transition-colors duration-(--dur-micro) focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
                  active
                    ? "text-text decoration-accent underline decoration-2 underline-offset-4"
                    : "text-text-3 hover:text-text-2"
                }`}
              >
                {page}
              </Link>
            </li>
          );
        })}
      </ul>

      {current < total && (
        <Link href={href(current + 1)} className={ARROW}>
          Sonraki ›
        </Link>
      )}
    </nav>
  );
}

const ARROW =
  "text-micro text-text-3 hover:text-text rounded-inner focus-visible:ring-accent focus-visible:ring-offset-surface px-1 py-1 transition-colors duration-(--dur-micro) focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none";
