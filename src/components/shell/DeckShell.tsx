import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Nav } from "./Nav";

/**
 * Kabuk (INTERACTIONS §1) — kırmızı çizgi 1'in uygulandığı yer.
 *
 * `100dvh` (`100vh` değil: mobil tarayıcı çubuğu yüksekliği değiştirir),
 * kabukta `overflow-hidden`, grid'de `min-h-0 flex-1`. Bu üçü birlikte olmazsa
 * body'de dikey scroll doğar ve deck bozulur.
 *
 * `--shell-max` içerik kutusudur, `--pad-shell` onun dışındadır (DESIGN-SYSTEM §3.1).
 */
export function DeckShell({ children }: { children: ReactNode }) {
  return (
    <div className="deck-viewport px-pad-shell">
      <div
        id="deck-shell"
        className="mx-auto flex h-full max-w-(--shell-max) flex-col gap-(--gap-row) py-(--pad-shell-y)"
      >
        {/*
          Klavye kullanıcısı nav'ı atlayabilmeli. Görünmez ama ODAKLANINCA
          belirir — `display: none` olsaydı odak sırasına hiç girmezdi.
          Hedef `#main`, `DeckGrid`'in `tabIndex={-1}` taşıyan `<main>`'i.
        */}
        <a
          href="#main"
          className="text-label text-bg bg-accent rounded-inner focus:ring-accent focus:ring-offset-bg sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:ring-2 focus:ring-offset-2 focus:outline-none"
        >
          İçeriğe geç
        </a>

        <Nav />
        {children}
        <Footer />
      </div>
    </div>
  );
}
