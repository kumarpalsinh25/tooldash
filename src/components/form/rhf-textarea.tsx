"use client";

import type { FieldPath, FieldValues } from "react-hook-form";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea, type TextareaProps } from "@/components/ui/textarea";

type RhfTextareaProps<TFieldValues extends FieldValues> = TextareaProps & {
    name: FieldPath<TFieldValues>;
    label?: string;
    description?: string;
    rules?: Parameters<typeof FormField<TFieldValues, FieldPath<TFieldValues>>>[0]["rules"];
};

export function RhfTextarea<TFieldValues extends FieldValues>({
    name,
    label,
    description,
    rules,
    ...props
}: RhfTextareaProps<TFieldValues>) {
    return (
        <FormField
            name={name}
            rules={rules}
            render={({ field }) => (
                <FormItem>
                    {label ? <FormLabel>{label}</FormLabel> : null}
                    <FormControl>
                        <Textarea {...props} {...field} />
                    </FormControl>
                    {description ? <FormDescription>{description}</FormDescription> : null}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
