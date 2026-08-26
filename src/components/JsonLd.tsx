/**
 * JSON-LD çıktısı (SEO §3). Tek `<script>` içinde `@graph` — her şema için
 * ayrı etiket açmak yerine.
 *
 * `dangerouslySetInnerHTML` burada doğru araç: JSON-LD bir script gövdesidir,
 * React'in metin kaçırması onu bozardı. Güvenlik iki katmanlı:
 *  1. `JSON.stringify` tırnak ve kontrol karakterlerini kaçırır
 *  2. `<` → `<` çevirisi `</script>` kaçışını kapatır — JSON-LD bloğunun
 *     TEK enjeksiyon yüzeyi budur ve içerik yazı başlığından besleniyor
 */
export function JsonLd({ schemas }: { schemas: object[] }) {
  const json = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": schemas,
  }).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
