"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/buttion";
import { Typography } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/copy-button";

export function HashGeneratorTool() {
    const [input, setInput] = useState("");
    const [hashes, setHashes] = useState<Record<string, string>>({});

    const generateHashes = async () => {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);

        const algorithms = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
        const results: Record<string, string> = {};

        for (const algo of algorithms) {
            const hashBuffer = await crypto.subtle.digest(algo, data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
            results[algo] = hashHex;
        }

        setHashes(results);
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Typography variant="caption">Input Text</Typography>
                <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter text to hash..."
                    rows={3}
                />
            </div>

            <Button onClick={generateHashes}>Generate Hashes</Button>

            {Object.keys(hashes).length > 0 && (
                <div className="space-y-3">
                    {Object.entries(hashes).map(([algo, hash]) => (
                        <div key={algo} className="space-y-1">
                            <div className="flex items-center justify-between">
                                <Typography variant="caption">{algo}</Typography>
                                <CopyButton text={hash} />
                            </div>
                            <Input
                                value={hash}
                                readOnly
                                className="font-mono text-xs"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
