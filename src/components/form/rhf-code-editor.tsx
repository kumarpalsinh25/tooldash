"use client";

import type { FieldPath, FieldValues } from "react-hook-form";
import {
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { CodeEditor, type CodeEditorProps } from "@/components/code-editor";

type RhfCodeEditorProps<TFieldValues extends FieldValues> = CodeEditorProps & {
    name: FieldPath<TFieldValues>;
    label?: string;
    description?: string;
    rules?: Parameters<typeof FormField<TFieldValues, FieldPath<TFieldValues>>>[0]["rules"];
};

export function RhfCodeEditor<TFieldValues extends FieldValues>({
    name,
    label,
    description,
    rules,
    ...props
}: RhfCodeEditorProps<TFieldValues>) {
    return (
        <FormField
            name={name}
            rules={rules}
            render={({ field }) => (
                <FormItem>
                    {label ? <FormLabel>{label}</FormLabel> : null}
                    <CodeEditor
                        {...props}
                        value={field.value ?? ""}
                        onChange={(value) => field.onChange(value)}
                    />
                    {description ? <FormDescription>{description}</FormDescription> : null}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
