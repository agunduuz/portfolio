"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

/**
 * Kod bloğu kopyalama butonu.
 *
 * Metni prop olarak DEĞİL, DOM'dan okuyor: `rehype-pretty-code` kodu onlarca
 * `<span>`e bölüyor ve ham metni ayrıca prop'la taşımak aynı içeriği HTML'de
 * iki kez göndermek olurdu.
 *
 * `navigator.clipboard` yalnızca güvenli bağlamda (https ve localhost) vardır.
 * Desteği tıklama anında yokluyoruz; render sırasında yoklamak sunucuda `false`,
 * istemcide `true` verip hidrasyon uyumsuzluğu doğururdu.
 */
export function CopyButton() {
  const ref = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  async function copy() {
    const pre = ref.current?.closest("[data-code-block]")?.querySelector("pre");
    if (!pre || !navigator.clipboard) return;

    try {
      await navigator.clipboard.writeText(pre.innerText);
      setCopied(true);
    } catch {
      // Kullanıcı izni reddettiyse sessiz kal; hata mesajı burada gürültü.
    }
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={copy}
      aria-label={copied ? "Kopyalandı" : "Kodu kopyala"}
      className="text-text-3 hover:text-text bg-surface border-border focus-visible:ring-accent focus-visible:ring-offset-elevated rounded-inner absolute top-2 right-2 cursor-pointer border p-2 opacity-0 transition-[opacity,color] duration-(--dur-micro) group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      {copied ? (
        <Check aria-hidden className="text-accent size-3.5" />
      ) : (
        <Copy aria-hidden className="size-3.5" />
      )}
    </button>
  );
}
