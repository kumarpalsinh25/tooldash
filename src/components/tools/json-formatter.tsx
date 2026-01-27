"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/code-editor";
import { Button } from "@/components/ui/buttion";
import { Typography } from "@/components/ui/typography";
import { CopyButton } from "@/components/copy-button";

export function JsonFormatterTool() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");

    const handleFormat = () => {
        try {
            const parsed = JSON.parse(input);
            setOutput(JSON.stringify(parsed, null, 2));
            setError("");
        } catch (e) {
            setError(e instanceof Error ? e.message : "Invalid JSON");
            setOutput("");
        }
    };

    const handleMinify = () => {
        try {
            const parsed = JSON.parse(input);
            setOutput(JSON.stringify(parsed));
            setError("");
        } catch (e) {
            setError(e instanceof Error ? e.message : "Invalid JSON");
            setOutput("");
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <CodeEditor
                    label="Input JSON"
                    value={input}
                    onChange={setInput}
                    language="json"
                    placeholder='{"key": "value"}'
                    size="md"
                />
            </div>

            <div className="flex gap-2">
                <Button onClick={handleFormat}>Format</Button>
                <Button variant="outline" onClick={handleMinify}>
                    Minify
                </Button>
            </div>

            {error && (
                <Typography color="error" variant="body2">
                    {error}
                </Typography>
            )}

            {output && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Typography variant="caption">Output</Typography>
                        <CopyButton text={output} />
                    </div>
                    <CodeEditor
                        value={output}
                        onChange={() => {}}
                        language="json"
                        readOnly
                        size="lg"
                    />
                </div>
            )}
        </div>
    );
}
