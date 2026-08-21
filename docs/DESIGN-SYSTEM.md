# Tasarım Sistemi

Renk, tipografi ve spacing için **tek kaynak**. Bileşen dosyalarında ham hex, mutlak px veya
`text-gray-400` gibi Tailwind default'ları görünmemeli.

---

## 0. Yön: cesareti nereye harcıyoruz

Palet Figma'da sabit: near-black + tek asit yeşili. Bu kombinasyon şu an AI üretimi
arayüzlerin en yaygın üç görünümünden biri — kendi başına bir imza değil. Paleti
değiştirmiyoruz çünkü brief sabitlemiş; ayırt ediciliği başka yerden çıkarıyoruz.

**İmza öğe: rayın taraf değiştirmesi.** Tek kolonluk uydu ray beş ekran boyunca sağda
durur, Projeler sayfasında sola geçer, sonra sağa döner. Konteyner hiç unmount olmaz;
`layout` animasyonuyla ekranın bir yanından diğerine kayar, içindeki kartlar çapraz
geçişle takas olur. Sitenin hatırlanacak tek hareketi budur.

> **Dürüst not:** ilk tasarım okumasında imza "kartların sayfalar arası taşınması" olarak
> yazılmıştı. Manifest incelendiğinde ardışık sayfalarda ortak kart bulunmadığı görüldü
> (About {Projects, Job Offers} → Projeler {Writings, About Me} kesişimi boş). Gerçek kart
> taşınması yalnızca Home ↔ About arasında gerçekleşir. İmza, konteynerin kendisidir.

Bunun dışında her şey sakin durur: hover 150 ms, gölge yok, gradient yok, parlama yok,
kart hover'ında scale yok.

**İkinci ayırt edici: sayısal tipografi.** Sayaç rakamları `tabular-nums` ile sabit
genişlikte akar; rakam ve birim iki farklı renkte, aralarında boşluk yok (`11Day.`).

Chanel kuralı: her ekrandan bir aksesuar çıkar. Bir kartta hem ikon, hem rozet, hem ok,
hem "More" linki varsa biri fazladır.

---

## 1. Renk

```css
@theme {
  --color-bg: #121212;
  --color-surface: #262626; /* bento kart */
  --color-surface-hover: #2e2e2e;
  --color-elevated: #333333; /* input, iç kart, görsel placeholder */

  --color-accent: #3be8a5;
  --color-accent-hover: #5cefb6;
  --color-accent-press: #2bc488;

  --color-text: #f2f2f2;
  --color-text-2: #a8a8a8; /* gövde metni */
  --color-text-3: #7a7a7a; /* etiket/ikon — gövde metninde kullanma */

  --color-border: rgb(255 255 255 / 0.07);
  --color-border-strong: rgb(255 255 255 / 0.14);

  --color-danger: #ff6b6b;
  --color-success: var(--color-accent);
}
```

**Kontrast (WCAG AA):**

| Çift                 | ≈ Oran | Kullanım                    |
| -------------------- | ------ | --------------------------- |
| `text` / `surface`   | 14:1   | başlık, birincil metin      |
| `text-2` / `surface` | 7:1    | gövde metni — uygun         |
| `text-3` / `surface` | 4:1    | **gövde metninde kullanma** |
| `accent` / `surface` | 9:1    | link, vurgu başlık          |

Accent'i geniş alanda zemin olarak kullanma. Accent = vurgu, zemin değil.

**Accent kullanım yerleri** (tasarımdan çıkarılan kural — dışına çıkma):
aktif nav linki · repo/yazı başlıkları · "Do you want to work with me?" · "Portfolio Web
Page" vurgusu · GitHub kullanıcı adı · focus ring · okuma ilerleme çubuğu.

**Buton renkleri Figma'ya sadıktır.** "Send the Offer." ve "Enter." tasarımda gri
görünür; öyle kalır. Bu bir erişilebilirlik sorunu değil, tasarım tercihidir
(`CLAUDE.md` → "Tasarım kaynağı ve bağlayıcılık").

---

## 2. Tipografi

**Font (doğrulanacak):** Figma'daki başlık fontu geometrik grotesk. En yakın eşleşme
**Jost**. Alternatifler: Space Grotesk, Outfit.

> **İlk iş:** Figma'da fontun gerçek adını oku ve buraya yaz. Ardından **Türkçe glif
> testi**: `ı İ ğ Ğ ş Ş ç Ç ö Ö ü Ü`. "Anıl Gündüz" doğru render edilmiyorsa font elenir.
> `latin-ext` subset'i şart.

```
Display : Jost  → başlıklar, sayaç, kart başlıkları
Body    : Inter Variable       → gövde, form, nav
Mono    : JetBrains Mono       → repo adları, teknoloji rozetleri, kod
```

`next/font/local` ile self-host et. Google Fonts CDN'i üretimde kullanma.

**Tip ölçeği** — `vw` tabanlı, **`dvh` tabanlı değil**:

| Rol          | Boyut                        | Ağırlık | Satır | Harf aralığı | Nerede                            |
| ------------ | ---------------------------- | ------- | ----- | ------------ | --------------------------------- |
| `display-xl` | `clamp(2rem, 3.2vw, 3rem)`   | 700     | 1.05  | -0.02em      | "Developer. Improver."            |
| `display-l`  | `clamp(1.5rem, 2.2vw, 2rem)` | 700     | 1.15  | -0.015em     | "Summary", yazı `<h1>`            |
| `h-card`     | `1.25rem`                    | 700     | 1.2   | -0.01em      | "Projects.", "About Me."          |
| `h-item`     | `1.0625rem`                  | 700     | 1.3   | 0            | repo adı, yazı başlığı (accent)   |
| `body-l`     | `1.0625rem`                  | 400     | 1.55  | 0            | hero tanıtımı, makale girişi      |
| `body`       | `0.9375rem`                  | 400     | 1.6   | 0            | kart açıklamaları, makale gövdesi |
| `label`      | `0.8125rem`                  | 500     | 1.4   | 0.01em       | form etiketleri, "Go to Live"     |
| `micro`      | `0.75rem`                    | 500     | 1.3   | 0.04em       | "More ›", sayfalama               |

**Sayaç bloğu** — tipografik imza:

```css
.counter-value {
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  color: var(--color-text);
}
.counter-unit {
  font-weight: 700;
  color: var(--color-text-2);
}
```

Rakam ve birim bitişik: `11Day.` Kasıtlı, düzeltme.

**Nokta kuralı.** Kart başlıkları noktayla biter: `Projects.` `About Me.` `Last Project.`
`Last Writing.` `Subscribe.` `Job Offers.` — sistemin parçası, koru.
Sayfa içi `<h2>` başlıkları (`Summary`, `Job History`) ve yazı başlıkları noktasızdır.
"Writings Heading!" gibi ünlem tasarımdaki placeholder'dır, gerçek başlıklara taşıma.

**"Go to X" kalıbı.** `Go to` gri (`text-3`, `label`), hedef kelime beyaz ve bold:
`Go to **Live**` · `Go to **Writing.**` · `Go to **Detail**` · `Go to **Profile**`.
Tüm link tıklanabilir, sadece bold kısım değil.

---

## 3. Ölçü sistemi

### 3.1 Yatay

```css
--shell-max: 1280px; /* İÇERİK kutusu genişliği, mx-auto ile ortalanır */
--pad-shell: 24px; /* içerik kutusunun DIŞINDA, dar ekran koruması */
--gap-col: 40px; /* kolonlar arası */
```

Kabuk **full-bleed değildir**: dış sarmalayıcı `px-(--pad-shell)`, iç sarmalayıcı
`mx-auto max-w-(--shell-max)`. 1920px'lik ekranda her iki yanda 320px boşluk kalır.

4 kolon · 40px gap ile kolon genişliği **290px**: `(1280 − 3×40) / 4 = 290`

> **Faz 0 ölçüm tutanağı (design/\*.png, 1920×1426 artboard).** Kart bloğu hem
> `home.png` hem `about.png` içinde her satırda `x 320..1599`, yani **tam 1280px** —
> `--shell-max` doğrulandı. Ölçülen kolonlar 296 / 280 / 280 / 296 (ort. **288**),
> aradaki boşluklar 41 / 41 / 46 / 48 (ort. **44**). Sapma Figma'da elle yerleştirmeden
> gelen paydır; bağlayıcı karar "1280 içinde eşit dört kolon"dur, o yüzden `--gap-col`
> 40px'te bırakıldı ve kolon 290px'e türetildi (ölçümle fark %0,7).
>
> **Düzeltme:** önceki `(1280 − 2×24 − 3×40) / 4 = 278` türetimi yanlıştı —
> `--pad-shell`'i `--shell-max`'in içinden düşüyordu. `--pad-shell` içerik kutusunun
> dışındadır; 1280 zaten içeriğin kendisidir.
>
> Kolon genişliği hiçbir yerde elle yazılmaz — `grid-cols-4` + `--gap-col` türetir.

### 3.2 Dikey — artboard değil, oran

Artboard 1426px yüksekliğinde çizilmiştir. Bu bir viewport ölçüsü **değil**, çizim
alanıdır. Tasarım kararı oran; piksel, o oranın 1426'daki izdüşümüdür.

Gerçek bir 1920×1080 monitörde tarayıcı kromundan sonra ~950px viewport kalır. Mutlak
pikseller korunursa sabit kabuk (nav 140 + footer 140 + boşluklar + padding = 469px)
grid'e 480px bırakır ve Job Offers kartı (iki satırda ~410px) sığmaz. Oran korunursa
grid ~640px'e çıkar.

> **Faz 2 düzeltmesi — "oran korunursa sığar" cümlesi fazla iyimserdi.** Oran
> korunduğunda Job Offers kartı ~400px alıyor; içeriği (dört etiketli alan +
> buton) ~440px istiyor. Kutu oranla küçülüyor, içerik `rem` olduğu için
> küçülmüyor. Gerçek eşikler aşağıdaki tabloda ölçüldü.

```css
--h-nav: clamp(84px, 9.82dvh, 150px);
--h-footer: clamp(72px, 9.82dvh, 150px);
--gap-row: clamp(28px, 3.9dvh, 56px);
--gap-field: clamp(10px, 1.4dvh, 18px); /* form alanları arası */
--pad-shell-y: clamp(16px, 2.24dvh, 32px); /* kabuğun DIŞ dikey payı */
```

> **Faz 2 düzeltmesi.** Kabuğun dış dikey payı `--gap-row` değildir. Ölçüm
> (design/home.png): nav y=32'de başlıyor, footer y=1394'te bitiyor → 32/1426 =
> **%2.24**, satır boşluğunun (%3.9) yarısından az. İkisi aynı token'la
> yazıldığında 842px'lik bir viewport'ta 28px fazladan yeniyor ve Hero kartı
> içeriğini kırpıyordu. Satır boşlukları %3.9 kaldı; ayrışan yalnızca dış pay.

`clamp()` uçlarda saçmalamayı önler: 2160px monitörde nav 212px olmaz, 800px'te 78px'in
altına inmez.

Satır yükseklikleri `dvh` ile yazılmaz; grid template oranı taşır:
`grid-template-rows: 21fr 21fr 17fr` (anasayfada hero için `1.15fr 1fr 1fr`).
Kalan alanı grid kendisi böler.

**Dikey bütçe — Faz 2'de ölçülen gerçek (önemli):**

Tipografi `rem`, kabuk `dvh`. Yani viewport küçüldükçe kutular küçülür ama içerik
küçülmez. Anasayfada bunun iki eşiği var (ölçülen, tahmin değil):

| Ne                    | Tam sığdığı viewport | Altında ne olur                 |
| --------------------- | -------------------- | ------------------------------- |
| Hero kartı            | ≈ 870px              | son satır birkaç px kırpılır    |
| Job Offers dört alanı | ≈ 1000px             | alanlar kart içinde scroll eder |

1080p bir monitörde viewport ≈ 900–950px olduğu için **Job Offers alanları
normal şartlarda kart içinde scroll eder.** Bu bir bug değil, kırmızı çizgi 1'in
öngördüğü davranış: sayfa değil kartın içi scroll eder. "Send the Offer." butonu
scroll alanının dışında, tabana çakılıdır — kullanıcının göremediği buton,
olmayan butondur.

**Kritik sınır — pazarlığa kapalı:**
`dvh` yalnızca kabuk kromunda kullanılır (nav, footer, satır boşlukları, form alan aralığı).
**Tipografi, kart içi padding ve satır aralığı `rem` ve `clamp(…vw…)` kalır.** Yazı boyutunu
viewport yüksekliğine bağlamak, kısa ekranda metni okunamaz hale getirir ve erişilebilirlik
zeminini çökertir.

### 3.3 Kart içi

4px tabanlı ölçek: `4 8 12 16 20 24 32 40 48 64`.

```css
--radius-card: 24px; /* bento kart, nav, footer */
--radius-media: 12px; /* kapak görselleri */
--radius-inner: 10px; /* input, buton, rozet */
--radius-pill: 999px; /* avatar */

--pad-card: 28px; /* lg ve md kartlar */
--pad-card-sm: 20px; /* 1 kolonluk uydu kartlar */
```

Gölge **yok**. Yükseklik hissi renk farkıyla verilir (`bg` → `surface` → `elevated`).
Kenarlık `1px solid var(--color-border)`, hover'da `--color-border-strong`.

---

## 4. Hareket

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in: cubic-bezier(0.7, 0, 0.84, 0);

--dur-micro: 150ms; /* hover, focus */
--dur-ui: 250ms; /* açılır/kapanır, carousel */
--dur-rail: 500ms; /* ray konteyner taşınması */
--dur-swap: 380ms; /* ana bölge ve kart çapraz geçişi */
```

Hover 150 ms'i geçmez. Ray taşınması 500 ms'i geçmez.
`prefers-reduced-motion: reduce` → tüm süreler `0.01ms`, sadece opacity, taşıma iptal.
Navigasyon çalışmaya devam eder.

---

## 5. Kart sistemi

### 5.1 Temel

```
bg-surface  border border-border  rounded-[--radius-card]
flex flex-col  min-h-0  overflow-hidden
```

`min-h-0` kritik: grid child'ı olarak taşmayı engeller ve iç scroll'u mümkün kılar.

### 5.2 Boyut varyantları

Kolon sayısına bağlı, üç değer:

| `size` | Kolon | Genişlik    | Padding         | Başlık      | Gövde    | Kullanım                              |
| ------ | ----- | ----------- | --------------- | ----------- | -------- | ------------------------------------- |
| `sm`   | 1     | ~290px      | `--pad-card-sm` | `h-card`    | `body`   | **Tüm uydu kartlar** (anasayfa dahil) |
| `md`   | 2     | ~596px      | `--pad-card`    | `h-card`    | `body`   | Subscribe (anasayfa)                  |
| `lg`   | 3–4   | ~914–1232px | `--pad-card`    | `display-l` | `body-l` | Hero, ana bölge modülleri             |

Uydu kartlar anasayfada da rayda da **1 kolon**, yani aynı genişlikte. Anasayfaya özel bir
boyut yoktur; `ProjectsCard` her yerde `sm`'dir.

Bir kartın ikinci kopyasını yazmak yerine `size` ekle.

### 5.3 Kart iç düzeni

Kart başlığı **ortalanmış**, gövde sola hizalı. Alt linkler (`More ›`, `Repository ›`,
`Detail ›`) kartın altında ortalanmış ve `mt-auto` ile tabana itilmiş.

İstisna: repo ızgarası kartlarında "Repository ›" **sağ altta** (tasarımda öyle).

---

## 6. Bileşen kuralları

**Buton**

| Varyant   | Zemin          | Metin    | Kullanım                                  |
| --------- | -------------- | -------- | ----------------------------------------- |
| primary   | Figma'daki gri | `text`   | Send the Offer, Enter                     |
| secondary | `elevated`     | `text`   | Resume                                    |
| ghost     | şeffaf         | `text-2` | More, Detail, Repository, carousel okları |

Tüm tıklanabilirler: `cursor-pointer`, min 40×40px hit alanı, `--dur-micro` geçiş,
`focus-visible` ring. Disabled: `opacity-40 cursor-not-allowed`.

Primary butonun grisi ölçüldü: `--color-button: #999999`, metin beyaz.

**Input**

```
bg-field  border border-field-border  rounded-[--radius-inner]  px-3 py-2
placeholder:text-text-3  focus:border-accent focus:ring-1 focus:ring-accent
```

Alanlar arası boşluk `--gap-field`. Hata: `border-danger` + altta `text-danger text-micro`

- `aria-describedby`.

> **Faz 2 ölçüm tutanağı (design/home.png).** Bu bölümün önceki reçetesi
> `bg-elevated` + `border-border` diyordu; ikisi de tasarımla uyuşmuyor.
> Piksel örneklemesi: input zemini **#1b1b1b**, yani kart yüzeyinden (#242424)
> KOYU — alan yükseltilmiş değil, **çukur**. Kenarlık `--color-border`'ın
> saydam beyazı değil, tam **#999999** 1px. Figma bağlayıcı olduğu için
> `--color-field` ve `--color-field-border` token'ları eklendi.
>
> `py` 2.5'ten 2'ye indi: Job Offers kartı dört alan + butonu 1080p'de
> sığdıramıyordu (aşağıdaki dikey bütçe notu).

**Teknoloji rozetleri** (`TechBadges`)

- 18×18px, `text-3`, hover'da `text-2`
- Repo topic'lerinden ve `primaryLanguage`'dan türetilir (`config/tech-icons.ts`)
- En fazla 4 ikon; fazlası `+2` metni
- Her ikonda `<title>` ve `aria-label`
- Eşleşmeyen teknoloji için ikon uydurma — atla

**Kapak görseli**

- `rounded-[--radius-media]`, `object-cover`
- Last Project: kare (`aspect-square`)
- Repo ızgarası: geniş (`aspect-[16/7]`)
- Yükleniyor/hata durumunda `bg-elevated` düz blok — kırık görsel ikonu gösterme
- `next/image` + doğru `sizes`, `alt` = "{repo adı} önizleme görseli"

**Avatar** — `rounded-full`, `bg-elevated` fallback, `alt="Anıl Gündüz"`.

**Carousel**

- Oklar dikey ortada, kart kenarında, `ghost` buton
- `aria-label="Önceki proje"` / `"Sonraki proje"`
- Sol/sağ ok tuşu carousel odaktayken çalışır; deck'i tetiklemez
- Otomatik oynatma yok; tek öğe varsa oklar gizlenir (disabled değil)
- Aktif öğe `aria-live="polite"` bölgede duyurulur
- **İndeks `DraftProvider`'da tutulur** — kart unmount olsa da korunur

**Liste kartı** (Yazılar sayfası)

- Başlık accent + `h-item`, 2 satır clamp özet, "Go to **Detail**"
- Tüm kart tıklanabilir: başlıkta `<Link>` + kartta `::after` ile genişletilmiş alan.
  İç içe `<a>` kullanma
- Hover: `bg-surface-hover` + `border-strong`

**Sayfalama**

- Ortalanmış, `micro` tipografi
- `‹ Önceki  1 2 3  Sonraki ›` — aktif sayfa `text` + accent alt çizgi
- `<nav aria-label="Sayfalama">`, aktif öğede `aria-current="page"`
- Sınırda olan yön gizlenir

**Okuma ilerleme çubuğu**

- Makale kartının üst kenarında 2px, `bg-accent`, `transform: scaleX()`
- `role="progressbar"` + `aria-valuenow`
- Kart scroll'una bağlı (sayfa scroll'una değil)

**İkonlar** — Lucide. Emoji ikon olarak kullanılmaz. Sosyal marka ikonları inline SVG.

---

## 7. Yazı tonu

Arayüz metinleri İngilizce (tasarımdaki gibi), blog içerikleri Türkçe.

- Sistemin nasıl kurulduğunu değil, kullanıcının ne yaptığını adlandır
- Bir eylem akış boyunca aynı adı taşır: "Send the Offer." → "Offer sent."
- Boş durum bir davettir: "Henüz yazı yok." değil → "İlk yazı yolda. Abone ol, haber vereyim."
- Hata mesajı ne olduğunu ve nasıl düzeltileceğini söyler, özür dilemez

**Lorem ipsum yasak.** Gerçek metin yazılmadan bir bölüm "tamamlandı" sayılmaz.
