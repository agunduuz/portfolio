import { Card, type CardSize } from "@/components/ui/Card";
import { ArrowLink } from "@/components/ui/Link";
import { TimeSpent } from "./TimeSpent";
import { COPY, SITE } from "@/config/site";

/**
 * Sayaç dışında tamamen statik — bu yüzden kart Server Component kalır,
 * yalnızca `TimeSpent` istemciye iner (CLAUDE.md → client sınırı).
 */
export function AboutMeCard({ size = "sm" }: { size?: CardSize }) {
  return (
    <Card title={COPY.aboutMe.title} size={size}>
      <p className="text-body text-text-2 mt-3 text-center text-balance">
        {COPY.aboutMe.statusPrefix}{" "}
        <strong className="text-accent font-semibold">
          {COPY.aboutMe.currentFocus}
        </strong>
      </p>

      <p className="text-body text-text mt-4 text-center">
        {COPY.aboutMe.counterLabel}
      </p>

      <div className="mt-2 flex min-h-0 flex-1 items-center justify-center">
        <TimeSpent since={SITE.careerStart} />
      </div>

      <div className="mt-auto flex justify-center pt-4">
        <ArrowLink href="/hakkimda">{COPY.aboutMe.more}</ArrowLink>
      </div>
    </Card>
  );
}
