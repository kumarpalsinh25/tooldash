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
import { Checkbox, type CheckboxProps } from "@/components/ui/checkbox";

type RhfCheckboxProps<TFieldValues extends FieldValues> = CheckboxProps & {
    name: FieldPath<TFieldValues>;
    label?: string;
    description?: string;
    rules?: Parameters<typeof FormField<TFieldValues, FieldPath<TFieldValues>>>[0]["rules"];
};

export function RhfCheckbox<TFieldValues extends FieldValues>({
    name,
    label,
    description,
    rules,
    ...props
}: RhfCheckboxProps<TFieldValues>) {
    return (
        <FormField
            name={name}
            rules={rules}
            render={({ field }) => (
                <FormItem className="flex items-start gap-3 space-y-0">
                    <FormControl>
                        <Checkbox
                            {...props}
                            checked={Boolean(field.value)}
                            onChange={(event) => field.onChange(event.target.checked)}
                        />
                    </FormControl>
                    <div className="space-y-1">
                        {label ? <FormLabel>{label}</FormLabel> : null}
                        {description ? <FormDescription>{description}</FormDescription> : null}
                        <FormMessage />
                    </div>
                </FormItem>
            )}
        />
    );
}
