"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";
import { useMountTimestamp } from "@/hooks/useMountTimestamp";
import { Input } from "@/components/ui/Field";
import { COPY } from "@/config/site";
import { subscribe } from "@/app/actions/subscribe";
import {
  HONEYPOT_FIELD,
  TIMESTAMP_FIELD,
  type FormState,
} from "@/app/actions/form-state";

/**
 * E-posta `DraftProvider`'a GİRMEZ — kapsam dar tutulur (ARCHITECTURE §3.4).
 * Tek alanlık bir formu yeniden doldurmak kullanıcıya pahalıya mal olmaz.
 *
 * Yerleşim boyuta bağlıdır, sayfaya değil: 2 kolonluk kartta (anasayfa) alan
 * ve buton yan yana, 1 kolonluk kartta (yazı detay) alt alta — tasarımda böyle.
 */
const INITIAL: FormState = { status: "idle" };

export function SubscribeForm({ inline }: { inline: boolean }) {
  const [state, action] = useActionState(subscribe, INITIAL);
  const startedAt = useMountTimestamp();

  // Başarıda alanı boşaltmak için `key` değiştiriyoruz: controlled state
  // tutmadan input'u sıfırlamanın en ucuz yolu.
  return (
    <div className="mt-3 flex flex-col gap-2">
      <form
        key={state.status === "success" ? "sent" : "idle"}
        action={action}
        className={`flex gap-3 ${inline ? "items-start" : "flex-col"}`}
      >
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

        <Input
          type="email"
          name="email"
          required
          autoComplete="email"
          aria-label={COPY.subscribe.title}
          invalid={
            state.status === "error" && Boolean(state.fieldErrors?.email)
          }
          className={inline ? "flex-1" : ""}
        />

        <Submit inline={inline} />
      </form>

      {state.status !== "idle" && (
        <p
          role="status"
          aria-live="polite"
          className={`text-micro text-center ${
            state.status === "success" ? "text-accent" : "text-danger"
          }`}
        >
          {state.status === "error"
            ? (state.fieldErrors?.email?.[0] ?? state.message)
            : state.message}
        </p>
      )}
    </div>
  );
}

function Submit({ inline }: { inline: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className={inline ? "shrink-0" : "w-full"}
    >
      {pending ? "…" : COPY.subscribe.submit}
    </Button>
  );
}
