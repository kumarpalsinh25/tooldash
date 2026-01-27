import * as React from "react";
import { tv, type VariantProps } from "@/lib/tv";
import { ArrowDown } from "lucide-react";

const selectStyles = tv({
    base: [
        "flex h-10 w-full items-center rounded-[var(--radius)] border border-border bg-background",
        "px-3 text-sm text-foreground shadow-sm",
        "focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "appearance-none",
    ],
    variants: {
        state: {
            default: "",
            success: "border-emerald-300",
            error: "border-red-300",
        },
    },
    defaultVariants: { state: "default" },
});

type SelectVariants = VariantProps<typeof selectStyles>;
export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & SelectVariants;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
    { className, state, children, ...props },
    ref
) {
    return (
        <div className="relative">
            <select ref={ref} className={selectStyles({ state, className })} {...props}>
                {children}
            </select>
            <ArrowDown
                size="sm"
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
        </div>
    );
});
