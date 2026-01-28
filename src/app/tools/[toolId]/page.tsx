import { notFound } from "next/navigation";
import { getToolById, tools } from "@/data/tools-registry";
import { Typography } from "@/components/ui/typography";

import { Base64Tool } from "@/components/tools/base64-encoder";
import { JsonFormatterTool } from "@/components/tools/json-formatter";
import { UrlEncoderTool } from "@/components/tools/url-encoder";
import { HashGeneratorTool } from "@/components/tools/hash-generator";
import { UuidGeneratorTool } from "@/components/tools/uuid-generator";
import { LoremIpsumTool } from "@/components/tools/lorem-ipsum";
import { PdfSplitterTool } from "@/components/tools/pdf-splitter";
import { PdfMergerTool } from "@/components/tools/pdf-merger";

const toolComponents: Record<string, React.ComponentType> = {
    "base64-encoder": Base64Tool,
    "json-formatter": JsonFormatterTool,
    "url-encoder": UrlEncoderTool,
    "hash-generator": HashGeneratorTool,
    "uuid-generator": UuidGeneratorTool,
    "lorem-ipsum": LoremIpsumTool,
    "pdf-splitter": PdfSplitterTool,
    "pdf-merger": PdfMergerTool,
};

export function generateStaticParams() {
    return tools.map((tool) => ({
        toolId: tool.id,
    }));
}

export default async function ToolPage({
    params,
}: {
    params: Promise<{ toolId: string }>;
}) {
    const { toolId } = await params;
    const tool = getToolById(toolId);

    if (!tool) {
        notFound();
    }

    const ToolComponent = toolComponents[toolId];

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Typography variant="h1">{tool.name}</Typography>
                <Typography color="muted">{tool.description}</Typography>
            </div>


            {ToolComponent ? (
                <ToolComponent />
            ) : (
                <Typography color="muted">
                    This tool is coming soon.
                </Typography>
            )}

        </div>
    );
}
