import type { ReactNode } from "react";

/** GEÇİCİ — Faz Kontrol paneli. Proje bitince bu klasör silinir. */

const TOKEN_RE = /(`[^`]+`|\*\*[^*]+\*\*)/g;

/**
 * ROADMAP.md maddelerindeki `kod` ve **kalın** işaretlerini React düğümlerine
 * çevirir. Kaynak bizim kendi dosyamız; tam bir markdown parser'a gerek yok ve
 * `dangerouslySetInnerHTML` kullanılmaz.
 */
export function Inline({ children }: { children: string }) {
  const parts = children.split(TOKEN_RE).filter((p) => p !== "");

  return (
    <>
      {parts.map((part, i) => {
        const key = `${i}-${part}`;

        if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
          return (
            <code
              key={key}
              className="bg-elevated text-text rounded px-1 py-0.5 font-mono text-[0.9em]"
            >
              {part.slice(1, -1)}
            </code>
          );
        }

        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          return (
            <strong key={key} className="text-text font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }

        return <span key={key}>{part}</span>;
      })}
    </>
  );
}

export function renderInline(text: string): ReactNode {
  return <Inline>{text}</Inline>;
}
