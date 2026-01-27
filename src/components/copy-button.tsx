"use client";

import { useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";

export type CopyButtonProps = Omit<ButtonProps, "onClick"> & {
    text: string;
    onCopy?: () => void;
};

export function CopyButton({ text, onCopy, children = "Copy", ...props }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            onCopy?.();

            // Reset after 2 seconds
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.error("Failed to copy text:", error);
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            {...props}
        >
            {copied ? "Copied!" : children}
        </Button>
    );
}
