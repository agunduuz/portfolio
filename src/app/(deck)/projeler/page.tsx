import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = { title: "Projeler" };

/**
 * Rayın SOLA geçtiği tek sayfa. Ana bölge 3 kolon:
 * r1 Last Project · r2 iki repo (alt grid) · r3 GitHub profil kartı.
 * Modüller Faz 4'te, veri Faz 3'te gelir.
 */
export default function ProjelerPage() {
  return (
    <div className="grid min-h-0 flex-1 grid-rows-[1fr_1.2fr_0.9fr] gap-(--gap-row)">
      <Card title="Last Project." size="lg" as="h1" />
      <div className="grid min-h-0 grid-cols-2 gap-(--gap-col)">
        <Card size="md" />
        <Card size="md" />
      </div>
      <Card size="lg" />
    </div>
  );
}
