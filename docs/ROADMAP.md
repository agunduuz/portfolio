# Yol Haritası

Her faz tek bir Claude Code oturumuna sığacak büyüklükte. Faz bitmeden sonrakine geçme;
`npm run build` temiz değilse faz bitmemiştir.

**Sıralama mantığı:** kalıcı kabuk ve kart sistemi önce kurulur. Sayfalar bu sistemin üstüne
gelir. Ters sırada yaparsan (önce sayfalar, sonra kabuk) her sayfayı yeniden yazmak zorunda kalırsın.

---

## Faz 0 — Zemin (1 oturum)

- [ ] `create-next-app` iskeleti, TypeScript strict
- [ ] Tailwind v4 `@theme` bloğuna `DESIGN-SYSTEM.md` tokenları
- [ ] Fontlar `public/fonts/`, `next/font/local` ile bağlandı
- [ ] **Türkçe glif testi**: `ı İ ğ Ğ ş Ş ç Ç ö Ö ü Ü` görsel kontrol
- [ ] `config/site.ts` gerçek verilerle dolduruldu
- [ ] `lib/env.ts` Zod doğrulaması + `.env.example`
- [ ] `next.config.ts` → `images.remotePatterns` (GitHub domainleri)
- [ ] ESLint + Prettier + `.gitignore`
- [ ] Git init, ilk commit

**Bitiş:** boş sayfa doğru font ve renklerle açılıyor, `tsc --noEmit` temiz.

## Faz 1 — Kalıcı kabuk (1–2 oturum)

Projenin en kritik fazı. Burada acele etme.

- [ ] `DeckShell` — `100dvh`, `overflow-hidden`, 12×3 grid
- [ ] `Nav` (aktif link durumu) + `Footer`
- [ ] `config/page-manifest.ts` — beş sayfanın kart/alan haritası
- [ ] `SatelliteRail` — `AnimatePresence` + sabit `key` + `layout` prop
- [ ] Kart iskeletleri (içerik boş, sadece kutu + başlık) — 6 kart
- [ ] `size` varyant sistemi (`sm` / `md` / `lg`)
- [ ] Dört route iskeleti + `template.tsx` ana bölge geçişi
- [ ] `useDeckNavigation` — eşik, kilit, momentum sönümü, rubber-band
- [ ] Klavye navigasyonu + `data-scrollable` istisnası
- [ ] `prefers-reduced-motion` dalı
- [ ] Nav nokta göstergesi + `aria-current`

**Bitiş:** `INTERACTIONS.md` §9 "Deck" ve "Kart taşınması" listelerindeki maddeler geçiyor.
Kartlar boş kutu olsa bile ray sağdan sola geçmeli ve kartlar taşınmalı.

## Faz 2 — Kart içerikleri (2 oturum)

- [ ] `HeroCard` — avatar, başlık, tanıtım, 7 sosyal ikon (`lg` ve `md` varyant)
- [ ] `AboutMeCard` — hidrasyon güvenli sayaç, `tabular-nums`, `visibilitychange`
- [ ] `ProjectsCard` — carousel, statik veriyle
- [ ] `WritingsCard` — carousel, statik veriyle
- [ ] `SubscribeCard` — form UI, iki alt metin varyantı
- [ ] `JobOffersCard` — 4 alanlı form UI
- [ ] `TechBadges` bileşeni + `config/tech-icons.ts`

**Bitiş:** anasayfa tasarıma uygun, 1440×900'de scroll yok, sayfa değişiminde carousel
indeksi ve sayaç korunuyor.

## Faz 3 — GitHub verisi (1 oturum)

- [ ] `lib/github.ts` — tek GraphQL sorgusu (profil + repo'lar), Zod parse
- [ ] `revalidate: 3600` + `tags: ["github"]`
- [ ] Fallback, filtreleme, sıralama, slot dağılımı
- [ ] `layout.tsx`'te `Promise.all` ile veri çekimi, ray + ana bölgeye dağıtım
- [ ] `api/revalidate/route.ts` — `timingSafeEqual` imza doğrulaması
- [ ] Kapak görselleri `next/image` ile, `sizes` doğru

**Bitiş:** token'ı boz, dev sunucusunu yeniden başlat — site hâlâ render ediyor.

## Faz 4 — Hakkımda ve Projeler (1–2 oturum)

- [ ] `/hakkimda` — Hero (`lg`, 9 kolon) + Summary/Job History kartı
- [ ] `config/about.ts` gerçek biyografi ve iş geçmişi
- [ ] `/projeler` — ray **sola** geçiyor
- [ ] `LastProject` modülü — kare kapak, açıklama, Go to Live, rozetler, Repository ›
- [ ] `RepoGrid` — 2'li alt grid, geniş kapaklar
- [ ] `GitHubProfile` — avatar, kullanıcı adı, repo sayısı, bio, Go to Profile

**Bitiş:** `/hakkimda` → `/projeler` geçişinde ray ekranın bir yanından diğerine kayıyor.

## Faz 5 — Blog (2 oturum)

- [ ] `lib/mdx.ts` — frontmatter Zod şeması, `getAllPosts`, `getPost`
- [ ] 3 örnek MDX yazısı (gerçek içerik, lorem yok)
- [ ] `/blog` — `LastWriting` + `PostList` (3 kart) + `Pagination`
- [ ] Sayfalama `?page=N`, sınır dışı → `notFound()`
- [ ] `/blog/[slug]` — makale kartı, `data-scrollable`
- [ ] `useProxiedWheel` — sayfa geneli wheel makaleye yönleniyor
- [ ] `ReadingProgress` — kart scroll'una bağlı
- [ ] `Esc` ile `/blog`'a dönüş, deck kapalı
- [ ] İçindekiler, kod blokları + kopyala, prev/next
- [ ] `?reader=1` tam ekran okuma modu (>2000 kelime)
- [ ] `not-found.tsx` + `error.tsx`

## Faz 6 — Formlar (1 oturum)

- [ ] `actions/subscribe.ts` + `actions/job-offer.ts`
- [ ] Zod şemaları, alan bazlı hata mesajları
- [ ] Honeypot + zaman eşiği + Upstash rate limit
- [ ] Resend + React Email şablonu
- [ ] `useActionState` / `useFormStatus` — pending/success/error
- [ ] JS kapalı testi
- [ ] Form dolu durumdayken sayfa değişimi testi (metin kaybolmamalı)

## Faz 7 — SEO ve performans (1 oturum)

- [ ] Route başına `generateMetadata`, sayfalama başlıkları dahil
- [ ] Semantik iskelet: `<main>` / `<aside>` ayrımı, tek `<h1>`, kart başlıkları `<h3>`
- [ ] `sitemap.ts`, `robots.ts`, `rss.xml`
- [ ] JSON-LD: `Person`, `WebSite`, `ItemList`, `BlogPosting`, `BreadcrumbList`
- [ ] `opengraph-image.tsx` — ana sayfa + yazı başına dinamik
- [ ] Bundle analizi; `SatelliteRail` client ağacı küçültüldü
- [ ] Geçiş sırasında uzun görev (>50ms) yok — Performance kaydı ile doğrula
- [ ] Lighthouse ≥ 95 (4 kategori)
- [ ] `SEO.md` kontrol listesi tamamlandı

## Faz 8 — Erişilebilirlik ve cila (1 oturum)

- [ ] Klavyeyle tam gezinti testi (deck, carousel, kart içi scroll, sayfalama)
- [ ] Kontrast denetimi — `text-2`/`text-3` kullanımları
- [ ] Ekran okuyucu testi (VoiceOver): sayfa değişimi duyurusu, sayaç sessiz
- [ ] `axe` DevTools sıfır kritik hata
- [ ] Reduced motion testi
- [ ] `grep -ri "lorem" src content` → boş
- [ ] Chanel kuralı: her ekrandan bir fazlalık çıkarıldı
- [ ] Mobil düzen: kart sırası ana bölge → uydu

## Faz 9 — Yayın

- [ ] Vercel'e bağlandı, env değişkenleri girildi
- [ ] Alan adı + HTTPS + `www` yönlendirmesi
- [ ] GitHub webhook üretime yönlendirildi
- [ ] Search Console + Bing Webmaster + sitemap gönderimi
- [ ] Vercel Speed Insights açık
- [ ] Lighthouse CI GitHub Actions'ta

---

## v2 fikirleri

TR/EN çoklu dil · komut paleti (⌘K) · projelerde dil filtresi · yazı görüntülenme sayacı ·
`/uses` sayfası · OG görselinde canlı GitHub istatistikleri.

Site yayında olmadan v2 tartışması yapılmaz.
