"use client";

import { useState } from "react";
import { Button } from "@/components/ui/buttion";
import { Typography } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/copy-button";

function generateUUID(): string {
    return crypto.randomUUID();
}

export function UuidGeneratorTool() {
    const [uuids, setUuids] = useState<string[]>([]);
    const [count, setCount] = useState(1);

    const handleGenerate = () => {
        const newUuids = Array.from({ length: count }, () => generateUUID());
        setUuids(newUuids);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-end gap-3">
                <div className="space-y-2">
                    <Typography variant="caption">Count</Typography>
                    <Input
                        type="number"
                        min={1}
                        max={100}
                        value={count}
                        onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                        className="w-24"
                    />
                </div>
                <Button onClick={handleGenerate}>Generate UUIDs</Button>
            </div>

            {uuids.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Typography variant="caption">Generated UUIDs</Typography>
                        {uuids.length > 1 && (
                            <CopyButton text={uuids.join("\n")}>Copy All</CopyButton>
                        )}
                    </div>
                    <div className="space-y-2">
                        {uuids.map((uuid, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <Input
                                    value={uuid}
                                    readOnly
                                    className="font-mono text-sm"
                                />
                                <CopyButton text={uuid} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
