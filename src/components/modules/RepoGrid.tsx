import { Card } from "@/components/ui/Card";
import { CoverImage } from "@/components/ui/CoverImage";
import { ArrowLink, GoTo, PrivateTag } from "@/components/ui/Link";
import { TechBadges } from "@/components/ui/TechBadges";
import { COPY } from "@/config/site";
import type { Project } from "@/lib/github";

/**
 * `/projeler` r2 — iki repo yan yana (INTERACTIONS §2.3).
 *
 * Last Project'ten iki farkı var, ikisi de tasarımdan:
 *  - kapak GENİŞ (16/7), kare değil
 *  - "Repository ›" SAĞ ALTTA, ortalanmış değil (DESIGN-SYSTEM §5.3 istisnası)
 *
 * Kart başlığı yok; repo adı başlığın kendisi.
 */
export function RepoGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <div className="grid min-h-0 grid-cols-2 gap-(--gap-col)">
      {projects.map((project) => (
        <RepoCard key={project.name} project={project} />
      ))}
    </div>
  );
}

function RepoCard({ project }: { project: Project }) {
  return (
    <Card size="md">
      {/*
        Kapak kalan yüksekliği alır (`min-h-0 flex-1`), sabit bir en-boy oranı
        dayatmaz. Sabit oran yüksekliği genişlikten türetir; kısa ekranda kart
        taşar. Uzun ekranda oran zaten tasarımdaki ~16/7'ye yakın oturuyor.
      */}
      <div className="min-h-0 flex-1">
        <CoverImage
          src={project.coverUrl}
          repo={project.name}
          ratio="fill"
          // Ana bölgenin 3 kolonu ikiye bölünüyor → yaklaşık 437px.
          sizes="(max-width: 1023px) 90vw, 440px"
        />
      </div>

      <div className="mt-3 flex shrink-0 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-h-item text-accent font-mono">{project.name}</h2>
          {project.isPrivate && <PrivateTag />}
        </div>

        {project.description && (
          <p className="text-body text-text-2 line-clamp-2">
            {project.description}
          </p>
        )}

        {project.liveUrl && (
          <GoTo href={project.liveUrl} target={COPY.projects.goTo} external />
        )}
      </div>

      {/* Rozetler solda, "Repository ›" sağda — tasarımdaki tek istisna satır. */}
      <div className="mt-auto flex shrink-0 items-center justify-between gap-3 pt-3">
        <TechBadges tech={project.tech} />
        {project.url && (
          <ArrowLink href={project.url} external className="ml-auto">
            {COPY.projects.repository}
          </ArrowLink>
        )}
      </div>
    </Card>
  );
}
