"use client";

import type { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { COPY } from "@/config/site";

/**
 * E-posta `DraftProvider`'a GİRMEZ — kapsam dar tutulur (ARCHITECTURE §3.4).
 * Tek alanlık bir formu yeniden doldurmak kullanıcıya pahalıya mal olmaz.
 *
 * Yerleşim boyuta bağlıdır, sayfaya değil: 2 kolonluk kartta (anasayfa) alan
 * ve buton yan yana, 1 kolonluk kartta (yazı detay) alt alta — tasarımda böyle.
 */
export function SubscribeForm({ inline }: { inline: boolean }) {
  // Faz 6'da `action={subscribe}` bağlanacak.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => e.preventDefault();

  return (
    <form
      onSubmit={onSubmit}
      className={`mt-3 flex gap-3 ${inline ? "items-start" : "flex-col"}`}
    >
      <Input
        type="email"
        name="email"
        required
        autoComplete="email"
        aria-label={COPY.subscribe.title}
        className={inline ? "flex-1" : ""}
      />
      <Button type="submit" className={inline ? "shrink-0" : "w-full"}>
        {COPY.subscribe.submit}
      </Button>
    </form>
  );
}
