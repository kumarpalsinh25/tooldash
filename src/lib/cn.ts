import { twMerge } from "tailwind-merge";

type ClassValue = string | null | undefined | false;

export function cn(...classes: ClassValue[]) {
    return twMerge(classes.filter(Boolean).join(" "));
}
