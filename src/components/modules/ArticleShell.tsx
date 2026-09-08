"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useProxiedWheel } from "@/hooks/useProxiedWheel";

/**
 * Makale kartının etkileşim kabuğu (INTERACTIONS §5).
 *
 * Üç iş yapar ve üçü de state gerektirdiği için burası client:
 *  1. Okuma ilerleme çubuğu — kart scroll'una bağlı, sayfa scroll'una değil
 *  2. Sayfa geneli wheel yönlendirme (`useProxiedWheel`)
 *  3. `Esc` → `/blog`
 *
 * Makale METNİ Server Component olarak `children` ile gelir; MDX derlemesi
 * istemciye inmez.
 */
export function ArticleShell({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useProxiedWheel(ref);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function onScroll() {
      if (!el) return;
      const max = el.scrollHeight - el.clientHeight;
      // Kısa yazıda scroll yok; oranı 0'da bırakmak çubuğu gizlemekten iyidir.
      setProgress(max <= 0 ? 0 : Math.min(1, el.scrollTop / max));
    }

    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      // Input odaktayken Esc'i çalmıyoruz (rayda iki form var).
      const el = e.target;
      if (el instanceof Element && el.closest("input, textarea, select"))
        return;
      router.push("/blog");
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return (
    <>
      {/* Kartın ÜST kenarında; `scaleX` layout tetiklemez, transform ucuzdur. */}
      <div
        role="progressbar"
        aria-label="Okuma ilerlemesi"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        className="bg-accent absolute inset-x-0 top-0 z-10 h-0.5 origin-left"
        style={{ transform: `scaleX(${progress})` }}
      />

      <article
        ref={ref}
        data-scrollable
        tabIndex={0}
        role="region"
        aria-label={label}
        className="focus-visible:ring-accent focus-visible:ring-offset-surface min-h-0 flex-1 overflow-y-auto focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {children}
      </article>
    </>
  );
}
