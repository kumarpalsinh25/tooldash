import {
    AlignLeft,
    Braces,
    Terminal,
    Paintbrush,
    ArrowRightLeft,
    Shield,
    Wrench,
    type LucideIcon
} from "lucide-react";

export interface ToolCategory {
    id: string;
    name: string;
    icon: LucideIcon;
}

export const toolCategories: ToolCategory[] = [
    {
        id: "text",
        name: "Text",
        icon: AlignLeft,
    },
    {
        id: "json",
        name: "JSON",
        icon: Braces,
    },
    {
        id: "encoding",
        name: "Encoding",
        icon: Terminal,
    },
    {
        id: "formatting",
        name: "Formatting",
        icon: Paintbrush,
    },
    {
        id: "conversion",
        name: "Conversion",
        icon: ArrowRightLeft,
    },
    {
        id: "security",
        name: "Security",
        icon: Shield,
    },
    {
        id: "other",
        name: "Other",
        icon: Wrench,
    },
];

export const toolCategoriesById = toolCategories.reduce((acc, category) => {
    acc[category.id] = category;
    return acc;
}, {} as Record<string, ToolCategory>);