"use client";

import type { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Scrollable } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { COPY } from "@/config/site";
import { useDraft } from "@/state/DraftProvider";

/**
 * Dört alan da `DraftProvider`'dan controlled (ARCHITECTURE §3.4).
 *
 * Sebep kırmızı çizgi 4: kart route değişiminde unmount olur. Kullanıcı üç
 * alanı doldurup Projeler'e bakmaya gittiğinde yazdıkları durmalı. Bu, kalıcı
 * kabuğun korumakla yükümlü olduğu iki state'ten biri.
 *
 * Alanların dördü de tasarımda serbest metin — "job type" için `<select>`
 * bilinçli olarak KULLANILMADI (PRD §9: karar bizim, Figma serbest metin).
 */

const FIELDS = [
  { name: "location", type: "text", autoComplete: "off" },
  { name: "type", type: "text", autoComplete: "off" },
  { name: "technology", type: "text", autoComplete: "off" },
  { name: "amount", type: "text", inputMode: "numeric" },
] as const;

export function JobOfferForm() {
  const { draft, setJobOffer } = useDraft();

  // Faz 6'da `action={sendJobOffer}` bağlanacak; o güne kadar gönderim
  // sayfayı yeniden yüklemesin diye tutuluyor.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => e.preventDefault();

  return (
    <form onSubmit={onSubmit} className="mt-2 flex min-h-0 flex-1 flex-col">
      {/*
        Dört alan kart içinde scroll eder, buton ETMEZ.

        Sebep dikey bütçe: bu kartın içeriği ~440px ister, 1080p bir monitörde
        (≈968px viewport) rayın iki satırı ~394px verir. `overflow-hidden` bir
        kart bu farkı sessizce kırpar ve "Send the Offer." görünmez olur —
        kullanıcının göremediği buton, olmayan butondur.

        Kırmızı çizgi 1 bu durumu zaten çözmüş: sayfa değil, kartın içi scroll
        eder. Buton scroll alanının DIŞINDA, `mt-auto` ile tabana çakılı kalır.
      */}
      <Scrollable
        label={COPY.jobOffers.title}
        className="flex flex-col gap-(--gap-field)"
      >
        {FIELDS.map(({ name, ...rest }) => (
          <Field
            key={name}
            form="job-offer"
            name={name}
            label={COPY.jobOffers.fields[name]}
            placeholder={COPY.jobOffers.placeholders[name]}
            value={draft.jobOffer[name]}
            onChange={(e) => setJobOffer({ [name]: e.target.value })}
            required
            {...rest}
          />
        ))}
      </Scrollable>

      <div className="flex shrink-0 justify-center pt-3">
        <Button type="submit">{COPY.jobOffers.submit}</Button>
      </div>
    </form>
  );
}
