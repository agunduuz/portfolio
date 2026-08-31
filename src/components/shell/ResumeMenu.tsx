"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Download } from "lucide-react";
import { COPY, SITE } from "@/config/site";

/**
 * CV indirme — iki dil arasında seçim (nav sağ üst).
 *
 * Neden menü, neden iki ayrı buton değil: nav yatayda dar ve tasarımda tek bir
 * "Resume" düğmesi var. İki düğme koymak tasarımı değiştirirdi; menü, tek
 * düğmenin davranışını genişletiyor.
 *
 * `Esc` burada `stopPropagation` çağırıyor. Sebebi somut: yazı detayında
 * `ArticleShell` window üzerinde `Esc` dinliyor ve `/blog`'a dönüyor. Menü
 * açıkken `Esc` menüyü kapatmalı, sayfayı değiştirmemeli — olay window'a
 * ulaşmadan kesiliyor.
 */
export function ResumeMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Dışarı tıklama ve odak kaybı kapatır. `pointerdown` kullanılıyor:
  // `click` beklenirse menü öğesine basarken önce kapanma yarışı doğuyor.
  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape" && open) {
      // ArticleShell'in window dinleyicisine ulaşmasın.
      e.stopPropagation();
      setOpen(false);
      buttonRef.current?.focus();
      return;
    }

    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;

    const items = Array.from(
      rootRef.current?.querySelectorAll<HTMLAnchorElement>(
        "[role='menuitem']",
      ) ?? [],
    );
    if (items.length === 0) return;

    e.preventDefault();
    if (!open) {
      setOpen(true);
      return;
    }

    const index = items.indexOf(document.activeElement as HTMLAnchorElement);
    const next =
      e.key === "ArrowDown"
        ? (index + 1) % items.length
        : (index - 1 + items.length) % items.length;
    items[next]?.focus();
  }

  return (
    <div ref={rootRef} onKeyDown={onKeyDown} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="bg-elevated border-border-strong text-text text-label hover:bg-surface-hover focus-visible:ring-accent focus-visible:ring-offset-surface rounded-inner flex cursor-pointer items-center gap-2 border px-4 py-2.5 transition-colors duration-(--dur-micro) focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <Download aria-hidden className="size-4" />
        {COPY.nav.resume}
        <ChevronDown
          aria-hidden
          className={`size-3.5 transition-transform duration-(--dur-micro) ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label={COPY.nav.resumeMenu}
          className="bg-elevated border-border-strong rounded-inner absolute top-[calc(100%+8px)] right-0 z-20 flex min-w-full flex-col overflow-hidden border py-1"
        >
          {SITE.resumes.map((cv) => (
            <a
              key={cv.lang}
              role="menuitem"
              href={cv.href}
              download={cv.download}
              hrefLang={cv.lang}
              onClick={() => setOpen(false)}
              className="text-label text-text-2 hover:bg-surface-hover hover:text-text focus-visible:ring-accent focus-visible:ring-offset-elevated px-4 py-2 text-left whitespace-nowrap transition-colors duration-(--dur-micro) focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
            >
              {cv.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
