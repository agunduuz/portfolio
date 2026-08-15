# CLAUDE.md — Anıl Gündüz Portfolio

Claude Code'un her oturumda otomatik okuduğu proje anayasası.
Kısa tut; detaylar `docs/` altındadır.

---

## Proje

Tek kişilik developer portfolyosu. 5 ekran: Anasayfa, Hakkımda, Projeler, Yazılar, Yazı Detay.
Sahip: Anıl Gündüz — Full-stack developer, Samsun / Türkiye.
Sayfanın tek işi: 10 saniyede "bu adam işini biliyor" dedirtmek.

## Mimarinin dört kırmızı çizgisi

Bunlar projenin kimliğidir. Bir çözüm birini bozuyorsa o çözüm yanlıştır.

1. **Deck'teki dört ekranda sayfa scroll etmez.** `/`, `/hakkimda`, `/projeler`, `/blog`
   tam `100dvh` içine sığar; `body`'de dikey overflow oluşursa bug'dır. İçerik taşarsa
   kartın _içi_ scroll eder. `/blog/[slug]` bu çizginin **kapsamı dışındadır** — orada
   makale kartı zaten tasarım gereği scroll eder. Kısa ekranda deck'in kapanması da
   ihlal değil, kapsam dışına çıkmadır.
2. **Masaüstünde wheel bir sonraki ekrana geçer.** Home → About → Projects → Writings.
   Efekt değil, gerçek route değişimi.
3. **Her ekran gerçek bir URL'dir.** Tek sayfalık scroll-jack sarmalı yasak.
4. **Ray konteyneri kalıcıdır.** `SatelliteRail` `layout.tsx` seviyesinde yaşar ve route
   değişiminde unmount olmaz; taraf değiştirirken `layout` animasyonuyla kayar.
   Kartların kendisi unmount **olabilir**. Kaybı can yakan state (Job Offers form taslağı,
   carousel indeksi) `DraftProvider` içinde, layout seviyesinde tutulur.

Mobilde 1, 2 ve 4 geçerli değildir: normal scroll, normal navigasyon, kartlar alt alta.

## Tasarım kaynağı ve bağlayıcılık

Figma tasarımı bağlayıcıdır. **Bağlayıcı olan tasarım kararıdır — artboard yüksekliğinden
türeyen mutlak pikseller değil, oranlar.** Artboard 1426px yüksekliğinde çizilmiştir; bu bir
viewport ölçüsü değil, çizim alanıdır. "Nav 140px" bir karar değil, "%9.82'lik bir şerit"
kararının 1426'daki izdüşümüdür. Dikey ölçüler `dvh` + `clamp()` ile ölçeklenir
(`docs/DESIGN-SYSTEM.md` §3).

Bu istisna dışında tasarımı "iyileştirme" adına değiştirme, önce sor.

**Erişilebilirlik zemini bu kuralın üstündedir**, ama dar bir alanda: kontrast oranı,
görünür focus, klavye erişimi ve reduced-motion. Bunlar düşükse sorulmadan düzeltilir ve
token güncellenir. Bunun dışındaki her şey (örneğin "Send the Offer." butonunun gri
görünmesi) tasarım tercihidir ve **Figma kazanır** — buton gri kalır.

## Sayfa–kart matrisi

Grid **4 kolon**. Sayfalar 3 kolonluk ana bölge + 1 kolonluk ray olarak bölünür; ray taraf
değiştirir. Anasayfa istisnadır: hero 4 kolon, altında beş kart.

| Kart       | Home  | About                 | Projects                                    | Writings                              | Detail  |
| ---------- | ----- | --------------------- | ------------------------------------------- | ------------------------------------- | ------- |
| Hero       | 4 kol | ana (3)               | –                                           | –                                     | –       |
| Projects   | 1 kol | ray sağ               | –                                           | ray sağ                               | –       |
| Writings   | 1 kol | –                     | ray sol                                     | –                                     | –       |
| About Me   | 1 kol | –                     | ray sol                                     | –                                     | ray sağ |
| Job Offers | 1 kol | ray sağ               | –                                           | ray sağ                               | –       |
| Subscribe  | 2 kol | –                     | –                                           | –                                     | ray sağ |
| Ana bölge  | –     | Summary + Job History | Last Project, repo ızgarası, GitHub profili | Last Writing, yazı listesi, sayfalama | Makale  |

Ray tarafı: About → sağ · Projects → **sol** · Writings → sağ · Detail → sağ.

Uydu kartlar her yerde **1 kolon = aynı genişlik**. Anasayfada ayrı bir boyut yoktur.

## Stack (değiştirme, önce sor)

- Next.js 15 App Router + React 19 + TypeScript (`strict: true`)
- Tailwind CSS v4 (CSS-first `@theme`, config dosyası yok)
- Motion (`npm i motion`) — ray konteyner animasyonu için zorunlu
- MDX blog: `content/blog/*.mdx` + `gray-matter` + `next-mdx-remote/rsc`
- Form: Server Action + Zod + Resend
- Deploy: Vercel

## Çalışma kuralları

- **Önce plan, sonra kod.** Yeni bölüm yazmadan ilgili `docs/*.md`'yi oku, planı 5 maddede özetle.
- **Kart bir kez yazılır.** `ProjectsCard` her yerde aynı bileşendir; `size` prop'u ile
  boyutlanır (`sm` / `md` / `lg`). İkinci bir kopyası varsa mimari yanlış kurulmuştur.
- **Client sınırı sarmalayıcıdadır.** `SatelliteRail` client bileşenidir; kart _içerikleri_
  Server Component olarak `children` üzerinden geçer. Yalnızca gerçekten state tutanlar
  client kalır: `AboutMeCard` sayacı, iki carousel, iki form. Bu desen kırmızı çizgi 4 ile
  "Server Component varsayılan" kuralını uzlaştırır.
- **Token kullan, hex ve mutlak px yazma.** Bileşende `#3BE8A5` veya `h-[140px]` görürsen hata.
- **`any` yasak.** Harici veri (GitHub, frontmatter) Zod ile parse edilir.
- **Sır kodda durmaz — sohbette de durmaz.** `.env.local` içeriğini asla yapıştırma,
  dosyayı okuyup değerini ekrana yazdırma. Sızan anahtar iptal edilip yeniden üretilir.
- **İş bitmeden bitti deme.** `npx tsc --noEmit` + `npm run lint` + `npm run build` temiz geçmeli.

## Erişilebilirlik zemini (pazarlığa kapalı)

- `prefers-reduced-motion: reduce` → geçişler anında; navigasyon çalışmaya devam eder.
- Klavye: `PageDown`/`PageUp`/`ArrowDown`/`ArrowUp` ekran değiştirir; input odaktayken devre dışı.
- Görünür focus ring: `focus-visible:ring-2 ring-accent ring-offset-2 ring-offset-bg`.
- Gövde metni kontrastı ≥ 4.5:1. Düşükse token yükseltilir ve `DESIGN-SYSTEM.md` güncellenir.
- Kart içi scroll alanları klavyeyle odaklanabilir (`tabIndex={0}` + `role="region"` + `aria-label`).
- İkon-only butonlarda `aria-label`.
- `dvh` yalnızca kabuk kromunda kullanılır. Tipografi asla viewport yüksekliğine bağlanmaz.

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
    shell/             DeckShell, SatelliteRail, DeckController, Nav, Footer
    cards/             Hero, Projects, Writings, AboutMe, JobOffers, Subscribe
    modules/           LastProject, RepoGrid, GitHubProfile, LastWriting, PostList, Article
    ui/                Button, Input, Field, TechBadges, Carousel, Pagination, CoverImage
  lib/                 github.ts, mdx.ts, seo.ts, env.ts, rate-limit.ts
  hooks/               useDeckNavigation, useElapsed, useProxiedWheel
  state/               DraftProvider.tsx
  config/              site.ts, page-manifest.ts, featured-projects.ts, tech-icons.ts
  content/blog/        *.mdx
docs/
```

## Dokümanlar

| Dosya                   | İçerik                                                    |
| ----------------------- | --------------------------------------------------------- |
| `docs/PRD.md`           | Sayfa sayfa gereksinimler, kabul kriterleri               |
| `docs/DESIGN-SYSTEM.md` | Token'lar, tipografi, kart varyantları, bileşen kuralları |
| `docs/ARCHITECTURE.md`  | Kalıcı kabuk, DraftProvider, veri akışı, env, formlar     |
| `docs/INTERACTIONS.md`  | Grid haritaları, deck navigasyonu, ray animasyonu         |
| `docs/SEO.md`           | Teknik SEO, metadata, JSON-LD, sayfalama, kontrol listesi |
| `docs/CONTENT-MODEL.md` | Frontmatter, GitHub şemaları, arayüz metinleri            |
| `docs/ROADMAP.md`       | Fazlar ve görev listesi                                   |

## Komutlar

```bash
npm run dev
npm run build
npm run lint
npx tsc --noEmit
```
