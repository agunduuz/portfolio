import { HeroCard } from "@/components/cards";

/**
 * Anasayfa — tek istisna sayfa: ray yoktur, hero 4 kolonun tamamını kaplar.
 * Diğer beş kart manifest üzerinden doğrudan grid'e yerleşir.
 */
export default function HomePage() {
  return <HeroCard size="lg" />;
}
