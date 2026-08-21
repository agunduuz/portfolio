import { Card, Scrollable } from "@/components/ui/Card";
import { ABOUT, formatRange } from "@/config/about";
import { COPY } from "@/config/site";

/**
 * `/hakkimda` r2–r3 — Summary + Job History TEK kartta (PRD §5).
 *
 * İki `<h2>` aynı kartın içinde; yeni kart açılmaz. İçerik sığmazsa kartın
 * içi scroll eder (`Scrollable` → `data-scrollable`), sayfa değil —
 * kırmızı çizgi 1.
 *
 * Başlıklar noktasızdır: nokta kuralı kart başlıklarına ait, sayfa içi
 * `<h2>`'lere değil (DESIGN-SYSTEM §2).
 */
export function AboutBody() {
  const hasSummary = ABOUT.summary.length > 0;
  const hasJobs = ABOUT.jobHistory.length > 0;

  return (
    <Card size="lg">
      <Scrollable label={COPY.about.label} className="flex flex-col gap-6">
        <section>
          <h2 className="font-display text-display-l text-text">
            {COPY.about.summary}
          </h2>
          {hasSummary ? (
            <div className="mt-3 flex flex-col gap-3">
              {ABOUT.summary.map((paragraph) => (
                <p key={paragraph} className="text-body text-text-2">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-body text-text-3 mt-3">{COPY.about.empty}</p>
          )}
        </section>

        {hasJobs && (
          <section>
            <h2 className="font-display text-display-l text-text">
              {COPY.about.jobHistory}
            </h2>

            <ul className="mt-3 flex flex-col gap-4">
              {ABOUT.jobHistory.map((job) => (
                <li key={`${job.company}-${job.from}`}>
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <h3 className="text-h-item text-text">{job.role}</h3>
                    <span className="text-label text-text-2">
                      · {job.company}
                    </span>
                    <span className="text-micro text-text-3 ml-auto tabular-nums">
                      {formatRange(job.from, job.to)}
                    </span>
                  </div>
                  <p className="text-body text-text-2 mt-1">{job.outcome}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </Scrollable>
    </Card>
  );
}
