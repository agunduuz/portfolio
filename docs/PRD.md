# PRD — Ürün Gereksinimleri

## 1. Amaç

Anıl Gündüz'ün işini kanıtlayan, hızlı ve akılda kalıcı bir portfolyo. Site iki soruya cevap verir:
**bu kişi ne yapıyor** ve **onunla nasıl iletişime geçilir**.

Başarı ölçütü (yayından 3 ay sonra):

- Lighthouse 4 kategoride ≥ 95
- 5 sayfanın da indekslenmiş olması
- Ayda ≥ 1 iş teklifi formu doldurulması
- Ortalama oturum süresi ≥ 60 sn

## 2. Sayfa haritası

| Route          | Ekran      | Deck sırası | Ray tarafı        |
| -------------- | ---------- | ----------- | ----------------- |
| `/`            | Anasayfa   | 1           | — (hero 12 kolon) |
| `/hakkimda`    | Hakkımda   | 2           | Sağ               |
| `/projeler`    | Projeler   | 3           | **Sol**           |
| `/blog`        | Yazılar    | 4           | Sağ               |
| `/blog/[slug]` | Yazı Detay | deck dışı   | Sağ               |

"Deck" = masaüstünde wheel ile birbirine geçen dört ekran. Yazı detay deck'in dışındadır:
oraya yalnızca tıklayarak girilir, çıkış `/blog`'a döner.

## 3. Ortak sistem: uydu kartlar

Tasarımın merkezindeki fikir şu: **aynı kartlar sayfalar boyunca sizinle geliyor.**
Projects kartı anasayfada 3 kolon, Hakkımda'da sağ rayda, Projeler'de yok, Yazılar'da yine sağ rayda.
About Me kartı anasayfada 3 kolon, Projeler'de sol rayda, Detay'da sağ rayda.

Bu bir tekrar değil, bir **navigasyon jestidir**: kullanıcı sayfa değiştirirken tanıdık kartların
yerini değiştirdiğini görür ve nerede olduğunu kaybetmez.

**Uygulama kuralı:** bu kartlar `layout.tsx` seviyesinde tek örnek olarak yaşar. Sayfa değişiminde
unmount olmaz, Motion `layout` prop'u ile yeni konumlarına animasyonla taşınır.
Detaylar `docs/INTERACTIONS.md` §3.

### 3.1 Kart envanteri

| Kart           | İçerik                                                                                      | "More" hedefi |
| -------------- | ------------------------------------------------------------------------------------------- | ------------- |
| **Hero**       | Avatar, "Developer. Improver.", 3 satır tanıtım, 7 sosyal ikon                              | —             |
| **Projects**   | GitHub repo carousel'i: ad, açıklama (3 satır clamp), "Go to **Live**", teknoloji rozetleri | `/projeler`   |
| **Writings**   | Son yazılar carousel'i: başlık, özet, "Go to **Writing.**"                                  | `/blog`       |
| **About Me**   | "I'm working right now about **X**" + "The Time Spent" sayacı                               | `/hakkimda`   |
| **Job Offers** | "Do you want to work with me?" + 4 alanlı form                                              | —             |
| **Subscribe**  | E-posta alanı + "Enter."                                                                    | —             |

Sosyal ikonlar: GitHub, LinkedIn, X, Medium, Instagram, Upwork, Mail.
Hepsinde `aria-label`, harici olanlarda `target="_blank" rel="me noopener"`.

### 3.2 Sayaç ne sayıyor?

Tasarımda etiket "The Time Spent" — neyin süresi belirsiz. Karar: **kod yazmaya başlama
tarihinden bu yana geçen süre** (`NEXT_PUBLIC_CAREER_START`). Etiketi netleştir; etiketsiz
bir sayaç ziyaretçiye hiçbir şey anlatmaz.

---

## 4. Anasayfa (`/`)

Tek istisna sayfa: ray yok, hero tam genişlikte.

**Yerleşim** (12 kolon, 3 satır — detay `INTERACTIONS.md` §2.1):

- Nav (12) → Home aktif
- Hero (12, satır 1)
- About Me (3, satır 2–3) · Projects (3, satır 2) · Writings (3, satır 2) · Job Offers (3, satır 2–3)
- Subscribe (6, satır 3 — Projects ve Writings'in altı)
- Footer

**Kabul kriterleri:**

- 1440×900 ve 1920×1080'de dikey scroll çubuğu yok
- Sayaç hidrasyon uyumsuzluğu üretmiyor
- GitHub API çökerse Projects kartı boş kalmıyor, fallback veriyle render ediyor
- Formlar JS kapalıyken de çalışıyor

---

## 5. Hakkımda (`/hakkimda`)

**Ana bölge (9 kolon):**

- Satır 1: **Hero kartı** — anasayfadakinin dar varyantı. Metin 4 satıra sarar, avatar aynı boyutta.
- Satır 2–3: **Summary + Job History kartı** — tek kart içinde iki `<h2>`.

**Ray (3 kolon, sağ):** Projects (satır 1) · Job Offers (satır 2–3)

**Summary / Job History içeriği:**

- `Summary` — 2–3 paragraf gerçek biyografi
- `Job History` — şirket, rol, tarih aralığı, tek satır çıktı biçiminde kayıtlar
- İçerik `100dvh`'a sığmazsa kart içi scroll (`data-scrollable`)

Tasarımda yetenek rozetleri ve eğitim bölümü yok. İstenirse aynı kartın içine `Skills` ve
`Education` başlıkları eklenebilir — **yeni kart açma**. Yetenek seviyesi yüzdesi kullanma;
uydurma veridir, güven kaybettirir.

---

## 6. Projeler (`/projeler`)

Rayın sola geçtiği tek sayfa. Bu bilinçli: göz önce sol raydaki tanıdık kartları görüp
sonra yeni içeriğe geçer.

**Ray (3 kolon, sol):** Writings (satır 1) · About Me (satır 2–3)

**Ana bölge (9 kolon):**

1. **Last Project** (satır 1) — en son güncellenen veya manuel seçilmiş öne çıkan proje.
   Sol tarafta kapak görseli (kare), sağda: repo adı (accent), tam açıklama, "Go to **Live**",
   teknoloji rozetleri. Kart altında ortalanmış "Repository ›" linki.
2. **Repo ızgarası** (satır 2) — iki kart yan yana (9 kolonun içinde 2'li alt grid).
   Her kart: geniş kapak görseli, repo adı, 2 satır clamp açıklama, "Go to **Live**",
   teknoloji rozetleri, sağ altta "Repository ›".
3. **GitHub profil kartı** (satır 3) — avatar, GitHub kullanıcı adı (accent),
   sağ üstte "Repository **33**" sayısı, profil bio'su, "Go to **Profile**".

**Veri kuralları:**

- Kapak görselleri GitHub'ın sosyal önizleme uç noktasından gelir:
  `https://opengraph.githubassets.com/1/{owner}/{repo}` — repo'ya özel görsel yüklenmişse o gelir.
  `next.config.ts` → `images.remotePatterns` içine eklenir.
- "Go to Live" yalnızca `homepageUrl` doluysa görünür; boşsa satır tamamen kaldırılır
  (tıklanamayan bir link göstermek kullanıcıya yalan söylemektir).
- Repo sayısı `repositories.totalCount` — public repo sayısı.
- Izgaradaki iki repo: `featured-projects.ts` sırasına göre 2. ve 3. sıradakiler.

**İstenirse (tasarımda yok, opsiyonel):** dile göre filtre. Eklenirse URL'e yansımalı
(`?lang=typescript`) ve deck navigasyonuyla çakışmamalı.

---

## 7. Yazılar (`/blog`)

**Ana bölge (9 kolon):**

1. **Last Writing** (satır 1) — en son yazı. Başlık (accent), özet, "Go to **Detail**",
   kart altında ortalanmış "Detail ›" linki.
2. **Yazı listesi** (satır 2–3) — dikey yığın halinde 3 kart. Her biri: başlık (accent),
   2 satır özet, "Go to **Detail**". Kartlar arası boşluk grid gap'i kadar.
3. **Sayfalama** — listenin altında ortalanmış.

**Ray (3 kolon, sağ):** Projects (satır 1) · Job Offers (satır 2–3)

**Sayfalama kuralları:**

- Sayfa başına 3 yazı (tasarımdaki kart sayısı bu; `100dvh` bütçesini bu belirliyor)
- URL: `/blog?page=2` — Server Component `searchParams` ile okur
- Sayfalama linkleri gerçek `<Link>`; JS kapalıyken çalışır
- Sayfa değişimi deck geçişi **değildir**; yalnızca ana bölge yeniden render olur, ray sabit kalır
- Sayfa 1'de "Önceki" gizli, son sayfada "Sonraki" gizli — disabled değil, gizli
- `aria-label="Sayfalama"` ile `<nav>` içinde, aktif sayfada `aria-current="page"`

**Deck ile çakışma:** `/blog` deck'in son ekranıdır. Wheel aşağı → deck sonu (sayfa 2'ye
geçmez). Sayfalama yalnızca tıklamayla çalışır. Bu bilinçli bir seçim: aynı jestin iki farklı
anlamı olması kullanıcıyı kaybettirir.

---

## 8. Yazı Detay (`/blog/[slug]`)

Deck'in dışında ama **aynı kabuğun içinde** — tasarımda nav, footer ve sağ ray duruyor.

**Ana bölge (9 kolon, 3 satır):** makale kartı.

- Başlık (`<h1>`, display-l)
- Giriş paragrafı (`body-l`, `text-2`)
- Ayrım boşluğu
- Gövde metni

**Ray (3 kolon, sağ):** Subscribe (satır 1, "Subscribed for next writing" alt metniyle) ·
About Me (satır 2–3)

**Kritik karar — uzun metin `100dvh`'a nasıl sığar:**

Makale kartı `data-scrollable`'dır; **kartın içi** scroll eder, sayfa değil. Ek olarak:

- Sayfanın herhangi bir yerindeki wheel hareketi makale kartına yönlendirilir
  (`useProxiedWheel`) — kullanıcı imleci kartın üstüne getirmek zorunda kalmaz
- Kartın üst kenarında ince bir **okuma ilerleme çubuğu** (accent), kart scroll'una bağlı
- Deck navigasyonu bu sayfada **tamamen kapalıdır**. `Esc` veya nav ile `/blog`'a dönülür
- Kart içi scroll `<article tabIndex={0} role="region" aria-label="Yazı içeriği">` ile
  klavyeden erişilebilir; `PageDown` kart içinde çalışır

**Bu kararın bedeli dürüstçe:** uzun bir yazıyı kutu içinde okumak, tam sayfa okumaktan
daha zahmetlidir. Tasarım bunu istiyor, uyguluyoruz. Ama iki kaçış kapısı bırak:

- Ekran yüksekliği < 700px → deck modu kapanır, sayfa normal scroll'a döner
- Makale > 2000 kelime → kart başında "Tam ekran oku" bağlantısı (`?reader=1`) —
  ray gizlenir, makale 12 kolona yayılır

**Ayrıca:**

- İçindekiler h2/h3'ten üretilir, uzun yazılarda kart içinde sticky
- Kod blokları `rehype-pretty-code` + kopyala butonu
- Yazı sonu: paylaş linkleri, önceki/sonraki yazı
- Yazı başına dinamik `opengraph-image`

---

## 9. Formlar

**Subscribe** — alan: e-posta. Zod `.email()`. Başarıda kart içi durum değişimi, sayfa yenilenmez.
Çift kayıt sessizce başarı döner (e-posta varlığını sızdırma).
Anasayfa alt metni ile detay sayfası alt metni farklıdır (`CONTENT-MODEL.md` §5).

**Job Offer** — alanlar: lokasyon, tip, teknoloji, tutar. Hepsi zorunlu.
Tasarımda dördü de serbest metin; "job type" için `<select>` daha iyi olur (Tam zamanlı /
Yarı zamanlı / Freelance / Sözleşmeli) — bu bir öneri, tasarıma sadık kalmak istersen input bırak.

**Ortak güvenlik:** honeypot alanı + gönderim zaman eşiği (< 2 sn = bot) + IP başına saatte
5 istek limiti. CAPTCHA yok.

**Buton durumları:** tasarımdaki gri "Send the Offer." / "Enter." butonları **disabled**
görünümüdür. Aktif hali `bg-accent text-bg` olmalı — ana CTA'nın pasif görünmesi dönüşüm kaybıdır.
Akış boyunca isim sabit: "Send the Offer." → "Sending…" → "Offer sent."

**Hata metni** ne olduğunu ve nasıl düzeltileceğini söyler, özür dilemez:

- Kötü: "Bir hata oluştu, üzgünüz."
- İyi: "E-posta gönderilemedi. Birkaç saniye sonra dene veya anil@… adresine yaz."

## 10. Kapsam dışı (v1)

Çoklu dil, yorum sistemi, arama, tema değiştirici, admin paneli, CMS.
v1 yayınlanmadan v2 tartışması yapılmaz.
