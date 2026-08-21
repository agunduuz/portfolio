import { HeroCard } from "@/components/cards";
import { getGitHub } from "@/lib/github";

/**
 * Anasayfa — tek istisna sayfa: ray yoktur, hero 4 kolonun tamamını kaplar.
 * Diğer beş kart manifest üzerinden doğrudan grid'e yerleşir.
 *
 * `getGitHub()` burada da çağrılıyor ama ikinci bir ağ isteği doğmuyor:
 * Next aynı render geçişindeki aynı `fetch`'i Data Cache üzerinden tekilleştirir.
 */
export default async function HomePage() {
  const { profile } = await getGitHub();

  return <HeroCard size="lg" avatarUrl={profile.avatarUrl} />;
}
