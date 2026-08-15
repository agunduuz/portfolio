import { COPY, SITE } from "@/config/site";

export function Footer() {
  return (
    <footer className="bg-surface border-border rounded-card text-body text-text-2 grid h-(--h-footer) shrink-0 place-items-center border">
      <p>
        © {new Date().getFullYear()} {SITE.name}. {COPY.footer.rights}
      </p>
    </footer>
  );
}
