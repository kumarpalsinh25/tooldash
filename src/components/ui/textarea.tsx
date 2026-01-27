import * as React from "react";
import { tv, type VariantProps } from "@/lib/tv";

const textareaStyles = tv({
    base: [
        "flex w-full rounded-[var(--radius)] border border-border bg-background",
        "px-3 py-2 text-sm text-foreground shadow-sm",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-60",
    ],
    variants: {
        size: {
            sm: "min-h-[96px]",
            md: "min-h-[120px]",
            lg: "min-h-[160px]",
        },
        state: {
            default: "",
            success: "border-emerald-300",
            error: "border-red-300",
        },
    },
    defaultVariants: { size: "md", state: "default" },
});

type TextareaVariants = VariantProps<typeof textareaStyles>;
export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & TextareaVariants;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
    { className, size, state, ...props },
    ref
) {
    return (
        <textarea
            ref={ref}
            className={textareaStyles({ size, state, className })}
            {...props}
        />
    );
});
