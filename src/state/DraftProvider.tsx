"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

/**
 * Kalıcı kabuk kartların unmount olmasını engellemez — kartlar route değişiminde
 * gider gelir. Kaybı can yakan iki state burada, layout seviyesinde yaşar:
 * iş teklifi formu taslağı ve carousel indeksleri.
 *
 * Kapsam dardır ve öyle kalmalı (ARCHITECTURE §3.4):
 *  - Sayaç girmez — mutlak tarihten türer, saklamaya gerek yok.
 *  - Scroll pozisyonu girmez — route değişince sıfırlanması doğru davranış.
 *  - `sessionStorage`'a yazılmaz — form taslağı kişisel veridir, sekme
 *    kapanınca kaybolması istenen davranıştır.
 */

type JobOfferDraft = {
  location: string;
  type: string;
  technology: string;
  amount: string;
};

type CarouselKey = "projects" | "writings";

type Draft = {
  jobOffer: JobOfferDraft;
  carousel: Record<CarouselKey, number>;
};

const EMPTY: Draft = {
  jobOffer: { location: "", type: "", technology: "", amount: "" },
  carousel: { projects: 0, writings: 0 },
};

type DraftContextValue = {
  draft: Draft;
  setJobOffer: (patch: Partial<JobOfferDraft>) => void;
  setCarousel: (key: CarouselKey, index: number) => void;
  clearJobOffer: () => void;
};

const DraftContext = createContext<DraftContextValue | null>(null);

export function DraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<Draft>(EMPTY);

  const setJobOffer = useCallback((patch: Partial<JobOfferDraft>) => {
    setDraft((prev) => ({ ...prev, jobOffer: { ...prev.jobOffer, ...patch } }));
  }, []);

  const setCarousel = useCallback((key: CarouselKey, index: number) => {
    setDraft((prev) => ({
      ...prev,
      carousel: { ...prev.carousel, [key]: index },
    }));
  }, []);

  const clearJobOffer = useCallback(() => {
    setDraft((prev) => ({ ...prev, jobOffer: EMPTY.jobOffer }));
  }, []);

  const value = useMemo(
    () => ({ draft, setJobOffer, setCarousel, clearJobOffer }),
    [draft, setJobOffer, setCarousel, clearJobOffer],
  );

  return <DraftContext value={value}>{children}</DraftContext>;
}

export function useDraft(): DraftContextValue {
  const value = useContext(DraftContext);
  if (!value) throw new Error("useDraft, DraftProvider içinde çağrılmalı.");
  return value;
}
