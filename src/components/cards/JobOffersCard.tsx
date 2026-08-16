import { Card, type CardSize } from "@/components/ui/Card";
import { JobOfferForm } from "./JobOfferForm";
import { COPY } from "@/config/site";

/**
 * Kart kabuğu Server Component; yalnızca form istemciye iner çünkü
 * `DraftProvider`'a bağlı (CLAUDE.md → client sınırı sarmalayıcıdadır).
 */
export function JobOffersCard({ size = "sm" }: { size?: CardSize }) {
  return (
    <Card title={COPY.jobOffers.title} size={size}>
      <p className="text-label text-accent mt-2 text-center font-semibold">
        {COPY.jobOffers.lead}
      </p>

      <JobOfferForm />
    </Card>
  );
}
