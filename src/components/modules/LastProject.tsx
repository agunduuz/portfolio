import { Card } from "@/components/ui/Card";
import { CoverImage } from "@/components/ui/CoverImage";
import { ArrowLink, GoTo, PrivateTag } from "@/components/ui/Link";
import { TechBadges } from "@/components/ui/TechBadges";
import { COPY } from "@/config/site";
import type { Project } from "@/lib/github";

/**
 * `/projeler` r1 — vitrinin en öndeki projesi (PRD §6).
 *
 * Tasarımda kapak KARE ve solda; sağ kolonda ad, tam açıklama, "Go to Live"
 * ve rozetler. "Repository ›" kartın altında ORTALANMIŞ — repo ızgarasındaki
 * sağ alt konumdan farklı, bu bilinçli (DESIGN-SYSTEM §5.3).
 */
export function LastProject({ project }: { project: Project | null }) {
  if (!project) return <Card title={COPY.projects.last} size="lg" as="h1" />;

  return (
    <Card title={COPY.projects.last} size="lg" as="h1">
      <div className="mt-4 flex min-h-0 flex-1 gap-6">
        {/*
          Kapak kare kalır ama boyutunu YÜKSEKLİK belirler (`h-full aspect-square`),
          genişlik değil. Genişlikten türetseydi kısa ekranda küçülmez, kart taşardı
          — ölçüldü: 626px'lik ana bölgeye 1071px içerik giriyordu.
        */}
        <div className="aspect-square h-full max-w-[40%] shrink-0">
          <CoverImage
            src={project.coverUrl}
            repo={project.name}
            ratio="fill"
            sizes="(max-width: 1023px) 40vw, 220px"
            priority
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-h-item text-accent font-mono">
              {project.name}
            </h2>
            {project.isPrivate && <PrivateTag />}
          </div>

          {project.description && (
            <p className="text-body text-text-2 line-clamp-3">
              {project.description}
            </p>
          )}

          {project.liveUrl && (
            <GoTo href={project.liveUrl} target={COPY.projects.goTo} external />
          )}

          <TechBadges tech={project.tech} />
        </div>
      </div>

      {/* Private projede repo linki yok — tıklanamayan link göstermeyiz. */}
      {project.url && (
        <div className="mt-auto flex shrink-0 justify-center pt-4">
          <ArrowLink href={project.url} external>
            {COPY.projects.repository}
          </ArrowLink>
        </div>
      )}
    </Card>
  );
}
