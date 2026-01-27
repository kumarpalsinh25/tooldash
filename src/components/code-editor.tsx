"use client";

import * as React from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { tv, type VariantProps } from "@/lib/tv";

const codeEditorStyles = tv({
    base: [
        "w-full rounded-[var(--radius)] border border-border",
        "bg-[#272822] text-[#f8f8f2] shadow-sm",
        "font-mono text-sm leading-6",
        "overflow-hidden",
        "relative",
    ],
    variants: {
        size: {
            sm: "min-h-[140px]",
            md: "min-h-[200px]",
            lg: "min-h-[280px]",
        },
    },
    defaultVariants: { size: "md" },
});

type CodeEditorVariants = VariantProps<typeof codeEditorStyles>;

export type CodeEditorProps = CodeEditorVariants & {
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    language?: string;
    height?: string | number;
    readOnly?: boolean;
    placeholder?: string;
    label?: string;
    helperText?: string;
    options?: Parameters<typeof Editor>[0]["options"];
    className?: string;
};

const MONOKAI_THEME = "monokai";

const monokaiTheme = {
    base: "vs-dark",
    inherit: true,
    rules: [
        { token: "", foreground: "F8F8F2" },
        { token: "comment", foreground: "75715E" },
        { token: "keyword", foreground: "F92672" },
        { token: "number", foreground: "AE81FF" },
        { token: "string", foreground: "E6DB74" },
        { token: "type", foreground: "66D9EF" },
        { token: "function", foreground: "A6E22E" },
        { token: "delimiter", foreground: "F8F8F2" },
    ],
    colors: {
        "editor.background": "#272822",
        "editor.foreground": "#F8F8F2",
        "editorLineNumber.foreground": "#75715E",
        "editorLineNumber.activeForeground": "#F8F8F2",
        "editorCursor.foreground": "#F8F8F0",
        "editor.selectionBackground": "#49483E",
        "editor.inactiveSelectionBackground": "#3E3D32",
        "editorIndentGuide.background": "#3B3A32",
        "editorIndentGuide.activeBackground": "#4F4E45",
        "editor.lineHighlightBackground": "#2B2A25",
    },
} as const;

export function CodeEditor({
    className,
    size,
    label,
    helperText,
    value,
    defaultValue,
    onChange,
    language = "typescript",
    height,
    readOnly,
    placeholder,
    options,
}: CodeEditorProps) {
    const themeReadyRef = React.useRef(false);
    const editorRef = React.useRef<Parameters<OnMount>[0] | null>(null);
    const [focused, setFocused] = React.useState(false);

    const handleMount: OnMount = (_editor, monaco) => {
        editorRef.current = _editor;
        if (!themeReadyRef.current) {
            monaco.editor.defineTheme(MONOKAI_THEME, monokaiTheme);
            themeReadyRef.current = true;
        }
        monaco.editor.setTheme(MONOKAI_THEME);

        _editor.onDidFocusEditorText(() => setFocused(true));
        _editor.onDidBlurEditorText(() => setFocused(false));
    };

    const resolvedHeight = height ?? (size === "sm" ? 160 : size === "lg" ? 300 : 220);
    const showPlaceholder = placeholder && !focused && !(value ?? defaultValue);

    return (
        <div className="space-y-2">
            {label ? <label className="text-sm font-medium text-foreground">{label}</label> : null}
            <div className={codeEditorStyles({ size, className })}>
                <Editor
                    value={value}
                    defaultValue={defaultValue}
                    onChange={(next) => onChange?.(next ?? "")}
                    language={language}
                    theme={MONOKAI_THEME}
                    height={resolvedHeight}
                    onMount={handleMount}
                    options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 13,
                        lineHeight: 20,
                        fontFamily: "var(--font-mono)",
                        readOnly,
                        padding: { top: 12, bottom: 12 },
                        ...options,
                    }}
                />
                {showPlaceholder ? (
                    <div className="pointer-events-none absolute left-[52px] top-3 text-sm text-[#75715E]">
                        {placeholder}
                    </div>
                ) : null}
            </div>
            {helperText ? <p className="text-sm text-muted-foreground">{helperText}</p> : null}
        </div>
    );
}
