# Etkileşim Spesifikasyonu

Projenin en riskli üç parçası burada: **scroll ile ekran geçişi**, **scroll etmeyen bento
düzen** ve **uydu kartların taşınması**. Üçü de yanlış yapıldığında siteyi kullanılamaz kılar.

---

## 1. Kabuk

```tsx
<div className="h-[100dvh] overflow-hidden flex flex-col gap-5 p-5">
  <Nav /> {/* auto yükseklik */}
  <div className="flex-1 min-h-0 grid grid-cols-12 grid-rows-3 gap-5">
    <SatelliteRail /> {/* grid-area manifest'ten */}
    <main id="main">{children}</main> {/* grid-area manifest'ten */}
  </div>
  <Footer /> {/* auto yükseklik */}
</div>
```

- `100dvh`, `100vh` değil — mobil tarayıcı çubuğu kaymasını önler
- `overflow-hidden` gövdede
- `flex-1 min-h-0` → grid'in taşmadan sığması için `min-h-0` şart
- Grid **3 satır**: `grid-rows-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]`
  Kartlar 1, 2 veya 3 satır kaplar; yükseklik ekrandan gelir, `min-height`'tan değil
- Her kart `overflow-hidden`; taşan içerik için iç `[data-scrollable]`

Anasayfa istisnası: `grid-rows-[1.15fr_1fr_1fr]` — hero biraz daha yüksek.

---

## 2. Grid haritaları

12 kolon · 3 satır · 20px gap. `grid-area` değerleri `config/page-manifest.ts`'te.

### 2.1 Anasayfa `/`

```
      1    2    3    4    5    6    7    8    9   10   11   12
    ┌───────────────────── NAV ──────────────────────────────┐
    ├────────────────────────────────────────────────────────┤
r1  │              HERO (1/1/2/13)                           │
    ├──────────┬─────────────────┬─────────────┬─────────────┤
r2  │ About Me │    Projects     │  Writings   │  Job Offers │
    │ 2/1/4/4  │    2/4/3/7      │  2/7/3/10   │  2/10/4/13  │
r3  │          ├─────────────────┴─────────────┤             │
    │          │      Subscribe  3/4/4/10      │             │
    └──────────┴───────────────────────────────┴─────────────┘
    ┌──────────────────── FOOTER ────────────────────────────┐
```

Not: bu sayfada teknik olarak "ray" yoktur; beş kart doğrudan grid'e yerleşir.
Manifest yine de aynı `rail` dizisini kullanır — böylece diğer sayfalara geçişte
`layout` animasyonu kesintisiz çalışır.

### 2.2 Hakkımda `/hakkimda`

```
r1  │        HERO (1/1/2/10)              │  Projects 1/10/2/13 │
    ├─────────────────────────────────────┼─────────────────────┤
r2  │                                     │                     │
    │   Summary + Job History             │   Job Offers        │
r3  │        (2/1/4/10)                   │   (2/10/4/13)       │
```

Ray **sağda**. Hero anasayfadan buraya taşınırken 12 kolondan 9 kolona daralır —
`layout` animasyonu bunu kendisi halleder, elle genişlik animasyonu yazma.

### 2.3 Projeler `/projeler`

```
r1  │ Writings 1/1/2/4 │      Last Project (1/4/2/13)         │
    ├──────────────────┼──────────────────┬───────────────────┤
r2  │                  │   Repo A         │   Repo B          │
    │  About Me        │   (nested 2-col subgrid)             │
    │  (2/1/4/4)       ├──────────────────┴───────────────────┤
r3  │                  │      GitHub Profile                  │
```

Ray **solda** — tek sayfa. Bu geçiş sitenin en gösterişli anı: kartlar ekranın bir
yanından diğerine kayar.

Ana bölge içi: `grid grid-rows-[1fr_1.2fr_0.9fr] gap-5`, orta satırda
`grid grid-cols-2 gap-5` alt grid.

### 2.4 Yazılar `/blog`

```
r1  │      Last Writing (1/1/2/10)        │  Projects 1/10/2/13 │
    ├─────────────────────────────────────┼─────────────────────┤
r2  │   Post 1                            │                     │
    │   Post 2                            │   Job Offers        │
r3  │   Post 3                            │   (2/10/4/13)       │
    │   ── Sayfalama ──                   │                     │
```

Ana bölge içi: `flex flex-col gap-5` + en altta `mt-auto` sayfalama.
Üç kart eşit yükseklikte (`flex-1`), açıklamalar `line-clamp-2`.

### 2.5 Yazı Detay `/blog/[slug]`

```
r1  │                                     │  Subscribe 1/10/2/13│
    │        MAKALE (1/1/4/10)            ├─────────────────────┤
r2  │        data-scrollable              │                     │
    │                                     │   About Me          │
r3  │                                     │   (2/10/4/13)       │
```

Makale kartı üç satırın tamamını kaplar ve içi scroll eder.

### 2.6 İçerik sığmazsa

Öncelik sırası — yukarıdan aşağı dene:

1. Metni `line-clamp` ile kırp (kart açıklamaları 2–3 satır)
2. Kart içine `data-scrollable` alan koy
3. `clamp()` tipografiyle küçült
4. Deck modunu kapat, normal scroll'a düş (ekran yüksekliği < 700px)

**Asla:** metni koşullu render ile DOM'dan çıkarma (SEO), `font-size` 13px altına inme.

### 2.7 Kırılım noktaları

| Genişlik    | Davranış                                           |
| ----------- | -------------------------------------------------- |
| ≥ 1280px    | 12 kolon, ray + ana bölge, deck aktif              |
| 1024–1279px | 12 kolon, sıkışık spacing, deck aktif              |
| 768–1023px  | Ray ana bölgenin altına iner, 2 kolon, deck kapalı |
| < 768px     | Tek kolon yığın, deck kapalı                       |

Mobil kart sırası (her sayfada): **ana bölge önce, uydu kartlar sonra.**
Anasayfada: Hero → Projects → Writings → About Me → Job Offers → Subscribe.
Mobil kullanıcı önce işi görmeli, formu değil.

---

## 3. İmza: uydu kartların taşınması

### 3.1 Prensip

Sayfa değişiminde iki farklı hareket eşzamanlı olur:

| Bölge         | Hareket                         | Süre                   |
| ------------- | ------------------------------- | ---------------------- |
| Uydu kartlar  | Konum + boyut geçişi (`layout`) | 500 ms                 |
| Ana bölge     | Çapraz geçiş (`opacity` + `y`)  | 380 ms                 |
| Kaybolan kart | `opacity → 0`, `scale → 0.96`   | 200 ms                 |
| Beliren kart  | `opacity → 1`, `y: 12 → 0`      | 300 ms, 120 ms gecikme |

Kaybolan kart önce gider, sonra kalanlar yerleşir, en son yeni kart gelir.
Bu sıra karışıklığı önler: kullanıcı üç şeyin aynı anda hareket ettiğini görmemeli.

### 3.2 Uygulama

```tsx
// src/components/shell/SatelliteRail.tsx  ("use client")
export function SatelliteRail({ repos, posts }: Props) {
  const pathname = usePathname();
  const manifest = resolveManifest(pathname);
  const reduced = useReducedMotion();

  return (
    <AnimatePresence mode="popLayout">
      {manifest.rail.map(({ id, area, size }) => (
        <motion.div
          key={id} // SABİT — pathname ekleme!
          layout={!reduced}
          layoutId={id}
          style={{ gridArea: area }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{
            layout: { duration: reduced ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] },
            opacity: { duration: 0.3, delay: 0.12 },
          }}
        >
          {renderCard(id, size, { repos, posts })}
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
```

### 3.3 Bu animasyonun bilinen tuzakları

**`key` tuzağı.** `key={id}` sabit kalmalı. `key={pathname + id}` yazarsan her sayfada kart
yeniden doğar, `layout` animasyonu çalışmaz ve tüm sistemin anlamı kaybolur.

**Metin bozulması.** `layout` animasyonu sırasında Motion elemanı `transform: scale` ile
gerdiği için içerideki metin geçici olarak eziliyor gibi görünür. Çözüm: kart içeriğini
`<motion.div layout="position">` ile sar — konum animasyonu olur, ölçek olmaz.

**Grid + layout.** `grid-area` değişimi `layout` ile animasyona girer ama `gap` değişimi
girmez. Gap'i tüm sayfalarda sabit tut (20px), değiştirme.

**Carousel durumu.** Kart taşındığında carousel indeksi korunur (kart unmount olmadığı için).
Bu istenen davranıştır — kullanıcı 3. projeye bakıyordu, sayfa değişti, hâlâ 3. projede.

**Performans.** `layout` animasyonu her frame'de layout okuması yapar. Aynı anda 2–3 karttan
fazlası taşınmamalı. Manifest'te bir sayfada 3'ten fazla ray kartı olmasın.

### 3.4 Ana bölge geçişi

```tsx
// src/app/template.tsx
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
      className="contents"
    >
      {children}
    </motion.div>
  );
}
```

Ana bölge içindeki modüller (Last Project, Repo A/B, GitHub Profile) `staggerChildren: 60ms`
ile kademeli girer. Kademe yönü: yukarıdan aşağı.

**Yapma:** blur filtresi (GPU pahalı), 3D rotate, sayfa boyu slide.

---

## 4. Deck navigasyonu

### 4.1 Sıra

```ts
export const DECK = ["/", "/hakkimda", "/projeler", "/blog"] as const;
```

`/blog/[slug]` deck'in dışındadır ve orada dinleyici **hiç kurulmaz**.

Deck sonu (`/blog`'da aşağı, `/`'da yukarı): geçiş yok. Kabuk 8px'lik yumuşak bir
rubber-band hareketi yapar ve geri döner — kullanıcı sınıra geldiğini anlar.
Döngü (`/blog` → `/`) **yok**; nerede olduğunu kaybettirir.

### 4.2 Ne zaman aktif

```ts
const isDeckMode =
  matchMedia("(min-width: 1024px)").matches &&
  matchMedia("(pointer: fine)").matches &&
  matchMedia("(min-height: 700px)").matches;
```

- `pointer: fine` → dokunmatikte kapalı; tablette wheel yakalamak felakettir
- `min-height: 700px` → kısa ekranda içerik sığmıyorsa normal scroll'a düş.
  **İçerik erişilemez kalmaktansa tasarım bozulur.** Pazarlığa kapalı.

`matchMedia` listener'ı ile canlı izlenir; pencere küçülünce mod anında değişir.

### 4.3 Wheel yakalama

Trackpad'in tuzağı **momentum**: tek kaydırma 40–60 event üretir ve azalarak devam eder.
Naif `deltaY > 0` kontrolü tek hareketle üç ekran atlatır.

Üç katmanlı çözüm:

1. **Eşik** — birikmiş `deltaY` mutlak değeri 120'yi geçmeden tetikleme
2. **Kilit** — tetikleme sonrası ~700 ms yeni tetikleme yok (500 ms animasyon + 200 ms pay)
3. **Momentum sönümü** — `|deltaY|` bir önceki event'ten küçükse birikim sıfırlanır

```ts
// src/hooks/useDeckNavigation.ts  ("use client")
export function useDeckNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const reduced = useReducedMotion();
  const lock = useRef(false);
  const acc = useRef(0);
  const lastAbs = useRef(0);

  const go = useCallback(
    (dir: 1 | -1) => {
      const i = DECK.indexOf(pathname as (typeof DECK)[number]);
      if (i === -1 || lock.current) return;
      const next = DECK[i + dir];
      if (!next) {
        bounce(dir);
        return;
      } // deck sonu

      lock.current = true;
      acc.current = 0;
      router.push(next);
      setTimeout(
        () => {
          lock.current = false;
        },
        reduced ? 100 : 700,
      );
    },
    [pathname, router, reduced],
  );

  useEffect(() => {
    if (!isDeckMode() || !DECK.includes(pathname as never)) return;

    const onWheel = (e: WheelEvent) => {
      if ((e.target as HTMLElement).closest("[data-scrollable]")) return;
      e.preventDefault();
      if (lock.current) return;

      const abs = Math.abs(e.deltaY);
      if (abs < lastAbs.current) acc.current = 0; // momentum sönüyor
      lastAbs.current = abs;

      acc.current += e.deltaY;
      if (Math.abs(acc.current) >= 120) go(acc.current > 0 ? 1 : -1);
    };

    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.matches("input, textarea, select, [contenteditable]")) return;
      if (t.closest("[data-scrollable]")) return;
      if (["PageDown", "ArrowDown", " "].includes(e.key)) {
        e.preventDefault();
        go(1);
      }
      if (["PageUp", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        go(-1);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [go, pathname]);
}
```

`{ passive: false }` zorunlu — `preventDefault` başka türlü çalışmaz.
Chrome'un "non-passive listener" uyarısı burada kasıtlıdır.

### 4.4 Kart içi scroll ile çakışma

`data-scrollable` taşıyan alanlarda wheel handler devreye girmez. Kart içi scroll sona
geldiğinde deck'e devretmek **yapılmaz** — öngörülemez hissettirir.

Carousel okları da deck'i tetiklememeli: sol/sağ ok tuşları yalnızca carousel odaktayken
çalışır, deck yukarı/aşağı tuşlarını kullanır. Çakışma yok.

### 4.5 Erişilebilirlik

- Nav linkleri gerçek `<Link>` — klavye ve ekran okuyucu için tek doğru yol
- Sağ (Projeler'de sol) kenarda dikey nokta göstergesi: 4 nokta, aktif olan accent,
  tıklanabilir, `aria-current="page"`
- Route değişiminde `<main>`'e focus taşınır; `aria-live="polite"` bölgede sayfa adı duyurulur
- `prefers-reduced-motion` → sadece opacity, 100 ms, kilit 100 ms

### 4.6 Prefetch

`<Link prefetch>` nav için otomatik. Ek olarak sayfa mount olduğunda komşu route'lar
prefetch edilir:

```ts
useEffect(() => {
  const i = DECK.indexOf(pathname as never);
  DECK[i + 1] && router.prefetch(DECK[i + 1]);
  DECK[i - 1] && router.prefetch(DECK[i - 1]);
}, [pathname]);
```

---

## 5. Yazı detay sayfası

Deck kapalı, makale kartı scroll ediyor.

### 5.1 Wheel yönlendirme

Kullanıcı imleci kartın üstüne getirmek zorunda kalmamalı:

```ts
// src/hooks/useProxiedWheel.ts  ("use client")
export function useProxiedWheel(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const el = ref.current;
      if (!el || el.contains(e.target as Node)) return; // zaten kartın içinde
      e.preventDefault();
      el.scrollBy({ top: e.deltaY });
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [ref]);
}
```

Ray kartlarının (Subscribe formu, sayaç) üzerindeyken de makale kayar — bu doğru davranıştır,
o kartların kendi scroll'u yok.

### 5.2 Diğer kurallar

- Üst kenarda 2px okuma ilerleme çubuğu, kart scroll'una bağlı, `role="progressbar"`
- `Esc` → `/blog`'a döner
- Makale `<article tabIndex={0} role="region" aria-label="Yazı içeriği">` — klavyeden
  odaklanılır, `PageDown` kart içinde çalışır
- İçindekiler uzun yazılarda kart içinde sticky; 768px altında gizli
- Ekran yüksekliği < 700px → deck kabuğu kapanır, sayfa normal scroll'a döner
- Makale > 2000 kelime → kart başında "Tam ekran oku" (`?reader=1`): ray gizlenir,
  makale 12 kolona yayılır

---

## 6. Sayfalama (`/blog`)

- Sayfalama **tıklamayla** çalışır. Wheel aşağı deck sonudur, sayfa 2'ye geçmez.
  Aynı jestin iki anlamı olması kullanıcıyı kaybettirir.
- Sayfa değişimi ana bölgeyi yeniden render eder; **ray sabit kalır** (aynı route, aynı manifest).
  Ana bölge modülleri `key={page}` ile çapraz geçiş yapar.
- Sayfalama linkleri gerçek `<Link href="/blog?page=2">` — JS kapalıyken çalışır
- Sınırda olan yön gizlenir (disabled değil)
- Sayfa değişince `<main>`'e focus taşınır, ekran okuyucuya "Sayfa 2" duyurulur

---

## 7. Sayaç (`AboutMeCard`)

Hidrasyon uyumsuzluğu buranın klasik tuzağı.

```tsx
"use client";
export function TimeSpent({ since }: { since: string }) {
  const [t, setT] = useState<Elapsed | null>(null); // sunucuda null

  useEffect(() => {
    const tick = () => setT(diff(since));
    tick();
    const id = setInterval(tick, 1000);
    const onVis = () => (document.hidden ? clearInterval(id) : tick());
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [since]);

  return (
    <dl aria-live="off" className="tabular-nums">
      {UNITS.map((u) => (
        <div key={u}>
          <dd className="counter-value">{t ? t[u] : "––"}</dd>
          <dt className="counter-unit">{LABEL[u]}</dt>
        </div>
      ))}
    </dl>
  );
}
```

- Sunucuda `––` placeholder → hidrasyon uyumsuzluğu yok
- `tabular-nums` → rakam değişirken layout kaymaz (CLS = 0)
- `aria-live="off"` → ekran okuyucu her saniye okumaya kalkmaz
- Sekme arkaplandayken interval durur; geri dönünce doğru değere atlar
- **Kart kalıcı olduğu için sayaç sayfa değişiminde sıfırlanmaz** — bu, kalıcı kabuk
  mimarisinin görünür faydasıdır

---

## 8. Hover ve mikro etkileşim

| Öğe                   | Hover                                     | Süre   |
| --------------------- | ----------------------------------------- | ------ |
| Bento kart            | `border-color` → `border-strong`          | 150 ms |
| Liste/repo kartı      | `bg` → `surface-hover` + `border-strong`  | 150 ms |
| Nav link              | `color` → `text`                          | 150 ms |
| Primary buton         | `bg` → `accent-hover`, `translateY(-1px)` | 150 ms |
| Sosyal ikon           | `color` → `accent`                        | 150 ms |
| Teknoloji rozeti      | `text-3` → `text-2`                       | 150 ms |
| "More ›" / "Detail ›" | `color` → `text`, ok `translateX(2px)`    | 150 ms |

Kart hover'ında `scale` **kullanma** — altı kart aynı anda nefes alıyormuş gibi görünür.
Sitenin sakinliği kasıtlıdır.

---

## 9. Test kontrol listesi

**Deck**

- [ ] Trackpad'de tek kaydırma = tek ekran geçişi (3 farklı hızda)
- [ ] Fare tekerleği tek klik = tek ekran geçişi
- [ ] Hızlı arka arkaya kaydırma ekran atlatmıyor
- [ ] `/blog`'da aşağı → rubber-band, geçiş yok
- [ ] Tarayıcı geri/ileri doğru çalışıyor
- [ ] URL doğrudan yapıştırılınca doğru ekran açılıyor

**Kart taşınması**

- [ ] `/` → `/hakkimda`: Projects ve Job Offers kartları sağ raya kayıyor, yeniden doğmuyor
- [ ] `/hakkimda` → `/projeler`: ray sağdan sola geçiyor
- [ ] Carousel 3. projedeyken sayfa değişince hâlâ 3. projede
- [ ] Sayaç sayfa değişiminde sıfırlanmıyor
- [ ] Taşınma sırasında kart içi metin ezilmiyor
- [ ] Job Offers formuna yazı yazılmışken sayfa değişince metin duruyor

**Yazı detay**

- [ ] Sayfanın herhangi bir yerinde wheel makaleyi kaydırıyor
- [ ] Okuma çubuğu kart scroll'uyla dolduruyor
- [ ] `Esc` `/blog`'a dönüyor
- [ ] Deck navigasyonu kapalı

**Genel**

- [ ] 1280×720'de scroll çubuğu yok
- [ ] 1366×768'de içerik sığıyor veya normal scroll'a düşüyor
- [ ] JS kapalıyken nav, sayfalama ve formlar çalışıyor
- [ ] Klavyeyle tüm site gezilebiliyor, focus her zaman görünür
- [ ] `prefers-reduced-motion` açıkken geçişler anlık, navigasyon çalışıyor
- [ ] VoiceOver/NVDA ile sayfa değişimi duyuruluyor
- [ ] Kart içi scroll alanında wheel deck'i tetiklemiyor
