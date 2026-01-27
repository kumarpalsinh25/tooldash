import * as React from "react";
import { tv, type VariantProps } from "@/lib/tv";

const typographyStyles = tv({
    base: "text-foreground",
    variants: {
        variant: {
            h1: "text-4xl font-semibold tracking-tight md:text-4xl",
            h2: "text-3xl font-semibold tracking-tight md:text-3xl",
            h3: "text-2xl font-semibold tracking-tight md:text-2xl",
            h4: "text-xl font-semibold tracking-tight md:text-xl",
            h5: "text-lg font-semibold md:text-lg",
            h6: "text-base font-semibold md:text-base",
            subtitle1: "text-lg font-medium",
            subtitle2: "text-base font-medium",
            body: "text-base leading-7",
            body2: "text-sm leading-6",
            button: "text-sm font-medium uppercase tracking-wide",
            caption: "text-xs text-muted-foreground",
            overline: "text-xs uppercase tracking-widest",
            inherit: "",
        },
        align: {
            inherit: "",
            left: "text-left",
            center: "text-center",
            right: "text-right",
            justify: "text-justify",
        },
        color: {
            default: "text-foreground",
            inherit: "text-inherit",
            primary: "text-primary",
            secondary: "text-secondary-foreground",
            muted: "text-muted-foreground",
            success: "text-emerald-600",
            warning: "text-amber-600",
            error: "text-red-600",
        },
        gutterBottom: {
            true: "mb-2",
        },
        noWrap: {
            true: "truncate",
        },
        paragraph: {
            true: "mb-4",
        },
    },
    defaultVariants: {
        variant: "body",
        align: "inherit",
        color: "inherit",
    },
});

type TypographyVariants = VariantProps<typeof typographyStyles>;

export type TypographyProps = React.HTMLAttributes<HTMLElement> &
    TypographyVariants & {
        component?: React.ElementType;
    };

const defaultVariantMapping: Record<
    NonNullable<TypographyVariants["variant"]>,
    React.ElementType
> = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    subtitle1: "h6",
    subtitle2: "h6",
    body: "p",
    body2: "p",
    button: "span",
    caption: "span",
    overline: "span",
    inherit: "p",
};

export function Typography({
    component,
    className,
    variant,
    align,
    color,
    gutterBottom,
    noWrap,
    paragraph,
    ...props
}: TypographyProps) {

    const mapped = defaultVariantMapping[variant ?? "body"];

    const Component = component ?? (paragraph ? "p" : mapped);

    return (
        <Component
            className={typographyStyles({
                variant,
                align,
                color,
                gutterBottom,
                noWrap,
                paragraph,
                className,
            })}
            {...props}
        />
    );
}
