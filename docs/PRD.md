# PRD — Ürün Gereksinimleri

## 1. Amaç

Anıl Gündüz'ün işini kanıtlayan, hızlı ve akılda kalıcı bir portfolyo. Site iki soruya
cevap verir: **bu kişi ne yapıyor** ve **onunla nasıl iletişime geçilir**.

Başarı ölçütü (yayından 3 ay sonra):

- Lighthouse 4 kategoride ≥ 95
- 5 sayfanın da indekslenmiş olması
- Ayda ≥ 1 iş teklifi formu doldurulması
- Ortalama oturum süresi ≥ 60 sn

## 2. Sayfa haritası

| Route          | Ekran      | Deck sırası | Ray tarafı       |
| -------------- | ---------- | ----------- | ---------------- |
| `/`            | Anasayfa   | 1           | — (hero 4 kolon) |
| `/hakkimda`    | Hakkımda   | 2           | Sağ              |
| `/projeler`    | Projeler   | 3           | **Sol**          |
| `/blog`        | Yazılar    | 4           | Sağ              |
| `/blog/[slug]` | Yazı Detay | deck dışı   | Sağ              |

"Deck" = masaüstünde wheel ile birbirine geçen dört ekran. Yazı detaya yalnızca tıklayarak
girilir, çıkış `/blog`'a döner.

---

## 3. Ortak sistem: uydu ray

Tek kolonluk uydu ray beş ekran boyunca sizinle gelir; Projeler sayfasında sola geçer.
İçindeki kartlar sayfaya göre değişir. Bu bir tekrar değil, bir **navigasyon jestidir**:
kullanıcı rayın taraf değiştirdiğini görür ve nerede olduğunu kaybetmez.

Ray kart kümeleri ardışık sayfalarda kesişmez; hareket kartlardan değil **konteynerden**
gelir (`INTERACTIONS.md` §3).

### 3.1 Kart envanteri

| Kart           | İçerik                                                                      | "More" hedefi |
| -------------- | --------------------------------------------------------------------------- | ------------- |
| **Hero**       | Avatar, "Developer. Improver.", 3 satır tanıtım, 7 sosyal ikon              | —             |
| **Projects**   | GitHub repo carousel'i: ad, açıklama, "Go to **Live**", teknoloji rozetleri | `/projeler`   |
| **Writings**   | Son yazılar carousel'i: başlık, özet, "Go to **Writing.**"                  | `/blog`       |
| **About Me**   | "I'm working right now about **X**" + "The Time Spent" sayacı               | `/hakkimda`   |
| **Job Offers** | "Do you want to work with me?" + 4 alanlı form                              | —             |
| **Subscribe**  | E-posta alanı + "Enter."                                                    | —             |

Sosyal ikonlar: GitHub, LinkedIn, X, Medium, Instagram, Upwork, Mail.
Hepsinde `aria-label`, harici olanlarda `target="_blank" rel="me noopener"`.

### 3.2 Sayaç ne sayıyor?

Tasarımdaki etiket "The Time Spent" — neyin süresi belirsiz. Karar: **kod yazmaya başlama
tarihinden bu yana geçen süre** (`NEXT_PUBLIC_CAREER_START`). Etiketi netleştir.

Sayaç mutlak tarihten türer; kart unmount olsa da değer kaybolmaz.

---

## 4. Anasayfa (`/`)

Tek istisna sayfa: ray yok, hero 4 kolonun tamamı.

**Yerleşim** (grid haritası `INTERACTIONS.md` §2.1):

- Nav → Home aktif
- Hero (4 kolon, satır 1)
- About Me (1 kol, satır 2–3) · Projects (1 kol, satır 2) · Writings (1 kol, **satır 2**) ·
  Job Offers (1 kol, satır 2–3)
- Subscribe (2 kol, satır 3)
- Footer

> **Faz 2 düzeltmesi.** Burada Writings için önce "satır 2–3" yazıyordu; bu bir
> yazım hatasıydı — öyle olsaydı Subscribe (satır 3, kolon 2–3) ile 3. satırın 3. kolonunda çakışırdı ve iki kart üst üste binerdi. design/home.png ölçümü:
> Projects ve Writings kutuları y 584–884 ile aynı, Subscribe ikisinin de
> altında y 936–1185. Writings, Projects'in ikizidir.

**Kabul kriterleri:**

- 1920×1080, 1440×900 ve 1280×800'de dikey scroll çubuğu yok
- Sayaç hidrasyon uyumsuzluğu üretmiyor
- GitHub API çökerse Projects kartı fallback veriyle render ediyor
- Formlar JS kapalıyken de çalışıyor

---

## 5. Hakkımda (`/hakkimda`)

**Ana bölge (3 kolon):**

- Satır 1: **Hero kartı** — `lg` varyant, metin 4 satıra sarar
- Satır 2–3: **Summary + Job History kartı** — tek kart içinde iki `<h2>`

**Ray (1 kolon, sağ):** Projects (satır 1) · Job Offers (satır 2–3)

**İçerik:**

- `Summary` — 2–3 paragraf gerçek biyografi
- `Job History` — şirket, rol, tarih aralığı, tek satır çıktı
- Sığmazsa kart içi scroll (`data-scrollable`)

Tasarımda yetenek rozetleri ve eğitim yok. İstenirse **aynı kartın içine** `Skills` ve
`Education` başlıkları eklenir — yeni kart açma. Yetenek seviyesi yüzdesi kullanma;
uydurma veridir.

---

## 6. Projeler (`/projeler`)

Rayın sola geçtiği tek sayfa. Bilinçli: göz önce sol raydaki tanıdık kartları görür,
sonra yeni içeriğe geçer.

**Ray (1 kolon, sol):** Writings (satır 1) · About Me (satır 2–3)

**Ana bölge (3 kolon):**

1. **Last Project** (satır 1) — kare kapak görseli, repo adı (accent), tam açıklama,
   "Go to **Live**", teknoloji rozetleri. Kart altında ortalanmış "Repository ›".
2. **Repo ızgarası** (satır 2) — iki kart yan yana. Geniş kapak, repo adı, 2 satır clamp
   açıklama, "Go to **Live**", rozetler, sağ altta "Repository ›".
3. **GitHub profil kartı** (satır 3) — avatar, kullanıcı adı (accent), sağ üstte
   "Repository **33**", bio, "Go to **Profile**".

**Veri kuralları:**

- Kapak görselleri `openGraphImageUrl`'den; repo'ya özel görsel yüklenmişse o gelir
- "Go to Live" yalnızca `homepageUrl` doluysa görünür; boşsa satır kaldırılır
  (tıklanamayan link göstermek kullanıcıya yalan söylemektir)
- Repo sayısı `repositories.totalCount`
- Izgaradaki iki repo: `featured-projects.ts` sırasına göre 2. ve 3.

**Opsiyonel (tasarımda yok):** dile göre filtre. Eklenirse URL'e yansımalı
(`?lang=typescript`) ve deck navigasyonuyla çakışmamalı.

---

## 7. Yazılar (`/blog`)

**Ana bölge (3 kolon):**

1. **Last Writing** (satır 1) — başlık (accent), özet, "Go to **Detail**",
   kart altında ortalanmış "Detail ›"
2. **Yazı listesi** (satır 2–3) — dikey yığın, 3 kart. Başlık (accent), 2 satır özet,
   "Go to **Detail**"
3. **Sayfalama** — listenin altında ortalanmış

**Ray (1 kolon, sağ):** Projects (satır 1) · Job Offers (satır 2–3)

**Sayfalama kuralları:**

- Sayfa başına 3 yazı (tasarımdaki kart sayısı; dvh bütçesini bu belirliyor)
- URL: `/blog?page=2`, Server Component `searchParams` ile okur
- Gerçek `<Link>`; JS kapalıyken çalışır
- Sayfa değişimi deck geçişi **değildir**; ana bölge yeniden render olur, ray sabit kalır
- 1. sayfada "Önceki" gizli, son sayfada "Sonraki" gizli — disabled değil, gizli
- Sınır dışı (`?page=99`) → `notFound()`
- `<nav aria-label="Sayfalama">`, aktif sayfada `aria-current="page"`

**Deck ile çakışma:** `/blog` deck'in son ekranıdır. Wheel aşağı → deck sonu, sayfa 2'ye
geçmez. Sayfalama yalnızca tıklamayla. Aynı jestin iki anlamı olması kullanıcıyı kaybettirir.

---

## 8. Yazı Detay (`/blog/[slug]`)

Deck dışında ama **aynı kabuğun içinde** — nav, footer ve sağ ray duruyor.

**Ana bölge (3 kolon, 3 satır):** makale kartı.

- Başlık (`<h1>`, `display-l`)
- Giriş paragrafı (`body-l`, `text-2`)
- Ayrım boşluğu
- Gövde metni

**Ray (1 kolon, sağ):** Subscribe (satır 1, "Subscribed for next writing" alt metniyle) ·
About Me (satır 2–3)

**Uzun metin nasıl sığar:**

Makale kartı `data-scrollable`'dır; kartın içi scroll eder, sayfa değil. Ek olarak:

- Sayfanın herhangi bir yerindeki wheel makaleye yönlendirilir (`useProxiedWheel`)
- Kartın üst kenarında okuma ilerleme çubuğu (accent), kart scroll'una bağlı
- Deck navigasyonu bu sayfada **tamamen kapalı**. `Esc` veya nav ile `/blog`'a dönülür
- `<article tabIndex={0} role="region" aria-label="Yazı içeriği">` — klavyeden erişilebilir

**Bu kararın bedeli dürüstçe:** uzun bir yazıyı kutu içinde okumak, tam sayfa okumaktan
zahmetlidir. Tasarım bunu istiyor, uyguluyoruz. İki kaçış kapısı var:

- Viewport < 800px → deck kapanır, sayfa normal scroll'a döner
- Makale > 2000 kelime → "Tam ekran oku" (`?reader=1`): ray gizlenir, makale 4 kolona yayılır

**Ayrıca:** içindekiler (h2/h3'ten, sticky), kod blokları + kopyala butonu, yazı sonu
paylaş linkleri ve önceki/sonraki yazı, dinamik `opengraph-image`.

---

## 9. Formlar

**Subscribe** — alan: e-posta. Zod `.email()`. Başarıda kart içi durum değişimi, sayfa
yenilenmez. Çift kayıt sessizce başarı döner (e-posta varlığını sızdırma).
Anasayfa ve detay sayfası alt metinleri farklıdır (`CONTENT-MODEL.md` §5).

**Job Offer** — alanlar: lokasyon, tip, teknoloji, tutar. Hepsi zorunlu.
Tasarımda dördü de serbest metin; "job type" için `<select>` öneri olarak durur, karar senin.
Taslak `DraftProvider`'da tutulur; sayfa değişiminde kaybolmaz.

**Ortak güvenlik:** honeypot + gönderim zaman eşiği (< 2 sn = bot) + IP başına saatte
5 istek. CAPTCHA yok.

**Buton görünümü:** tasarımdaki gri "Send the Offer." / "Enter." **öyle kalır** — bu bir
tasarım tercihidir, erişilebilirlik sorunu değil (`CLAUDE.md` → bağlayıcılık).
Akış boyunca isim sabit: "Send the Offer." → "Sending…" → "Offer sent."

**Hata metni** ne olduğunu ve nasıl düzeltileceğini söyler, özür dilemez:

- Kötü: "Bir hata oluştu, üzgünüz."
- İyi: "E-posta gönderilemedi. Birkaç saniye sonra dene veya anil@… adresine yaz."

## 10. Kapsam dışı (v1)

Çoklu dil, yorum sistemi, arama, tema değiştirici, admin paneli, CMS.
v1 yayınlanmadan v2 tartışması yapılmaz.
