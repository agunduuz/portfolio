import { Card, type CardSize } from "@/components/ui/Card";
import { Carousel } from "@/components/ui/Carousel";
import { ArrowLink, GoTo, PrivateTag } from "@/components/ui/Link";
import { TechBadges } from "@/components/ui/TechBadges";
import { COPY } from "@/config/site";
import type { TechId } from "@/config/tech-icons";

/**
 * Kartın ihtiyaç duyduğu alanlar — `lib/github.ts`'in `Project` tipi (Faz 3)
 * bu şeklin üstüne oturur. Kart GitHub şemasını bilmez, yalnızca ne
 * göstereceğini bilir.
 */
export type ProjectItem = {
  name: string;
  description: string | null;
  /** Boşsa "Go to Live" satırı hiç çıkmaz — tıklanamayan link göstermeyiz. */
  liveUrl: string | null;
  tech: readonly TechId[];
  /** Private projede repo linki yoktur; yerine "Private" etiketi çıkar. */
  isPrivate: boolean;
};

/**
 * Slaytlar burada, Server Component olarak üretilir; `Carousel` yalnızca
 * hangisinin görüneceğine karar veren ince bir istemci sarmalayıcıdır.
 */
export function ProjectsCard({
  size = "sm",
  projects = [],
}: {
  size?: CardSize;
  /** Faz 3'te GitHub'dan gelir. Boşken kart davet metniyle durur. */
  projects?: readonly ProjectItem[];
}) {
  return (
    <Card title={COPY.projects.title} size={size}>
      {projects.length === 0 ? (
        <Empty />
      ) : (
        <Carousel id="projects" label="Projeler">
          {projects.map((project) => (
            <Slide key={project.name} project={project} />
          ))}
        </Carousel>
      )}

      <div className="mt-auto flex justify-center pt-4">
        <ArrowLink href="/projeler">{COPY.projects.more}</ArrowLink>
      </div>
    </Card>
  );
}

function Slide({ project }: { project: ProjectItem }) {
  return (
    <article className="flex flex-col gap-2">
      {/*
        Uydu kartta zaten "Repository ›" yok (o /projeler modüllerinde).
        Bu yüzden etiket adın yanına oturuyor — kartta repo linki aramaya
        başlamadan önce projenin private olduğunu görsün.
      */}
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="text-h-item text-accent font-mono">{project.name}</h4>
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
    </article>
  );
}

function Empty() {
  return (
    <p className="text-body text-text-2 my-auto text-center text-balance">
      {COPY.projects.empty}
    </p>
  );
}
