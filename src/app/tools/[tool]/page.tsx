import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Typography } from "@/components/ui/typography";
import { getToolById } from "@/data/tools-registry";
import * as tools from "@/components/tools";
import { Icon } from "@/components/ui/icon";
import { ArrowLeft, Home, Star, Clock, Users } from "lucide-react";

const toolComponentMap: Record<string, React.ComponentType> = {
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
    "pdf-organizer": tools.PdfOrganizerTool,
};

interface ToolPageProps {
    params: Promise<{ tool: string }>;
}

export default async function ToolPage({ params }: ToolPageProps) {
    const { tool: toolId } = await params;
    const tool = getToolById(toolId);

    if (!tool) {
        return (
            <Container className="py-16">
                <div className="text-center space-y-6">
                    <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                        <Icon icon={Home} size="xl" className="text-destructive" />
                    </div>
                    <div className="space-y-2">
                        <Typography variant="h1" className="text-3xl">Tool Not Found</Typography>
                        <Typography color="muted" className="text-lg max-w-md mx-auto">
                            The tool you&apos;re looking for doesn&apos;t exist or may have been moved.
                        </Typography>
                    </div>
                    <Link
                        href="/"
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors"
                    >
                        <Icon icon={ArrowLeft} size="sm" />
                        <span>Back to Tools</span>
                    </Link>
                </div>
            </Container>
        );
    }

    const ToolComponent = toolComponentMap[toolId];

    if (!ToolComponent) {
        return (
            <Container className="py-16">
                <div className="text-center space-y-6">
                    <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                        <Icon icon={Clock} size="xl" className="text-amber-600" />
                    </div>
                    <div className="space-y-2">
                        <Typography variant="h1" className="text-3xl">Coming Soon</Typography>
                        <Typography color="muted" className="text-lg max-w-md mx-auto">
                            This tool is currently under development and will be available soon.
                        </Typography>
                    </div>
                    <Link
                        href="/"
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors"
                    >
                        <Icon icon={ArrowLeft} size="sm" />
                        <span>Back to Tools</span>
                    </Link>
                </div>
            </Container>
        );
    }

    return (
        <Container className="max-w-7xl py-8">
            {/* Tool Header */}
            <header className="mb-8">
                {/* Breadcrumb Navigation */}
                <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
                    <Link
                        href="/"
                        className="flex items-center space-x-1 hover:text-primary transition-colors"
                    >
                        <Icon icon={Home} size="sm" />
                        <span>Home</span>
                    </Link>
                    <span className="text-muted-foreground/50" aria-hidden="true">/</span>
                    <Link
                        href="/"
                        className="hover:text-primary transition-colors"
                    >
                        Tools
                    </Link>
                    <span className="text-muted-foreground/50" aria-hidden="true">/</span>
                    <span className="text-foreground font-medium" aria-current="page">{tool.name}</span>
                </nav>

                {/* Tool Header - Compact Design */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                            <Icon icon={Star} size="md" className="text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                                {tool.name}
                            </h1>
                            <p className="text-muted-foreground text-sm md:text-base max-w-md">
                                {tool.description}
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
                            <Icon icon={Users} size="xs" className="mr-1.5" />
                            Active
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                            <Icon icon={Star} size="xs" className="mr-1.5" />
                            Free
                        </span>
                    </div>
                </div>
            </header>

            {/* Tool Interface */}
            <section className="bg-card rounded-lg border border-border p-6">
                <ToolComponent />
            </section>
        </Container>
    );
}