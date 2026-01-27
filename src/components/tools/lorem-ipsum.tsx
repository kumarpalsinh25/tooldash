"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/buttion";
import { Typography } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { CopyButton } from "@/components/copy-button";

const LOREM_WORDS = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
    "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
    "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
    "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
    "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
    "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
    "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
    "deserunt", "mollit", "anim", "id", "est", "laborum"
];

function generateWords(count: number): string {
    return Array.from({ length: count }, () =>
        LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]
    ).join(" ");
}

function generateSentence(): string {
    const wordCount = Math.floor(Math.random() * 10) + 5;
    const sentence = generateWords(wordCount);
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
}

function generateParagraph(): string {
    const sentenceCount = Math.floor(Math.random() * 4) + 3;
    return Array.from({ length: sentenceCount }, () => generateSentence()).join(" ");
}

export function LoremIpsumTool() {
    const [output, setOutput] = useState("");
    const [count, setCount] = useState(3);
    const [type, setType] = useState<"paragraphs" | "sentences" | "words">("paragraphs");

    const handleGenerate = () => {
        let result = "";
        switch (type) {
            case "paragraphs":
                result = Array.from({ length: count }, () => generateParagraph()).join("\n\n");
                break;
            case "sentences":
                result = Array.from({ length: count }, () => generateSentence()).join(" ");
                break;
            case "words":
                result = generateWords(count);
                break;
        }
        setOutput(result);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-end gap-3">
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
                <div className="space-y-2">
                    <Typography variant="caption">Type</Typography>
                    <Select
                        value={type}
                        onChange={(e) => setType(e.target.value as typeof type)}
                    >
                        <option value="paragraphs">Paragraphs</option>
                        <option value="sentences">Sentences</option>
                        <option value="words">Words</option>
                    </Select>
                </div>
                <Button onClick={handleGenerate}>Generate</Button>
            </div>

            {output && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Typography variant="caption">Generated Text</Typography>
                        <CopyButton text={output} />
                    </div>
                    <Textarea value={output} readOnly rows={10} />
                </div>
            )}
        </div>
    );
}
