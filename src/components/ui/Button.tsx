import type { ButtonHTMLAttributes } from "react";

/**
 * Üç varyant, tek bileşen (DESIGN-SYSTEM §6).
 *
 * `primary` zemini Figma'daki gri (`--color-button`). Kontrastı düşük
 * görünmesi kasıtlıdır; erişilebilirlik zemini bunu kapsamaz.
 */

export type ButtonVariant = "primary" | "secondary" | "ghost";

const VARIANT: Record<ButtonVariant, string> = {
  primary:
    "bg-button text-text hover:bg-button-hover hover:-translate-y-px font-semibold",
  secondary:
    "bg-elevated border border-border-strong text-text hover:bg-surface-hover",
  ghost: "text-text-2 hover:text-text",
};

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      type={type}
      className={`text-label rounded-inner focus-visible:ring-accent focus-visible:ring-offset-surface inline-flex min-h-10 cursor-pointer items-center justify-center px-4 py-2.5 transition-[background-color,color,transform] duration-(--dur-micro) focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 ${VARIANT[variant]} ${className}`}
      {...props}
    />
  );
}
