"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { resolveLayout, type CardId } from "@/config/page-manifest";

/**
 * Sitenin imza hareketi (INTERACTIONS §3).
 *
 * Bu bileşen `layout.tsx` seviyesinde yaşar ve route değişiminde UNMOUNT OLMAZ.
 * `grid-area` değiştiğinde Motion kartları kaydırır — zıplatmaz.
 *
 * ⚠ `key` SABİT olmalı (`key={id}`). `key={pathname + id}` yazılırsa Home ↔ About
 * arasındaki ortak kartların (`projects`, `jobOffers`) `layoutId` taşınması çalışmaz
 * ve `AnimatePresence` exit animasyonu hiç tetiklenmez. INTERACTIONS §3.4 bunu
 * "projenin en pahalı hatası" diye işaretliyor.
 *
 * Kart içerikleri Server Component olarak `cards` üzerinden gelir; burada yalnızca
 * sarmalayıcı client'tır.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

export function SatelliteRail({
  cards,
  detailCards,
}: {
  cards: Record<CardId, ReactNode>;
  /**
   * Yazı detayında farklı render edilen kartlar. Şu an yalnızca Subscribe:
   * anasayfada 2 kolon ve davet metniyle, detayda 1 kolon ve bağlam metniyle
   * çıkar (CONTENT-MODEL §5). Kartı ikizlemek yerine düğüm burada seçilir —
   * kart hâlâ tek bileşen ve Server Component.
   */
  detailCards?: Partial<Record<CardId, ReactNode>>;
}) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const { rail } = resolveLayout(pathname);
  const isDetail = pathname.startsWith("/blog/");

  return (
    <aside className="contents" aria-label="Uydu kartlar">
      <AnimatePresence mode="popLayout" initial={false}>
        {rail.map(({ id, area }) => (
          <motion.div
            key={id}
            layoutId={id}
            layout={!reduced}
            style={{ gridArea: area }}
            className="min-h-0"
            initial={{ opacity: 0, y: reduced ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: reduced ? 1 : 0.96 }}
            transition={
              reduced
                ? { duration: 0.001 }
                : {
                    layout: { duration: 0.5, ease: EASE },
                    opacity: { duration: 0.3, delay: 0.12 },
                    y: { duration: 0.3, delay: 0.12 },
                    scale: { duration: 0.2 },
                  }
            }
          >
            {/* `layout="position"` olmadan taşıma sırasında `scale` metni ezer. */}
            <motion.div
              layout={reduced ? false : "position"}
              className="h-full"
            >
              {(isDetail && detailCards?.[id]) || cards[id]}
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </aside>
  );
}
