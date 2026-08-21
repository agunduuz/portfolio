"use client";

import { useEffect, useState } from "react";

/**
 * "The Time Spent" sayacı (INTERACTIONS §7).
 *
 * Değer mutlak bir tarihten türer — hiçbir yerde saklanmaz, kart unmount
 * olunca kaybolacak bir şey yoktur. `DraftProvider`'a girmemesinin sebebi bu.
 *
 * Kritik nokta hidrasyon: sunucu 11 saniye, istemci 12 saniye yazarsa React
 * kızar. Bu yüzden ilk render'da `null` döner (kart `––` basar), gerçek değer
 * yalnızca `useEffect` içinde hesaplanır.
 */

export type Elapsed = { day: number; hour: number; min: number; sec: number };

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function diff(since: number, now: number): Elapsed {
  const ms = Math.max(0, now - since);

  return {
    day: Math.floor(ms / DAY),
    hour: Math.floor((ms % DAY) / HOUR),
    min: Math.floor((ms % HOUR) / MINUTE),
    sec: Math.floor((ms % MINUTE) / SECOND),
  };
}

export function useElapsed(since: string): Elapsed | null {
  const [elapsed, setElapsed] = useState<Elapsed | null>(null);

  useEffect(() => {
    const start = new Date(since).getTime();
    if (Number.isNaN(start)) return;

    const tick = () => setElapsed(diff(start, Date.now()));
    tick();

    const id = window.setInterval(tick, SECOND);

    // Sekme arkaplandayken tarayıcı interval'i kısıyor; dönüşte tek
    // adımda doğru değere atla, yavaşça yakalamaya çalışma.
    const onVisibility = () => {
      if (!document.hidden) tick();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [since]);

  return elapsed;
}
