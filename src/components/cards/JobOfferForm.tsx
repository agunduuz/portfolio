"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";
import { useMountTimestamp } from "@/hooks/useMountTimestamp";
import { Scrollable } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { COPY } from "@/config/site";
import { useDraft } from "@/state/DraftProvider";
import { sendJobOffer } from "@/app/actions/job-offer";
import {
  HONEYPOT_FIELD,
  TIMESTAMP_FIELD,
  type FormState,
} from "@/app/actions/form-state";

/**
 * Dört alan da `DraftProvider`'dan controlled (ARCHITECTURE §3.4).
 *
 * Sebep kırmızı çizgi 4: kart route değişiminde unmount olur. Kullanıcı üç
 * alanı doldurup Projeler'e bakmaya gittiğinde yazdıkları durmalı.
 *
 * Server Action kullanılıyor, API route değil — JS kapalıyken de çalışsın.
 */

const FIELDS = [
  { name: "location", type: "text", autoComplete: "off" },
  { name: "type", type: "text", autoComplete: "off" },
  { name: "technology", type: "text", autoComplete: "off" },
  { name: "amount", type: "text", inputMode: "numeric" },
] as const;

const INITIAL: FormState = { status: "idle" };

export function JobOfferForm() {
  const { draft, setJobOffer, clearJobOffer } = useDraft();
  const [state, action] = useActionState(sendJobOffer, INITIAL);

  // Form açıldığı an — 2 saniyeden hızlı gönderim bot sayılır.
  const startedAt = useMountTimestamp();

  useEffect(() => {
    if (state.status === "success") clearJobOffer();
  }, [state.status, clearJobOffer]);

  return (
    <form action={action} className="mt-2 flex min-h-0 flex-1 flex-col">
      {/* Honeypot: ekran okuyucudan ve klavyeden gizli, botlara görünür. */}
      <input
        type="text"
        name={HONEYPOT_FIELD}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="pointer-events-none absolute -left-[9999px] size-0 opacity-0"
      />
      <input
        ref={startedAt}
        type="hidden"
        name={TIMESTAMP_FIELD}
        defaultValue=""
      />

      {/*
        Alanlar kart içinde scroll eder, buton ETMEZ. Bu kartın içeriği ~440px
        ister, 1080p'de rayın iki satırı ~394px verir; kullanıcının göremediği
        buton olmayan butondur (DESIGN-SYSTEM §3.2).
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
            error={
              state.status === "error"
                ? state.fieldErrors?.[name]?.[0]
                : undefined
            }
            required
            {...rest}
          />
        ))}
      </Scrollable>

      <div className="flex shrink-0 flex-col items-center gap-2 pt-3">
        <Submit />
        <Status state={state} />
      </div>
    </form>
  );
}

/** `useFormStatus` yalnızca `<form>`'un ALTINDA çalışır — ayrı bileşen şart. */
function Submit() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? COPY.jobOffers.pending : COPY.jobOffers.submit}
    </Button>
  );
}

function Status({ state }: { state: FormState }) {
  if (state.status === "idle") return null;

  return (
    <p
      role="status"
      aria-live="polite"
      className={`text-micro text-center ${
        state.status === "success" ? "text-accent" : "text-danger"
      }`}
    >
      {state.message}
    </p>
  );
}
