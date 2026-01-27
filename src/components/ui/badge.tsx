import * as React from "react";
import { tv, type VariantProps } from "@/lib/tv";

const badgeStyles = tv({
  base: [
    "inline-flex items-center gap-1",
    "rounded-full border px-2.5 py-0.5",
    "text-xs font-medium",
  ],
  variants: {
    variant: {
      solid: "border-transparent",
      soft: "border-transparent",
      outline: "bg-transparent",
    },
    color: {
      primary: "",
      neutral: "",
      success: "",
      warning: "",
      danger: "",
    },
  },
  compoundVariants: [
    { variant: "solid", color: "primary", class: "bg-primary text-primary-foreground" },
    { variant: "solid", color: "neutral", class: "bg-foreground text-background" },
    { variant: "solid", color: "success", class: "bg-emerald-600 text-white" },
    { variant: "solid", color: "warning", class: "bg-amber-500 text-black" },
    { variant: "solid", color: "danger", class: "bg-red-600 text-white" },
    { variant: "soft", color: "primary", class: "bg-primary/10 text-primary" },
    { variant: "soft", color: "neutral", class: "bg-muted text-foreground" },
    { variant: "soft", color: "success", class: "bg-emerald-50 text-emerald-700" },
    { variant: "soft", color: "warning", class: "bg-amber-50 text-amber-800" },
    { variant: "soft", color: "danger", class: "bg-red-50 text-red-700" },
    { variant: "outline", color: "primary", class: "border-primary/40 text-primary" },
    { variant: "outline", color: "neutral", class: "border-border text-foreground" },
    { variant: "outline", color: "success", class: "border-emerald-300 text-emerald-700" },
    { variant: "outline", color: "warning", class: "border-amber-300 text-amber-800" },
    { variant: "outline", color: "danger", class: "border-red-300 text-red-700" },
  ],
  defaultVariants: { variant: "soft", color: "primary" },
});

type BadgeVariants = VariantProps<typeof badgeStyles>;
export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & BadgeVariants;

export function Badge({ className, variant, color, ...props }: BadgeProps) {
  return <span className={badgeStyles({ variant, color, className })} {...props} />;
}
