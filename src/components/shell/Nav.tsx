"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/config/site";
import { ResumeMenu } from "./ResumeMenu";

/**
 * Gerçek `<Link>`'ler — deck sadece bir kısayol, navigasyonun kendisi değil.
 * JS kapalıyken de site gezilebilir kalır.
 */
export function Nav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Ana gezinti"
      className="bg-surface border-border rounded-card h-(--h-nav) shrink-0 border"
    >
      <div className="px-pad-card flex h-full items-center justify-between">
        <ul className="flex items-center gap-8">
          {NAV.map(({ href, label }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);

            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`text-label focus-visible:ring-accent focus-visible:ring-offset-surface rounded-inner px-1 py-2 transition-colors duration-(--dur-micro) focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
                    active ? "text-accent" : "text-text-2 hover:text-text"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <ResumeMenu />
      </div>
    </nav>
  );
}
