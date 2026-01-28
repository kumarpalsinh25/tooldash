import { ToolCategory } from "./tool-categories";

export interface Tool {
    id: string;
    name: string;
    description: string;
    categories: ToolCategory['id'][];
}

export const tools: Tool[] = [
    {
        id: "base64-encoder",
        name: "Base64 Encoder/Decoder",
        description: "Encode and decode text to/from Base64 format.",
        categories: ["encoding", "conversion"],
    },
    {
        id: "json-formatter",
        name: "JSON Formatter",
        description: "Format, validate, and beautify JSON data.",
        categories: ["json", "formatting"],
    },
    {
        id: "url-encoder",
        name: "URL Encoder/Decoder",
        description: "Encode and decode URL components.",
        categories: ["encoding", "conversion"],
    },
    {
        id: "hash-generator",
        name: "Hash Generator",
        description: "Generate MD5, SHA-1, SHA-256 and other hashes.",
        categories: ["security", "conversion"],
    },
    {
        id: "uuid-generator",
        name: "UUID Generator",
        description: "Generate random UUIDs (v4) for your applications.",
        categories: ["other"],
    },
    {
        id: "lorem-ipsum",
        name: "Lorem Ipsum Generator",
        description: "Generate placeholder text for your designs.",
        categories: ["text"],
    },
    {
        id: "pdf-splitter",
        name: "PDF Splitter",
        description: "Split a PDF file into multiple files based on page ranges.",
        categories: ["conversion"],
    },
    {
        id: "pdf-merger",
        name: "PDF Merger",
        description: "Merge multiple PDF files into a single PDF. You can reorder the files before merging.",
        categories: ["conversion"],
    },
    {
        id: "image-compressor",
        name: "Image Compressor",
        description: "Compress image file size by selecting a compression percentage.",
        categories: ["conversion"],
    },
];

export function getToolById(id: string): Tool | undefined {
    return tools.find((tool) => tool.id === id);
}

export function searchTools(query: string): Tool[] {
    const lowerQuery = query.toLowerCase();
    return tools.filter(
        (tool) =>
            tool.name.toLowerCase().includes(lowerQuery) ||
            tool.description.toLowerCase().includes(lowerQuery)
    );
}
