import type { ReactNode } from "react";

/**
 * Tüm bento kartların tek temeli (DESIGN-SYSTEM §5).
 *
 * `size` kolon sayısına bağlıdır, sayfaya değil:
 *   sm → 1 kolon  (tüm uydu kartlar, anasayfa dahil)
 *   md → 2 kolon  (anasayfada Subscribe)
 *   lg → 3–4 kolon (Hero, ana bölge modülleri)
 *
 * İkinci bir kart bileşeni yazma — buraya varyant ekle.
 */

export type CardSize = "sm" | "md" | "lg";

const PADDING: Record<CardSize, string> = {
  sm: "p-pad-card-sm",
  md: "p-pad-card",
  lg: "p-pad-card",
};

const TITLE: Record<CardSize, string> = {
  sm: "text-h-card",
  md: "text-h-card",
  lg: "text-display-l",
};

export function Card({
  title,
  size = "sm",
  as: Heading = "h3",
  className = "",
  children,
}: {
  title?: string;
  size?: CardSize;
  as?: "h1" | "h2" | "h3";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <section
      className={`bg-surface border-border hover:border-border-strong rounded-card flex h-full min-h-0 flex-col overflow-hidden border transition-colors duration-(--dur-micro) ${PADDING[size]} ${className}`}
    >
      {title && (
        <Heading
          className={`font-display text-text shrink-0 text-center ${TITLE[size]}`}
        >
          {title}
        </Heading>
      )}
      {children}
    </section>
  );
}

/**
 * Kart içinde scroll eden alan. Deck navigasyonu `[data-scrollable]` gören
 * yerde devreye girmez (INTERACTIONS §4.4), klavyeyle odaklanabilir olması
 * erişilebilirlik zemininin parçasıdır.
 */
export function Scrollable({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      data-scrollable
      tabIndex={0}
      role="region"
      aria-label={label}
      className={`focus-visible:ring-accent focus-visible:ring-offset-surface min-h-0 flex-1 overflow-y-auto focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${className}`}
    >
      {children}
    </div>
  );
}
