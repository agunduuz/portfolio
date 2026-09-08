"use client";

import { useEffect, useRef } from "react";

/**
 * Formun açıldığı anı gizli bir alana yazar — bot zaman eşiği için
 * (ARCHITECTURE §7: 2 saniyeden hızlı gönderim insan değildir).
 *
 * Değer neden render'da değil de effect'te yazılıyor:
 *  - Render'da `Date.now()` çağırmak sunucu ve istemcide FARKLI değer üretir,
 *    yani hidrasyon uyumsuzluğu.
 *  - `useRef().current`'ı render sırasında okumak da yasak (React kuralı).
 *
 * JS kapalıyken alan boş kalır. `Number("")` → 0 → "çok eski" sayılır ve form
 * normal işler; bu bilinçli, çünkü JS'siz kullanıcıyı bot muamelesiyle sessizce
 * yutmak PRD §4'teki "formlar JS kapalıyken de çalışır" kuralını çiğnerdi.
 */
export function useMountTimestamp() {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.value = String(Date.now());
  }, []);

  return ref;
}
