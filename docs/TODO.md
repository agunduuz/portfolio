# Yapılacaklar

`ROADMAP.md` fazları izler — ne yapıldığını. Bu dosya **kimin ne yapacağını** izler.
`/faz-kontrol` panelinde işaretlenebilir; kutuyu tıklamak bu dosyayı günceller.

Her madde ya **sahibinde** (içerik, hesap, karar) ya da bir **tarayıcı aracı**
gerektiriyor. Kodla kapatılabilecek bir madde kalmadıysa bu dosya doğrudur.

---

## Blok 1 — İçerik (yayın öncesi zorunlu)

Bunlar olmadan site yayına çıkmamalı; sayfalar boş durum metniyle görünür.

- [ ] `src/config/about.ts` → `summary`: 2–3 paragraf gerçek biyografi
- [ ] `src/config/about.ts` → `jobHistory`: şirket, rol, tarih (`2023-01`), tek satır çıktı
- [ ] `src/content/blog/css-grid-1fr-neden-tasar.mdx` — gözden geçir, kendi
      sesinle yeniden yaz ya da sil (içerik doğru, künye senin)
- [ ] `src/content/blog/suspense-icinde-olen-animasyon.mdx` — aynısı
- [ ] Üçüncü yazı (ROADMAP Faz 5 üç yazı istiyor, iki tane var)
- [ ] `src/config/private-projects.ts` — göstermek istediğin private projeler
      (boş bırakılabilir; ad 20 karakteri geçmesin, uzun ad kartı taşırıyor)

## Blok 2 — Anahtarlar

`.env.local` dosyasına. Hiçbiri olmadan site çalışır ama özellikler kapalıdır.

- [ ] `GITHUB_TOKEN` — fine-grained PAT, `Public Repositories (read-only)` +
      `Metadata: Read`. Yoksa Projects kartı `featured-projects.ts` fallback'iyle çalışır.
- [ ] `GITHUB_USERNAME=agunduuz`
- [ ] `RESEND_API_KEY` + `CONTACT_EMAIL` — yoksa formlar "e-posta servisi bağlı
      değil" der (bilinçli: sessizce "gönderildi" demek yalan olurdu)
- [ ] `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` — yoksa hız sınırı kapalı
- [ ] `GITHUB_WEBHOOK_SECRET` — `openssl rand -hex 32`. Yalnızca üretimde gerekli.

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

- [ ] Vitrin repolarına **açıklama** ekle — 12 repoda yok, kartlar açıklamasız çıkıyor
- [ ] Vitrin repolarına **topic** ekle (`nextjs`, `typescript`, `tailwindcss`) —
      teknoloji rozetleri oradan türüyor
- [ ] Gizlemek istediğin repolara `portfolio-hidden` topic'i

## Blok 5 — Elle test (tarayıcı aracı gerekiyor)

- [ ] Lighthouse ≥ 95 (4 kategori) — yayın URL'inde
- [ ] Geçiş sırasında uzun görev (>50 ms) yok — DevTools Performance kaydı
- [ ] VoiceOver: sayfa değişimi duyuruluyor, sayaç sessiz
- [ ] `axe` DevTools — sıfır kritik hata
- [ ] Gerçek mobil cihazda kontrol (CSS yazıldı ama gerçek cihazda denenmedi)

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
