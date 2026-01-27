import Link from "next/link";
import { Container } from "@/components/ui/container";

const footerLinks = [
  { label: "Docs", href: "#docs" },
  { label: "Changelog", href: "#changelog" },
  { label: "Status", href: "#status" },
  { label: "GitHub", href: "#github" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-muted/40">
      <Container className="flex flex-col items-start justify-between gap-6 py-10 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold">Tooldash UI</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Opinionated Tailwind components with variants inspired by MUI.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </div>
      </Container>
    </footer>
  );
}
