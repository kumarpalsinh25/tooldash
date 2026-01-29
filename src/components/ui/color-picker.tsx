"use client";

import { useState, useEffect, useRef } from "react";
import { HexColorPicker } from "react-colorful";

type ColorPickerProps = {
    value: string;
    onChange: (value: string) => void;
    className?: string;
};

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
    const [internalColor, setInternalColor] = useState(value);
    const pickerRef = useRef<HTMLDivElement>(null);
    const currentColorRef = useRef(value);

    useEffect(() => {
        setInternalColor(value);
        currentColorRef.current = value;
    }, [value]);

    const handleMouseUp = () => {
        onChange(currentColorRef.current);
    };

    useEffect(() => {
        const picker = pickerRef.current;
        if (picker) {
            picker.addEventListener("mouseup", handleMouseUp);
            picker.addEventListener("touchend", handleMouseUp);
            return () => {
                picker.removeEventListener("mouseup", handleMouseUp);
                picker.removeEventListener("touchend", handleMouseUp);
            };
        }
    }, []);

    return (
        <div ref={pickerRef} className={className}>
            <HexColorPicker
                color={internalColor}
                onChange={(color) => {
                    setInternalColor(color);
                    currentColorRef.current = color;
                }}
            />
        </div>
    );
}