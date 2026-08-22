import Link from "next/link";

/**
 * 404 — kök seviyede, deck kabuğunun DIŞINDA.
 *
 * `(deck)` grubunun içine koymak, kalıcı kabuğu ve uydu rayı 404'te de
 * render etmek demekti; bulunamayan bir sayfada altı kart göstermek gürültü.
 * Burada tek iş var: kullanıcıyı geri yollamak.
 */
export default function NotFound() {
  return (
    <main className="px-pad-shell flex min-h-dvh flex-col items-center justify-center gap-6 text-center">
      <p className="font-display text-display-xl text-text-3 tabular-nums">
        404
      </p>

      <h1 className="font-display text-display-l text-text">Bu sayfa yok.</h1>

      <p className="text-body text-text-2 max-w-prose">
        Adres yanlış olabilir ya da yazı kaldırılmış olabilir. Yazıların tamamı
        listede duruyor.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link href="/" className={LINK}>
          Anasayfa
        </Link>
        <Link href="/blog" className={LINK}>
          Yazılar
        </Link>
      </div>
    </main>
  );
}

const LINK =
  "text-label text-text bg-elevated border-border-strong rounded-inner hover:bg-surface-hover focus-visible:ring-accent focus-visible:ring-offset-bg border px-4 py-2.5 transition-colors duration-(--dur-micro) focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none";
