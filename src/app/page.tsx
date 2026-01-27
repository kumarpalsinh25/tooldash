"use client";

import { useState, useMemo } from "react";
import { Container } from "@/components/ui/container";
import { Typography } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import { ToolCard } from "@/components/tool-card";
import { tools, searchTools } from "@/data/tools-registry";
import { Search } from "lucide-react";

export default function Home() {
  const [query, setQuery] = useState("");

  const filteredTools = useMemo(() => {
    if (!query.trim()) return tools;
    return searchTools(query);
  }, [query]);

  return (
    <Container className="py-12">
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <Typography variant="h1">Developer Tools</Typography>
        <Typography color="muted" className="text-lg">
          A collection of useful tools for developers. Search and find the tool you need.
        </Typography>
      </div>

      <div className="mx-auto mt-8 max-w-md">
        <div className="relative">
          <Icon
            icon={Search}
            size="sm"
            tone="muted"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 z-10"
          />
          <Input
            type="search"
            placeholder="Search tools..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="mt-10">
        {filteredTools.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <Typography color="muted">
              No tools found matching &quot;{query}&quot;
            </Typography>
          </div>
        )}
      </div>
    </Container>
  );
}
