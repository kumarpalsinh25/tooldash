import * as React from "react";
import { tv, type VariantProps } from "@/lib/tv";
import { Check, Info, AlertTriangle, XCircle } from "lucide-react";
import { Icon } from "./icon";

const alertStyles = tv({
    base: [
        "relative flex w-full gap-3 rounded-[var(--radius)] p-4 text-sm",
        "border shadow-sm",
    ],
    variants: {
        severity: {
            info: "",
            success: "",
            warning: "",
            error: "",
        },
        variant: {
            standard: "",
            outlined: "bg-transparent",
            filled: "border-transparent text-white",
        },
    },
    compoundVariants: [
        { variant: "standard", severity: "info", class: "border-blue-200 bg-blue-50 text-blue-900" },
        { variant: "standard", severity: "success", class: "border-emerald-200 bg-emerald-50 text-emerald-900" },
        { variant: "standard", severity: "warning", class: "border-amber-200 bg-amber-50 text-amber-900" },
        { variant: "standard", severity: "error", class: "border-red-200 bg-red-50 text-red-900" },
        { variant: "outlined", severity: "info", class: "border-blue-300 text-blue-900" },
        { variant: "outlined", severity: "success", class: "border-emerald-300 text-emerald-900" },
        { variant: "outlined", severity: "warning", class: "border-amber-300 text-amber-900" },
        { variant: "outlined", severity: "error", class: "border-red-300 text-red-900" },
        { variant: "filled", severity: "info", class: "bg-blue-600" },
        { variant: "filled", severity: "success", class: "bg-emerald-600" },
        { variant: "filled", severity: "warning", class: "bg-amber-500 text-black" },
        { variant: "filled", severity: "error", class: "bg-red-600" },
    ],
    defaultVariants: { severity: "info", variant: "standard" },
});

const iconStyles = tv({
    base: "mt-0.5 h-5 w-5 shrink-0",
    variants: {
        severity: {
            info: "text-blue-600",
            success: "text-emerald-600",
            warning: "text-amber-600",
            error: "text-red-600",
        },
        variant: {
            standard: "",
            outlined: "",
            filled: "text-white",
        },
    },
    compoundVariants: [
        { variant: "filled", severity: "warning", class: "text-black" },
    ],
    defaultVariants: { severity: "info", variant: "standard" },
});

type AlertVariants = VariantProps<typeof alertStyles>;

export type AlertProps = React.HTMLAttributes<HTMLDivElement> &
    AlertVariants & {
        showIcon?: boolean;
        action?: React.ReactNode;
    };

const iconBySeverity = {
    info: Info,
    success: Check,
    warning: AlertTriangle,
    error: XCircle,
} as const;

export function Alert({
    className,
    severity,
    variant,
    showIcon = true,
    action,
    children,
    ...props
}: AlertProps) {
    const iconComponent = iconBySeverity[severity ?? "info"];
    return (
        <div
            role="alert"
            className={alertStyles({ severity, variant, className })}
            {...props}
        >
            {showIcon ? (
                <Icon icon={iconComponent} className={iconStyles({ severity, variant })} />
            ) : null}
            <div className="flex-1 space-y-1">{children}</div>
            {action ? <div className="ml-2 flex items-start">{action}</div> : null}
        </div>
    );
}

export type AlertTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

export function AlertTitle({ className, ...props }: AlertTitleProps) {
    return <h5 className={`text-sm font-semibold ${className ?? ""}`} {...props} />;
}
