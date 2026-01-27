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
import { Input, type InputProps } from "@/components/ui/input";

type RhfInputProps<TFieldValues extends FieldValues> = InputProps & {
    name: FieldPath<TFieldValues>;
    label?: string;
    description?: string;
    rules?: Parameters<typeof FormField<TFieldValues, FieldPath<TFieldValues>>>[0]["rules"];
};

export function RhfInput<TFieldValues extends FieldValues>({
    name,
    label,
    description,
    rules,
    ...props
}: RhfInputProps<TFieldValues>) {
    return (
        <FormField
            name={name}
            rules={rules}
            render={({ field }) => (
                <FormItem>
                    {label ? <FormLabel>{label}</FormLabel> : null}
                    <FormControl>
                        <Input {...props} {...field} />
                    </FormControl>
                    {description ? <FormDescription>{description}</FormDescription> : null}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
