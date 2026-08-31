"use client";

import { useState } from "react";
import type { ReactNode } from "react";

/**
 * GEÇİCİ — Faz Kontrol paneli. Proje bitince bu klasör silinir.
 *
 * İki sekme, iki dosya: fazlar (ne yapıldı) ve yapılacaklar (kim yapacak).
 * Her iki panel de HER ZAMAN render ediliyor, gizlenen `hidden` ile
 * saklanıyor — koşullu render olsaydı sekme değiştirmek açık/kapalı faz
 * durumunu ve iyimser güncellemeleri sıfırlardı.
 *
 * ARIA tab deseni: `role="tablist"` → `role="tab"` → `role="tabpanel"`,
 * sol/sağ ok tuşlarıyla geçiş.
 */
export function Tabs({
  tabs,
}: {
  tabs: { id: string; label: string; badge?: string; panel: ReactNode }[];
}) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();

    const index = tabs.findIndex((t) => t.id === active);
    const next =
      e.key === "ArrowRight"
        ? (index + 1) % tabs.length
        : (index - 1 + tabs.length) % tabs.length;

    const id = tabs[next]?.id;
    if (!id) return;
    setActive(id);
    document.getElementById(`tab-${id}`)?.focus();
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        role="tablist"
        aria-label="Panel bölümleri"
        onKeyDown={onKeyDown}
        className="border-border bg-surface rounded-card flex gap-1 border p-1"
      >
        {tabs.map((tab) => {
          const selected = tab.id === active;

          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.id)}
              className={`text-label rounded-inner focus-visible:ring-accent focus-visible:ring-offset-surface flex flex-1 cursor-pointer items-center justify-center gap-2 px-4 py-2.5 transition-colors duration-(--dur-micro) focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
                selected
                  ? "bg-elevated text-text"
                  : "text-text-3 hover:text-text-2"
              }`}
            >
              {tab.label}
              {tab.badge && (
                <span className="text-micro text-text-3 font-mono tabular-nums">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab.id}`}
          hidden={tab.id !== active}
        >
          {tab.panel}
        </div>
      ))}
    </div>
  );
}
