import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { tv, type VariantProps } from "@/lib/tv";

const iconStyles = tv({
    base: "shrink-0",
    variants: {
        size: {
            xs: "h-3.5 w-3.5",
            sm: "h-4 w-4",
            md: "h-5 w-5",
            lg: "h-6 w-6",
            xl: "h-7 w-7",
        },
        tone: {
            inherit: "text-current",
            default: "text-foreground",
            muted: "text-muted-foreground",
            primary: "text-primary",
            success: "text-emerald-600",
            warning: "text-amber-600",
            danger: "text-red-600",
        },
    },
    defaultVariants: { size: "md", tone: "inherit" },
});

type IconVariants = VariantProps<typeof iconStyles>;

export type IconProps = React.SVGProps<SVGSVGElement> &
    IconVariants & {
        title?: string;
        icon?: LucideIcon;
        children?: React.ReactNode;
    };

export function Icon({
    size,
    tone,
    className,
    title,
    icon: IconComponent,
    children,
    ...props
}: IconProps) {

    const computedClassName = iconStyles({ size, tone, className });

    if (IconComponent) {
        return (
            <IconComponent
                className={computedClassName}
                aria-label={title}
                aria-hidden={!title}
                {...props}
            />
        );
    }

    return (
        <svg
            viewBox="0 0 24 24"
            className={computedClassName}
            {...props}
        >
            {title ? <title>{title}</title> : null}
            {children}
        </svg>
    );
}
