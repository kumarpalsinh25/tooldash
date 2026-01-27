import * as React from "react";
import { tv, type VariantProps } from "@/lib/tv";
import { Loader2 } from "lucide-react";

const buttonStyles = tv({
    base: [
        "inline-flex items-center justify-center gap-2",
        "whitespace-nowrap font-medium",
        "transition",
        "focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        "rounded-[var(--radius)]",
    ],
    variants: {
        variant: {
            solid: "bg-primary text-primary-foreground hover:opacity-90",
            outline: "border border-border bg-transparent hover:bg-muted",
            ghost: "bg-transparent hover:bg-muted",
            soft: "bg-muted text-foreground hover:opacity-90",
        },
        color: {
            primary: "",
            danger: "bg-red-600 text-white hover:opacity-90",
            success: "bg-green-600 text-white hover:opacity-90",
        },
        size: {
            sm: "h-9 px-3 text-sm",
            md: "h-10 px-4 text-sm",
            lg: "h-11 px-5 text-base",
        },
        fullWidth: {
            true: "w-full",
            false: "",
        },
        loading: {
            true: "cursor-wait",
            false: "",
        },
    },
    compoundVariants: [
        // If variant is outline/ghost/soft, color should not override unless you want it
        { variant: "outline", color: "danger", class: "border-red-300 text-red-700 hover:bg-red-50" },
        { variant: "ghost", color: "danger", class: "text-red-700 hover:bg-red-50" },
    ],
    defaultVariants: {
        variant: "solid",
        color: "primary",
        size: "md",
        fullWidth: false,
        loading: false,
    },
});

type ButtonVariants = VariantProps<typeof buttonStyles>;

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
    ButtonVariants & {
        component?: React.ElementType;
        leftIcon?: React.ReactNode;
        rightIcon?: React.ReactNode;
        loading?: boolean;
        loadingText?: string;
    };

export function Button({
    component: Component = "button",
    className,
    variant,
    color,
    size,
    fullWidth,
    leftIcon,
    rightIcon,
    loading = false,
    loadingText,
    children,
    ...props
}: ButtonProps) {
    const isDisabled = loading || props.disabled;
    return (
        <Component
            className={buttonStyles({ variant, color, size, fullWidth, loading, className })}
            disabled={Component === "button" ? isDisabled : props.disabled}
            aria-busy={loading || undefined}
            {...props}
        >
            {loading ? <Loader2 className="animate-spin" size="sm" /> : leftIcon}
            <span>{loading && loadingText ? loadingText : children}</span>
            {!loading ? rightIcon : null}
        </Component>
    );
}
