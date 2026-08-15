import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { HeroCard } from "@/components/cards";

export const metadata: Metadata = { title: "Hakkımda" };

/**
 * Ana bölge 3 kolon × 3 satır: r1 Hero (lg), r2–3 Summary + Job History.
 * İçerik Faz 4'te gelir (`config/about.ts`).
 */
export default function HakkimdaPage() {
  return (
    <div className="grid min-h-0 flex-1 grid-rows-[1.15fr_2fr] gap-(--gap-row)">
      <HeroCard size="lg" />
      <Card size="lg">
        <h1 className="font-display text-display-l text-text">Summary</h1>
        <p className="text-body text-text-3 mt-auto">Faz 4</p>
      </Card>
    </div>
  );
}
