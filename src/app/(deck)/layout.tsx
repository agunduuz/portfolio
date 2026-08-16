import { DeckShell } from "@/components/shell/DeckShell";
import { DeckGrid } from "@/components/shell/DeckGrid";
import { DeckController } from "@/components/shell/DeckController";
import { SatelliteRail } from "@/components/shell/SatelliteRail";
import { DraftProvider } from "@/state/DraftProvider";
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
export default function DeckLayout({ children }: LayoutProps<"/">) {
  // Kart içerikleri Server Component olarak üretilip ray'e prop geçer;
  // client sınırı yalnızca sarmalayıcıdadır.
  // Projects ve Writings verisi Faz 3 ve Faz 5'te bağlanır; o zamana kadar
  // kartlar boş durum metniyle render eder (CONTENT-MODEL §8).
  const cards = {
    hero: <HeroCard />,
    projects: <ProjectsCard />,
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
