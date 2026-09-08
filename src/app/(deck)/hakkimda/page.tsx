import type { Metadata } from "next";
import { HeroCard } from "@/components/cards";
import { AboutBody } from "@/components/modules/AboutBody";
import { getGitHub } from "@/lib/github";

export const metadata: Metadata = {
  title: "Hakkımda",
  description:
    "Anıl Gündüz kimdir, hangi teknolojilerle çalışır ve şimdiye kadar nerelerde ne üretti.",
  alternates: { canonical: "/hakkimda" },
};

/**
 * Ana bölge 3 kolon × 3 satır: r1 Hero (lg), r2–3 Summary + Job History
 * (INTERACTIONS §2.2). Metin `config/about.ts`'ten gelir.
 *
 * `minmax(0,…)`: çıplak `fr` aslında `minmax(auto,fr)` demek ve satırın
 * içeriğinden küçülmesini engelliyor — uzun biyografi kartı ana bölgenin
 * dışına taşırırdı. Bu sınırla birlikte kart kendi içinde scroll eder.
 */
export default async function HakkimdaPage() {
  const { profile } = await getGitHub();

  return (
    <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1.15fr)_minmax(0,2fr)] gap-(--gap-row)">
      <HeroCard size="lg" avatarUrl={profile.avatarUrl} />
      <AboutBody />
    </div>
  );
}
