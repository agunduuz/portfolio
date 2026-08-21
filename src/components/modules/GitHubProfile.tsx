import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { GoTo } from "@/components/ui/Link";
import { COPY } from "@/config/site";
import type { Profile } from "@/lib/github";

/**
 * `/projeler` r3 — GitHub profil kartı (PRD §6).
 *
 * Kart başlığı yok; kullanıcı adı başlığın kendisi. Sağ üstte repo sayısı:
 * "Repository" gri, sayı beyaz ve bold — "Go to X" kalıbının aynadaki hâli.
 */
export function GitHubProfile({ profile }: { profile: Profile }) {
  return (
    <Card size="lg">
      <div className="flex min-h-0 flex-1 items-center gap-6">
        <Avatar src={profile.avatarUrl} size={118} />

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-h-item text-accent font-mono">
              {profile.login}
            </h2>

            <p className="text-label text-text-3 shrink-0">
              {COPY.projects.repoCount}{" "}
              <strong className="text-text font-semibold tabular-nums">
                {profile.repoCount}
              </strong>
            </p>
          </div>

          {profile.bio && (
            <p className="text-body text-text-2 line-clamp-2">{profile.bio}</p>
          )}

          <GoTo href={profile.url} target={COPY.projects.profile} external />
        </div>
      </div>
    </Card>
  );
}
