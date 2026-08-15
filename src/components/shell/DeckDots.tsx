"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DECK, NAV } from "@/config/site";
import type { RailSide } from "@/config/page-manifest";

/**
 * Deck'teki dört ekranın nokta göstergesi (INTERACTIONS §4.5).
 * Ray hangi taraftaysa gösterge karşı kenarda durur; gerçek `<Link>`'lerdir.
 * Yazı detayda deck kapalı olduğu için gösterge de çizilmez.
 */
export function DeckDots({ side }: { side: RailSide }) {
  const pathname = usePathname();
  if (pathname.startsWith("/blog/")) return null;

  const index = DECK.indexOf(pathname as (typeof DECK)[number]);
  const outside = side === "left" ? "-right-4" : "-left-4";

  return (
    <nav
      aria-label="Ekranlar"
      className={`absolute top-1/2 hidden -translate-y-1/2 flex-col gap-3 xl:flex ${outside}`}
    >
      {DECK.map((href, i) => {
        const active = i === index;
        const label = NAV.find((n) => n.href === href)?.label ?? href;

        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            className="focus-visible:ring-accent focus-visible:ring-offset-bg group grid size-4 place-items-center rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <span
              className={`block size-1.5 rounded-full transition-colors duration-(--dur-micro) ${
                active
                  ? "bg-accent"
                  : "bg-text-3 group-hover:bg-text-2"
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
}
