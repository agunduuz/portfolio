import { Card, type CardSize } from "@/components/ui/Card";
import { COPY } from "@/config/site";

/**
 * Faz 1 — kart iskeletleri.
 *
 * Şu an yalnızca kutu + başlık. İçerikler Faz 2'de gelir; kartlar Server
 * Component kalır, yalnızca gerçekten state tutanlar ("use client") olur.
 * Her kart tek bir bileşendir — sayfaya özel kopya yazma, `size` ile boyutlan.
 */

const PLACEHOLDER = "text-body text-text-3 mt-auto pt-4 text-center";

export function HeroCard({ size = "lg" }: { size?: CardSize }) {
  return (
    <Card size={size} className="justify-center">
      <p className="font-display text-display-xl text-text">
        {COPY.hero.title}
      </p>
      <p className="text-body-l text-text-2 mt-3 max-w-prose">
        {COPY.hero.bio}
      </p>
    </Card>
  );
}

export function ProjectsCard({ size = "sm" }: { size?: CardSize }) {
  return (
    <Card title={COPY.projects.title} size={size}>
      <p className={PLACEHOLDER}>Faz 2</p>
    </Card>
  );
}

export function WritingsCard({ size = "sm" }: { size?: CardSize }) {
  return (
    <Card title={COPY.writings.title} size={size}>
      <p className={PLACEHOLDER}>Faz 2</p>
    </Card>
  );
}

export function AboutMeCard({ size = "sm" }: { size?: CardSize }) {
  return (
    <Card title={COPY.aboutMe.title} size={size}>
      <p className={PLACEHOLDER}>Faz 2</p>
    </Card>
  );
}

export function JobOffersCard({ size = "sm" }: { size?: CardSize }) {
  return (
    <Card title={COPY.jobOffers.title} size={size}>
      <p className="text-label text-accent mt-2 text-center">
        {COPY.jobOffers.lead}
      </p>
      <p className={PLACEHOLDER}>Faz 2</p>
    </Card>
  );
}

export function SubscribeCard({ size = "sm" }: { size?: CardSize }) {
  return (
    <Card title={COPY.subscribe.title} size={size}>
      <p className={PLACEHOLDER}>Faz 2</p>
    </Card>
  );
}
