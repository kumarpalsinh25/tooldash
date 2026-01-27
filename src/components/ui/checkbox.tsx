import * as React from "react";
import { tv, type VariantProps } from "@/lib/tv";

const checkboxStyles = tv({
    base: [
        "h-4 w-4 rounded border border-border text-primary",
        "focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-60",
    ],
    variants: {
        state: {
            default: "",
            error: "border-red-300 text-red-600",
        },
    },
    defaultVariants: { state: "default" },
});

type CheckboxVariants = VariantProps<typeof checkboxStyles>;
export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & CheckboxVariants;

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
    { className, state, ...props },
    ref
) {
    return (
        <input
            ref={ref}
            type="checkbox"
            className={checkboxStyles({ state, className })}
            {...props}
        />
    );
});
