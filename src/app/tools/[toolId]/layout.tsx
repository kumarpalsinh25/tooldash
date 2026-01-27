import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ChevronLeft } from "lucide-react";

export default function ToolLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Container className="py-8">
            <nav className="mb-6">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ChevronLeft size="sm" />
                    Back to Tools
                </Link>
            </nav>
            {children}
        </Container>
    );
}
