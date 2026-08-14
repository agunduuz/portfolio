# CLAUDE.md — Anıl Gündüz Portfolio

Claude Code'un her oturumda otomatik okuduğu proje anayasası.
Kısa tut; detaylar `docs/` altındadır.

---

## Proje

Tek kişilik developer portfolyosu. 5 ekran: Anasayfa, Hakkımda, Projeler, Yazılar, Yazı Detay.
Figma tasarımı mevcut ve **bağlayıcıdır** — "iyileştirme" adına değiştirme, önce sor.

Sahip: Anıl Gündüz — Full-stack developer, Samsun / Türkiye.
Sayfanın tek işi: 10 saniyede "bu adam işini biliyor" dedirtmek.

## Mimarinin dört kırmızı çizgisi

Bunlar projenin kimliğidir. Bir çözüm birini bozuyorsa o çözüm yanlıştır.

1. **Masaüstünde sayfa scroll etmez.** Her ekran tam `100dvh`. `body`'de dikey overflow
   oluşursa bug'dır. İçerik taşarsa kartın _içi_ scroll eder, sayfa değil.
2. **Masaüstünde wheel bir sonraki ekrana geçer.** Home → About → Projects → Writings.
   Bu bir efekt değil, gerçek route değişimidir.
3. **Her ekran gerçek bir URL'dir.** Tek sayfalık scroll-jack sarmalı yasak.
   `/`, `/hakkimda`, `/projeler`, `/blog`, `/blog/[slug]`.
4. **Uydu kartlar kalıcıdır.** Projects, Writings, About Me, Job Offers, Subscribe kartları
   sayfalar arasında unmount olmaz — konum ve boyut değiştirerek _taşınır_. Sitenin imzası budur.
   Bu kartlar her sayfada baştan render edilirse tasarımın anlamı kaybolur.

Mobilde 1, 2 ve 4 geçerli değildir: normal scroll, normal navigasyon, kartlar alt alta.

## Sayfa–kart matrisi

Her sayfa 12 kolonluk grid'i **9 kolonluk ana bölge** + **3 kolonluk uydu rayı** olarak böler.
Ray taraf değiştirir. Anasayfa istisnadır: hero 12 kolon, altında dört kart.

| Kart              | Home   | About                 | Projects                                    | Writings                              | Detail  |
| ----------------- | ------ | --------------------- | ------------------------------------------- | ------------------------------------- | ------- |
| Hero              | 12 kol | ana (9)               | –                                           | –                                     | –       |
| Projects          | 3 kol  | ray sağ               | –                                           | ray sağ                               | –       |
| Writings          | 3 kol  | –                     | ray sol                                     | –                                     | –       |
| About Me (sayaç)  | 3 kol  | –                     | ray sol                                     | –                                     | ray sağ |
| Job Offers        | 3 kol  | ray sağ               | –                                           | ray sağ                               | –       |
| Subscribe         | 6 kol  | –                     | –                                           | –                                     | ray sağ |
| Ana bölge içeriği | –      | Summary + Job History | Last Project, repo ızgarası, GitHub profili | Last Writing, yazı listesi, sayfalama | Makale  |

Ray tarafı: About → sağ · Projects → **sol** · Writings → sağ · Detail → sağ.

## Stack (değiştirme, önce sor)

- Next.js 15 App Router + React 19 + TypeScript (`strict: true`)
- Tailwind CSS v4 (CSS-first `@theme`, config dosyası yok)
- Motion (`npm i motion`) — `layout` animasyonu uydu kartların taşınması için **zorunlu**
- MDX blog: `content/blog/*.mdx` + `gray-matter` + `next-mdx-remote/rsc`
- Form: Server Action + Zod + Resend
- Deploy: Vercel

## Çalışma kuralları

- **Önce plan, sonra kod.** Yeni bölüm yazmadan ilgili `docs/*.md`'yi oku ve planı 5 maddede özetle.
- **Kart bir kez yazılır.** `ProjectsCard` beş sayfada aynı bileşendir; `size` prop'u ile boyutlanır.
  İkinci bir kopyasını oluşturursan bu bir hatadır.
- **Uydu kartlar `layout.tsx` seviyesinde yaşar**, sayfa dosyalarında değil. Sayfa yalnızca
  ana bölgeyi ve hangi kartların görüneceğini bildirir (`docs/ARCHITECTURE.md` §3).
- **Token kullan, hex yazma.** Bileşende `#3BE8A5` görürsen hata → `text-accent`.
- **Server Component varsayılan.** `"use client"` en yaprak bileşende.
- **`any` yasak.** Harici veri (GitHub, frontmatter) Zod ile parse edilir.
- **Sır kodda durmaz.** `.env.local` + `src/lib/env.ts`.
- **İş bitmeden bitti deme.** `npx tsc --noEmit` + `npm run lint` + `npm run build` temiz geçmeli.

## Erişilebilirlik zemini (pazarlığa kapalı)

- `prefers-reduced-motion: reduce` → geçişler anında; navigasyon çalışmaya devam eder.
- Klavye: `PageDown`/`PageUp`/`ArrowDown`/`ArrowUp` ekran değiştirir; input odaktayken devre dışı.
- Görünür focus ring: `focus-visible:ring-2 ring-accent ring-offset-2 ring-offset-bg`.
- Gövde metni kontrastı ≥ 4.5:1. Tasarımdaki gri tonları test et, düşükse token'ı yükselt.
- Kart içi scroll alanları klavyeyle odaklanabilir (`tabIndex={0}` + `role="region"` + `aria-label`).
- İkon-only butonlarda `aria-label`.

## Performans bütçesi

| Metrik                  | Hedef         |
| ----------------------- | ------------- |
| LCP                     | < 1.5 s       |
| INP                     | < 200 ms      |
| CLS                     | < 0.02        |
| Route başına ilk JS     | < 120 KB gzip |
| Lighthouse (4 kategori) | ≥ 95          |

Bütçeyi aşan bağımlılık eklenmez. Tek istisna Motion'dır.

## Dosya haritası

```
src/
  app/                 route'lar, layout (kalıcı kabuk), metadata, sitemap, rss
  components/
    shell/             DeckShell, SatelliteRail, Nav, Footer, DeckController
    cards/             Projects, Writings, AboutMe, JobOffers, Subscribe, Hero
    modules/           LastProject, RepoGrid, GitHubProfile, PostList, Article, Summary
    ui/                Button, Input, Field, Badge, TechBadges, Carousel, Pagination
  lib/                 github.ts, mdx.ts, seo.ts, env.ts, rate-limit.ts
  hooks/               useDeckNavigation, useElapsed, useProxiedWheel
  config/              site.ts, page-manifest.ts, featured-projects.ts, tech-icons.ts
  content/blog/        *.mdx
docs/
```

## Dokümanlar

| Dosya                   | İçerik                                                     |
| ----------------------- | ---------------------------------------------------------- |
| `docs/PRD.md`           | Sayfa sayfa gereksinimler, kabul kriterleri                |
| `docs/DESIGN-SYSTEM.md` | Renk, tipografi, kart varyantları, bileşen kuralları       |
| `docs/ARCHITECTURE.md`  | Kalıcı kabuk mimarisi, veri akışı, env, formlar            |
| `docs/INTERACTIONS.md`  | Grid haritaları, deck navigasyonu, kart taşıma animasyonu  |
| `docs/SEO.md`           | Teknik SEO, metadata, JSON-LD, sayfalama, kontrol listesi  |
| `docs/CONTENT-MODEL.md` | Frontmatter, GitHub şemaları, kart manifestosu, metin tonu |
| `docs/ROADMAP.md`       | Fazlar ve görev listesi                                    |

## Komutlar

```bash
npm run dev
npm run build
npm run lint
npx tsc --noEmit
```
