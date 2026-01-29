"use client";

import { useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Unlock, Download } from "lucide-react";
import { Icon } from "@/components/ui/icon";

export function PdfUnlockerTool() {
    const [file, setFile] = useState<File | null>(null);
    const [password, setPassword] = useState("");
    const [unlocking, setUnlocking] = useState(false);
    const [unlockedPdf, setUnlockedPdf] = useState<{ name: string; blob: Blob } | null>(null);
    const [error, setError] = useState("");

    const handleFileChange = (files: File[]) => {
        setFile(files[0] || null);
        setError("");
        setUnlockedPdf(null);
    };

    const unlockPdf = async () => {
        if (!file || !password || password.trim() === '') {
            setError("Please select a PDF file and enter the password.");
            return;
        }

        setUnlocking(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('password', password);

            const response = await fetch('/api/pdf/unlock', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to unlock PDF');
            }

            const blob = await response.blob();
            const name = `unlocked_${file.name}`;
            setUnlockedPdf({ name, blob });

        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred while unlocking the PDF. Please check the password.");
        } finally {
            setUnlocking(false);
        }
    };

    const downloadFile = (blob: Blob, name: string) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Upload PDF File</CardTitle>
                    <CardDescription>
                        Select the password-protected PDF file you want to unlock.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FileUpload
                        value={file ? [file] : []}
                        onChange={handleFileChange}
                        accept=".pdf"
                        emptyText="Drop a PDF file here or click to upload"
                    />
                    <Input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button onClick={unlockPdf} disabled={unlocking || !file || !password} loading={unlocking} leftIcon={<Icon icon={Unlock} size="md" />}>
                        {unlocking ? "Unlocking..." : "Unlock PDF"}
                    </Button>
                </CardContent>
            </Card>

            {unlockedPdf && (
                <Card>
                    <CardHeader>
                        <CardTitle>Unlocked PDF</CardTitle>
                        <CardDescription>
                            Your PDF has been unlocked successfully. Download it below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-3 border rounded">
                            <span className="text-sm font-medium">{unlockedPdf.name}</span>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => downloadFile(unlockedPdf.blob, unlockedPdf.name)}
                                leftIcon={<Icon icon={Download} size="sm" />}
                            >
                                Download
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200">
                    {error}
                </div>
            )}
        </div>
    );
}