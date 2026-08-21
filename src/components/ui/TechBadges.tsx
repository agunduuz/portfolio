import { BrandIcon } from "./BrandIcon";
import { MAX_TECH_ICONS, type TechId } from "@/config/tech-icons";

/**
 * Repo teknoloji rozetleri (DESIGN-SYSTEM §6).
 *
 * En fazla 4 ikon; fazlası `+2` metnine düşer. Boş listede hiçbir şey
 * render edilmez — boş bir sıra bırakmak kartın ritmini bozar.
 */
export function TechBadges({ tech }: { tech: readonly TechId[] }) {
  if (tech.length === 0) return null;

  const shown = tech.slice(0, MAX_TECH_ICONS);
  const rest = tech.length - shown.length;

  return (
    <ul className="flex items-center gap-2.5">
      {shown.map((id) => (
        <li
          key={id}
          className="text-text-3 hover:text-text-2 transition-colors duration-(--dur-micro)"
        >
          <BrandIcon id={id} className="size-[18px]" />
        </li>
      ))}
      {rest > 0 && (
        <li className="text-text-3 text-micro font-mono">+{rest}</li>
      )}
    </ul>
  );
}
