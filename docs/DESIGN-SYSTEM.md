# Tasarım Sistemi

Renk, tipografi ve spacing için **tek kaynak**. Bileşen dosyalarında ham hex, ham px veya
`text-gray-400` gibi Tailwind default'ları görünmemeli.

---

## 0. Yön: cesareti nereye harcıyoruz

Palet Figma'da sabit: near-black + tek asit yeşili. Bu kombinasyon şu an AI üretimi arayüzlerin
en yaygın üç görünümünden biri — kendi başına bir imza değil. Paleti değiştirmiyoruz çünkü brief
sabitlemiş; **ayırt ediciliği başka yerden çıkarıyoruz.**

**İmza öğe: taşınan uydu kartlar.** Beş ekran boyunca Projects, Writings, About Me, Job Offers
ve Subscribe kartları unmount olmadan yer değiştirir. Ray sağdan sola geçer, kartlar boyut
değiştirir, ana bölge içeriği çapraz geçişle değişir. Sitenin hatırlanacak tek hareketi budur.

Bunun dışında her şey sakin durur: hover 150 ms, gölge yok, gradient yok, parlama yok, scale yok.

**İkinci ayırt edici: sayısal tipografi.** Sayaç rakamları `tabular-nums` ile sabit genişlikte
akar; rakam ve birim iki farklı renkte set edilir (`11` beyaz, `Day.` gri), aralarında boşluk yok.

Chanel kuralı: her ekrandan bir aksesuar çıkar. Bir kartta hem ikon, hem rozet, hem ok, hem
"More" linki varsa biri fazladır.

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
aktif nav linki · repo/yazı başlıkları · "Do you want to work with me?" · "Portfolio Web Page"
vurgusu · GitHub kullanıcı adı · focus ring · okuma ilerleme çubuğu.

---

## 2. Tipografi

**Font (doğrulanacak):** Figma'daki başlık fontu geometrik grotesk. En yakın eşleşme
**Kumbh Sans**. Alternatifler: Space Grotesk, Outfit.

> **İlk iş:** Figma'da fontun gerçek adını oku ve buraya yaz. Ardından **Türkçe glif testi**:
> `ı İ ğ Ğ ş Ş ç Ç ö Ö ü Ü`. "Anıl Gündüz" doğru render edilmiyorsa font elenir.
> `latin-ext` subset'i şart.

```
Display : Kumbh Sans Variable  → başlıklar, sayaç, kart başlıkları
Body    : Inter Variable       → gövde, form, nav
Mono    : JetBrains Mono       → repo adları, teknoloji rozetleri, kod
```

`next/font/local` ile self-host et. Google Fonts CDN'i üretimde kullanma.

**Tip ölçeği:**

| Rol          | Boyut                        | Ağırlık | Satır | Harf aralığı | Nerede                                    |
| ------------ | ---------------------------- | ------- | ----- | ------------ | ----------------------------------------- |
| `display-xl` | `clamp(2rem, 3.2vw, 3rem)`   | 700     | 1.05  | -0.02em      | "Developer. Improver."                    |
| `display-l`  | `clamp(1.5rem, 2.2vw, 2rem)` | 700     | 1.15  | -0.015em     | "Summary", "Job History", yazı `<h1>`     |
| `h-card`     | `1.25rem`                    | 700     | 1.2   | -0.01em      | "Projects.", "Last Project.", "About Me." |
| `h-item`     | `1.0625rem`                  | 700     | 1.3   | 0            | repo adı, yazı başlığı (accent)           |
| `body-l`     | `1.0625rem`                  | 400     | 1.55  | 0            | hero tanıtımı, makale giriş paragrafı     |
| `body`       | `0.9375rem`                  | 400     | 1.6   | 0            | kart açıklamaları, makale gövdesi         |
| `label`      | `0.8125rem`                  | 500     | 1.4   | 0.01em       | form etiketleri, "Go to Live"             |
| `micro`      | `0.75rem`                    | 500     | 1.3   | 0.04em       | "More ›", "Repository ›", sayfalama       |

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
"Writings Heading!" gibi ünlem tasarımdaki placeholder'dır, gerçek başlıklarda taşıma.

**"Go to X" kalıbı.** `Go to` gri (`text-3`, `label`), hedef kelime beyaz ve bold:
`Go to **Live**` · `Go to **Writing.**` · `Go to **Detail**` · `Go to **Profile**`.
Tüm link tıklanabilir, sadece bold kısım değil.

---

## 3. Spacing ve geometri

4px tabanlı ölçek: `4 8 12 16 20 24 32 40 48 64`.

```css
--radius-card: 24px; /* bento kart, nav, footer */
--radius-media: 12px; /* kapak görselleri */
--radius-inner: 10px; /* input, buton, rozet */
--radius-pill: 999px; /* avatar */

--gap-grid: 20px;
--pad-card: 28px;
--pad-card-sm: 20px; /* 3 kolonluk ray kartları */
--pad-shell: 20px; /* sayfa kenar boşluğu */
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
--dur-travel: 500ms; /* uydu kart taşınması */
--dur-swap: 380ms; /* ana bölge çapraz geçişi */
```

Kural: hover 150 ms'i geçmez. Kart taşınması 500 ms'i geçmez.
`prefers-reduced-motion: reduce` → tüm süreler `0.01ms`, sadece opacity, taşıma animasyonu iptal
(kartlar anında yeni yerinde belirir). Navigasyon çalışmaya devam eder.

---

## 5. Kart sistemi

### 5.1 Temel

```
bg-surface  border border-border  rounded-[--radius-card]
flex flex-col  min-h-0  overflow-hidden
```

`min-h-0` kritik: grid child'ı olarak taşmayı engeller ve iç scroll'u mümkün kılar.

### 5.2 Boyut varyantları

Aynı bileşen üç boyutta yaşar. `size` prop'u ile:

| `size` | Kolon | Padding         | Başlık      | Gövde         | Kullanım                  |
| ------ | ----- | --------------- | ----------- | ------------- | ------------------------- |
| `sm`   | 3     | `--pad-card-sm` | `h-card`    | `body` 12.5px | Ray kartları              |
| `md`   | 3–6   | `--pad-card`    | `h-card`    | `body`        | Anasayfa kartları         |
| `lg`   | 9–12  | `--pad-card`    | `display-l` | `body-l`      | Hero, ana bölge modülleri |

Bir kartın ikinci bir kopyasını yazmak yerine `size` ekle. Beş sayfada beş `ProjectsCard`
dosyası varsa mimari yanlış kurulmuştur.

### 5.3 Kart iç düzeni

Kart başlığı **ortalanmış**, gövde sola hizalı. Alt linkler (`More ›`, `Repository ›`,
`Detail ›`) kartın altında **ortalanmış** ve `mt-auto` ile en alta itilmiş — kart yüksekliği
ne olursa olsun link tabana yapışır.

İstisna: repo ızgarası kartlarında "Repository ›" **sağ altta** (tasarımda öyle).

---

## 6. Bileşen kuralları

**Buton**

| Varyant   | Zemin      | Metin    | Kullanım                                  |
| --------- | ---------- | -------- | ----------------------------------------- |
| primary   | `accent`   | `bg`     | Send the Offer, Enter                     |
| secondary | `elevated` | `text`   | Resume                                    |
| ghost     | şeffaf     | `text-2` | More, Detail, Repository, carousel okları |

Tüm tıklanabilirler: `cursor-pointer`, min 40×40px hit alanı, `--dur-micro` geçiş,
`focus-visible` ring. Disabled: `opacity-40 cursor-not-allowed`.

**Input**

```
bg-elevated  border border-border  rounded-[--radius-inner]  px-3 py-2.5
placeholder:text-text-3  focus:border-accent focus:ring-1 focus:ring-accent
```

Hata: `border-danger` + altta `text-danger text-micro` + `aria-describedby`.

**Teknoloji rozetleri** (`TechBadges`)
Tasarımda repo kartlarında üç küçük ikon: Next.js, TypeScript, Tailwind.

- 18×18px, `text-3`, hover'da `text-2`
- Repo topic'lerinden ve `primaryLanguage`'dan türetilir, eşleme `config/tech-icons.ts`
- En fazla 4 ikon; fazlası `+2` şeklinde metin
- Her ikonda `<title>` ve `aria-label` (teknoloji adı)
- Eşleşmeyen teknoloji için ikon uydurma — atla

**Kapak görseli**

- `rounded-[--radius-media]`, `object-cover`
- Last Project: kare (`aspect-square`, ~140px)
- Repo ızgarası: geniş (`aspect-[16/7]`)
- Yükleniyor/hata durumunda `bg-elevated` düz blok — kırık görsel ikonu gösterme
- `next/image` + `sizes` doğru verilmeli, `alt` = "{repo adı} önizleme görseli"

**Avatar**

- `rounded-full`, `bg-elevated` fallback
- Hero'da ~120px, GitHub profil kartında ~110px
- `alt="Anıl Gündüz"` (dekoratif değil, kimlik bildiriyor)

**Carousel** (Projects ve Writings kartlarında)

- Oklar dikey ortada, kartın sol/sağ kenarında, `ghost` buton
- `aria-label="Önceki proje"` / `"Sonraki proje"`
- Sol/sağ ok tuşu carousel odaktayken çalışır; deck navigasyonunu tetiklemez
- Otomatik oynatma **yok**
- Tek öğe varsa oklar gizlenir (disabled değil, gizli)
- Aktif öğe `aria-live="polite"` bölgede duyurulur

**Liste kartı** (Yazılar sayfasındaki 3 kart)

- Başlık accent + `h-item`, altında 2 satır clamp özet, altında "Go to **Detail**"
- Tüm kart tıklanabilir: `<article>` içinde başlıkta `<Link>` + kartta `::after` ile
  genişletilmiş tıklama alanı. İç içe `<a>` kullanma
- Hover: `bg-surface-hover` + `border-strong`

**Sayfalama**

- Ortalanmış, `micro` tipografi
- `‹ Önceki  1 2 3  Sonraki ›` — aktif sayfa `text` + accent alt çizgi, diğerleri `text-3`
- `<nav aria-label="Sayfalama">`, aktif öğede `aria-current="page"`
- Sınırda olan yön gizlenir

**Okuma ilerleme çubuğu**

- Makale kartının üst kenarında 2px, `bg-accent`, `transform: scaleX()` ile
- `role="progressbar"` + `aria-valuenow`
- Kart scroll'una bağlı (sayfa scroll'una değil — sayfa scroll etmiyor)

**İkonlar** — Lucide. Emoji ikon olarak kullanılmaz. Sosyal marka ikonları inline SVG
(paket import etme, yalnızca gereken 7 path).

---

## 7. Yazı tonu

Arayüz metinleri İngilizce (tasarımdaki gibi), blog içerikleri Türkçe.

- Sistemin nasıl kurulduğunu değil, kullanıcının ne yaptığını adlandır: "Submit" değil → "Send the Offer."
- Bir eylem akış boyunca aynı adı taşır: "Send the Offer." → "Offer sent."
- Boş durum bir davettir: "Henüz yazı yok." değil → "İlk yazı yolda. Abone ol, haber vereyim."
- Hata mesajı ne olduğunu ve nasıl düzeltileceğini söyler.

**Lorem ipsum yasak.** Gerçek metin yazılmadan bir bölüm "tamamlandı" sayılmaz.
