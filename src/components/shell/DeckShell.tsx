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
        className="mx-auto flex h-full max-w-(--shell-max) flex-col gap-(--gap-row) py-(--gap-row)"
      >
        <Nav />
        {children}
        <Footer />
      </div>
    </div>
  );
}
