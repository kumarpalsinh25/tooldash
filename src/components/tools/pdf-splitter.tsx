"use client";

import { useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardActions } from "@/components/ui/card";
import { Scissors, Download } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

export function PdfSplitterTool() {
    const [file, setFile] = useState<File | null>(null);
    const [totalPages, setTotalPages] = useState<number | null>(null);

    const [ranges, setRanges] = useState<{ start: string; end: string }[]>([{ start: "", end: "" }]);

    const [splitting, setSplitting] = useState(false);
    const [error, setError] = useState("");
    const [splitPdfs, setSplitPdfs] = useState<{ name: string; blob: Blob }[]>([]);

    const handleFileChange = async (files: File[]) => {
        const selectedFile = files[0] || null;
        setFile(selectedFile);
        setError("");
        setSplitPdfs([]);
        if (selectedFile) {
            try {
                const pdfBytes = await selectedFile.arrayBuffer();
                const pdfDoc = await PDFDocument.load(pdfBytes);
                setTotalPages(pdfDoc.getPageCount());
            } catch (err) {
                setError("Failed to load PDF. Please select a valid PDF file.");
                setTotalPages(null);
            }
        } else {
            setTotalPages(null);
        }
    };

    const addRange = () => {
        setRanges([...ranges, { start: "", end: "" }]);
    };

    const removeRange = (index: number) => {
        if (ranges.length > 1) {
            setRanges(ranges.filter((_, i) => i !== index));
        }
    };

    const updateRange = (index: number, field: 'start' | 'end', value: string) => {
        const newRanges = [...ranges];
        newRanges[index][field] = value;
        setRanges(newRanges);
    };

    const getRanges = (): number[][] => {
        if (!totalPages) throw new Error("Total pages not available.");

        const parsed: number[][] = [];
        for (const range of ranges) {
            const start = parseInt(range.start, 10);
            const end = parseInt(range.end, 10);
            if (isNaN(start) || isNaN(end) || start < 1 || end < start || end > totalPages) {
                throw new Error(`Invalid range: ${start}-${end}`);
            }
            parsed.push([start, end]);
        }
        return parsed;
    };

    const splitPdf = async () => {
        if (!file || !totalPages) {
            setError("Please select a PDF file.");
            return;
        }

        setSplitting(true);
        setError("");
        setSplitPdfs([]);

        try {
            const rangeList = getRanges();
            if (rangeList.length === 0) throw new Error("No valid ranges to split.");

            const pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes);

            // Create new PDFs for each range
            const newPdfs: { name: string; blob: Blob }[] = [];
            for (let i = 0; i < rangeList.length; i++) {
                const [start, end] = rangeList[i];
                const newPdf = await PDFDocument.create();
                const pages = await newPdf.copyPages(pdfDoc, Array.from({ length: end - start + 1 }, (_, j) => start - 1 + j));
                pages.forEach(page => newPdf.addPage(page));
                const pdfBytes = await newPdf.save();
                const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
                const name = `${file.name.replace('.pdf', '')}_part${i + 1}.pdf`;
                newPdfs.push({ name, blob });
            }

            setSplitPdfs(newPdfs);

        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred while splitting the PDF.");
        } finally {
            setSplitting(false);
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

    const downloadAll = async () => {
        const zip = new JSZip();
        splitPdfs.forEach(({ name, blob }) => {
            zip.file(name, blob);
        });
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        downloadFile(zipBlob, `${file!.name.replace('.pdf', '')}_split.zip`);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Upload PDF File</CardTitle>
                    <CardDescription>
                        Select the PDF file you want to split into multiple parts.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <FileUpload
                        value={file ? [file] : []}
                        onChange={handleFileChange}
                        accept=".pdf"
                        emptyText="Drop a PDF file here or click to upload"
                    />
                </CardContent>
            </Card>

            {file && totalPages && (
                <Card>
                    <CardHeader>
                        <CardTitle>Configure Split</CardTitle>
                        <CardDescription>
                            Your PDF has {totalPages} pages. Specify the page ranges to split.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Typography variant="caption">Page Ranges</Typography>
                                {ranges.map((range, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            placeholder="Start"
                                            value={range.start}
                                            onChange={(e) => updateRange(index, 'start', e.target.value)}
                                            min="1"
                                            max={totalPages?.toString()}
                                            className="w-20"
                                        />
                                        <span className="text-sm">-</span>
                                        <Input
                                            type="number"
                                            placeholder="End"
                                            value={range.end}
                                            onChange={(e) => updateRange(index, 'end', e.target.value)}
                                            min="1"
                                            max={totalPages?.toString()}
                                            className="w-20"
                                        />
                                        {ranges.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeRange(index)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addRange}
                                >
                                    Add Range
                                </Button>
                            </div>

                            <div className="pt-2">
                                <Typography variant="caption">
                                    Specify start and end pages for each range. Ranges must not overlap and be within 1 to {totalPages}.
                                </Typography>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button onClick={splitPdf} disabled={splitting} loading={splitting} leftIcon={<Icon icon={Scissors} size="md" />}>
                                {splitting ? "Splitting..." : "Split PDF"}
                            </Button>
                        </div>

                        {error && (
                            <div className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200">
                                {error}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {splitPdfs.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Split PDFs</CardTitle>
                        <CardDescription>
                            Your PDF has been split into {splitPdfs.length} parts.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {splitPdfs.map((pdf, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded">
                                    <span className="text-sm font-medium">{pdf.name}</span>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => downloadFile(pdf.blob, pdf.name)}
                                        leftIcon={<Icon icon={Download} size="sm" />}
                                    >
                                        Download
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardActions>
                        <Button onClick={downloadAll} leftIcon={<Icon icon={Download} size="sm" />}>
                            Download All as ZIP
                        </Button>
                    </CardActions>
                </Card>
            )}
        </div>
    );
}