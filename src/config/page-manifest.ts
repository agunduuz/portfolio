/**
 * Hangi sayfada hangi kart nerede durur — tek kaynak.
 *
 * `area` biçimi: "satır-başı / kolon-başı / satır-sonu / kolon-sonu"
 * Grid 4 kolon × 3 satır (ARCHITECTURE §3.3, INTERACTIONS §2).
 *
 * Bu dosyayı değiştirmek düzeni değiştirir; bileşenlerde grid-area yazma.
 */

export type CardId =
  | "hero"
  | "projects"
  | "writings"
  | "aboutMe"
  | "jobOffers"
  | "subscribe";

export type RailSide = "left" | "right" | "none";

export type Slot = { id: CardId; area: string };

export type PageLayout = {
  railSide: RailSide;
  /** Uydu kartlar. Anasayfada teknik olarak "ray" yoktur, beş kart doğrudan grid'e oturur. */
  rail: Slot[];
  mainArea: string;
};

export const MANIFEST = {
  "/": {
    railSide: "none",
    rail: [
      { id: "aboutMe", area: "2 / 1 / 4 / 2" },
      { id: "projects", area: "2 / 2 / 3 / 3" },
      { id: "writings", area: "2 / 3 / 4 / 4" },
      { id: "subscribe", area: "3 / 2 / 4 / 4" },
      { id: "jobOffers", area: "2 / 4 / 4 / 5" },
    ],
    mainArea: "1 / 1 / 2 / 5",
  },
  "/hakkimda": {
    railSide: "right",
    rail: [
      { id: "projects", area: "1 / 4 / 2 / 5" },
      { id: "jobOffers", area: "2 / 4 / 4 / 5" },
    ],
    mainArea: "1 / 1 / 4 / 4",
  },
  "/projeler": {
    railSide: "left",
    rail: [
      { id: "writings", area: "1 / 1 / 2 / 2" },
      { id: "aboutMe", area: "2 / 1 / 4 / 2" },
    ],
    mainArea: "1 / 2 / 4 / 5",
  },
  "/blog": {
    railSide: "right",
    rail: [
      { id: "projects", area: "1 / 4 / 2 / 5" },
      { id: "jobOffers", area: "2 / 4 / 4 / 5" },
    ],
    mainArea: "1 / 1 / 4 / 4",
  },
  "/blog/[slug]": {
    railSide: "right",
    rail: [
      { id: "subscribe", area: "1 / 4 / 2 / 5" },
      { id: "aboutMe", area: "2 / 4 / 4 / 5" },
    ],
    mainArea: "1 / 1 / 4 / 4",
  },
} as const satisfies Record<string, PageLayout>;

/** Anasayfada hero birinci satırı domine eder; diğer sayfalarda satırlar dengelidir. */
export const GRID_ROWS = {
  home: "1.15fr 1fr 1fr",
  default: "21fr 21fr 17fr",
} as const;

const FALLBACK: PageLayout = MANIFEST["/"];

/** `/blog/nextjs-rehberi` → `/blog/[slug]` eşlemesi dahil. */
export function resolveLayout(pathname: string): PageLayout {
  if (pathname.startsWith("/blog/")) return MANIFEST["/blog/[slug]"];
  return (MANIFEST as Record<string, PageLayout>)[pathname] ?? FALLBACK;
}
