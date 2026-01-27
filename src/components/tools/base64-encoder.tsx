"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/buttion";
import { Typography } from "@/components/ui/typography";
import { CopyButton } from "@/components/copy-button";

export function Base64Tool() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState<"encode" | "decode">("encode");

    const handleEncode = () => {
        try {
            const encoded = btoa(input);
            setOutput(encoded);
        } catch {
            setOutput("Error: Invalid input for encoding");
        }
    };

    const handleDecode = () => {
        try {
            const decoded = atob(input);
            setOutput(decoded);
        } catch {
            setOutput("Error: Invalid Base64 string");
        }
    };

    const handleProcess = () => {
        if (mode === "encode") {
            handleEncode();
        } else {
            handleDecode();
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Button
                    variant={mode === "encode" ? "solid" : "outline"}
                    onClick={() => setMode("encode")}
                >
                    Encode
                </Button>
                <Button
                    variant={mode === "decode" ? "solid" : "outline"}
                    onClick={() => setMode("decode")}
                >
                    Decode
                </Button>
            </div>

            <div className="space-y-2">
                <Typography variant="caption">Input</Typography>
                <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 to decode..."}
                    rows={4}
                />
            </div>

            <Button onClick={handleProcess}>
                {mode === "encode" ? "Encode to Base64" : "Decode from Base64"}
            </Button>

            {output && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Typography variant="caption">Output</Typography>
                        <CopyButton text={output} />
                    </div>
                    <Textarea value={output} readOnly rows={4} />
                </div>
            )}
        </div>
    );
}
