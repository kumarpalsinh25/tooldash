import * as React from "react";
import { tv, type VariantProps } from "@/lib/tv";
import { IconUpload } from "@/components/ui/icon";

const fileUploadStyles = tv({
    base: [
        "w-full rounded-[var(--radius)] border border-dashed border-border",
        "bg-background px-4 py-3 text-sm text-foreground",
        "transition hover:border-primary/60",
        "focus-within:ring-2 focus-within:ring-ring/40",
    ],
    variants: {
        size: {
            sm: "min-h-[90px]",
            md: "min-h-[120px]",
            lg: "min-h-[160px]",
        },
    },
    defaultVariants: { size: "md" },
});

type FileUploadVariants = VariantProps<typeof fileUploadStyles>;

export type FileUploadProps = Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "onChange"
> &
    FileUploadVariants & {
        value?: File[];
        onChange?: (files: File[]) => void;
        label?: string;
        helperText?: string;
        emptyText?: string;
    };

function formatBytes(bytes: number) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
    function FileUpload(
        {
            className,
            size,
            label,
            helperText,
            emptyText = "Drop files here or click to upload",
            multiple,
            value = [],
            onChange,
            ...props
        },
        ref
    ) {
        const inputId = React.useId();
        const [key, setKey] = React.useState(0);
        const inputRef = React.useRef<HTMLInputElement | null>(null);
        const files = value ?? [];

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const next = Array.from(event.target.files ?? []);
            onChange?.(multiple ? next : next.slice(0, 1));
            setKey(prev => prev + 1);
        };

        const handleRemove = (index: number) => {
            const next = files.filter((_, i) => i !== index);
            onChange?.(next);
            setKey(prev => prev + 1);
        };

        React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

        return (
            <div className="space-y-2">
                {label ? (
                    <label htmlFor={inputId} className="text-sm font-medium text-foreground">
                        {label}
                    </label>
                ) : null}
                <div className={fileUploadStyles({ size, className })}>
                    <input
                        key={key}
                        id={inputId}
                        ref={inputRef}
                        type="file"
                        multiple={multiple}
                        className="sr-only"
                        onChange={handleChange}
                        {...props}
                    />
                    <label
                        htmlFor={inputId}
                        className={`flex cursor-pointer flex-col items-center justify-center gap-4 text-center ${
                            files.length === 0 ? "min-h-[inherit]" : "py-4"
                        }`}
                    >
                        {files.length === 0 ? (
                            <>
                                <div className="rounded-full border border-dashed p-3 transition-colors group-hover:bg-muted/50">
                                    <IconUpload size="lg" className="text-muted-foreground" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-foreground">
                                        {emptyText}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {multiple
                                            ? "Support for single or multiple file uploads"
                                            : "Support for single file upload"}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center">
                                <p className="text-xs text-muted-foreground">
                                    Click to upload more files
                                </p>
                            </div>
                        )}
                    </label>
                    {files.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {files.map((file, index) => (
                                <div
                                    key={`${file.name}-${index}`}
                                    className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2 text-left"
                                >
                                    <div className="min-w-0 flex-1 pr-3 pointer-events-none">
                                        <p className="truncate text-sm font-medium text-foreground">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatBytes(file.size)}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        className="shrink-0 text-xs font-medium text-red-600 hover:text-red-700 pointer-events-auto"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            handleRemove(index);
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {helperText ? (
                    <p className="text-sm text-muted-foreground">{helperText}</p>
                ) : null}
            </div>
        );
    }
);
