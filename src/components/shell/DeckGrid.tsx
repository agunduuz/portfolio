"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import { GRID_ROWS, resolveLayout } from "@/config/page-manifest";
import { DeckDots } from "./DeckDots";

/**
 * 4×3 grid. Satır oranı ve `<main>`'in alanı route'a bağlı olduğu için burası
 * client — ama kart ve sayfa içerikleri Server Component olarak `children` ile
 * geçer, bu ağaca client sınırı bulaşmaz.
 *
 * `<main>` bilinçli olarak `layout` animasyonu ALMAZ: ana bölge çapraz geçişle
 * değişir (`template.tsx`), taşınarak değil. Böylece aynı anda en fazla iki
 * eleman taşınır ve INTERACTIONS §3.4'teki "3 eleman" sınırı korunur.
 */
export function DeckGrid({
  rail,
  children,
}: {
  rail: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { mainArea, railSide } = resolveLayout(pathname);
  const isHome = pathname === "/";
  const mainRef = useRef<HTMLElement>(null);
  const first = useRef(true);

  // Route değişiminde odağı ana bölgeye taşı — ekran okuyucu kullanıcısı
  // yeni içeriğin başında başlasın (INTERACTIONS §4.5).
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <div
      className="deck-grid relative grid min-h-0 flex-1 grid-cols-4 gap-x-(--gap-col) gap-y-(--gap-row)"
      // Satır oranı CSS değişkeni olarak geçer ki kısa ekranda `.deck-grid`
      // onu `auto` ile ezebilsin — inline style medya sorgusunu yenerdi.
      style={
        {
          "--deck-rows": isHome ? GRID_ROWS.home : GRID_ROWS.default,
        } as CSSProperties
      }
    >
      {rail}

      <main
        ref={mainRef}
        id="main"
        tabIndex={-1}
        style={{ gridArea: mainArea }}
        className="flex min-h-0 flex-col focus-visible:outline-none"
      >
        {children}
      </main>

      <DeckDots side={railSide} />
    </div>
  );
}
