import { DeckShell } from "@/components/shell/DeckShell";
import { DeckGrid } from "@/components/shell/DeckGrid";
import { DeckController } from "@/components/shell/DeckController";
import { SatelliteRail } from "@/components/shell/SatelliteRail";
import { DraftProvider } from "@/state/DraftProvider";
import { getGitHub, slots } from "@/lib/github";
import {
  AboutMeCard,
  HeroCard,
  JobOffersCard,
  ProjectsCard,
  SubscribeCard,
  WritingsCard,
} from "@/components/cards";

/**
 * Kalıcı kabuk (ARCHITECTURE §3, kırmızı çizgi 4).
 *
 * Bu layout route değişiminde YENİDEN RENDER EDİLMEZ. `SatelliteRail` burada
 * yaşadığı için konteyner hiç unmount olmaz ve `grid-area` değişimini kayarak
 * karşılar. Ray'i sayfa dosyasına taşımak imza hareketi bozar.
 */
export default async function DeckLayout({ children }: LayoutProps<"/">) {
  // GitHub verisi kabuk seviyesinde bir kez çekilir: ray her sayfada duruyor,
  // her route'ta yeniden istek atmak anlamsız olurdu. `getGitHub` asla throw
  // etmez — token yoksa veya API çökerse fallback döner (ARCHITECTURE §5).
  const github = await getGitHub();
  const { carousel } = slots(github.repos);

  // Kart içerikleri Server Component olarak üretilip ray'e prop geçer;
  // client sınırı yalnızca sarmalayıcıdadır.
  // Writings verisi Faz 5'te (MDX) bağlanır.
  const cards = {
    hero: <HeroCard avatarUrl={github.profile.avatarUrl} />,
    projects: <ProjectsCard projects={carousel} />,
    writings: <WritingsCard />,
    aboutMe: <AboutMeCard />,
    jobOffers: <JobOffersCard />,
    subscribe: <SubscribeCard />,
  };

  const detailCards = {
    subscribe: <SubscribeCard size="sm" variant="detail" />,
  };

  return (
    <DraftProvider>
      <DeckController />
      <DeckShell>
        <DeckGrid
          rail={<SatelliteRail cards={cards} detailCards={detailCards} />}
        >
          {children}
        </DeckGrid>
      </DeckShell>
    </DraftProvider>
  );
}
