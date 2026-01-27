"use client";

import * as React from "react";
import {
    Controller,
    FormProvider,
    type ControllerProps,
    type FieldPath,
    type FieldValues,
    useFormContext,
} from "react-hook-form";
import { cn } from "@/lib/cn";

const FormFieldContext = React.createContext<{ name: string } | null>(null);
const FormItemContext = React.createContext<{ id: string } | null>(null);

export const Form = FormProvider;

export function FormField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>(
    props: ControllerProps<TFieldValues, TName>
) {
    const methods = useFormContext<TFieldValues>();
    return (
        <FormFieldContext.Provider value={{ name: props.name }}>
            <Controller {...props} control={props.control ?? methods.control} />
        </FormFieldContext.Provider>
    );
}

export function FormItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    const id = React.useId();
    return (
        <FormItemContext.Provider value={{ id }}>
            <div className={cn("space-y-1.5", className)} {...props} />
        </FormItemContext.Provider>
    );
}

function useFormField() {
    const fieldContext = React.useContext(FormFieldContext);
    const itemContext = React.useContext(FormItemContext);
    const { getFieldState, formState } = useFormContext();

    if (!fieldContext) {
        throw new Error("FormField must be used within a FormField component.");
    }

    const fieldState = getFieldState(fieldContext.name, formState);
    const id = itemContext?.id ?? fieldContext.name;

    return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        ...fieldState,
    };
}

export function FormLabel({
    className,
    ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
    const { formItemId } = useFormField();
    return (
        <label
            className={cn("text-sm font-medium text-foreground", className)}
            htmlFor={formItemId}
            {...props}
        />
    );
}

export function FormControl({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    const { formItemId, formDescriptionId, formMessageId, error } = useFormField();
    const describedBy = error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId;

    return (
        <div className={cn(className)} {...props}>
            {React.Children.map(props.children, (child) => {
                if (!React.isValidElement(child)) return child;
                return React.cloneElement(
                    child as React.ReactElement<React.HTMLAttributes<HTMLElement>>,
                    {
                        id: formItemId,
                        "aria-describedby": describedBy,
                        "aria-invalid": Boolean(error) || undefined,
                    }
                );
            })}
        </div>
    );
}

export function FormDescription({
    className,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
    const { formDescriptionId } = useFormField();
    return (
        <p
            id={formDescriptionId}
            className={cn("text-sm text-muted-foreground", className)}
            {...props}
        />
    );
}

export function FormMessage({
    className,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
    const { error, formMessageId } = useFormField();
    if (!error?.message) return null;
    return (
        <p
            id={formMessageId}
            className={cn("text-sm text-red-600", className)}
            {...props}
        >
            {String(error.message)}
        </p>
    );
}
