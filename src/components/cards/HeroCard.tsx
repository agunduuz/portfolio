import { Card, type CardSize } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { COPY } from "@/config/site";

/**
 * Anasayfada 4 kolon, `/hakkimda`'da 3 kolon — ikisi de `lg` (DESIGN-SYSTEM §5.2).
 * Rayda hiç görünmez, o yüzden `sm` varyantı yoktur.
 *
 * `<h1>` yalnızca burada: her sayfada tek `<h1>` olması SEO iskeletinin şartı.
 * Kart başlığı ortalanmış değil sola hizalı — tasarımda hero'nun kendi düzeni var.
 */
export function HeroCard({
  size = "lg",
  avatarUrl,
}: {
  size?: CardSize;
  /** Faz 3'te GitHub profilinden gelir; yokken düz gri daire kalır. */
  avatarUrl?: string | null;
}) {
  return (
    <Card size={size} className="justify-center">
      <div className="flex items-center justify-center gap-8">
        <Avatar src={avatarUrl} size={120} />

        {/*
          Satır ölçüsü tasarımdan: design/home.png'de tanıtım metni x 604–1475,
          yani 871px'lik bir blokta İKİ satır. 62ch (~530px) onu üç satıra
          kırıyor ve kart 1080p'de içeriğini kırpıyordu. 104ch ≈ 871px.
        */}
        <div className="flex max-w-[104ch] min-w-0 flex-col gap-2">
          <h1 className="font-display text-display-xl text-text">
            {COPY.hero.title}
          </h1>
          <p className="text-body-l text-text-2">{COPY.hero.bio}</p>
          <SocialLinks />
        </div>
      </div>
    </Card>
  );
}
