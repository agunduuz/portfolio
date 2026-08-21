import type { InputHTMLAttributes } from "react";

/**
 * Input + Field (DESIGN-SYSTEM §6).
 *
 * `Field` etiket, input ve hata metnini bir arada tutar ve `aria-describedby`
 * bağını kurar — hata mesajı ekran okuyucuda alanın parçası olarak okunur.
 * Bu bağı elle kurma, alan eklerken `Field` kullan.
 *
 * `id`, `useId()` yerine `form` + `name`'den türetilir: hook kullanmadığı için
 * bileşen Server Component kalır ve abonelik formu istemci paketine girmez.
 */

export function Input({
  invalid = false,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={`bg-field text-text text-label placeholder:text-text-3 rounded-inner focus:border-accent focus:ring-accent w-full border px-3 py-2 transition-colors duration-(--dur-micro) focus:ring-1 focus:outline-none ${
        invalid ? "border-danger" : "border-field-border"
      } ${className}`}
      {...props}
    />
  );
}

export function Field({
  form,
  name,
  label,
  error,
  ...input
}: Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "id"> & {
  /** Aynı sayfada iki form olursa id'lerin çakışmasını önler. */
  form: string;
  name: string;
  label: string;
  error?: string;
}) {
  const id = `${form}-${name}`;
  const errorId = `${id}-error`;

  return (
    <div className="flex shrink-0 flex-col gap-1">
      <label htmlFor={id} className="text-label text-text-2 text-center">
        {label}
      </label>

      <Input
        id={id}
        name={name}
        invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...input}
      />

      {error && (
        <p id={errorId} className="text-micro text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
