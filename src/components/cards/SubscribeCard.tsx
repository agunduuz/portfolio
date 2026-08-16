import { Card, type CardSize } from "@/components/ui/Card";
import { SubscribeForm } from "./SubscribeForm";
import { COPY } from "@/config/site";

/**
 * İki alt metin varyantı tasarımın kendi kararı (CONTENT-MODEL §5):
 * anasayfada davet, yazı detayında bağlam. Aynı kart, iki cümle.
 */
export function SubscribeCard({
  size = "md",
  variant = "home",
}: {
  size?: CardSize;
  variant?: "home" | "detail";
}) {
  return (
    <Card title={COPY.subscribe.title} size={size} className="justify-center">
      <p className="text-body text-text-2 mt-2 text-center text-balance">
        {variant === "home"
          ? COPY.subscribe.homeLead
          : COPY.subscribe.detailLead}
      </p>

      <SubscribeForm inline={size !== "sm"} />
    </Card>
  );
}
