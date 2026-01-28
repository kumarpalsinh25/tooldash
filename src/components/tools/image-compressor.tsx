"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import { Download } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import type { Point, Area } from "react-easy-crop";

interface FileData {
    file: File;
    originalSize: number;
    originalDimensions: { width: number; height: number } | null;
    cropSettings?: {
        crop: Point;
        zoom: number;
        croppedAreaPixels: Area | null;
    };
    compressedFile: Blob | null;
    compressedSize: number | null;
    compressedDimensions: { width: number; height: number } | null;
    status: 'pending' | 'processing' | 'completed' | 'error';
    error?: string;
}

export function ImageCompressorTool() {
    const [files, setFiles] = useState<FileData[]>([]);
    const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null);
    const [compressionPercent, setCompressionPercent] = useState(50);
    const [outputFormat, setOutputFormat] = useState<'jpeg' | 'jpg' | 'webp' | 'png' | 'bmp'>('jpeg');
    const [resizeEnabled, setResizeEnabled] = useState(false);
    const [resizeWidth, setResizeWidth] = useState<string>('');
    const [resizeHeight, setResizeHeight] = useState<string>('');
    const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
    const [cropEnabled, setCropEnabled] = useState(false);
    const [cropAspectRatio, setCropAspectRatio] = useState<string>('1:1');
    const [processing, setProcessing] = useState(false);
    const [currentFileIndex, setCurrentFileIndex] = useState<number | null>(null);

    const handleFileChange = async (selectedFiles: File[]) => {
        const newFileData: FileData[] = [];

        for (const file of selectedFiles) {
            try {
                const img = new Image();
                await new Promise<void>((resolve, reject) => {
                    img.onload = () => resolve();
                    img.onerror = () => reject(new Error("Failed to load image."));
                    img.src = URL.createObjectURL(file);
                });

                newFileData.push({
                    file,
                    originalSize: file.size,
                    originalDimensions: { width: img.width, height: img.height },
                    cropSettings: {
                        crop: { x: 0, y: 0 },
                        zoom: 1,
                        croppedAreaPixels: null
                    },
                    compressedFile: null,
                    compressedSize: null,
                    compressedDimensions: null,
                    status: 'pending'
                });
            } catch (error) {
                newFileData.push({
                    file,
                    originalSize: file.size,
                    originalDimensions: null,
                    compressedFile: null,
                    compressedSize: null,
                    compressedDimensions: null,
                    status: 'error',
                    error: error instanceof Error ? error.message : 'Failed to load image'
                });
            }
        }

        setFiles(newFileData);
        setSelectedFileIndex(newFileData.length > 0 ? 0 : null);
    };

    const processFile = async (fileData: FileData, index: number): Promise<FileData> => {
        if (!fileData.originalDimensions) {
            return { ...fileData, status: 'error', error: 'Invalid image dimensions' };
        }

        try {
            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                throw new Error("Canvas context not available.");
            }

            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = () => reject(new Error("Failed to load image."));
                img.src = URL.createObjectURL(fileData.file);
            });

            let sourceX = 0, sourceY = 0, sourceWidth = img.width, sourceHeight = img.height;
            let targetWidth = img.width, targetHeight = img.height;

            // Handle cropping
            if (cropEnabled && fileData.cropSettings?.croppedAreaPixels) {
                sourceX = fileData.cropSettings.croppedAreaPixels.x;
                sourceY = fileData.cropSettings.croppedAreaPixels.y;
                sourceWidth = fileData.cropSettings.croppedAreaPixels.width;
                sourceHeight = fileData.cropSettings.croppedAreaPixels.height;
            }

            // Handle resizing
            if (resizeEnabled) {
                const desiredWidth = resizeWidth ? parseInt(resizeWidth, 10) : null;
                const desiredHeight = resizeHeight ? parseInt(resizeHeight, 10) : null;

                if (desiredWidth && desiredHeight) {
                    targetWidth = desiredWidth;
                    targetHeight = desiredHeight;
                } else if (desiredWidth && maintainAspectRatio) {
                    targetWidth = desiredWidth;
                    targetHeight = Math.round(desiredWidth / (sourceWidth / sourceHeight));
                } else if (desiredHeight && maintainAspectRatio) {
                    targetHeight = desiredHeight;
                    targetWidth = Math.round(desiredHeight * (sourceWidth / sourceHeight));
                } else if (desiredWidth) {
                    targetWidth = desiredWidth;
                    targetHeight = Math.round(sourceHeight * (desiredWidth / sourceWidth)); // Scale proportionally
                } else if (desiredHeight) {
                    targetHeight = desiredHeight;
                    targetWidth = Math.round(sourceWidth * (desiredHeight / sourceHeight)); // Scale proportionally
                }
            }

            canvas.width = targetWidth;
            canvas.height = targetHeight;
            ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, targetWidth, targetHeight);

            const quality = compressionPercent / 100;
            let mimeType: string;
            let useQuality: number | undefined;

            switch (outputFormat) {
                case 'jpeg':
                case 'jpg':
                    mimeType = 'image/jpeg';
                    useQuality = quality;
                    break;
                case 'webp':
                    mimeType = 'image/webp';
                    useQuality = quality;
                    break;
                case 'png':
                    mimeType = 'image/png';
                    useQuality = undefined; // PNG is lossless
                    break;
                case 'bmp':
                    mimeType = 'image/bmp';
                    useQuality = undefined; // BMP doesn't support quality
                    break;
                default:
                    mimeType = 'image/jpeg';
                    useQuality = quality;
            }

            const blob = await new Promise<Blob>((resolve, reject) => {
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error("Failed to process image."));
                        }
                    },
                    mimeType,
                    useQuality
                );
            });

            return {
                ...fileData,
                compressedFile: blob,
                compressedSize: blob.size,
                compressedDimensions: { width: targetWidth, height: targetHeight },
                status: 'completed'
            };
        } catch (err) {
            return {
                ...fileData,
                status: 'error',
                error: err instanceof Error ? err.message : "An error occurred while processing the image."
            };
        }
    };

    const compressImages = async () => {
        if (files.length === 0) {
            return;
        }

        setProcessing(true);
        setCurrentFileIndex(0);

        const updatedFiles = [...files];

        for (let i = 0; i < files.length; i++) {
            setCurrentFileIndex(i);
            updatedFiles[i] = { ...updatedFiles[i], status: 'processing' };
            setFiles([...updatedFiles]);

            const processedFile = await processFile(updatedFiles[i], i);
            updatedFiles[i] = processedFile;
            setFiles([...updatedFiles]);
        }

        setProcessing(false);
        setCurrentFileIndex(null);
    };

    const onCropChange = useCallback((crop: Point) => {
        if (selectedFileIndex !== null) {
            setFiles(prev => prev.map((file, index) =>
                index === selectedFileIndex
                    ? { ...file, cropSettings: { ...file.cropSettings!, crop } }
                    : file
            ));
        }
    }, [selectedFileIndex]);

    const onZoomChange = useCallback((zoom: number) => {
        if (selectedFileIndex !== null) {
            setFiles(prev => prev.map((file, index) =>
                index === selectedFileIndex
                    ? { ...file, cropSettings: { ...file.cropSettings!, zoom } }
                    : file
            ));
        }
    }, [selectedFileIndex]);

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        if (selectedFileIndex !== null) {
            setFiles(prev => prev.map((file, index) =>
                index === selectedFileIndex
                    ? { ...file, cropSettings: { ...file.cropSettings!, croppedAreaPixels } }
                    : file
            ));
        }
    }, [selectedFileIndex]);



    const selectedFile = selectedFileIndex !== null ? files[selectedFileIndex] : null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl mx-auto">
                    <Typography variant="h1" className="text-2xl font-bold text-gray-900">
                        Image Compressor
                    </Typography>
                    <Typography color="muted" className="mt-1">
                        Compress, resize, and crop multiple images with advanced controls
                    </Typography>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="grid grid-cols-12 gap-6">
                    {/* Upload & File Selection */}
                    <div className="col-span-12 lg:col-span-8">
                        <Card className="mb-6">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Upload Images</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FileUpload
                                    value={files.map(f => f.file)}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    multiple
                                    emptyText="Drop images here or click to upload"
                                />
                            </CardContent>
                        </Card>

                        {/* File Grid */}
                        {files.length > 0 && (
                            <Card className="mb-6">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">Selected Images ({files.length})</CardTitle>
                                        <Button
                                            onClick={compressImages}
                                            disabled={processing || files.length === 0}
                                            loading={processing}
                                            size="sm"
                                        >
                                            {processing
                                                ? `Processing... (${currentFileIndex !== null ? currentFileIndex + 1 : 0}/${files.length})`
                                                : `Process ${files.length} Image${files.length !== 1 ? 's' : ''}`
                                            }
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {files.map((fileData, index) => (
                                            <div
                                                key={index}
                                                className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                                                    selectedFileIndex === index
                                                        ? 'border-blue-500 ring-2 ring-blue-200'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                                onClick={() => setSelectedFileIndex(index)}
                                            >
                                                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                                                    <img
                                                        src={URL.createObjectURL(fileData.file)}
                                                        alt={fileData.file.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="p-2 bg-white">
                                                    <p className="text-xs font-medium truncate" title={fileData.file.name}>
                                                        {fileData.file.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {(fileData.originalSize / 1024).toFixed(1)} KB
                                                    </p>
                                                    <div className={`inline-block px-2 py-1 rounded text-xs mt-1 ${
                                                        fileData.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        fileData.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                        fileData.status === 'error' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {fileData.status}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Results Grid */}
                        {files.some(f => f.status === 'completed') && (
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">Processed Images</CardTitle>
                                        {files.filter(f => f.status === 'completed').length > 1 && (
                                            <Button
                                                size="sm"
                                                onClick={() => {
                                                    const completedFiles = files.filter(f => f.status === 'completed' && f.compressedFile);
                                                    completedFiles.forEach(fileData => {
                                                        if (fileData.compressedFile) {
                                                            const url = URL.createObjectURL(fileData.compressedFile);
                                                            const a = document.createElement('a');
                                                            let extension: string;
                                                            switch (outputFormat) {
                                                                case 'jpeg':
                                                                case 'jpg':
                                                                    extension = 'jpg';
                                                                    break;
                                                                case 'webp':
                                                                    extension = 'webp';
                                                                    break;
                                                                case 'png':
                                                                    extension = 'png';
                                                                    break;
                                                                case 'bmp':
                                                                    extension = 'bmp';
                                                                    break;
                                                                default:
                                                                    extension = 'jpg';
                                                            }
                                                            a.href = url;
                                                            a.download = `compressed_${fileData.file.name.replace(/\.[^/.]+$/, '')}.${extension}`;
                                                            document.body.appendChild(a);
                                                            a.click();
                                                            document.body.removeChild(a);
                                                            URL.revokeObjectURL(url);
                                                        }
                                                    });
                                                }}
                                                leftIcon={<Icon icon={Download} size="sm" />}
                                            >
                                                Download All
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {files.filter(f => f.status === 'completed').map((fileData, index) => (
                                            <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                                {fileData.compressedFile && (
                                                    <div className="aspect-square bg-gray-100">
                                                        <img
                                                            src={URL.createObjectURL(fileData.compressedFile)}
                                                            alt={`Processed ${fileData.file.name}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div className="p-3">
                                                    <h4 className="font-medium text-sm truncate" title={fileData.file.name}>
                                                        {fileData.file.name}
                                                    </h4>
                                                    <div className="mt-2 space-y-1 text-xs text-gray-600">
                                                        <div className="flex justify-between">
                                                            <span>Original:</span>
                                                            <span>{(fileData.originalSize / 1024).toFixed(1)} KB</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Compressed:</span>
                                                            <span>{(fileData.compressedSize! / 1024).toFixed(1)} KB</span>
                                                        </div>
                                                        <div className="flex justify-between font-medium text-green-600">
                                                            <span>Saved:</span>
                                                            <span>{((fileData.originalSize - fileData.compressedSize!) / 1024).toFixed(1)} KB</span>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        className="w-full mt-3"
                                                        onClick={() => {
                                                            if (fileData.compressedFile) {
                                                                const url = URL.createObjectURL(fileData.compressedFile);
                                                                const a = document.createElement('a');
                                                                let extension: string;
                                                                switch (outputFormat) {
                                                                    case 'jpeg':
                                                                    case 'jpg':
                                                                        extension = 'jpg';
                                                                        break;
                                                                    case 'webp':
                                                                        extension = 'webp';
                                                                        break;
                                                                    case 'png':
                                                                        extension = 'png';
                                                                        break;
                                                                    case 'bmp':
                                                                        extension = 'bmp';
                                                                        break;
                                                                    default:
                                                                        extension = 'jpg';
                                                                }
                                                                a.href = url;
                                                                a.download = `compressed_${fileData.file.name.replace(/\.[^/.]+$/, '')}.${extension}`;
                                                                document.body.appendChild(a);
                                                                a.click();
                                                                document.body.removeChild(a);
                                                                URL.revokeObjectURL(url);
                                                            }
                                                        }}
                                                        leftIcon={<Icon icon={Download} size="sm" />}
                                                    >
                                                        Download
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Settings Sidebar */}
                    <div className="col-span-12 lg:col-span-4">
                        <div className="sticky top-6 space-y-6">
                            {/* Global Settings */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">Global Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Output Format</label>
                                        <Select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value as 'jpeg' | 'jpg' | 'webp' | 'png' | 'bmp')}>
                                            <option value="jpeg">JPEG (Photos, lossy)</option>
                                            <option value="jpg">JPG (Same as JPEG)</option>
                                            <option value="webp">WebP (Modern, smaller)</option>
                                            <option value="png">PNG (Lossless, larger)</option>
                                            <option value="bmp">BMP (Uncompressed)</option>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Quality: {compressionPercent}%
                                        </label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="100"
                                            value={compressionPercent}
                                            onChange={(e) => setCompressionPercent(Number(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Resize Settings */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">Resize</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="resize-enabled"
                                            checked={resizeEnabled}
                                            onChange={(e) => setResizeEnabled(e.target.checked)}
                                        />
                                        <label htmlFor="resize-enabled" className="text-sm font-medium">
                                            Enable resizing
                                        </label>
                                    </div>

                                    {resizeEnabled && (
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="block text-xs mb-1">Width (px)</label>
                                                    <Input
                                                        type="number"
                                                        placeholder="Auto"
                                                        value={resizeWidth}
                                                        onChange={(e) => setResizeWidth(e.target.value)}
                                                        min="1"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs mb-1">Height (px)</label>
                                                    <Input
                                                        type="number"
                                                        placeholder="Auto"
                                                        value={resizeHeight}
                                                        onChange={(e) => setResizeHeight(e.target.value)}
                                                        min="1"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="maintain-aspect"
                                                    checked={maintainAspectRatio}
                                                    onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                                                />
                                                <label htmlFor="maintain-aspect" className="text-xs">
                                                    Maintain aspect ratio
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Crop Settings */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">Crop</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="crop-enabled"
                                            checked={cropEnabled}
                                            onChange={(e) => setCropEnabled(e.target.checked)}
                                        />
                                        <label htmlFor="crop-enabled" className="text-sm font-medium">
                                            Enable cropping
                                        </label>
                                    </div>

                                    {cropEnabled && selectedFile && (
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm mb-2">Aspect Ratio</label>
                                                <Select value={cropAspectRatio} onChange={(e) => setCropAspectRatio(e.target.value)}>
                                                    <option value="1:1">Square (1:1)</option>
                                                    <option value="4:3">Standard (4:3)</option>
                                                    <option value="16:9">Widescreen (16:9)</option>
                                                    <option value="3:2">Photo (3:2)</option>
                                                    <option value="21:9">Ultrawide (21:9)</option>
                                                    <option value="free">Free (Custom)</option>
                                                </Select>
                                            </div>

                                            <div className="text-xs text-gray-600 mb-2">
                                                Configure crop for: <strong>{selectedFile.file.name}</strong>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Crop Modal/Overlay */}
                {cropEnabled && selectedFile && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                <h3 className="text-lg font-medium">Crop Image: {selectedFile.file.name}</h3>
                                <button
                                    onClick={() => setCropEnabled(false)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="p-4">
                                <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden mb-4">
                                    <Cropper
                                        image={URL.createObjectURL(selectedFile.file)}
                                        crop={selectedFile.cropSettings?.crop || { x: 0, y: 0 }}
                                        zoom={selectedFile.cropSettings?.zoom || 1}
                                        aspect={cropAspectRatio === 'free' ? undefined : parseFloat(cropAspectRatio.split(':')[0]) / parseFloat(cropAspectRatio.split(':')[1])}
                                        onCropChange={onCropChange}
                                        onZoomChange={onZoomChange}
                                        onCropComplete={onCropComplete}
                                        classes={{
                                            containerClassName: 'h-full',
                                            cropAreaClassName: 'border-2 border-white border-opacity-50',
                                        }}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                        Zoom: {(selectedFile.cropSettings?.zoom || 1).toFixed(1)}x
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="range"
                                            min="1"
                                            max="3"
                                            step="0.1"
                                            value={selectedFile.cropSettings?.zoom || 1}
                                            onChange={(e) => onZoomChange(Number(e.target.value))}
                                            className="w-32"
                                        />
                                        <Button onClick={() => setCropEnabled(false)}>
                                            Done
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}