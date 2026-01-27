import * as React from "react";
import { tv, type VariantProps } from "@/lib/tv";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/cn";

const cardStyles = tv({
    base: [
        "overflow-hidden rounded-[var(--radius)] bg-card text-card-foreground",
        "transition-shadow",
    ],
    variants: {
        elevation: {
            0: "shadow-none",
            1: "shadow-sm",
            2: "shadow",
            3: "shadow-md",
            4: "shadow-lg",
        },
        variant: {
            elevated: "",
            outlined: "border border-border",
        },
    },
    defaultVariants: { elevation: 1, variant: "elevated" },
});

type CardVariants = VariantProps<typeof cardStyles>;

export type CardProps = React.HTMLAttributes<HTMLDivElement> & CardVariants;

export function Card({ className, elevation, variant, ...props }: CardProps) {
    return <div className={cardStyles({ elevation, variant, className })} {...props} />;
}

export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export function CardHeader({ className, ...props }: CardHeaderProps) {
    return <div className={cn("p-5 pb-3", className)} {...props} />;
}

export type CardTitleProps = Omit<React.HTMLAttributes<HTMLHeadingElement>, 'color'>;

export function CardTitle({ className, ...props }: CardTitleProps) {
    return <Typography variant="h3" className={className} {...props} />;
}

export type CardDescriptionProps = Omit<React.HTMLAttributes<HTMLParagraphElement>, 'color'>;

export function CardDescription({ className, ...props }: CardDescriptionProps) {
    return <Typography className={className} {...props} />;
}

export type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

export function CardContent({ className, ...props }: CardContentProps) {
    return <div className={cn("px-5 pb-5", className)} {...props} />;
}

export type CardActionsProps = React.HTMLAttributes<HTMLDivElement>;

export function CardActions({ className, ...props }: CardActionsProps) {
    return (
        <div
            className={cn("flex items-center justify-end gap-2 border-t border-border/70 px-5 py-3", className)}
            {...props}
        />
    );
}

export type CardMediaProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function CardMedia({ className, ...props }: CardMediaProps) {
    return <img className={cn("h-48 w-full object-cover", className)} {...props} />;
}
