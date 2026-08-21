import { BrandIcon } from "./BrandIcon";
import { SITE } from "@/config/site";

/**
 * Hero kartındaki 7 sosyal ikon (PRD §3.1).
 *
 * `rel="me"` bu hesapların gerçekten aynı kişiye ait olduğunu söyler ve
 * JSON-LD `Person.sameAs` ile aynı listeden beslenir. `mailto:` harici
 * değildir — yeni sekmede açılmaz.
 */
export function SocialLinks() {
  return (
    <ul className="flex items-center gap-5">
      {SITE.socials.map(({ name, url, icon }) => {
        const external = !url.startsWith("mailto:");

        return (
          <li key={name}>
            <a
              href={url}
              aria-label={name}
              {...(external
                ? { target: "_blank", rel: "me noopener noreferrer" }
                : { rel: "me" })}
              className="text-text-3 hover:text-accent focus-visible:ring-accent focus-visible:ring-offset-surface rounded-inner -m-2 flex size-10 items-center justify-center p-2 transition-colors duration-(--dur-micro) focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <BrandIcon id={icon} className="size-5" decorative />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
