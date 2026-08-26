import type { Metadata } from "next";
import { LastProject } from "@/components/modules/LastProject";
import { RepoGrid } from "@/components/modules/RepoGrid";
import { GitHubProfile } from "@/components/modules/GitHubProfile";
import { getGitHub, slots } from "@/lib/github";
import { JsonLd } from "@/components/JsonLd";
import { projectListSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Projeler",
  description:
    "Açık kaynak repolar ve canlı projeler — kullanılan teknolojiler, kaynak kodu ve dağıtım adresleriyle.",
  alternates: { canonical: "/projeler" },
};

/**
 * Rayın SOLA geçtiği tek sayfa (INTERACTIONS §2.3). Ana bölge 3 kolon:
 * r1 Last Project · r2 iki repo (alt grid) · r3 GitHub profil kartı.
 *
 * Satır oranı `1fr 1.2fr 0.9fr`: ortadaki satır kapak görselleri yüzünden
 * en çok yeri isteyen satır.
 */
export default async function ProjelerPage() {
  const github = await getGitHub();
  const { last, grid, carousel } = slots(github.repos);

  return (
    // `minmax(0,…)` şart: çıplak `1fr` aslında `minmax(auto,1fr)` demek ve
    // otomatik alt sınır satırın içeriğinden küçülmesini engelliyor — kartlar
    // ana bölgenin dışına taşıyordu.
    <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,0.9fr)] gap-(--gap-row)">
      <JsonLd schemas={[projectListSchema(carousel)]} />
      <LastProject project={last} />
      <RepoGrid projects={grid} />
      <GitHubProfile profile={github.profile} />
    </div>
  );
}
