"use client";

import type { FieldPath, FieldValues } from "react-hook-form";
import {
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { FileUpload, type FileUploadProps } from "@/components/file-upload";

type RhfFileUploadProps<TFieldValues extends FieldValues> = FileUploadProps & {
    name: FieldPath<TFieldValues>;
    label?: string;
    description?: string;
    rules?: Parameters<typeof FormField<TFieldValues, FieldPath<TFieldValues>>>[0]["rules"];
};

export function RhfFileUpload<TFieldValues extends FieldValues>({
    name,
    label,
    description,
    rules,
    ...props
}: RhfFileUploadProps<TFieldValues>) {
    return (
        <FormField
            name={name}
            rules={rules}
            render={({ field }) => (
                <FormItem>
                    {label ? <FormLabel>{label}</FormLabel> : null}
                    <FileUpload
                        {...props}
                        value={Array.isArray(field.value) ? field.value : []}
                        onChange={(files) => field.onChange(files)}
                    />
                    {description ? <FormDescription>{description}</FormDescription> : null}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
