"use client";

import { usePathname } from "next/navigation";
import { useDeckNavigation } from "@/hooks/useDeckNavigation";
import { NAV } from "@/config/site";

/**
 * Wheel + klavye dinleyicilerini kuran görünmez bileşen, artı route değişimini
 * ekran okuyucuya duyuran canlı bölge (INTERACTIONS §4.5).
 */
export function DeckController() {
  const pathname = usePathname();
  useDeckNavigation();

  const label = NAV.find((n) => n.href === pathname)?.label;

  return (
    <p aria-live="polite" className="sr-only">
      {label ? `${label} ekranı` : ""}
    </p>
  );
}
