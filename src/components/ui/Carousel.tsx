"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { KeyboardEvent, ReactNode } from "react";
import { useDraft, type CarouselKey } from "@/state/DraftProvider";

/**
 * Projects ve Writings kartlarının carousel'i (DESIGN-SYSTEM §6).
 *
 * İndeks `DraftProvider`'da yaşar: kart route değişiminde unmount olur ama
 * kullanıcının 3. projede olduğu bilgisi kaybolmaz (INTERACTIONS §9).
 *
 * Slaytlar Server Component olarak `children` dizisiyle gelir — bu bileşen
 * yalnızca hangisinin görüneceğine karar verir, içeriği üretmez.
 *
 * Sol/sağ ok tuşları burada, yukarı/aşağı deck'te (`useDeckNavigation`
 * yalnızca Page/Arrow-Up/Down dinler, çakışma yok — INTERACTIONS §5).
 */

export function Carousel({
  id,
  label,
  children,
}: {
  id: CarouselKey;
  /** Ör. "Projeler" — ok etiketleri ve canlı bölge bundan türer. */
  label: string;
  children: ReactNode[];
}) {
  const { draft, setCarousel } = useDraft();
  const count = children.length;

  // Liste kısalırsa (GitHub'dan iki repo düştü) saklanan indeks taşabilir.
  const index = count > 0 ? Math.min(draft.carousel[id], count - 1) : 0;

  const go = (delta: number) => {
    if (count < 2) return;
    setCarousel(id, (index + delta + count) % count);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.stopPropagation();
    go(e.key === "ArrowRight" ? 1 : -1);
  };

  // Tek öğe varsa oklar gizlenir — disabled değil, yok.
  const multiple = count > 1;

  return (
    <div
      onKeyDown={onKeyDown}
      className="flex min-h-0 flex-1 items-center gap-1"
    >
      {multiple && (
        <Arrow direction="prev" label={label} onClick={() => go(-1)} />
      )}

      <div
        aria-live="polite"
        aria-atomic="true"
        className="flex min-h-0 flex-1 flex-col justify-center"
      >
        {children[index]}
      </div>

      {multiple && (
        <Arrow direction="next" label={label} onClick={() => go(1)} />
      )}
    </div>
  );
}

function Arrow({
  direction,
  label,
  onClick,
}: {
  direction: "prev" | "next";
  label: string;
  onClick: () => void;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${direction === "prev" ? "Önceki" : "Sonraki"} — ${label}`}
      className="text-text-3 hover:text-text focus-visible:ring-accent focus-visible:ring-offset-surface rounded-inner -mx-2 flex size-10 shrink-0 cursor-pointer items-center justify-center transition-colors duration-(--dur-micro) focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <Icon aria-hidden className="size-4" />
    </button>
  );
}
