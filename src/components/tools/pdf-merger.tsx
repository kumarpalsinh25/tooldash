"use client";

import { useState, useEffect, useCallback } from "react";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Merge, Download, GripVertical } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { PDFDocument } from 'pdf-lib';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
    id: string;
    file: File;
    thumbnail: string | null;
}

function SortableItem({ id, file, thumbnail }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center justify-between p-3 border rounded ${isDragging ? 'opacity-50' : ''}`}
        >
            <div className="flex items-center gap-3 min-w-0 flex-1">
                <button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing shrink-0"
                >
                    <Icon icon={GripVertical} size="sm" />
                </button>
                {thumbnail ? (
                    <img
                        src={thumbnail}
                        alt="PDF thumbnail"
                        className="max-h-16 max-w-24 object-contain rounded border shrink-0"
                    />
                ) : (
                    <div className="w-24 h-16 bg-muted rounded border flex items-center justify-center shrink-0">
                        <span className="text-xs text-muted-foreground">PDF</span>
                    </div>
                )}
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
            </div>
        </div>
    );
}

export function PdfMergerTool() {
    const [files, setFiles] = useState<File[]>([]);
    const [merging, setMerging] = useState(false);
    const [error, setError] = useState("");
    const [mergedPdf, setMergedPdf] = useState<{ name: string; blob: Blob } | null>(null);
    const [thumbnails, setThumbnails] = useState<Record<string, string | null>>({});

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleFileChange = (selectedFiles: File[]) => {
        setFiles(selectedFiles);
        setError("");
        setMergedPdf(null);
    };

    const generateThumbnail = useCallback(async (file: File, id: string) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/generate-thumbnail', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setThumbnails(prev => ({ ...prev, [id]: data.thumbnail }));
            } else {
                console.error('Failed to generate thumbnail');
                setThumbnails(prev => ({ ...prev, [id]: null }));
            }
        } catch (err) {
            console.error('Error generating thumbnail:', err);
            setThumbnails(prev => ({ ...prev, [id]: null }));
        }
    }, []);

    useEffect(() => {
        files.forEach((file, index) => {
            const id = `${file.name}-${index}`;
            if (thumbnails[id] === undefined) {
                generateThumbnail(file, id);
            }
        });
    }, [files, generateThumbnail]);

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setFiles((items) => {
                const oldIndex = items.findIndex((item) => `${item.name}-${items.indexOf(item)}` === active.id);
                const newIndex = items.findIndex((item) => `${item.name}-${items.indexOf(item)}` === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

    const mergePdfs = async () => {
        if (files.length < 2) {
            setError("Please select at least two PDF files to merge.");
            return;
        }

        setMerging(true);
        setError("");
        setMergedPdf(null);

        try {
            const mergedPdfDoc = await PDFDocument.create();

            for (const file of files) {
                const pdfBytes = await file.arrayBuffer();
                const pdfDoc = await PDFDocument.load(pdfBytes);
                const pages = await mergedPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
                pages.forEach(page => mergedPdfDoc.addPage(page));
            }

            const pdfBytes = await mergedPdfDoc.save();
            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
            const name = "merged.pdf";
            setMergedPdf({ name, blob });

        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred while merging the PDFs.");
        } finally {
            setMerging(false);
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
                    <CardTitle>Upload PDF Files</CardTitle>
                    <CardDescription>
                        Select multiple PDF files to merge. You can reorder them before merging.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <FileUpload
                        value={files}
                        onChange={handleFileChange}
                        accept=".pdf"
                        multiple
                        emptyText="Drop PDF files here or click to upload"
                    />
                </CardContent>
            </Card>

            {files.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Reorder Files</CardTitle>
                        <CardDescription>
                            Adjust the order of the PDF files before merging.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext items={files.map((file, index) => `${file.name}-${index}`)} strategy={verticalListSortingStrategy}>
                                {files.map((file, index) => {
                                    const id = `${file.name}-${index}`;
                                    return (
                                        <SortableItem
                                            key={id}
                                            id={id}
                                            file={file}
                                            thumbnail={thumbnails[id] || null}
                                        />
                                    );
                                })}
                            </SortableContext>
                        </DndContext>

                        <div className="pt-4">
                            <Button onClick={mergePdfs} disabled={merging || files.length < 2} loading={merging} leftIcon={<Icon icon={Merge} size="md" />}>
                                {merging ? "Merging..." : "Merge PDFs"}
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

            {mergedPdf && (
                <Card>
                    <CardHeader>
                        <CardTitle>Merged PDF</CardTitle>
                        <CardDescription>
                            Your PDFs have been merged successfully.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-3 border rounded">
                            <span className="text-sm font-medium">{mergedPdf.name}</span>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => downloadFile(mergedPdf.blob, mergedPdf.name)}
                                leftIcon={<Icon icon={Download} size="sm" />}
                            >
                                Download
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}