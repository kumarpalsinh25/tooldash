import * as React from "react";
import { tv, type VariantProps } from "@/lib/tv";

const containerStyles = tv({
  base: "mx-auto w-full px-6",
  variants: {
    size: {
      sm: "max-w-3xl",
      md: "max-w-5xl",
      lg: "max-w-6xl",
      xl: "max-w-7xl",
    },
  },
  defaultVariants: { size: "lg" },
});

type ContainerVariants = VariantProps<typeof containerStyles>;
export type ContainerProps = React.HTMLAttributes<HTMLDivElement> & ContainerVariants;

export function Container({ className, size, ...props }: ContainerProps) {
  return <div className={containerStyles({ size, className })} {...props} />;
}
