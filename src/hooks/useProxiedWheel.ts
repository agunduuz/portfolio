"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

/**
 * Yazı detayında sayfanın HERHANGİ bir yerindeki wheel makaleye yönlenir
 * (INTERACTIONS §5.1).
 *
 * Gerekçe: makale bir kartın içinde scroll ediyor. Kullanıcının imleci o
 * kartın üstüne getirmek zorunda kalması, kutu içinde okumanın zaten ödediğimiz
 * bedelini iki katına çıkarırdı. Ray kartlarının üzerindeyken de makale kayar —
 * doğru davranış, o kartların kendi scroll'u yok.
 *
 * Kart ZATEN kendi içinde scroll ettiği için, imleç kartın üstündeyken
 * dokunmuyoruz: tarayıcının doğal davranışı hem daha akıcı hem momentum'u
 * doğru taşıyor.
 */
export function useProxiedWheel(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    function onWheel(e: WheelEvent) {
      const el = ref.current;
      if (!el) return;

      // İmleç makalenin içindeyse tarayıcı halleder.
      if (e.target instanceof Node && el.contains(e.target)) return;

      // Yatay kaydırma ve pinch-zoom bizi ilgilendirmez.
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      e.preventDefault();
      el.scrollBy({ top: e.deltaY });
    }

    // `passive: false` şart — preventDefault olmadan sayfa yine de kayar.
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [ref]);
}
