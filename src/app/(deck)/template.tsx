"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Ana bölge çapraz geçişi (INTERACTIONS §3.5).
 *
 * `template.tsx` her route değişiminde yeniden mount olur — animasyonun her
 * geçişte yeniden çalışmasını sağlayan şey budur (`layout.tsx` olsaydı olmazdı).
 *
 * Yapma: blur filtresi (GPU'da pahalı), 3D rotate, sayfa boyu slide.
 * Ray 500 ms'de kayarken ana bölge 380 ms'de solar — üç şey aynı anda hareket etmez.
 *
 * Not: INTERACTIONS §3.5 burada `className="contents"` yazıyor, ama
 * `display: contents` olan bir elemanın kutusu olmadığı için `opacity` ve
 * `transform` hiç uygulanmaz — geçiş sessizce ölür. Bu yüzden gerçek bir kutu
 * kullanılıyor ve ızgara sorumluluğu sayfaların kendisine bırakılıyor.
 */
export default function DeckTemplate({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="min-h-0 flex-1"
      initial={{ opacity: 0, y: reduced ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduced
          ? { duration: 0.001 }
          : { duration: 0.38, ease: [0.16, 1, 0.3, 1], delay: 0.08 }
      }
    >
      {children}
    </motion.div>
  );
}
