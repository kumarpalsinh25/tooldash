"use client";

import * as React from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Select, type SelectProps } from "@/components/ui/select";

type RhfSelectProps<TFieldValues extends FieldValues> = SelectProps & {
    name: FieldPath<TFieldValues>;
    label?: string;
    description?: string;
    rules?: Parameters<typeof FormField<TFieldValues, FieldPath<TFieldValues>>>[0]["rules"];
};

export function RhfSelect<TFieldValues extends FieldValues>({
    name,
    label,
    description,
    rules,
    children,
    ...props
}: RhfSelectProps<TFieldValues>) {
    return (
        <FormField
            name={name}
            rules={rules}
            render={({ field }) => (
                <FormItem>
                    {label ? <FormLabel>{label}</FormLabel> : null}
                    <FormControl>
                        <Select {...props} {...field}>
                            {children}
                        </Select>
                    </FormControl>
                    {description ? <FormDescription>{description}</FormDescription> : null}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
