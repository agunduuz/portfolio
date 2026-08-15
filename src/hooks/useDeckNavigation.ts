"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useReducedMotion } from "motion/react";
import { DECK } from "@/config/site";

/**
 * Masaüstünde wheel bir sonraki ekrana geçer (INTERACTIONS §4).
 *
 * Asıl problem momentum: trackpad'de tek bir kaydırma 40–60 event üretir.
 * Üç katmanlı çözüm:
 *   1. Eşik   — birikmiş |deltaY| 120'yi geçmeden tetikleme yok.
 *   2. Kilit  — tetikledikten sonra ~700 ms (500 ms animasyon + pay) sağır kal.
 *   3. Sönüm  — |deltaY| bir öncekinden küçükse kaydırma bitiyor demektir,
 *               birikimi sıfırla ki serbest kayış ikinci geçişi tetiklemesin.
 */

const THRESHOLD = 120;
const RUBBER_BAND_PX = 8;

/** Aktiflik koşulu — üçü birden sağlanmalı. 800px "pazarlığa kapalı": */
/* içerik erişilemez kalmaktansa deck kapanır ve normal scroll devreye girer. */
const QUERY = "(min-width: 1024px) and (pointer: fine) and (min-height: 800px)";

const TYPING = new Set(["INPUT", "TEXTAREA", "SELECT"]);

function isExempt(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  if (target.closest("[data-scrollable]")) return true;

  const el = target.closest<HTMLElement>(
    "input, textarea, select, [contenteditable]",
  );
  if (!el) return false;
  return TYPING.has(el.tagName) || el.isContentEditable;
}

export function useDeckNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();

  const locked = useRef(false);
  const acc = useRef(0);
  const lastAbs = useRef(0);
  const bandRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Yazı detayda deck kapalıdır — dinleyici hiç kurulmaz (INTERACTIONS §4.1).
    if (pathname.startsWith("/blog/")) return;

    const index = DECK.indexOf(pathname as (typeof DECK)[number]);
    if (index === -1) return;

    const media = window.matchMedia(QUERY);
    let enabled = media.matches;

    const lockMs = reduced ? 100 : 700;
    bandRef.current = document.getElementById("deck-shell");

    function rubberBand(dir: 1 | -1) {
      const el = bandRef.current;
      if (!el || reduced) return;
      el.style.transition = "transform 180ms cubic-bezier(0.16,1,0.3,1)";
      el.style.transform = `translateY(${-dir * RUBBER_BAND_PX}px)`;
      window.setTimeout(() => {
        el.style.transform = "translateY(0)";
      }, 180);
    }

    function go(dir: 1 | -1) {
      const next = index + dir;

      // Deck döngü yapmaz; uçlarda yumuşak bir direnç verir.
      if (next < 0 || next >= DECK.length) {
        rubberBand(dir);
        return;
      }

      locked.current = true;
      acc.current = 0;
      router.push(DECK[next]!);
      window.setTimeout(() => {
        locked.current = false;
      }, lockMs);
    }

    function onWheel(e: WheelEvent) {
      if (!enabled || isExempt(e.target)) return;

      // Yatay kaydırma ve pinch-zoom deck'i ilgilendirmez.
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      e.preventDefault();
      if (locked.current) return;

      const abs = Math.abs(e.deltaY);
      if (abs < lastAbs.current) acc.current = 0; // momentum sönümü
      lastAbs.current = abs;

      acc.current += e.deltaY;

      if (Math.abs(acc.current) >= THRESHOLD) {
        go(acc.current > 0 ? 1 : -1);
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (!enabled || locked.current || isExempt(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const forward =
        e.key === "PageDown" || e.key === "ArrowDown" || e.key === " ";
      const back = e.key === "PageUp" || e.key === "ArrowUp";
      if (!forward && !back) return;

      e.preventDefault();
      go(forward ? 1 : -1);
    }

    function onMediaChange(e: MediaQueryListEvent) {
      enabled = e.matches;
      acc.current = 0;
    }

    // `passive: false` şart — preventDefault olmadan sayfa yine de kayar.
    // Chrome'un "non-passive wheel listener" uyarısı kasıtlıdır.
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    media.addEventListener("change", onMediaChange);

    // Komşu ekranları önceden getir — geçiş anında ağ beklemesi olmasın.
    for (const dir of [-1, 1]) {
      const n = DECK[index + dir];
      if (n) router.prefetch(n);
    }

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      media.removeEventListener("change", onMediaChange);
    };
  }, [pathname, reduced, router]);
}
