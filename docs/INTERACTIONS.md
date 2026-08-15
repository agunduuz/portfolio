# Etkileşim Spesifikasyonu

Projenin en riskli üç parçası burada: **scroll ile ekran geçişi**, **scroll etmeyen bento
düzen** ve **rayın taraf değiştirmesi**. Üçü de yanlış yapıldığında siteyi kullanılamaz kılar.

---

## 1. Kabuk

```tsx
<div
  className="mx-auto flex h-[100dvh] max-w-[--shell-max] flex-col overflow-hidden px-[--pad-shell]"
  style={{ gap: "var(--gap-row)" }}
>
  <Nav className="h-[--h-nav] shrink-0" />
  <div
    className="grid min-h-0 flex-1 grid-cols-4"
    style={{ columnGap: "var(--gap-col)", rowGap: "var(--gap-row)" }}
  >
    <SatelliteRail /> {/* grid-area manifest'ten */}
    <main id="main">{children}</main> {/* grid-area manifest'ten */}
  </div>
  <Footer className="h-[--h-footer] shrink-0" />
</div>
```

- `100dvh`, `100vh` değil — mobil tarayıcı çubuğu kaymasını önler
- Kabuk **ortalanmış ve sınırlı**: `mx-auto max-w-[1280px]`. Full-bleed değil.
- `overflow-hidden` kabukta
- `flex-1 min-h-0` → grid'in taşmadan sığması için `min-h-0` şart
- Nav ve footer yükseklikleri `dvh` clamp token'ından; mutlak px yazma
- Grid **4 kolon · 3 satır**: `grid-template-rows: 21fr 21fr 17fr`
- Anasayfa istisnası: `1.15fr 1fr 1fr` — hero biraz daha yüksek
- Her kart `overflow-hidden`; taşan içerik için iç `[data-scrollable]`

Sabit kabuk toplamı 950px viewport'ta ≈ 318px (nav 93 + footer 93 + 4×`gap-row` 37 + padding),
grid'e ~630px kalır. Job Offers kartının iki satırda istediği ~410px sığar.

---

## 2. Grid haritaları

4 kolon · 3 satır. `grid-area` değerleri `config/page-manifest.ts`'te,
`satır-başı / kolon-başı / satır-sonu / kolon-sonu` biçiminde.

### 2.1 Anasayfa `/`

```
        1          2          3          4
    ┌──────────────── NAV ──────────────────┐
r1  │            HERO  1/1/2/5              │
    ├──────────┬──────────┬──────────┬──────┤
r2  │ About Me │ Projects │ Writings │ Job  │
    │ 2/1/4/2  │ 2/2/3/3  │ 2/3/4/4  │Offers│
r3  │          ├──────────┴──────────┤2/4/4/5
    │          │ Subscribe 3/2/4/4   │      │
    └──────────┴─────────────────────┴──────┘
    ┌─────────────── FOOTER ────────────────┐
```

Teknik olarak bu sayfada "ray" yoktur; beş kart doğrudan grid'e yerleşir.
Manifest yine de aynı `rail` dizisini kullanır.

### 2.2 Hakkımda `/hakkimda` — ray sağda

```
r1  │        HERO  1/1/2/4              │ Projects 1/4/2/5 │
    ├───────────────────────────────────┼──────────────────┤
r2  │                                   │                  │
    │   Summary + Job History           │  Job Offers      │
r3  │        2/1/4/4                    │  2/4/4/5         │
```

### 2.3 Projeler `/projeler` — ray **solda**

```
r1  │ Writings 1/1/2/2 │   Last Project  1/2/2/5          │
    ├──────────────────┼──────────────┬───────────────────┤
r2  │                  │   Repo A     │   Repo B          │
    │  About Me        │   (2 kolonluk alt grid)          │
    │  2/1/4/2         ├──────────────┴───────────────────┤
r3  │                  │   GitHub Profile                 │
```

Ana bölge içi: `grid grid-rows-[1fr_1.2fr_0.9fr]`, orta satırda `grid-cols-2` alt grid.

### 2.4 Yazılar `/blog` — ray sağda

```
r1  │   Last Writing  1/1/2/4           │ Projects 1/4/2/5 │
    ├───────────────────────────────────┼──────────────────┤
r2  │   Post 1                          │                  │
    │   Post 2                          │  Job Offers      │
r3  │   Post 3                          │  2/4/4/5         │
    │   ── Sayfalama ──                 │                  │
```

Ana bölge içi: `flex flex-col` + `gap-[--gap-row]` + en altta `mt-auto` sayfalama.
Üç kart eşit yükseklikte (`flex-1`), özetler `line-clamp-2`.

### 2.5 Yazı Detay `/blog/[slug]` — ray sağda

```
r1  │                                   │ Subscribe 1/4/2/5│
    │      MAKALE  1/1/4/4              ├──────────────────┤
r2  │      data-scrollable              │                  │
    │                                   │  About Me        │
r3  │                                   │  2/4/4/5         │
```

### 2.6 İçerik sığmazsa

Öncelik sırası:

0. **Kabuk kroması zaten `dvh` ile ölçekleniyor — ek küçültme yapma.**
1. Metni `line-clamp` ile kırp (kart açıklamaları 2–3 satır)
2. Kart içine `data-scrollable` alan koy
3. `clamp(…vw…)` tipografiyle küçült — **`dvh` ile değil**
4. Deck modunu kapat, normal scroll'a düş (viewport < 800px)

**Asla:** metni koşullu render ile DOM'dan çıkarma (SEO), `font-size` 13px altına inme.

### 2.7 Kırılım noktaları

| Genişlik    | Davranış                                           |
| ----------- | -------------------------------------------------- |
| ≥ 1280px    | 4 kolon, ray + ana bölge, deck aktif               |
| 1024–1279px | 4 kolon, `gap-col` daralır, deck aktif             |
| 768–1023px  | 2 kolon, ray ana bölgenin altına iner, deck kapalı |
| < 768px     | 1 kolon yığın, deck kapalı                         |

Mobil kart sırası: **ana bölge önce, uydu kartlar sonra.**
Anasayfada: Hero → Projects → Writings → About Me → Job Offers → Subscribe.

---

## 3. İmza: rayın taraf değiştirmesi

### 3.1 Gerçek durum

Ray kart kümeleri:

| Sayfa          | Ray içeriği                           |
| -------------- | ------------------------------------- |
| `/`            | (ray yok — beş kart doğrudan grid'de) |
| `/hakkimda`    | Projects, Job Offers                  |
| `/projeler`    | Writings, About Me                    |
| `/blog`        | Projects, Job Offers                  |
| `/blog/[slug]` | Subscribe, About Me                   |

**Ardışık sayfalarda kesişim yok** (About→Projeler, Projeler→Blog, Blog→Detay).
Gerçek kart taşınması yalnızca **Home ↔ About** arasında olur (Projects, Job Offers ortak).

Bu yüzden hareket kartlardan değil, **konteynerden** gelir. `SatelliteRail`
`layout.tsx`'te yaşar ve hiç unmount olmaz; `grid-area`'sı değiştiğinde `layout`
animasyonuyla ekranın bir yanından diğerine kayar.

### 3.2 Zamanlama

| Bölge                    | Hareket                        | Süre                   |
| ------------------------ | ------------------------------ | ---------------------- |
| **Ray konteyneri**       | `grid-area` geçişi (`layout`)  | 500 ms                 |
| Kaybolan kart            | `opacity → 0`, `scale → 0.96`  | 200 ms                 |
| Beliren kart             | `opacity → 1`, `y: 12 → 0`     | 300 ms, 120 ms gecikme |
| Ana bölge                | Çapraz geçiş (`opacity` + `y`) | 380 ms                 |
| Home↔About ortak kartlar | `layoutId` ile taşınma         | 500 ms                 |

Sıra: kaybolan kart önce gider, konteyner kayar, en son yeni kart gelir.
Kullanıcı üç şeyin aynı anda hareket ettiğini görmemeli.

### 3.3 Uygulama

```tsx
// src/components/shell/SatelliteRail.tsx  ("use client")
export function SatelliteRail({
  children,
}: {
  children: Record<CardId, ReactNode>;
}) {
  const pathname = usePathname();
  const manifest = resolveManifest(pathname);
  const reduced = useReducedMotion();

  return (
    <motion.aside
      layout={!reduced}
      className="contents"
      transition={{ layout: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
    >
      <AnimatePresence mode="popLayout">
        {manifest.rail.map(({ id, area }) => (
          <motion.div
            key={id} // SABİT — pathname ekleme!
            layoutId={id} // Home↔About ortak kartları için
            style={{ gridArea: area }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{
              layout: { duration: reduced ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.3, delay: 0.12 },
            }}
          >
            <motion.div layout="position">{children[id]}</motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.aside>
  );
}
```

Kart içerikleri `children` üzerinden Server Component olarak gelir; yalnızca sarmalayıcı
client'tır (`CLAUDE.md` → çalışma kuralları).

### 3.4 Bilinen tuzaklar

**`key` tuzağı — bu projenin en pahalı hatası.** `key={id}` sabit kalmalı.
`key={pathname + id}` yazarsan Home↔About taşınması da çalışmaz ve `AnimatePresence`
exit animasyonu tetiklenmez.

**Metin bozulması.** `layout` animasyonu sırasında Motion elemanı `transform: scale` ile
gerer, içerideki metin geçici olarak ezilir. Çözüm: kart içeriğini `layout="position"`
ile sar — yukarıdaki kodda var, kaldırma.

**Grid + layout.** `grid-area` değişimi animasyona girer ama `gap` değişimi girmez.
`--gap-col` ve `--gap-row` tüm sayfalarda sabit kalır.

**Performans.** `layout` animasyonu her frame'de layout okur. Aynı anda 3'ten fazla
eleman taşınmamalı. Manifest'te bir sayfada 2 ray kartı var — bu sınır rahat.

### 3.5 Ana bölge geçişi

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

Ana bölge modülleri (Last Project, Repo A/B, GitHub Profile) `staggerChildren: 60ms`
ile yukarıdan aşağı kademeli girer.

**Yapma:** blur filtresi (GPU pahalı), 3D rotate, sayfa boyu slide.

---

## 4. Deck navigasyonu

### 4.1 Sıra

```ts
export const DECK = ["/", "/hakkimda", "/projeler", "/blog"] as const;
```

`/blog/[slug]` deck'in dışındadır; orada dinleyici **hiç kurulmaz**.

Deck sonu (`/blog`'da aşağı, `/`'da yukarı): geçiş yok. Kabuk 8px'lik yumuşak bir
rubber-band hareketi yapar. Döngü (`/blog` → `/`) **yok**.

### 4.2 Ne zaman aktif

```ts
const isDeckMode =
  matchMedia("(min-width: 1024px)").matches &&
  matchMedia("(pointer: fine)").matches &&
  matchMedia("(min-height: 800px)").matches;
```

- `pointer: fine` → dokunmatikte kapalı; tablette wheel yakalamak felakettir
- `min-height: 800px` → `clamp()`'in alt sınırı burada tutuyor. Altında normal scroll.
  **İçerik erişilemez kalmaktansa deck kapanır.** Pazarlığa kapalı.

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
      }

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
      if (abs < lastAbs.current) acc.current = 0;
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

Carousel okları deck'i tetiklemez: sol/sağ tuşları carousel'e, yukarı/aşağı deck'e ait.

### 4.5 Erişilebilirlik

- Nav linkleri gerçek `<Link>`
- Ray tarafında dikey nokta göstergesi: 4 nokta, aktif olan accent, tıklanabilir,
  `aria-current="page"`
- Route değişiminde `<main>`'e focus taşınır; `aria-live="polite"` bölgede sayfa adı duyurulur
- `prefers-reduced-motion` → sadece opacity, 100 ms, kilit 100 ms

### 4.6 Prefetch

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
      if (!el || el.contains(e.target as Node)) return;
      e.preventDefault();
      el.scrollBy({ top: e.deltaY });
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [ref]);
}
```

Ray kartlarının üzerindeyken de makale kayar — doğru davranış, o kartların kendi scroll'u yok.

### 5.2 Diğer kurallar

- Üst kenarda 2px okuma ilerleme çubuğu, kart scroll'una bağlı, `role="progressbar"`
- `Esc` → `/blog`'a döner
- `<article tabIndex={0} role="region" aria-label="Yazı içeriği">` — klavyeden odaklanılır,
  `PageDown` kart içinde çalışır
- İçindekiler uzun yazılarda kart içinde sticky; 768px altında gizli
- Viewport < 800px → deck kabuğu kapanır, sayfa normal scroll'a döner
- Makale > 2000 kelime → kart başında "Tam ekran oku" (`?reader=1`): ray gizlenir,
  makale 4 kolona yayılır

---

## 6. Sayfalama (`/blog`)

- Sayfalama **tıklamayla** çalışır. Wheel aşağı deck sonudur, sayfa 2'ye geçmez.
  Aynı jestin iki anlamı olması kullanıcıyı kaybettirir.
- Sayfa değişimi ana bölgeyi yeniden render eder; **ray sabit kalır** (aynı manifest).
  Ana bölge modülleri `key={page}` ile çapraz geçiş yapar.
- Linkler gerçek `<Link href="/blog?page=2">` — JS kapalıyken çalışır
- Sınırda olan yön gizlenir (disabled değil)
- Sayfa değişince `<main>`'e focus taşınır, "Sayfa 2" duyurulur

---

## 7. Sayaç (`AboutMeCard`)

**Sayaç `NEXT_PUBLIC_CAREER_START` mutlak tarihinden türer ve her mount'ta o tarihten
hesaplanır. Kart unmount olsa bile değer kaybolmaz; hiçbir persistans mekanizması
gerektirmez.** Kalıcı kabuğun koruduğu state bu değil — Job Offers form taslağı ve
carousel indeksidir (`ARCHITECTURE.md` §3.4).

Asıl risk hidrasyon uyumsuzluğudur: sunucu 11 saniye yazar, client 12 yazar, React kızar.

```tsx
"use client";
export function TimeSpent({ since }: { since: string }) {
  const [t, setT] = useState<Elapsed | null>(null); // sunucuda null

  useEffect(() => {
    const tick = () => setT(diff(since));
    tick();
    const id = setInterval(tick, 1000);
    const onVis = () => {
      if (!document.hidden) tick();
    };
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
- Sekme arkaplandan dönünce tek seferde doğru değere atlar

---

## 8. Hover ve mikro etkileşim

| Öğe                   | Hover                                    | Süre   |
| --------------------- | ---------------------------------------- | ------ |
| Bento kart            | `border-color` → `border-strong`         | 150 ms |
| Liste/repo kartı      | `bg` → `surface-hover` + `border-strong` | 150 ms |
| Nav link              | `color` → `text`                         | 150 ms |
| Primary buton         | `translateY(-1px)`, hafif açılma         | 150 ms |
| Sosyal ikon           | `color` → `accent`                       | 150 ms |
| Teknoloji rozeti      | `text-3` → `text-2`                      | 150 ms |
| "More ›" / "Detail ›" | `color` → `text`, ok `translateX(2px)`   | 150 ms |

Kart hover'ında `scale` **kullanma** — altı kart aynı anda nefes alıyormuş gibi görünür.

---

## 9. Test kontrol listesi

**Deck**

- [ ] Trackpad'de tek kaydırma = tek ekran geçişi (3 farklı hızda)
- [ ] Fare tekerleği tek klik = tek ekran geçişi
- [ ] Hızlı arka arkaya kaydırma ekran atlatmıyor
- [ ] `/blog`'da aşağı → rubber-band, geçiş yok
- [ ] Tarayıcı geri/ileri doğru çalışıyor
- [ ] URL doğrudan yapıştırılınca doğru ekran açılıyor

**Ray ve kartlar**

- [ ] **About → Projeler geçişinde ray sağdan sola kayıyor, zıplamıyor**
- [ ] Projeler → Blog geçişinde ray soldan sağa kayıyor
- [ ] Home → About: Projects ve Job Offers kartları taşınıyor, yeniden doğmuyor
- [ ] Taşınma sırasında kart içi metin ezilmiyor
- [ ] **Job Offers formuna yazılmış metin sayfa değişiminde duruyor** (DraftProvider)
- [ ] **Carousel 3. projedeyken sayfa değişince hâlâ 3. projede** (DraftProvider)

**Dikey sığma**

- [ ] 1920×1080'de scroll çubuğu yok
- [ ] 1440×900'de scroll çubuğu yok
- [ ] 1366×768'de içerik sığıyor veya normal scroll'a düşüyor
- [ ] 1280×800'de Job Offers kartı taşmıyor
- [ ] Nav/footer oranı geniş ekranda tasarımdaki gibi görünüyor

**Yazı detay**

- [ ] Sayfanın herhangi bir yerinde wheel makaleyi kaydırıyor
- [ ] Okuma çubuğu kart scroll'uyla doluyor
- [ ] `Esc` `/blog`'a dönüyor
- [ ] Deck navigasyonu kapalı

**Genel**

- [ ] JS kapalıyken nav, sayfalama ve formlar çalışıyor
- [ ] Klavyeyle tüm site gezilebiliyor, focus her zaman görünür
- [ ] `prefers-reduced-motion` açıkken geçişler anlık, navigasyon çalışıyor
- [ ] VoiceOver/NVDA ile sayfa değişimi duyuruluyor
- [ ] Kart içi scroll alanında wheel deck'i tetiklemiyor
