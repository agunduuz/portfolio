import "server-only";
import { z } from "zod";
import { githubEnv, hasGitHubEnv } from "./env.server";
import { FEATURED } from "@/config/featured-projects";
import { PRIVATE_PROJECTS } from "@/config/private-projects";
import { resolveTech, type TechId } from "@/config/tech-icons";

/**
 * GitHub veri akışı (ARCHITECTURE §5).
 *
 * Tek kural her şeyin üstünde: **bu modül asla throw etmez.** Token bozuksa,
 * API 403 dönerse, şema değişirse fallback render edilir. Portfolyonun
 * GitHub'ın uptime'ına bağlı olması kabul edilemez — kartın boş kalması
 * ziyaretçiye "bu adam işini bilmiyor" dedirtir, ki sitenin tek işi bunun
 * tersi.
 */

const ENDPOINT = "https://api.github.com/graphql";

/** `next.tags` ve `revalidateTag` aynı sabiti kullanır; iki yerde yazılmaz. */
export const GITHUB_TAG = "github";

/** Tasarımın üç veri ihtiyacı (repo listesi, öne çıkan repo, profil) tek sorguda. */
const PORTFOLIO_QUERY = /* GraphQL */ `
  query Portfolio($login: String!) {
    user(login: $login) {
      login
      name
      bio
      url
      avatarUrl(size: 240)
      repositories(
        # 50, keyfi bir sayı değil: 64 public repo var ve vitrindeki
        # safe-zone pushedAt sıralamasında 9. sırada (son push 2024).
        # first:20 ile bugün sığıyor ama 12 repoya daha push atılırsa
        # pencereden düşer ve vitrin slotu sessizce boşalır — FEATURED
        # sıralaması onu kurtaramaz, çünkü veri hiç gelmemiş olur.
        first: 50
        privacy: PUBLIC
        isFork: false
        orderBy: { field: PUSHED_AT, direction: DESC }
      ) {
        totalCount
        nodes {
          name
          description
          url
          homepageUrl
          stargazerCount
          pushedAt
          isArchived
          openGraphImageUrl
          usesCustomOpenGraphImage
          primaryLanguage {
            name
            color
          }
          repositoryTopics(first: 10) {
            nodes {
              topic {
                name
              }
            }
          }
        }
      }
    }
  }
`;

/* ── Şema ────────────────────────────────────────────────────────────────── */

const RepoNode = z.object({
  name: z.string(),
  description: z.string().nullable(),
  url: z.string(),
  homepageUrl: z.string().nullable(),
  stargazerCount: z.number(),
  pushedAt: z.string(),
  isArchived: z.boolean(),
  openGraphImageUrl: z.string(),
  usesCustomOpenGraphImage: z.boolean(),
  primaryLanguage: z
    .object({ name: z.string(), color: z.string().nullable() })
    .nullable(),
  repositoryTopics: z.object({
    nodes: z.array(z.object({ topic: z.object({ name: z.string() }) })),
  }),
});

const UserNode = z.object({
  login: z.string(),
  name: z.string().nullable(),
  bio: z.string().nullable(),
  url: z.string(),
  avatarUrl: z.string(),
  repositories: z.object({
    totalCount: z.number(),
    // `nodes` içinde null gelebilir (silinmiş/erişilemez repo); eleriz.
    nodes: z.array(RepoNode.nullable()),
  }),
});

/* ── Alan tipleri (CONTENT-MODEL §3) ─────────────────────────────────────── */

export type Project = {
  name: string;
  description: string | null;
  /**
   * "Repository ›" hedefi. Private projede **null** — private repo sayfası
   * ziyaretçide 404 verir, tıklanamayan link göstermek kullanıcıya yalan
   * söylemektir (PRD §6).
   */
  url: string | null;
  /** Boşsa "Go to Live" satırı hiç render edilmez. */
  liveUrl: string | null;
  /** Private projede config'ten gelir; verilmemişse null → düz blok. */
  coverUrl: string | null;
  hasCustomCover: boolean;
  stars: number;
  language: { name: string; color: string | null } | null;
  topics: string[];
  tech: TechId[];
  pushedAt: string;
  featured: boolean;
  /** Kartta "Private" etiketi çıkarır ve repo linkini bastırır. */
  isPrivate: boolean;
};

export type Profile = {
  login: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string;
  url: string;
  repoCount: number;
};

export type GitHubData = { profile: Profile; repos: Project[] };

/* ── Fallback ────────────────────────────────────────────────────────────── */

const GITHUB_USER = "agunduuz";
const PROFILE_URL = `https://github.com/${GITHUB_USER}`;

/**
 * API çöktüğünde render edilen veri (CONTENT-MODEL §3).
 *
 * Public repo açıklamaları burada yok çünkü tek doğruluk kaynağı GitHub'daki
 * repo açıklamasıdır; uydurma açıklama yazmak veriyi ikiye böler. Açıklama
 * boşsa kart o satırı zaten atlar.
 *
 * Private projeler fallback'te de görünür — onların kaynağı zaten API değil,
 * `private-projects.ts`. API'nin çökmesi onları etkilemez.
 *
 * Fonksiyon, sabit değil: `fromPrivate()` modül seviyesindeki `FEATURED_ORDER`
 * map'ine bakıyor ve o aşağıda tanımlı. Sabit olsaydı modül yüklenirken TDZ'ye
 * çarpardı.
 */
let fallbackCache: GitHubData | null = null;

function fallback(): GitHubData {
  if (fallbackCache) return fallbackCache;

  // Dönüş tipi açıkça `Project`: `as const` olan FEATURED yoksa `name`'i
  // literal birleşime daraltıyor ve `concat` reddediyor.
  const repos: Project[] = FEATURED.map((f): Project => ({
    name: f.repo,
    description: null,
    url: `${PROFILE_URL}/${f.repo}`,
    liveUrl: f.live,
    coverUrl: `https://opengraph.githubassets.com/1/${GITHUB_USER}/${f.repo}`,
    hasCustomCover: false,
    stars: 0,
    language: null,
    topics: [],
    tech: [],
    pushedAt: new Date(0).toISOString(),
    featured: true,
    isPrivate: false,
  }))
    .concat(fromPrivate())
    .sort(byFeaturedThenRecent);

  fallbackCache = {
    profile: {
      login: GITHUB_USER,
      name: "Anıl Gündüz",
      bio: null,
      avatarUrl: `https://avatars.githubusercontent.com/${GITHUB_USER}`,
      url: PROFILE_URL,
      repoCount: repos.length,
    },
    repos,
  };

  return fallbackCache;
}

/* ── Dönüştürme ──────────────────────────────────────────────────────────── */

/**
 * Elle küratörlük sırası; listede olmayan repo `Infinity` alır ve arkaya düşer.
 *
 * **İki kaynaktan besleniyor.** Vitrin artık yalnızca public repolardan
 * oluşmuyor: private projeler de sıraya girebiliyor ve ikisi TEK havuzda
 * yarışıyor. Ayrı iki sıra tutmak "1. sırada iki proje var" durumunu mümkün
 * kılardı; slot dağılımı (1 → Last Project, 2–3 → ızgara) buna izin vermez.
 *
 * `Map<string, …>` açıkça yazılıyor: `FEATURED` `as const` olduğu için anahtar
 * tipi repo adlarının birleşimine kilitleniyor ve GitHub'dan gelen herhangi bir
 * `string` ile sorgulanamıyor.
 */
const FEATURED_ORDER = new Map<string, number>([
  ...FEATURED.map((f) => [f.repo, f.order] as [string, number]),
  ...PRIVATE_PROJECTS.filter((p) => p.order !== undefined).map(
    (p) => [p.name, p.order as number] as [string, number],
  ),
]);
const FEATURED_LIVE = new Map<string, string | null>(
  FEATURED.map((f) => [f.repo, f.live]),
);

const HIDDEN_TOPIC = "portfolio-hidden";

/**
 * Elle yazılmış private projeleri API'den gelenlerle aynı şekle sokar.
 * Sıralama, slot dağılımı ve kartlar ikisini ayırt etmez — tek fark
 * `isPrivate` ve `url`'ün null olması.
 */
function fromPrivate(): Project[] {
  return PRIVATE_PROJECTS.map((p) => ({
    name: p.name,
    description: p.description,
    url: null,
    liveUrl: p.liveUrl,
    coverUrl: p.cover ?? null,
    hasCustomCover: Boolean(p.cover),
    stars: 0,
    language: null,
    topics: [],
    tech: [...p.tech],
    pushedAt: new Date(p.updated).toISOString(),
    featured: p.order !== undefined,
    isPrivate: true,
  }));
}

/** Vitrin sırası önce, kalanlar `pushedAt` desc. Public/private ayrımı yok. */
function byFeaturedThenRecent(a: Project, b: Project): number {
  const oa = FEATURED_ORDER.get(a.name) ?? Infinity;
  const ob = FEATURED_ORDER.get(b.name) ?? Infinity;
  if (oa !== ob) return oa - ob;
  return b.pushedAt.localeCompare(a.pushedAt);
}

function shape(user: z.infer<typeof UserNode>): GitHubData {
  const repos = user.repositories.nodes
    .filter((n): n is z.infer<typeof RepoNode> => n !== null)
    // Eleme dönüştürmeden ÖNCE: `isFork` ve `privacy` sorguda halledildi,
    // arşiv ve `portfolio-hidden` burada. Sonra elemek, sadece atılacak
    // repo'lar için rozet çözmek demek olurdu.
    .filter(
      (node) =>
        !node.isArchived &&
        !node.repositoryTopics.nodes.some((t) => t.topic.name === HIDDEN_TOPIC),
    )
    .map((node): Project => {
      const topics = node.repositoryTopics.nodes.map((t) => t.topic.name);

      return {
        name: node.name,
        description: node.description,
        url: node.url,
        // GitHub boş `homepageUrl`'i "" olarak döner; boş string link değildir.
        liveUrl:
          node.homepageUrl?.trim() || FEATURED_LIVE.get(node.name) || null,
        coverUrl: node.openGraphImageUrl,
        hasCustomCover: node.usesCustomOpenGraphImage,
        stars: node.stargazerCount,
        language: node.primaryLanguage,
        topics,
        tech: resolveTech(topics, node.primaryLanguage?.name),
        pushedAt: node.pushedAt,
        featured: FEATURED_ORDER.has(node.name),
        isPrivate: false,
      };
    })
    .concat(fromPrivate())
    .sort(byFeaturedThenRecent);

  return {
    profile: {
      login: user.login,
      name: user.name,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      url: user.url,
      repoCount: user.repositories.totalCount,
    },
    repos,
  };
}

/* ── Giriş noktası ───────────────────────────────────────────────────────── */

export async function getGitHub(): Promise<GitHubData> {
  // Token'ı olmayan bir geliştirici de siteyi ayağa kaldırabilmeli.
  if (!hasGitHubEnv()) return fallback();

  try {
    const env = githubEnv();

    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: PORTFOLIO_QUERY,
        variables: { login: env.GITHUB_USERNAME },
      }),
      // Saatte bir tazelenir; push webhook'u `revalidateTag` ile araya girer.
      next: { revalidate: 3600, tags: [GITHUB_TAG] },
    });

    // 401/403/429 — token bozuk, izin yetersiz veya kota doldu.
    if (!res.ok) return fallback();

    const json: unknown = await res.json();
    // GraphQL 200 döndürüp gövdede hata taşıyabilir; `data.user` yoksa parse zaten düşer.
    const parsed = UserNode.safeParse(
      (json as { data?: { user?: unknown } })?.data?.user,
    );

    if (!parsed.success) return fallback();

    const data = shape(parsed.data);
    // Filtreler her şeyi elediyse fallback daha dürüst bir sonuçtur.
    return data.repos.length > 0 ? data : fallback();
  } catch {
    // Ağ hatası, DNS, timeout — hepsi aynı yere çıkar.
    return fallback();
  }
}

/**
 * Slot dağılımı (`/projeler`, CONTENT-MODEL §3):
 * 1. → Last Project · 2. ve 3. → repo ızgarası · ilk 8 → Projects carousel'i.
 */
export function slots(repos: Project[]) {
  return {
    last: repos[0] ?? null,
    grid: repos.slice(1, 3),
    carousel: repos.slice(0, 8),
  };
}
