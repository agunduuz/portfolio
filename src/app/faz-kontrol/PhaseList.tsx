"use client";

import { useOptimistic, useState, useTransition } from "react";
import { toggleTask } from "./actions";
import { Inline } from "./inline";
import type { RoadmapPhase, Source } from "./roadmap";

/** GEÇİCİ — Faz Kontrol paneli. Proje bitince bu klasör silinir. */

function countOf(phases: RoadmapPhase[]) {
  const items = phases.flatMap((p) => p.items);
  return { done: items.filter((i) => i.done).length, total: items.length };
}

function Bar({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div
      className="bg-elevated h-1.5 w-24 shrink-0 overflow-hidden rounded-full"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${done} / ${total} tamamlandı`}
    >
      <div
        className="bg-accent h-full rounded-full transition-[width] duration-(--dur-ui) ease-(--ease-out)"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function Check({ done }: { done: boolean }) {
  return (
    <span
      aria-hidden
      className={`mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-[5px] border transition-colors duration-(--dur-micro) ${
        done
          ? "border-accent bg-accent text-bg"
          : "border-border-strong text-transparent"
      }`}
    >
      <svg viewBox="0 0 12 12" className="size-3" fill="none">
        <path
          d="M2.5 6.2 4.8 8.5 9.5 3.8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function PhaseList({
  phases,
  source,
  title,
}: {
  phases: RoadmapPhase[];
  /** Hangi dosyaya yazılacağı buradan gelir; serbest yol asla istemciden gelmez. */
  source: Source;
  title: string;
}) {
  const [optimisticPhases, applyToggle] = useOptimistic(
    phases,
    (state: RoadmapPhase[], line: number) =>
      state.map((phase) => ({
        ...phase,
        items: phase.items.map((item) =>
          item.line === line ? { ...item, done: !item.done } : item,
        ),
      })),
  );

  // Açık faz: başlanmış ama bitmemiş ilk faz; yoksa ilk tamamlanmamış faz.
  const inProgress = phases.find(
    (p) => p.items.some((i) => i.done) && p.items.some((i) => !i.done),
  );
  const firstOpen =
    (inProgress ?? phases.find((p) => p.items.some((i) => !i.done)))?.number ??
    phases[0]?.number;

  const [open, setOpen] = useState<Set<number>>(
    () => new Set(firstOpen === undefined ? [] : [firstOpen]),
  );
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const overall = countOf(optimisticPhases);

  function toggle(line: number, text: string) {
    setError(null);
    startTransition(async () => {
      applyToggle(line);
      const result = await toggleTask(source, line, text);
      if (!result.ok) setError(result.error);
    });
  }

  function toggleOpen(number: number) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (!next.delete(number)) next.add(number);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <header className="border-border bg-surface rounded-card flex flex-wrap items-center gap-x-5 gap-y-3 border p-6">
        <div className="mr-auto">
          <h2 className="font-display text-h-card text-text">{title}</h2>
          <p className="text-micro text-text-3 mt-1">
            <code className="font-mono">
              docs/{source === "roadmap" ? "ROADMAP" : "TODO"}.md
            </code>{" "}
            · geliştirme aracı, üretime çıkmaz
          </p>
        </div>

        <div className="text-right">
          <div className="font-display text-display-l text-text tabular-nums">
            {overall.done}
            <span className="text-text-3">/{overall.total}</span>
          </div>
          <div className="text-micro text-text-3">tamamlandı</div>
        </div>

        <Bar done={overall.done} total={overall.total} />
      </header>

      {error && (
        <p
          role="alert"
          className="border-danger/40 text-danger text-label rounded-inner border px-4 py-3"
        >
          {error} Sayfayı yenile.
        </p>
      )}

      {optimisticPhases.map((phase) => {
        const { done, total } = countOf([phase]);
        const complete = total > 0 && done === total;
        const isOpen = open.has(phase.number);

        return (
          <section
            key={phase.number}
            className="border-border bg-surface rounded-card overflow-hidden border"
          >
            <h3>
              <button
                type="button"
                onClick={() => toggleOpen(phase.number)}
                aria-expanded={isOpen}
                className="hover:bg-surface-hover focus-visible:ring-accent focus-visible:ring-offset-bg flex w-full cursor-pointer items-center gap-4 px-6 py-4 text-left transition-colors duration-(--dur-micro) focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <span
                  className={`text-label rounded-inner grid h-7 min-w-11 shrink-0 place-items-center px-2 font-mono tabular-nums ${
                    complete ? "bg-accent text-bg" : "bg-elevated text-text-2"
                  }`}
                >
                  {phase.number}
                </span>

                <span className="mr-auto min-w-0">
                  <span className="font-display text-h-item text-text block">
                    {phase.title}
                  </span>
                  {phase.meta && (
                    <span className="text-micro text-text-3">{phase.meta}</span>
                  )}
                </span>

                <span className="text-label text-text-2 tabular-nums">
                  {done}/{total}
                </span>

                <Bar done={done} total={total} />

                <svg
                  viewBox="0 0 16 16"
                  aria-hidden
                  className={`text-text-3 size-4 shrink-0 transition-transform duration-(--dur-micro) ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                >
                  <path
                    d="m4 6 4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </h3>

            {isOpen && (
              <div className="border-border border-t px-6 py-4">
                {phase.note && (
                  <p className="text-body text-text-3 mb-4 italic">
                    <Inline>{phase.note}</Inline>
                  </p>
                )}

                <ul className="flex flex-col gap-1">
                  {phase.items.map((item) => (
                    <li key={item.line}>
                      <button
                        type="button"
                        onClick={() => toggle(item.line, item.text)}
                        className="hover:bg-surface-hover focus-visible:ring-accent focus-visible:ring-offset-surface text-body rounded-inner flex w-full cursor-pointer items-start gap-3 px-2 py-1.5 text-left transition-colors duration-(--dur-micro) focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                      >
                        <Check done={item.done} />
                        <span
                          className={
                            item.done
                              ? "text-text-3 line-through"
                              : "text-text-2"
                          }
                        >
                          <Inline>{item.text}</Inline>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>

                {phase.finish && (
                  <p className="border-border text-label text-text-3 mt-4 border-t pt-4">
                    <span className="text-text-2 font-semibold">Bitiş: </span>
                    <Inline>{phase.finish}</Inline>
                  </p>
                )}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
