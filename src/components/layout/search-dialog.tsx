"use client";

import * as React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { tools, searchTools } from "@/data/tools-registry";
import { Input } from "@/components/ui/input";
import { toolCategoriesById } from "@/data/tool-categories";

type SearchDialogProps = {
    open: boolean;
    onClose: () => void;
};

export function SearchDialog({ open, onClose }: SearchDialogProps) {
    const [query, setQuery] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    const filteredTools = React.useMemo(() => {
        if (!query.trim()) return tools;
        return searchTools(query);
    }, [query]);

    React.useEffect(() => {
        if (open) {
            setQuery("");
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open]);

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (open) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="relative z-10 w-full max-w-lg rounded-xl border border-border bg-card shadow-2xl">
                {/* Search Input */}
                <div className="flex items-center border-b border-border px-4">
                    <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
                    <Input
                        ref={inputRef}
                        type="search"
                        placeholder="Search tools..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                    />
                    <button
                        onClick={onClose}
                        className="ml-2 rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
                    >
                        ESC
                    </button>
                </div>

                {/* Results */}
                <div className="max-h-[50vh] overflow-y-auto p-2">
                    {filteredTools.length > 0 ? (
                        <ul className="space-y-1">
                            {filteredTools.map((tool) => {
                                const primaryCategory = tool.categories[0] || "other";
                                const Icon = toolCategoriesById[primaryCategory].icon;

                                return (
                                    <li key={tool.id}>
                                        <Link
                                            href={`/tools/${tool.id}`}
                                            onClick={onClose}
                                            className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted"
                                        >
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-foreground">
                                                    {tool.name}
                                                </p>
                                                <p className="truncate text-xs text-muted-foreground">
                                                    {tool.description}
                                                </p>
                                            </div>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            No tools found for &quot;{query}&quot;
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
                    <span className="mr-4">↑↓ Navigate</span>
                    <span className="mr-4">↵ Select</span>
                    <span>ESC Close</span>
                </div>
            </div>
        </div>
    );
}
