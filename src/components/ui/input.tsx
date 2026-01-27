import * as React from "react";
import { tv, type VariantProps } from "@/lib/tv";

const inputStyles = tv({
  base: [
    "flex w-full rounded-[var(--radius)] border border-border bg-background",
    "px-3 text-sm text-foreground shadow-sm",
    "placeholder:text-muted-foreground",
    "focus-visible:outline-none",
    "disabled:cursor-not-allowed disabled:opacity-60",
  ],
  variants: {
    size: {
      sm: "h-9",
      md: "h-10",
      lg: "h-11",
    },
    state: {
      default: "",
      success: "border-emerald-300",
      error: "border-red-300",
    },
  },
  defaultVariants: { size: "md", state: "default" },
});

type InputVariants = VariantProps<typeof inputStyles>;
export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & InputVariants;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, size, state, ...props },
  ref
) {
  return <input ref={ref} className={inputStyles({ size, state, className })} {...props} />;
});
