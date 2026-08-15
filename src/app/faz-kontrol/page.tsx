import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PhaseList } from "./PhaseList";
import { readRoadmap } from "./roadmap";

/**
 * GEÇİCİ — Faz Kontrol paneli.
 *
 * Yalnızca geliştirmede erişilebilir. Proje bitince tek komutla kaldırılır:
 *   rm -rf src/app/faz-kontrol
 * (ROADMAP.md Faz 9'daki ilgili madde de o zaman işaretlenir.)
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Faz Kontrol",
  robots: { index: false, follow: false },
};

const GATES = ["npx tsc --noEmit", "npm run lint", "npm run build"];

export default async function FazKontrolPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const roadmap = await readRoadmap();

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <PhaseList phases={roadmap.phases} />

      <footer className="border-border text-micro text-text-3 mt-8 border-t pt-6">
        <p className="mb-2">
          Kalite kapıları — faz bitti demeden önce üçü de temiz geçmeli:
        </p>
        <ul className="flex flex-wrap gap-2">
          {GATES.map((gate) => (
            <li
              key={gate}
              className="bg-elevated text-text-2 rounded-inner px-2 py-1 font-mono"
            >
              {gate}
            </li>
          ))}
        </ul>
      </footer>
    </main>
  );
}
