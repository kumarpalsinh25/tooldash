"use client";

import { useState, useEffect, useCallback } from "react";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GripVertical, RotateCw, Trash2, Download, Merge } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { PDFDocument, degrees } from 'pdf-lib';
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



interface PageItem {
    id: string;
    pdfIndex: number;
    pageIndex: number;
    rotation: number;
    thumbnail: string;
}

interface SortablePageProps {
    page: PageItem;
    onRotate: (id: string) => void;
    onDelete: (id: string) => void;
}

function SortablePage({ page, onRotate, onDelete }: SortablePageProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: page.id });

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
            <div className="flex items-center gap-3">
                <button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing shrink-0"
                >
                    <Icon icon={GripVertical} size="sm" />
                </button>
                {page.thumbnail ? (
                    <img
                        src={page.thumbnail}
                        alt={`Page ${page.pageIndex + 1}`}
                        className="max-h-20 max-w-32 object-contain rounded border shrink-0"
                    />
                ) : (
                    <div className="w-32 h-20 bg-muted rounded border flex items-center justify-center shrink-0">
                        <span className="text-xs text-muted-foreground">Page {page.pageIndex + 1}</span>
                    </div>
                )}
                <div>
                    <p className="text-sm font-medium">Page {page.pageIndex + 1}</p>
                    <p className="text-xs text-muted-foreground">Rotation: {page.rotation}°</p>
                </div>
            </div>
            <div className="flex gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onRotate(page.id)}
                    leftIcon={<Icon icon={RotateCw} size="sm" />}
                >
                    Rotate
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDelete(page.id)}
                    leftIcon={<Icon icon={Trash2} size="sm" />}
                >
                    Delete
                </Button>
            </div>
        </div>
    );
}

export function PdfOrganizerTool() {
    const [files, setFiles] = useState<File[]>([]);
    const [pages, setPages] = useState<PageItem[]>([]);
    const [pdfDocs, setPdfDocs] = useState<PDFDocument[]>([]);
    const [organizing, setOrganizing] = useState(false);
    const [error, setError] = useState("");
    const [organizedPdf, setOrganizedPdf] = useState<{ name: string; blob: Blob } | null>(null);
    const [loading, setLoading] = useState(false);
    const [pdfjsLib, setPdfjsLib] = useState<any>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        import('pdfjs-dist').then((pdfjs) => {
            // pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js'; // Disable for simplicity
            setPdfjsLib(pdfjs);
        }).catch(() => {
            console.error('Failed to load PDF.js');
        });
    }, []);

    const generateThumbnail = useCallback(async (file: File, pageNum: number): Promise<string> => {
        if (!pdfjsLib) return '';

        try {
            console.log(`Generating thumbnail for page ${pageNum}`);
            const arrayBuffer = await file.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 0.3 });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d')!;
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            };

            await page.render(renderContext).promise;
            const dataURL = canvas.toDataURL();
            console.log(`Thumbnail generated for page ${pageNum}, size: ${dataURL.length}`);
            return dataURL;
        } catch (err) {
            console.error(`Error generating thumbnail for page ${pageNum}:`, err);
            return '';
        }
    }, [pdfjsLib]);

    const loadPdfs = useCallback(async (selectedFiles: File[]) => {
        setLoading(true);
        setError("");
        setPages([]);
        setPdfDocs([]);
        setOrganizedPdf(null);

        const docs: PDFDocument[] = [];
        const pageList: PageItem[] = [];

        for (let fileIndex = 0; fileIndex < selectedFiles.length; fileIndex++) {
            const file = selectedFiles[fileIndex];
            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdfDoc = await PDFDocument.load(arrayBuffer);
                docs.push(pdfDoc);

                const numPages = pdfDoc.getPageCount();
                for (let pageIndex = 0; pageIndex < numPages; pageIndex++) {
                    // Generate thumbnail asynchronously
                    generateThumbnail(file, pageIndex + 1).then(thumbnail => {
                        if (thumbnail) {
                            console.log(`Updating thumbnail for ${fileIndex}-${pageIndex}`);
                            setPages(prev => prev.map(p =>
                                p.id === `${fileIndex}-${pageIndex}` ? { ...p, thumbnail } : p
                            ));
                        }
                    });
                    pageList.push({
                        id: `${fileIndex}-${pageIndex}`,
                        pdfIndex: fileIndex,
                        pageIndex,
                        rotation: 0,
                        thumbnail: '', // Placeholder initially
                    });
                }
            } catch (err) {
                setError(`Error loading ${file.name}: ${err instanceof Error ? err.message : 'Unknown error'}`);
                setLoading(false);
                return;
            }
        }

        setPdfDocs(docs);
        setPages(pageList);
        setLoading(false);
    }, []);

    const handleFileChange = (selectedFiles: File[]) => {
        setFiles(selectedFiles);
        if (selectedFiles.length > 0) {
            loadPdfs(selectedFiles);
        } else {
            setPages([]);
            setPdfDocs([]);
            setLoading(false);
        }
    };

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setPages((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

    const handleRotate = (id: string) => {
        setPages((prev) =>
            prev.map((page) =>
                page.id === id ? { ...page, rotation: (page.rotation + 90) % 360 } : page
            )
        );
    };

    const handleDelete = (id: string) => {
        setPages((prev) => prev.filter((page) => page.id !== id));
    };

    const organizePdfs = async () => {
        if (pages.length === 0) {
            setError("No pages to organize.");
            return;
        }

        setOrganizing(true);
        setError("");
        setOrganizedPdf(null);

        try {
            const mergedPdfDoc = await PDFDocument.create();

            for (const pageItem of pages) {
                const pdfDoc = pdfDocs[pageItem.pdfIndex];
                const [page] = await mergedPdfDoc.copyPages(pdfDoc, [pageItem.pageIndex]);
                page.setRotation(degrees(pageItem.rotation));
                mergedPdfDoc.addPage(page);
            }

            const pdfBytes = await mergedPdfDoc.save();
            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
            const name = "organized.pdf";
            setOrganizedPdf({ name, blob });

        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred while organizing the PDF.");
        } finally {
            setOrganizing(false);
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
                        Select one or more PDF files to organize their pages. You can reorder, rotate, and delete pages before merging.
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

            {(pages.length > 0 || loading) && (
                <Card>
                    <CardHeader>
                        <CardTitle>Organize Pages</CardTitle>
                        <CardDescription>
                            {loading ? 'Loading PDF pages...' : 'Reorder pages by dragging, rotate or delete individual pages.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                                    <p className="mt-2 text-sm text-muted-foreground">Generating page previews...</p>
                                </div>
                            </div>
                        ) : (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext items={pages.map((page) => page.id)} strategy={verticalListSortingStrategy}>
                                    {pages.map((page) => (
                                        <SortablePage
                                            key={page.id}
                                            page={page}
                                            onRotate={handleRotate}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        )}

                        <div className="pt-4">
                            <Button onClick={organizePdfs} disabled={organizing} loading={organizing} leftIcon={<Icon icon={Merge} size="md" />}>
                                {organizing ? "Organizing..." : "Organize & Download PDF"}
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

            {organizedPdf && (
                <Card>
                    <CardHeader>
                        <CardTitle>Organized PDF</CardTitle>
                        <CardDescription>
                            Your PDF has been organized successfully.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-3 border rounded">
                            <span className="text-sm font-medium">{organizedPdf.name}</span>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => downloadFile(organizedPdf.blob, organizedPdf.name)}
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