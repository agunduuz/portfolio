# Mimari

## 1. Stack ve gerekçe

| Katman    | Seçim                 | Neden                                              |
| --------- | --------------------- | -------------------------------------------------- |
| Framework | Next.js 15 App Router | Route bazlı SSG/ISR, metadata API, `ImageResponse` |
| Dil       | TypeScript strict     | Harici veri var; tip güvenliği pazarlık dışı       |
| Stil      | Tailwind CSS v4       | CSS-first `@theme`, config dosyası yok             |
| Animasyon | `motion`              | Ray konteynerinin `layout` animasyonu için zorunlu |
| İçerik    | MDX (dosya tabanlı)   | Tek yazar için CMS gereksiz gecikme                |
| Mail      | Resend + React Email  | Server Action'dan tek çağrı                        |
| Doğrulama | Zod                   | Form + GitHub yanıtı + frontmatter aynı araçla     |
| Hosting   | Vercel                | ISR ve edge cache framework'le hizalı              |

**Bilinçli kullanılmayanlar:** state kütüphanesi (DraftProvider 40 satır, yeter),
UI kit, Contentlayer, GSAP, i18n.

---

## 2. Klasör yapısı

```
src/
├── app/
│   ├── layout.tsx                # KALICI KABUK: nav, ray, footer, DraftProvider
│   ├── template.tsx              # ana bölge çapraz geçişi
│   ├── page.tsx                  # Anasayfa
│   ├── hakkimda/page.tsx
│   ├── projeler/page.tsx
│   ├── blog/
│   │   ├── page.tsx              # liste + ?page=N
│   │   └── [slug]/
│   │       ├── page.tsx
│   │       └── opengraph-image.tsx
│   ├── api/revalidate/route.ts
│   ├── actions/{subscribe,job-offer}.ts
│   ├── sitemap.ts · robots.ts · rss.xml/route.ts · opengraph-image.tsx
│   ├── not-found.tsx · error.tsx
│
├── components/
│   ├── shell/
│   │   ├── DeckShell.tsx         # 100dvh, max-w-1280, 4×3 grid
│   │   ├── SatelliteRail.tsx     # "use client" — layout animasyonlu konteyner
│   │   ├── DeckController.tsx    # "use client" — wheel/klavye
│   │   ├── Nav.tsx · Footer.tsx
│   ├── cards/                    # Hero, Projects, Writings, AboutMe,
│   │                             # JobOffers, Subscribe
│   ├── modules/                  # LastProject, RepoGrid, GitHubProfile,
│   │                             # LastWriting, PostList, Article
│   └── ui/                       # Button, Input, Field, TechBadges, Carousel,
│                                 # Pagination, CoverImage, ReadingProgress
├── lib/
│   └── github.ts · mdx.ts · seo.ts · env.ts · rate-limit.ts
├── hooks/
│   └── useDeckNavigation.ts · useElapsed.ts · useProxiedWheel.ts
├── state/
│   └── DraftProvider.tsx         # "use client" — form taslağı + carousel indeksi
├── config/
│   ├── site.ts · page-manifest.ts · featured-projects.ts · tech-icons.ts · about.ts
└── content/blog/*.mdx
```

---

## 3. Kalıcı kabuk mimarisi

### 3.1 Gerekçe

`layout.tsx` route değişiminde yeniden render **edilmez**; React ağacında kalır. Bunu iki
şey için kullanıyoruz:

1. **Ray konteynerinin stabil kalması.** `SatelliteRail` route'lar arası aynı React elemanı
   olarak yaşar; `grid-area`'sı değiştiğinde Motion `layout` animasyonu onu kaydırır.
   Sayfa dosyasında olsaydı her route'ta unmount/mount olur, kayma yerine zıplama görünürdü.
2. **Manifest'in tek kaynak olması.** Hangi sayfada hangi kartın nerede olduğu tek dosyadan
   okunur; sayfa dosyaları yalnızca ana bölgeyi doldurur.

> **Bu gerekçe listesinde eskiden "kartların persist etmesi" de vardı, düştü.** Manifest
> incelemesinde ardışık sayfalarda ortak kart bulunmadığı görüldü; kartlar zaten unmount
> oluyor. Kaybı can yakan state `DraftProvider`'a taşındı (§3.4).

### 3.2 Kabuk

```tsx
// src/app/layout.tsx
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [github, posts] = await Promise.all([getGitHub(), getAllPosts()]);

  return (
    <html lang="tr" className={fonts}>
      <body>
        <DraftProvider>
          <DeckShell>
            <Nav />
            <div className="deck-grid">
              <SatelliteRail>
                {{
                  hero: <HeroCard size="sm" />,
                  projects: <ProjectsCard size="sm" repos={github.repos} />,
                  writings: <WritingsCard size="sm" posts={posts} />,
                  aboutMe: <AboutMeCard size="sm" />,
                  jobOffers: <JobOffersCard size="sm" />,
                  subscribe: <SubscribeCard size="sm" variant="detail" />,
                }}
              </SatelliteRail>
              <main id="main">{children}</main>
            </div>
            <Footer />
          </DeckShell>
        </DraftProvider>
      </body>
    </html>
  );
}
```

Kart içerikleri **Server Component** olarak `children` map'i üzerinden geçer;
`SatelliteRail` yalnızca sarmalayıcı olarak client'tır. Bu, kırmızı çizgi 4 ile
"Server Component varsayılan" kuralını uzlaştırır.

Veri layout'ta bir kez çekilir; `fetch` cache'i sayesinde ana bölge aynı veriyi
tekrar istediğinde yeni istek gitmez.

### 3.3 Sayfa manifestosu

```ts
// src/config/page-manifest.ts
export type CardId =
  "hero" | "projects" | "writings" | "aboutMe" | "jobOffers" | "subscribe";

type Slot = { id: CardId; area: string }; // "satır / kolon / satır-sonu / kolon-sonu"

export const MANIFEST: Record<
  string,
  { railSide: "left" | "right" | "none"; rail: Slot[]; mainArea: string }
> = {
  "/": {
    railSide: "none",
    rail: [
      { id: "aboutMe", area: "2 / 1 / 4 / 2" },
      { id: "projects", area: "2 / 2 / 3 / 3" },
      { id: "writings", area: "2 / 3 / 4 / 4" },
      { id: "subscribe", area: "3 / 2 / 4 / 4" },
      { id: "jobOffers", area: "2 / 4 / 4 / 5" },
    ],
    mainArea: "1 / 1 / 2 / 5", // Hero
  },
  "/hakkimda": {
    railSide: "right",
    rail: [
      { id: "projects", area: "1 / 4 / 2 / 5" },
      { id: "jobOffers", area: "2 / 4 / 4 / 5" },
    ],
    mainArea: "1 / 1 / 4 / 4",
  },
  "/projeler": {
    railSide: "left",
    rail: [
      { id: "writings", area: "1 / 1 / 2 / 2" },
      { id: "aboutMe", area: "2 / 1 / 4 / 2" },
    ],
    mainArea: "1 / 2 / 4 / 5",
  },
  "/blog": {
    railSide: "right",
    rail: [
      { id: "projects", area: "1 / 4 / 2 / 5" },
      { id: "jobOffers", area: "2 / 4 / 4 / 5" },
    ],
    mainArea: "1 / 1 / 4 / 4",
  },
  "/blog/[slug]": {
    railSide: "right",
    rail: [
      { id: "subscribe", area: "1 / 4 / 2 / 5" },
      { id: "aboutMe", area: "2 / 4 / 4 / 5" },
    ],
    mainArea: "1 / 1 / 4 / 4",
  },
};
```

Anasayfada Hero ana bölgedir (`mainArea` 1. satırın tamamı); diğer beş kart `rail`
dizisindedir. Bu, Home→About geçişinde Projects ve Job Offers'ın `layoutId` ile
taşınmasını mümkün kılar.

### 3.4 DraftProvider

Kart unmount olduğunda kaybı can yakan iki şey var. İkisi de burada yaşar, fazlası değil.

```tsx
// src/state/DraftProvider.tsx  ("use client")
type Draft = {
  jobOffer: {
    location: string;
    type: string;
    technology: string;
    amount: string;
  };
  carousel: { projects: number; writings: number };
};

const DraftCtx = createContext<{
  draft: Draft;
  setJobOffer: (patch: Partial<Draft["jobOffer"]>) => void;
  setCarousel: (key: keyof Draft["carousel"], index: number) => void;
} | null>(null);

export function DraftProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<Draft>(EMPTY);
  // ...
  return <DraftCtx.Provider value={value}>{children}</DraftCtx.Provider>;
}
```

**Kapsam kuralı:** yalnızca form taslağı ve carousel indeksi. Kart state'ini topluca
buraya taşıma — sayaç buraya girmez (mutlak tarihten türer), scroll pozisyonu girmez
(route değişince zaten sıfırlanmalı).

Form başarıyla gönderildiğinde taslak temizlenir.

`sessionStorage`'a yazma **yok**: form taslağı kişisel veridir ve sekme kapandığında
kaybolması doğru davranıştır.

---

## 4. Render stratejisi

| Route          | Strateji  | Yenileme                         |
| -------------- | --------- | -------------------------------- |
| `/`            | ISR       | 1 saat                           |
| `/hakkimda`    | ISR       | 1 saat (ray Projects kartı için) |
| `/projeler`    | ISR       | 1 saat                           |
| `/blog`        | ISR       | 1 saat                           |
| `/blog/[slug]` | SSG + ISR | `generateStaticParams` + 1 saat  |

Layout'ta GitHub verisi olduğu için hiçbir sayfa tam statik değil; hepsi ISR.
İlk byte hâlâ cache'ten gelir.

Hiçbir sayfa client-side render edilmez. Deck geçişi client'ta olur ama her route'un
HTML'i sunucudan tam gelir.

---

## 5. GitHub veri akışı

Tasarım üç ayrı veri istiyor: repo listesi, öne çıkan repo detayı, profil kartı.
Tek GraphQL sorgusuyla üçü birden gelir.

```graphql
query Portfolio($login: String!) {
  user(login: $login) {
    login
    name
    bio
    url
    avatarUrl(size: 240)
    repositories(
      first: 20
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
```

```ts
// src/lib/github.ts
export async function getGitHub(): Promise<GitHubData> {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: PORTFOLIO_QUERY,
      variables: { login: env.GITHUB_USERNAME },
    }),
    next: { revalidate: 3600, tags: ["github"] },
  });

  if (!res.ok) return FALLBACK; // asla throw etme
  const parsed = GitHubSchema.safeParse((await res.json()).data?.user);
  return parsed.success ? shape(parsed.data) : FALLBACK;
}
```

**Kurallar:**

- Token yalnızca sunucuda. `NEXT_PUBLIC_` öneki asla.
- Fine-grained token'da yalnızca `Metadata: Read` yeterli.
- 403/429 veya şema uyumsuzluğunda `FALLBACK`; kart asla boş kalmaz.
- Filtre: `isArchived`, `isFork`, `portfolio-hidden` topic'i elenir.
- Sıralama: `featured-projects.ts` manuel sırası önce, kalanlar `pushedAt` desc.

**Kapak görselleri.** `openGraphImageUrl` her repo için gelir.

```ts
// next.config.ts
images: {
  formats: ["image/avif", "image/webp"],
  remotePatterns: [
    { protocol: "https", hostname: "opengraph.githubassets.com" },
    { protocol: "https", hostname: "repository-images.githubusercontent.com" },
    { protocol: "https", hostname: "avatars.githubusercontent.com" },
  ],
}
```

**Webhook.** `app/api/revalidate/route.ts` push webhook'unu alır, `x-hub-signature-256`
imzasını `crypto.timingSafeEqual` ile doğrular, `revalidateTag("github")` çağırır.
İmza doğrulanmadan hiçbir şey yapılmaz.

---

## 6. Blog akışı

`content/blog/*.mdx` → `gray-matter` → Zod → `next-mdx-remote/rsc`.
Eklentiler: `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`, `rehype-pretty-code`.
Okuma süresi `reading-time` ile hesaplanır, frontmatter'a yazılmaz.

**Sayfalama** — `/blog?page=N`:

```tsx
export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const current = Math.max(1, Number(page) || 1);
  const posts = await getAllPosts();
  const perPage = 3;

  const [featured, ...rest] = posts;
  const source = current === 1 ? rest : posts;      // bkz. karar notu
  const slice = source.slice((current - 1) * perPage, current * perPage);
  if (current > 1 && slice.length === 0) notFound();
  ...
}
```

**Karar:** "Last Writing" kartı yalnızca 1. sayfada öne çıkan yazıyı gösterir; 2. sayfadan
itibaren o slot listenin devamına dönüşür. Aynı yazıyı her sayfada tekrar göstermek hem yer
israfı hem içerik tekrarıdır.

Sınır dışı sayfa → `notFound()`. Boş liste 200 dönmemeli.

---

## 7. Formlar

Server Action, API route değil — JS kapalıyken de çalışsın.

```ts
// src/app/actions/job-offer.ts
"use server";

export async function sendJobOffer(
  prev: State,
  formData: FormData,
): Promise<State> {
  if (formData.get("company_website")) return { ok: true }; // honeypot
  if (Date.now() - Number(formData.get("ts")) < 2000) return { ok: true };

  if (await isRateLimited())
    return { ok: false, error: "Çok fazla deneme. Bir saat sonra dene." };

  const parsed = JobOfferSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };

  await resend.emails.send({/* ... */});
  return { ok: true };
}
```

İstemcide `useActionState` + `useFormStatus`. Pending'de buton `disabled` ve "Sending…".

**Taslak entegrasyonu:** input'lar `DraftProvider`'dan controlled değer alır; her
değişiklik `setJobOffer` ile yazılır. Başarılı gönderimde taslak temizlenir.

`redirect()` çağırma — form gönderimi sayfa değişimi tetiklememeli.

Rate limit: Upstash Redis. Bellek içi `Map` üretimde çalışmaz (Vercel'de her lambda ayrı bellek).

---

## 8. Ortam değişkenleri

```bash
# .env.local — asla commit edilmez, asla sohbete yapıştırılmaz
GITHUB_TOKEN=
GITHUB_USERNAME=anilgunduz
GITHUB_WEBHOOK_SECRET=
RESEND_API_KEY=
CONTACT_EMAIL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

NEXT_PUBLIC_SITE_URL=https://anilgunduz.dev
NEXT_PUBLIC_CAREER_START=2021-09-01T00:00:00Z
```

`src/lib/env.ts` bunları Zod ile parse eder ve **build sırasında** doğrular.
Eksik değişkenle build patlamalı. `.env.example` commit edilir.

**Sızıntı prosedürü:** bir anahtar sohbete, log'a veya commit'e girerse iptal edilip
yeniden üretilir. `GITHUB_WEBHOOK_SECRET` değişirse GitHub webhook ayarında da güncellenir
— iki yerde birden değişmezse webhook sessizce 401 döner.

---

## 9. Kalite kapıları

```bash
npx tsc --noEmit
npm run lint
npm run build
npx @lhci/cli autorun
```

GitHub Actions'ta PR başına. Kırmızıysa merge yok.
