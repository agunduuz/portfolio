"use client";

import { useElapsed } from "@/hooks/useElapsed";

/**
 * Sayacın tipografik imzası (DESIGN-SYSTEM §0, §2).
 *
 * Rakam ve birim BİTİŞİK ve iki farklı renkte: `1809Day.` Aralarında boşluk
 * yoktur, bu kasıtlıdır — düzeltme.
 *
 * `<dl>` seçildi çünkü değer/birim gerçekten bir tanım listesi. Görsel sıra
 * değer→birim olduğu için `<dd>` `<dt>`'den önce geliyor; HTML bunu kabul eder
 * ve ekran okuyucu çifti yine birlikte okur.
 */

const UNITS = [
  { key: "day", label: "Day." },
  { key: "hour", label: "Hour." },
  { key: "min", label: "Min." },
  { key: "sec", label: "Sec." },
] as const;

export function TimeSpent({ since }: { since: string }) {
  const elapsed = useElapsed(since);

  return (
    <dl
      // Her saniye okunmasın; sayaç bilgilendirici, uyarı değil.
      aria-live="off"
      className="font-display flex flex-col items-center"
    >
      {UNITS.map(({ key, label }) => (
        <div key={key} className="flex items-baseline">
          {/* `tabular-nums` olmadan 9→10 geçişinde satır kayar (CLS). */}
          <dd className="text-display-l text-text tabular-nums">
            {elapsed ? elapsed[key] : "––"}
          </dd>
          <dt className="text-display-l text-text-2">{label}</dt>
        </div>
      ))}
    </dl>
  );
}
