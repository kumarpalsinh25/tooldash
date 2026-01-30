"use client";

import { useState, Fragment } from "react";
import { createPortal } from "react-dom";
import { Combobox, Transition, Portal } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface SearchableSelectProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = "Select...",
    className,
}: SearchableSelectProps) {
    const [query, setQuery] = useState("");

    const sortedOptions = [...options].sort();
    const filteredOptions =
        query === ""
            ? sortedOptions.slice(0, 20)
            : sortedOptions.filter((option) =>
                  option.toLowerCase().includes(query.toLowerCase())
              ).slice(0, 20);

    return (
        <Combobox value={value} onChange={onChange}>
            <div className={cn("relative", className)}>
                <div className={cn("relative w-full cursor-default overflow-hidden rounded-md bg-background text-left border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:text-sm", className)}>
                    <Combobox.Input
                        className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-foreground bg-transparent focus:ring-0"
                        displayValue={(val: string) => val}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={placeholder}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronDown
                            className="h-5 w-5 text-muted-foreground"
                            aria-hidden="true"
                        />
                    </Combobox.Button>
                </div>
                <Portal>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery("")}
                    >
                        <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredOptions.length === 0 && query !== "" ? (
                            <div className="relative cursor-default select-none py-2 px-4 text-muted-foreground">
                                Nothing found.
                            </div>
                        ) : (
                            filteredOptions.map((option) => (
                                <Combobox.Option
                                    key={option}
                                    className={({ active }) =>
                                        cn(
                                            "relative cursor-default select-none py-2 pl-10 pr-4",
                                            active ? "bg-accent text-accent-foreground" : "text-popover-foreground"
                                        )
                                    }
                                    value={option}
                                >
                                    {({ selected, active }) => (
                                        <>
                                            <span
                                                className={cn(
                                                    "block truncate",
                                                    selected ? "font-medium" : "font-normal"
                                                )}
                                            >
                                                {option}
                                            </span>
                                            {selected ? (
                                                <span
                                                    className={cn(
                                                        "absolute inset-y-0 left-0 flex items-center pl-3",
                                                        active ? "text-accent-foreground" : "text-muted-foreground"
                                                    )}
                                                >
                                                    <Check className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </Combobox.Option>
                            ))
                        )}
                    </Combobox.Options>
                    </Transition>
                </Portal>
            </div>
        </Combobox>
    );
}