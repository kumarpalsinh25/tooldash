import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Typography } from "@/components/ui/typography";
import { getToolById } from "@/data/tools-registry";
import * as tools from "@/components/tools";

const toolComponentMap: Record<string, any> = {
    "base64-encoder": tools.Base64Tool,
    "json-formatter": tools.JsonFormatterTool,
    "url-encoder": tools.UrlEncoderTool,
    "hash-generator": tools.HashGeneratorTool,
    "uuid-generator": tools.UuidGeneratorTool,
    "lorem-ipsum": tools.LoremIpsumTool,
    "pdf-splitter": tools.PdfSplitterTool,
    "pdf-merger": tools.PdfMergerTool,
    "pdf-locker": tools.PdfLockerTool,
    "pdf-unlocker": tools.PdfUnlockerTool,
    "image-compressor": tools.ImageCompressorTool,
    "color-palette-generator": tools.ColorPaletteGeneratorTool,
    "app-icon-splash-generator": tools.AppIconSplashGeneratorTool,
    "sqlite-viewer": tools.SqliteViewerTool,
    "timezone-scheduler": tools.TimezoneSchedulerTool,
};

interface ToolPageProps {
    params: Promise<{ tool: string }>;
}

export default async function ToolPage({ params }: ToolPageProps) {
    const { tool: toolId } = await params;
    const tool = getToolById(toolId);

    if (!tool) {
        notFound();
    }

    const ToolComponent = toolComponentMap[toolId];

    if (!ToolComponent) {
        notFound();
    }

    return (
        <Container className="py-8">
            <div className="space-y-6">
                <div className="space-y-2">
                    <Typography variant="h1">{tool.name}</Typography>
                    <Typography color="muted">{tool.description}</Typography>
                </div>
                <ToolComponent />
            </div>
        </Container>
    );
}