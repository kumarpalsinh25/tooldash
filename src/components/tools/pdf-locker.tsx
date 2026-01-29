"use client";

import { useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Download } from "lucide-react";
import { Icon } from "@/components/ui/icon";

export function PdfLockerTool() {
    const [file, setFile] = useState<File | null>(null);
    const [password, setPassword] = useState("");
    const [locking, setLocking] = useState(false);
    const [lockedPdf, setLockedPdf] = useState<{ name: string; blob: Blob } | null>(null);
    const [error, setError] = useState("");

    const handleFileChange = (files: File[]) => {
        setFile(files[0] || null);
        setError("");
        setLockedPdf(null);
    };

    const lockPdf = async () => {
        if (!file || !password || password.trim() === '') {
            setError("Please select a PDF file and enter a password.");
            return;
        }

        setLocking(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('password', password);

            const response = await fetch('/api/pdf/lock', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to lock PDF');
            }

            const blob = await response.blob();
            const name = `locked_${file.name}`;
            setLockedPdf({ name, blob });

        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred while locking the PDF.");
        } finally {
            setLocking(false);
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
                        Select the PDF file you want to lock with a password.
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
                    <Button onClick={lockPdf} disabled={locking || !file || !password} loading={locking} leftIcon={<Icon icon={Lock} size="md" />}>
                        {locking ? "Locking..." : "Lock PDF"}
                    </Button>
                </CardContent>
            </Card>

            {lockedPdf && (
                <Card>
                    <CardHeader>
                        <CardTitle>Locked PDF</CardTitle>
                        <CardDescription>
                            Your PDF has been locked with the password. Download it below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-3 border rounded">
                            <span className="text-sm font-medium">{lockedPdf.name}</span>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => downloadFile(lockedPdf.blob, lockedPdf.name)}
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