# SEO ve Performans

## 1. Bu tasarımın SEO riskleri ve çözümleri

| Risk                                                          | Çözüm                                                                                                                                                                                                                                 |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Scroll-jack → tek URL, tek başlık                             | Her ekran **ayrı route**. Deck yalnızca geçiş katmanı.                                                                                                                                                                                |
| `100dvh`'a sığsın diye içerik kırpılıyor → ince içerik        | Uzun içerik kart içi scroll alanında **DOM'da tam** durur. `line-clamp` görsel kısaltmadır.                                                                                                                                           |
| Client-side geçiş → crawler bulamaz                           | Her route sunucuda tam HTML üretir.                                                                                                                                                                                                   |
| **Uydu kartlar her sayfada tekrar ediyor → yinelenen içerik** | Kartlar `layout.tsx`'te olduğu için her sayfada aynı boilerplate metin çıkar. Kart metinleri kısa ve `aria` etiketli tutulur; sayfanın **benzersiz** içeriği ana bölgede ve `<main>` içinde yaşar. Kartlar `<aside>` ile işaretlenir. |
| **Yazı detayda makale scroll kutusunda**                      | Metin DOM'da bütün; `overflow: auto` indekslemeyi etkilemez. Ama `<article>` gerçek `<h1>`, `<h2>` hiyerarşisi taşımalı.                                                                                                              |
| **Sayfalama → ince/yinelenen liste sayfaları**                | Aşağıdaki §4 kuralları.                                                                                                                                                                                                               |

**Kural:** görsel olarak gizlenen içerik CSS ile gizlenir, koşullu render ile değil.
`{open && <p>…</p>}` yerine `line-clamp-2`.

**Semantik iskelet** (her sayfada):

```html
<header>
  <!-- Nav -->
  <main id="main">
    <!-- sayfaya özgü içerik, tek <h1> burada -->
    <aside>
      <!-- uydu kartlar -->
      <footer></footer>
    </aside>
  </main>
</header>
```

Uydu kartlar `<aside>` içindedir. Bu, arama motoruna "bu bölüm sayfanın ana içeriği değil"
der ve tekrar eden kart metinlerinin sayfayı seyreltmesini engeller.

## 2. Metadata

`src/lib/seo.ts` tek üretici. Her sayfa `generateMetadata` ile kendi başlığını verir.

```ts
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  title: {
    default: "Anıl Gündüz — Full-Stack Developer",
    template: "%s · Anıl Gündüz",
  },
  description:
    "Modern web teknolojileriyle hızlı ve erişilebilir arayüzler geliştiriyorum.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "tr_TR", siteName: "Anıl Gündüz" },
  twitter: { card: "summary_large_image", creator: "@kullaniciadi" },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};
```

**Sayfa başlıkları:**

| Route          | Title                              | H1                   |
| -------------- | ---------------------------------- | -------------------- |
| `/`            | Anıl Gündüz — Full-Stack Developer | Developer. Improver. |
| `/hakkimda`    | Hakkımda                           | Summary              |
| `/projeler`    | Projeler                           | Last Project.        |
| `/blog`        | Yazılar                            | Last Writing.        |
| `/blog/[slug]` | {yazı başlığı}                     | {yazı başlığı}       |

Her sayfada **tek `<h1>`**. Uydu kartların başlıkları `<h2>` değil `<h3>`'tür —
sayfanın ana hiyerarşisiyle yarışmamalı.

**Açıklama:** 150–160 karakter, sayfanın gerçek içeriğini anlatır. Şablon açıklama kullanma.

## 3. Yapısal veri (JSON-LD)

| Sayfa          | Şema                                                                                               |
| -------------- | -------------------------------------------------------------------------------------------------- |
| Tüm sayfalar   | `WebSite` + `Person` (`sameAs` ile sosyal linkler)                                                 |
| `/projeler`    | `ItemList` → `SoftwareSourceCode` (repo başına `codeRepository`, `programmingLanguage`)            |
| `/blog`        | `Blog` + `ItemList`                                                                                |
| `/blog/[slug]` | `BlogPosting` (headline, datePublished, dateModified, author, image, wordCount) + `BreadcrumbList` |

`<script type="application/ld+json">` Server Component'te render edilir.
`Person.sameAs` GitHub, LinkedIn, X, Medium adreslerini içermeli — Knowledge Graph eşlemesi
bunu kullanır. Kaynak `config/site.ts`; ikinci bir yere yazma.

Görünmeyen içeriği işaretleme — cezaya açık.

## 4. Sayfalama SEO'su

- Her sayfa **kendini işaret eden canonical** taşır: `/blog?page=2` → canonical `/blog?page=2`. 2. sayfayı 1'e canonical'lamak, oradaki yazıların indekslenmemesine yol açar.
- `rel="prev"/"next"` Google tarafından artık kullanılmıyor ama Bing için zararsız —
  eklemek isteğe bağlı.
- Sayfa 2+ **`noindex` yapılmaz**; yazılara giden tek yol olabilir.
- Sayfa 2+ başlığı ayrışır: `Yazılar — Sayfa 2 · Anıl Gündüz`
- Sınır dışı sayfa (`?page=99`) → `notFound()`, 404 döner. Boş liste 200 dönmemeli.
- Tüm yazı URL'leri `sitemap.xml`'de; sayfalama URL'leri sitemap'e **girmez** (yazılar zaten var).

## 5. Sitemap, robots, RSS

```ts
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/hakkimda`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/projeler`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.9 },
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.updated ?? p.date,
      priority: 0.7,
    })),
  ];
}
```

`app/robots.ts`: tümüne izin, `sitemap` alanı dolu, `/api/` disallow.
RSS `app/rss.xml/route.ts`; `<link rel="alternate" type="application/rss+xml">` ile `<head>`'e bağlanır.

## 6. Görsel ve OG

- Tüm görseller `next/image`, `width`/`height` zorunlu (CLS)
- Format: AVIF öncelikli, WebP fallback
- **GitHub kapak görselleri harici kaynaktan gelir** → `remotePatterns` tanımlı olmalı,
  `sizes` doğru verilmeli (repo ızgarasında `(max-width: 1280px) 33vw, 400px`)
- Hero avatarı `priority` + `fetchPriority="high"`; kapak görselleri lazy
- `alt` metinleri: avatar → "Anıl Gündüz", kapak → "{repo adı} önizleme görseli"
- OG görselleri `opengraph-image.tsx` ile `ImageResponse` üzerinden dinamik üretilir
  (1200×630, sitenin renk ve fontuyla). Statik PNG tutma.

## 7. Performans

**Kaynak yükleme**

- Font `next/font/local`, `display: swap`, `preload: true`, `latin` + `latin-ext`
- Üçüncü parti script yok. Analitik: Vercel Analytics veya Umami (<2 KB)
- Google Fonts / Font Awesome / jQuery CDN kullanılmaz

**JS bütçesi**

- `SatelliteRail` client bileşenidir ve tüm kartları içerir — bu, projenin en büyük client
  ağacı. Kart _içeriklerini_ mümkün olduğunca Server Component olarak `children` üzerinden
  geçir; yalnızca sarmalayıcı `motion.div` client olsun
- `"use client"` en yaprak bileşende. Bir kart yüzünden tüm sayfa client olmasın
- İkonlar tek tek import: `import { Download } from "lucide-react"` — barrel import etme
- Motion yalnızca `SatelliteRail` ve `template.tsx`'te
- `@next/bundle-analyzer` ile her release öncesi kontrol

**Cache**

- Statik varlıklar `immutable, max-age=31536000`
- ISR 1 saat + webhook ile on-demand `revalidateTag("github")`

**Hedefler:** LCP < 1.5s · INP < 200ms · CLS < 0.02 · TTFB < 200ms · route başına JS < 120 KB gzip

**INP riski:** `layout` animasyonu her frame'de layout okur. Aynı anda 3'ten fazla kart
taşınmamalı. Ölçüm: Chrome DevTools Performance, geçiş sırasında uzun görev (>50ms) olmamalı.

## 8. Yayın öncesi kontrol listesi

**Teknik**

- [ ] `robots.txt` erişilebilir, `noindex` kalıntısı yok
- [ ] `sitemap.xml` tüm route'ları içeriyor, hepsi 200
- [ ] Her sayfada tek `<h1>`, hiyerarşi atlamıyor
- [ ] Uydu kartlar `<aside>`, ana içerik `<main>` içinde
- [ ] `<html lang="tr">`
- [ ] Canonical'lar self-referencing, sayfalama dahil
- [ ] `?page=99` → 404
- [ ] 404 sayfası özel ve 404 status kodu dönüyor
- [ ] HTTPS + `www` → apex tek yönlü yönlendirme
- [ ] Rich Results Test: `Person`, `BlogPosting`, `ItemList` doğrulandı

**İçerik**

- [ ] Her sayfanın benzersiz title + description'ı var
- [ ] Görsellerde anlamlı `alt`
- [ ] Her yazı en az bir diğer sayfaya link veriyor
- [ ] Harici linklerde `rel="noopener"`
- [ ] Lorem ipsum kalıntısı yok (tam metin araması yap)

**Ölçüm**

- [ ] Google Search Console doğrulandı, sitemap gönderildi
- [ ] Bing Webmaster Tools eklendi
- [ ] Vercel Speed Insights açık
- [ ] Lighthouse CI GitHub Actions'ta, eşik 95

**Yayından sonra 1. hafta**

- [ ] `site:anilgunduz.dev` ile 5 sayfa da indekslendi
- [ ] Search Console "Sayfa deneyimi" raporu temiz
- [ ] Mobil kullanılabilirlik hatası yok
