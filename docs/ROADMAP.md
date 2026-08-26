# Yol Haritası

Her faz tek bir Claude Code oturumuna sığacak büyüklükte. Faz bitmeden sonrakine geçme;
`npm run build` temiz değilse faz bitmemiştir.

**Sıralama mantığı:** kabuk ve ray sistemi önce kurulur. Sayfalar bunun üstüne gelir.
Ters sırada yaparsan her sayfayı yeniden yazmak zorunda kalırsın.

---

## Faz -1 — Güvenlik (hemen)

Bu faz, `.env.local` içeriği herhangi bir yere (sohbet, log, commit, ekran görüntüsü)
sızmışsa zorunludur.

- [ ] GitHub PAT iptal, yenisi üretildi (fine-grained, yalnızca `Metadata: Read`)
- [ ] Resend API anahtarı silindi, yenisi üretildi
- [ ] Upstash REST token rotate edildi
- [ ] `GITHUB_WEBHOOK_SECRET` yenilendi **ve GitHub webhook ayarında da güncellendi**
      (iki yerde birden değişmezse webhook sessizce 401 döner)

## Faz 0 — Zemin (1 oturum)

- [x] `create-next-app` iskeleti, TypeScript strict
- [x] Tailwind v4 `@theme` bloğuna `DESIGN-SYSTEM.md` tokenları
      (renk + yatay ölçü + `dvh` clamp'leri)
- [x] Fontlar `public/fonts/`, `next/font/local` ile bağlandı
- [x] **Türkçe glif testi**: `ı İ ğ Ğ ş Ş ç Ç ö Ö ü Ü` görsel kontrol
- [x] **Figma ölçü doğrulaması**: `--shell-max`, `--pad-shell`, `--gap-col` değerleri
      Figma'dan teyit edildi; kolon genişliği türetiliyor mu kontrol edildi
- [x] `config/site.ts` gerçek verilerle dolduruldu
- [x] `lib/env.ts` Zod doğrulaması + `.env.example`
- [x] `next.config.ts` → `images.remotePatterns` (3 GitHub domaini)
- [x] ESLint + Prettier + `.gitignore`
- [x] Git init, ilk commit

**Bitiş:** boş sayfa doğru font ve renklerle açılıyor, `tsc --noEmit` temiz.

## Faz 1 — Kabuk ve ray (1–2 oturum)

Projenin en kritik fazı. Acele etme.

- [x] `DeckShell` — `100dvh`, `max-w-[--shell-max] mx-auto`, 4×3 grid,
      nav/footer yükseklikleri `dvh` token'ından
- [x] `Nav` (aktif link) + `Footer`
- [x] `config/page-manifest.ts` — beş sayfanın kart/alan haritası (4 kolon notasyonu)
- [x] `state/DraftProvider.tsx` — form taslağı + carousel indeksi
- [x] `SatelliteRail` — konteyner `layout` animasyonu, `AnimatePresence`, sabit `key`,
      `layoutId`, kart içeriği `layout="position"` ile sarılmış
- [x] Kart iskeletleri (içerik boş, sadece kutu + başlık) — 6 kart
- [x] `size` varyant sistemi (`sm` / `md` / `lg`)
- [x] Dört route iskeleti + `template.tsx` ana bölge geçişi
- [x] `useDeckNavigation` — eşik, kilit, momentum sönümü, rubber-band, 800px eşiği
- [x] Klavye navigasyonu + `data-scrollable` istisnası
- [x] `prefers-reduced-motion` dalı
- [x] Ray tarafında nokta göstergesi + `aria-current`

**Bitiş:** kartlar boş kutu olsa bile **ray sağdan sola kayarak taraf değiştiriyor,
zıplamıyor**. `INTERACTIONS.md` §9 "Deck", "Ray ve kartlar", "Dikey sığma" listeleri geçiyor.

## Faz 2 — Kart içerikleri (2 oturum)

- [x] `HeroCard` — avatar, başlık, tanıtım, 7 sosyal ikon (`lg`; rayda hiç
      görünmediği için `sm` varyantı yok)
- [x] `AboutMeCard` — hidrasyon güvenli sayaç, `tabular-nums`, `visibilitychange`
- [x] `ProjectsCard` — carousel, indeks `DraftProvider`'dan
- [x] `WritingsCard` — carousel, indeks `DraftProvider`'dan
- [x] `SubscribeCard` — form UI, iki alt metin varyantı (`home` / `detail`)
- [x] `JobOffersCard` — 4 alanlı form UI, değerler `DraftProvider`'dan controlled
- [x] `TechBadges` + `config/tech-icons.ts` (+ `config/brand-icons.ts`, 15 glif)
- [x] Kart içerikleri Server Component olarak `children` üzerinden geçiyor
      (client kalanlar: `TimeSpent`, `Carousel`, `JobOfferForm`, `SubscribeForm`)

**Bitiş:** anasayfa tasarıma uygun, dört çözünürlükte scroll yok, sayfa değişiminde
carousel indeksi ve form taslağı korunuyor.

**Faz 2 notları (Faz 3 bunları devralır):**

- Kart verisi **bilinçli olarak bağlanmadı**: Projects GitHub'ı (Faz 3), Writings
  MDX'i (Faz 5) bekliyor. İkisi de boş durum metniyle render ediyor ve `projects` /
  `writings` prop'unu alacak şekilde hazır.
- Yol boyunca çıkan üç ölçüm düzeltmesi dokümanlara işlendi: input renkleri
  (DESIGN-SYSTEM §6), kabuk dış payı `--pad-shell-y` (§3.2), Writings satır
  aralığı (PRD §4 — Subscribe ile çakışıyordu).
- **Açık karar:** Figma'daki accent #05ffb4, token'daki #3be8a5. Faz 0'da
  sabitlenmiş; değiştirilmedi, sahibi karar verecek.

## Faz 3 — GitHub verisi (1 oturum)

- [x] `lib/github.ts` — tek GraphQL sorgusu (profil + repo'lar), Zod parse
- [x] `revalidate: 3600` + `tags: ["github"]`
- [x] Fallback, filtreleme, sıralama, slot dağılımı
- [x] `layout.tsx`'te veri, ray + ana bölgeye dağıtım
      (tek kaynak olduğu için `Promise.all` gerekmedi; Faz 5'te MDX eklenince gelir)
- [x] `api/revalidate/route.ts` — `timingSafeEqual` imza doğrulaması
- [x] Kapak görselleri `next/image`, `sizes` doğru (Faz 4'te tüketicileriyle
      birlikte tamamlandı)

**Bitiş:** token'ı boz, dev sunucusunu yeniden başlat — site hâlâ render ediyor.
✅ Doğrulandı: `.env.local`'de GitHub anahtarı hiç yokken site fallback ile render
ediyor, Projects kartı `featured-projects.ts` verisini gösteriyor.

**Private projeler (Faz 3 eki).** `config/private-projects.ts` — elle küratörlük,
opt-in. GitHub API'sinden private repo ÇEKİLMİYOR; sebebi opt-out modelin private
veri için yanlış varsayılan olması (bir `portfolio-hidden` unutulursa yayına çıkar).
API zaten işe yaramazdı: private repo'nun kapak görseli jenerik placeholder olarak
gelir ve repo linki ziyaretçide 404 verir (ikisi de ölçüldü). Kartta "Private"
etiketi çıkar, `url` null olduğu için "Repository ›" render edilmez. Public
projelerle aynı listede sıralanır.

**Faz 3 notu — `env.server.ts` faz faz bölündü.** Önceki hâli yedi sırrı tek şemada
doğruluyordu; bu, GitHub verisini çekmek için Resend ve Upstash anahtarı istemek
demekti. Artık `githubEnv()` ve `mailEnv()` ayrı; bir grubu okuyan modül yalnızca
kendi grubunu doğruluyor. `hasGitHubEnv()` token yokluğunu sessiz fallback'e çeviriyor.

## Faz 4 — Hakkımda ve Projeler (1–2 oturum)

- [x] `/hakkimda` — Hero (`lg`) + Summary/Job History kartı (`AboutBody`)
- [ ] `config/about.ts` gerçek biyografi ve iş geçmişi
      — **SAHİBİNİ BEKLİYOR.** Yapı ve boş durum hazır; uydurma biyografi
      yazılmadı çünkü uydurma iş geçmişi lorem ipsum'dan beterdir.
- [x] `/projeler` — ray **sola** geçiyor
- [x] `LastProject` — kare kapak, açıklama, Go to Live, rozetler, Repository ›
- [x] `RepoGrid` — 2'li alt grid, geniş kapaklar, sağ altta Repository ›
- [x] `GitHubProfile` — avatar, kullanıcı adı, repo sayısı, bio, Go to Profile

**Bitiş:** `/hakkimda` → `/projeler` geçişinde ray ekranın bir yanından diğerine kayıyor.

**Faz 4'te çıkan iki gerçek hata (ikisi de üretim build'inde doğrulandı):**

1. **Ana bölge dört ekranda da GÖRÜNMEZDİ.** `template.tsx` Motion'ın
   `initial/animate`'ini kullanıyordu; Faz 3'te sayfalar `async` olunca Next
   onları Suspense'e sardı ve akış sırasında giriş animasyonu iptal edilip bir
   daha çalışmadı — eleman `opacity: 0`'da kaldı. Geçiş CSS'e taşındı
   (`.deck-main-enter`, globals.css). Yan fayda: `template.tsx` artık Server
   Component.
2. **Çıplak `fr` satırları taşırıyordu.** `1fr` aslında `minmax(auto,1fr)`;
   otomatik alt sınır satırın içerikten küçülmesini engelliyor. `/projeler`
   626px'lik ana bölgeye 1071px içerik sokuyordu. Satırlar `minmax(0,…)` oldu
   ve kapaklar yüksekliği GENİŞLİKTEN türetmeyi bıraktı (`CoverImage` `fill`
   modu) — `aspect-[16/7]` kısa ekranda küçülemediği için kart taşıyordu.

## Faz 5 — Blog (2 oturum)

- [x] `lib/mdx.ts` — frontmatter Zod şeması, `getAllPosts`, `getPost`
- [ ] 3 örnek MDX yazısı (gerçek içerik, lorem yok)
      — **2 yazı var, SAHİBİ GÖZDEN GEÇİRMELİ.** İkisi de bu projede gerçekten
      ölçülmüş bulgular üzerine yazıldı (`minmax(0,1fr)` taşması, Suspense
      içinde ölen Motion animasyonu). İçerik doğru ama **künye Anıl'ın**;
      yayından önce kendi sesiyle yeniden yazılmalı ya da silinmeli.
- [x] `/blog` — `LastWriting` + `PostList` (3 kart) + `Pagination`
- [x] Sayfalama `?page=N`, sınır dışı → `notFound()`
      (bozuk girdi `?page=abc` 1. sayfaya düşer, 404 vermez — yalnızca
      sınır dışı SAYI 404'tür)
- [x] `/blog/[slug]` — makale kartı, `data-scrollable`
- [x] `useProxiedWheel` — sayfa geneli wheel makaleye yönleniyor
- [x] Okuma ilerleme çubuğu — kart scroll'una bağlı (`ArticleShell`)
- [x] `Esc` ile `/blog`'a dönüş, deck kapalı
- [x] İçindekiler, kod blokları + kopyala, prev/next
- [x] `?reader=1` tam ekran okuma modu (>2000 kelime)
      — CSS ile (`:has([data-reader])`), JS ile değil: `useSearchParams()`
      kalıcı kabuğu Suspense'e sarmayı ve TÜM sayfaların statik olmaktan
      çıkmasını gerektiriyordu. Bir görünüm anahtarının bedeli bu olamaz.
- [x] `not-found.tsx` + `error.tsx` (kök seviyede, deck kabuğunun dışında —
      bulunamayan bir sayfada altı uydu kart göstermek gürültü olurdu)

**Faz 5 doğrulaması:** makale 200, olmayan slug 404, `Esc` → `/blog`, wheel
sayfanın boşluğundan makaleye yönleniyor, ilerleme çubuğu kart scroll'unu
izliyor, kod blokları vurgulu ve kopyalanabilir.

## Faz 6 — Formlar (1 oturum)

- [x] `actions/subscribe.ts` + `actions/job-offer.ts`
- [x] Zod şemaları, alan bazlı hata mesajları
- [x] Honeypot + zaman eşiği + Upstash rate limit (`lib/rate-limit.ts`)
- [x] Resend — **düz metin, React Email DEĞİL.** Sapma bilinçli: React Email
      yeni bir bağımlılık demek ve performans bütçesi Motion dışında ekleme
      yasaklıyor. Bu e-posta yalnızca site sahibine gidiyor; düz metin hem
      yeterli hem istemci uyumluluk derdi yok.
- [x] `useActionState` / `useFormStatus` — pending/success/error
- [x] Başarılı gönderimde `DraftProvider` taslağı temizleniyor
- [x] JS kapalı testi — `<form method="POST">` sunucudan geliyor (Next
      progressive enhancement), zaman damgası boşken form bot sayılmıyor
- [x] Form dolu durumdayken sayfa değişimi testi (Faz 2'de ölçüldü)

**Faz 6 notu — anahtarsız davranış.** Resend/Upstash tanımlı değilse:
`isRateLimited` sessizce `false` döner (sınırlama kapalı, form çalışır) ama
`sendMail` KULLANICIYA SÖYLER: "E-posta servisi henüz bağlı değil." Sessizce
"gönderildi" demek yalan olurdu — kullanıcı cevap bekler, gelmez.

## Faz 7 — SEO ve performans (1 oturum)

- [x] Route başına `generateMetadata`, sayfalama başlıkları dahil
      (`/blog?page=2` → "Yazılar — Sayfa 2", kendini işaret eden canonical)
- [x] Semantik iskelet: `<main>` / `<aside>`, tek `<h1>`, kart başlıkları `<h3>`
      — beş route'ta da ölçüldü: h1=1, main=1, aside=1
- [x] `sitemap.ts`, `robots.ts`, `rss.xml` (üçü de 200, doğru content-type)
- [x] JSON-LD: `Person`, `WebSite`, `ItemList`, `Blog`, `BlogPosting`,
      `BreadcrumbList` — tek `@graph`, `</script>` enjeksiyonuna kapalı
- [x] `opengraph-image.tsx` — ana sayfa + yazı başına dinamik
- [x] Bundle analizi — **bütçe aşılıyor ve aşılmaya devam edecek**, bkz. SEO §7
      ölçüm tutanağı. Çerçeve tabanı tek başına 246 KB; hedef 120 KB.
      `LazyMotion` denendi, işe yaramadı (297 KB'a çıktı), geri alındı.
- [ ] Geçiş sırasında uzun görev (>50ms) yok — Performance kaydı ile doğrula
      — **elle yapılmalı**, DevTools kaydı gerektiriyor
- [ ] Lighthouse ≥ 95 (4 kategori) — **elle yapılmalı**, yayın URL'inde
- [ ] `SEO.md` kontrol listesi tamamlandı — yayın anındaki maddeler (HTTPS,
      www yönlendirmesi, Rich Results Test) Faz 9'a bağlı

## Faz 8 — Erişilebilirlik ve cila (1 oturum)

- [x] Klavyeyle tam gezinti — **`#main`'e atlama linki eklendi** (yoktu);
      deck Page/Arrow, carousel Sol/Sağ, kart içi scroll `tabIndex={0}`,
      sayfalama gerçek `<Link>`
- [x] Kontrast denetimi — hepsi WCAG formülüyle hesaplandı, tablo
      DESIGN-SYSTEM §1'de. Gövde metni her zeminde geçiyor. **Buton metni
      2.54:1 ile AA'yı geçmiyor**; tasarım kararı olduğu için değiştirilmedi
      ama dokümandaki "bu erişilebilirlik sorunu değil" iddiası düzeltildi.
- [ ] Ekran okuyucu testi (VoiceOver) — **elle yapılmalı**
- [ ] `axe` DevTools sıfır kritik hata — **elle yapılmalı**
- [x] Reduced motion — JS tarafı `useReducedMotion`, CSS tarafı için global
      `prefers-reduced-motion` bloğu eklendi (hover `translateY`'leri dahil)
- [x] `grep -ri "lorem" src` → yalnızca "lorem yasak" diyen yorumlar
- [x] Mobil düzen: kart sırası ana bölge → uydu. **Eksikti**: medya sorgusu
      yalnızca satırları `auto` yapıyordu, `grid-cols-4` ve inline `grid-area`
      duruyordu — 420px'de dört 290px kolon, yani yatay taşma. Artık tek kolon
      ve `<main>` `order: -1` ile önde.
- [x] Chanel kuralı: uydu Projects kartında repo linki yok (yalnızca "Go to
      Live" + rozet), liste kartlarında "Go to Detail" metin — kartın tamamı
      zaten link, ikinci bir `<a>` hem fazlalık hem geçersiz HTML olurdu

## Faz 9 — Yayın

- [ ] Vercel'e bağlandı, env değişkenleri girildi
- [ ] Alan adı + HTTPS + `www` yönlendirmesi
- [ ] GitHub webhook üretime yönlendirildi
- [ ] Search Console + Bing Webmaster + sitemap gönderimi
- [ ] Vercel Speed Insights açık
- [ ] Lighthouse CI GitHub Actions'ta
- [ ] Faz Kontrol paneli kaldırıldı (`rm -rf src/app/faz-kontrol`)

---

## v2 fikirleri

TR/EN çoklu dil · komut paleti (⌘K) · projelerde dil filtresi · yazı görüntülenme sayacı ·
`/uses` sayfası · OG görselinde canlı GitHub istatistikleri.

Site yayında olmadan v2 tartışması yapılmaz.
