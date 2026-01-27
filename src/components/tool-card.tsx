import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { tv, type VariantProps } from "@/lib/tv";
import { type Tool } from "@/data/tools-registry";
import { Typography } from "@/components/ui/typography";
import { Badge } from "./ui/badge";
import { toSentenceCase } from "@/lib/case-converter";
import { toolCategoriesById } from "@/data/tool-categories";

const toolCardStyles = tv({
    base: [
        "group relative flex flex-col rounded-[var(--radius)] border border-border bg-card p-5",
        "transition-all duration-200",
        "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
    ],
    variants: {
        size: {
            sm: "gap-2",
            md: "gap-3",
            lg: "gap-4",
        },
    },
    defaultVariants: { size: "md" },
});

type ToolCardVariants = VariantProps<typeof toolCardStyles>;

export type ToolCardProps = ToolCardVariants & {
    tool: Tool;
    className?: string;
};

export function ToolCard({ tool, size, className }: ToolCardProps) {
    const primaryCategory = tool.categories[0] || "other";
    const Icon = toolCategoriesById[primaryCategory].icon;

    return (
        <Link href={`/tools/${tool.id}`} className={toolCardStyles({ size, className })}>
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                </div>
                <Typography variant="h4" className="line-clamp-1">
                    {tool.name}
                </Typography>
            </div>
            <Typography color="muted" className="line-clamp-2 text-sm">
                {tool.description}
            </Typography>
            <div className="mt-auto flex items-center justify-between pt-2">
                <div className="flex flex-wrap gap-1">
                    {tool.categories.slice(0, 2).map((category) => (
                        <Badge key={category} variant="soft" color="neutral">
                            {toSentenceCase(category)}
                        </Badge>
                    ))}
                    {tool.categories.length > 2 && (
                        <Badge variant="soft" color="neutral">
                            +{tool.categories.length - 2}
                        </Badge>
                    )}
                </div>
                <ChevronRight
                    className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
                />
            </div>
        </Link>
    );
}
