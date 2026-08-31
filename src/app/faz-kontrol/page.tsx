import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PhaseList } from "./PhaseList";
import { Tabs } from "./Tabs";
import { readSource, type Roadmap } from "./roadmap";

/**
 * GEÇİCİ — Faz Kontrol paneli.
 *
 * İki sekme, iki kaynak dosya:
 *  - **Fazlar** (`docs/ROADMAP.md`) — NE yapıldı
 *  - **Yapılacaklar** (`docs/TODO.md`) — KİM yapacak
 *
 * Kutuları tıklamak kaynak dosyayı yerinde günceller; ayrı bir durum dosyası
 * yok. Yalnızca geliştirmede erişilebilir. Proje bitince tek komutla kalkar:
 *   rm -rf src/app/faz-kontrol
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Faz Kontrol",
  robots: { index: false, follow: false },
};

const GATES = ["npx tsc --noEmit", "npm run lint", "npm run build"];

function badge({ done, total }: Roadmap): string {
  return `${done}/${total}`;
}

export default async function FazKontrolPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const [roadmap, todo] = await Promise.all([
    readSource("roadmap"),
    readSource("todo"),
  ]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="font-display text-display-l text-text mb-5">
        Faz Kontrol
      </h1>

      <Tabs
        tabs={[
          {
            id: "todo",
            label: "Yapılacaklar",
            badge: badge(todo),
            panel: (
              <PhaseList
                phases={todo.phases}
                source="todo"
                title="Sende kalanlar"
              />
            ),
          },
          {
            id: "roadmap",
            label: "Fazlar",
            badge: badge(roadmap),
            panel: (
              <PhaseList
                phases={roadmap.phases}
                source="roadmap"
                title="Yol haritası"
              />
            ),
          },
        ]}
      />

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
