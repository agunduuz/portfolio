# Yapılacaklar

`ROADMAP.md` fazları izler — ne yapıldığını. Bu dosya **kimin ne yapacağını** izler.
`/faz-kontrol` panelinde işaretlenebilir; kutuyu tıklamak bu dosyayı günceller.

Her madde ya **sahibinde** (içerik, hesap, karar) ya da bir **tarayıcı aracı**
gerektiriyor. Kodla kapatılabilecek bir madde kalmadıysa bu dosya doğrudur.

**`[!]` ile başlayan maddeler önerilen sıradaki adımlardır** — panelde turuncu
görünürler. Seçim ölçütü: en görünür boşluğu kapatan, en ucuz ve başka hiçbir
şeye bağlı olmayan işler.

---

## Nerede kaldık (2026-09-09)

**Faz 0–9 kodu bitti.** `ROADMAP.md`'de kodla kapatılabilecek madde kalmadı.
`npx tsc --noEmit`, `npm run lint`, `npm run build` üçü de temiz.

Beş ekran çalışıyor, içerik gerçek: biyografi ve iş geçmişi girildi, üç blog
yazısı yayında, dört vitrin projesi (RefTakip, Codworks, Vega PDR, Gündüz
Wedding) `curated-projects.ts`'te.

**`GITHUB_TOKEN` girildi ve geçerli** — API'ye doğrudan sorulduğunda `agunduuz`,
bio "Front End Developer", 67 public repo dönüyor.

**Ama site hâlâ fallback gösteriyor** (Repository 4, bio yok) ve bu bir
yapılandırma tuzağı: `env.server.ts`'teki `githubSchema` `GITHUB_WEBHOOK_SECRET`'ı
da zorunlu tutuyor, oysa `hasGitHubEnv()` kapısı yalnızca token + username'e
bakıyor. `getGitHub()` kapıdan geçiyor, `githubEnv()` fırlatıyor, `github.ts:353`
bare `catch`'i sessizce fallback'e düşürüyor — log'a hiçbir şey düşmüyor.

İki çıkış var, ikisi de doğru:

1. `GITHUB_WEBHOOK_SECRET`'ı şimdi üret (`openssl rand -hex 32`) — nasılsa
   üretimde gerekecek, tek komut.
2. Webhook sırrını `githubSchema`'dan ayır; okuma yolu onu istemesin. Dosyanın
   kendi yorumunun ("bir grubu okuyan modül yalnızca kendi grubunu doğrulamalı")
   söylediği şey bu; sırrı yalnızca `api/revalidate` okumalı.

Sonrası: Blok 4 (repo eleme + açıklama + topic), sonra Blok 6 (Vercel deploy).

Site token olmadan da tam çalışır — `getGitHub()` fallback'e düşer, hiçbir kart
boş kalmaz. Bu bir eksiklik değil, tasarlanmış davranış. Sessizce fallback'e
düşen **yanlış yapılandırma** ise tasarlanmış değil; yukarıdaki tuzak odur.

---

## Blok 1 — İçerik (yayın öncesi zorunlu)

Bunlar olmadan site yayına çıkmamalı; sayfalar boş durum metniyle görünür.

- [x] `src/config/about.ts` → `summary`: 2–3 paragraf gerçek biyografi
- [x] `src/config/about.ts` → `jobHistory`: Otoparçasan, StrategyCube, Litum
      (tip genişletildi: `location` + `highlights`, çünkü gerçek içerik tek
      satıra sığmıyordu)
- [x] `src/content/blog/css-grid-1fr-neden-tasar.mdx` — sahibinin yönergesiyle
      yeniden yazıldı: başlangıçtan uzmana, mülakat soruları, "15 yaşındaki
      birine anlatır gibi" bölümleri açıkça etiketli
- [x] `src/content/blog/suspense-icinde-olen-animasyon.mdx` — aynı yapıda yeniden yazıldı
- [x] Üçüncü yazı: `tek-query-parametresi-butun-sayfalari-dinamiklestirdi.mdx`
      (useSearchParams'ın statik render'ı bozması ve CSS `:has()` ile kaçınma)
- [x] `src/config/curated-projects.ts` — dört vitrin projesi eklendi: RefTakip,
      Codworks, Vega PDR, Gündüz Wedding. Dosya `private-projects.ts`'ten
      yeniden adlandırıldı; içindekilerin çoğu artık public.

## Blok 2 — Anahtarlar

`.env.local` dosyasına. Hiçbiri olmadan site çalışır ama özellikler kapalıdır.

- [x] `GITHUB_TOKEN` — girildi ve **geçerli**: API'ye doğrudan sorulduğunda
      `agunduuz`, bio "Front End Developer", 67 public repo dönüyor. Ama site
      hâlâ fallback gösteriyor; sebep aşağıdaki `GITHUB_WEBHOOK_SECRET` maddesi.
- [x] `GITHUB_USERNAME=agunduuz` — `.env.local`'e yazıldı
- [ ] [!] `GITHUB_WEBHOOK_SECRET` — `openssl rand -hex 32`. **Artık üretimden
      önce de gerekli:** `env.server.ts`'teki `githubSchema` bu değişkeni de
      istiyor, `hasGitHubEnv()` ise yalnızca token + username'e bakıyor. Sonuç:
      `getGitHub()` kapıdan geçiyor, `githubEnv()` fırlatıyor, `catch` sessizce
      fallback'e düşürüyor. Token'ın etkisi bu değer girilene kadar görünmez.
      (Alternatif: webhook sırrını şemadan ayırmak — bkz. aşağıdaki not.)
- [ ] `RESEND_API_KEY` + `CONTACT_EMAIL` — yoksa formlar "e-posta servisi bağlı
      değil" der (bilinçli: sessizce "gönderildi" demek yalan olurdu)
- [ ] `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` — yoksa hız sınırı kapalı

## Blok 3 — Tasarım kararları

Üçü de ölçüldü, karar senin. Detay: `DESIGN-SYSTEM.md`.

- [ ] **Accent rengi.** Figma'da `#05ffb4`, token'da `#3be8a5`. Faz 0'da
      sabitlenmiş; ölçüm Figma'nın daha doygun olduğunu gösteriyor.
- [ ] **Buton kontrastı.** "Send the Offer." **2.54:1** — WCAG AA ihlali.
      Tasarım kararı olduğu için değiştirilmedi. Metni `#121212` yapmak zemini
      bozmadan 6.5:1'e çıkarır.
- [ ] **Repo kapakları.** GitHub'ın beyaz OG kartları koyu tasarımda yamalı
      duruyor. Ya repolara custom social preview yükle, ya da custom görseli
      olmayanda düz blok bırakalım.
- [ ] **Subscribe metni dili.** `homeLead` Türkçe, kartın geri kalanı İngilizce.

## Blok 4 — GitHub tarafı (kod değil, repo ayarı)

Vitrindeki dört projenin metni ve kapağı artık `curated-projects.ts`'ten
geliyor; GitHub açıklamaları onları **etkilemiyor**. Buradaki maddeler
carousel'de vitrinin ARKASINDAN gelen repo'lar için.

- [ ] [!] Vitrine girmesini istemediğin repo'lara `portfolio-hidden` topic'i
      (**67** public repo var; carousel ilk 8'i alıyor). Token çalışır çalışmaz
      en görünür boşluk bu: eleme yapılmazsa arka dört sırayı ne çıkarsa o
      dolduruyor.
- [ ] [!] Projects carousel'i ilk 8 repo'yu gösteriyor. Vitrinden sonraki 4
      sırada hangi repo'lar çıkacaksa onlara GitHub'da **açıklama** ekle —
      açıklaması olmayan repo kartta yalnızca ad + "Go to Live" olarak görünür.
- [ ] [!] Aynı repo'lara **topic** ekle (`nextjs`, `typescript`, `tailwindcss`) —
      teknoloji rozetleri oradan türüyor

## Blok 5 — Elle test (tarayıcı aracı gerekiyor)

- [ ] Lighthouse ≥ 95 (4 kategori) — yayın URL'inde
- [ ] Geçiş sırasında uzun görev (>50 ms) yok — DevTools Performance kaydı
- [ ] VoiceOver: sayfa değişimi duyuruluyor, sayaç sessiz
- [ ] `axe` DevTools — sıfır kritik hata
- [ ] Gerçek mobil cihazda kontrol (CSS yazıldı ama gerçek cihazda denenmedi)
- [x] Kapak görselleri küçültüldü: 3426×1980 → **1400×809**, toplam
      5.8 MB → **1.6 MB**

## Blok 6 — Yayın (Faz 9)

- [ ] Vercel'e bağla, env değişkenlerini gir
- [ ] Alan adı + HTTPS + `www` → apex yönlendirmesi
- [ ] GitHub webhook'u `https://<alan-adi>/api/revalidate` adresine yönlendir
      (uç hazır, `x-hub-signature-256` doğruluyor)
- [ ] Search Console + Bing Webmaster, sitemap gönder
- [ ] Vercel Speed Insights aç (panelden, paket eklenmedi)
- [ ] `rm -rf src/app/faz-kontrol` — bu panel de gider

---

## Bilinen ve kabul edilmiş

Bunlar hata değil, belgelenmiş kararlar. Kapatılacak bir şey yok.

- **JS bütçesi aşılıyor: 288 KB gzip, hedef 120 KB.** Çerçeve tabanı tek başına
  246 KB (React 19 + Next 16 App Router), Motion +42 KB. Hedef bu stack için
  baştan gerçekçi değilmiş. `LazyMotion` denendi, 297 KB'a çıktı, geri alındı.
  Küçültmenin tek yolu Motion'ı çıkarmak — o da rayın taraf değiştirmesini elle
  yeniden yazmak demek. Bkz. `SEO.md` §7.
- **Job Offers alanları ~1000px altında kart içinde scroll eder.** Kutu `dvh` ile
  küçülüyor, içerik `rem` olduğu için küçülmüyor. Kırmızı çizgi 1'in öngördüğü
  davranış; buton scroll alanının dışında sabit.
- **Faz -1 (güvenlik rotasyonu) gerekmiyor.** Denetlendi: `.env.local` hiç commit
  edilmemiş, geçmişte sır formatında dize yok. Yalnızca bu depoyu kapsar.
