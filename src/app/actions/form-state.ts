/**
 * İstemci ve sunucunun ORTAK kullandığı form sözleşmesi.
 *
 * Ayrı dosya olmasının sebebi: `shared.ts` `server-only` ve `next/headers`
 * taşıyor. Formlar istemci bileşeni olduğu için oradan tek bir sabit almak
 * bile build'i patlatıyordu ("You're importing a module that depends on
 * server-only into a React Client Component"). Tip ve sabitler burada,
 * sunucu mantığı orada.
 */

export type FormState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | {
      status: "error";
      message: string;
      fieldErrors?: Record<string, string[]>;
    };

/** Botların doldurduğu, insanların göremediği alan. */
export const HONEYPOT_FIELD = "company_website";

/** Formun açıldığı an; 2 saniyeden hızlı gönderim bot sayılır. */
export const TIMESTAMP_FIELD = "ts";
