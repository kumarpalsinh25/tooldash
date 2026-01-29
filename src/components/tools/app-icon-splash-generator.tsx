"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import JSZip from "jszip";
import { ColorPicker } from "@/components/ui/color-picker";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Eye, Settings } from "lucide-react";
import { Icon } from "@/components/ui/icon";

interface GeneratedAsset {
    name: string;
    blob: Blob;
    url: string;
}

interface FrameworkConfig {
    id: string;
    name: string;
    iconSizes: { size: number; name: string }[];
    splashSizes: { width: number; height: number; name: string }[];
}

const frameworks: FrameworkConfig[] = [
    {
        id: "android",
        name: "Android",
        iconSizes: [
            { size: 48, name: "mdpi (48x48)" },
            { size: 72, name: "hdpi (72x72)" },
            { size: 96, name: "xhdpi (96x96)" },
            { size: 144, name: "xxhdpi (144x144)" },
            { size: 192, name: "xxxhdpi (192x192)" },
            { size: 512, name: "Google Play Store (512x512)" },
        ],
        splashSizes: [
            { width: 320, height: 480, name: "HVGA (320x480)" },
            { width: 480, height: 800, name: "WVGA800 (480x800)" },
            { width: 480, height: 854, name: "WVGA854 (480x854)" },
            { width: 540, height: 960, name: "qHD (540x960)" },
            { width: 600, height: 1024, name: "WQVGA (600x1024)" },
            { width: 720, height: 1280, name: "720p (720x1280)" },
            { width: 768, height: 1024, name: "XGA (768x1024)" },
            { width: 800, height: 1280, name: "WXGA (800x1280)" },
            { width: 1080, height: 1920, name: "1080p (1080x1920)" },
            { width: 1200, height: 1920, name: "WXGA+ (1200x1920)" },
            { width: 1440, height: 2560, name: "1440p (1440x2560)" },
        ],
    },
    {
        id: "ios",
        name: "iOS",
        iconSizes: [
            { size: 20, name: "20pt @1x" },
            { size: 40, name: "20pt @2x" },
            { size: 60, name: "20pt @3x" },
            { size: 29, name: "29pt @1x" },
            { size: 58, name: "29pt @2x" },
            { size: 87, name: "29pt @3x" },
            { size: 40, name: "40pt @1x" },
            { size: 80, name: "40pt @2x" },
            { size: 120, name: "40pt @3x" },
            { size: 60, name: "60pt @1x" },
            { size: 120, name: "60pt @2x" },
            { size: 180, name: "60pt @3x" },
            { size: 76, name: "76pt @1x" },
            { size: 152, name: "76pt @2x" },
            { size: 167, name: "83.5pt @2x" },
            { size: 1024, name: "App Store (1024x1024)" },
        ],
        splashSizes: [
            { width: 640, height: 960, name: "iPhone 4 (640x960)" },
            { width: 640, height: 1136, name: "iPhone 5/5S/5C/SE (640x1136)" },
            { width: 750, height: 1334, name: "iPhone 6/6S/7/8 (750x1334)" },
            { width: 1242, height: 2208, name: "iPhone 6+/6S+/7+/8+ (1242x2208)" },
            { width: 1125, height: 2436, name: "iPhone X/XS/11 Pro (1125x2436)" },
            { width: 828, height: 1792, name: "iPhone XR/11 (828x1792)" },
            { width: 1242, height: 2688, name: "iPhone XS Max/11 Pro Max (1242x2688)" },
            { width: 1170, height: 2532, name: "iPhone 12/12 Pro (1170x2532)" },
            { width: 1284, height: 2778, name: "iPhone 12 Pro Max (1284x2778)" },
            { width: 1170, height: 2532, name: "iPhone 13/13 Pro/14 (1170x2532)" },
            { width: 1284, height: 2778, name: "iPhone 13 Pro Max/14 Plus (1284x2778)" },
            { width: 1290, height: 2796, name: "iPhone 14 Pro (1290x2796)" },
            { width: 1320, height: 2868, name: "iPhone 14 Pro Max (1320x2868)" },
            { width: 1536, height: 2048, name: "iPad (1536x2048)" },
            { width: 2048, height: 2732, name: "iPad Pro 12.9\" (2048x2732)" },
            { width: 1668, height: 2388, name: "iPad Pro 11\" (1668x2388)" },
        ],
    },
    {
        id: "react-native",
        name: "React Native",
        iconSizes: [
            { size: 29, name: "iOS 29pt" },
            { size: 40, name: "iOS 40pt" },
            { size: 60, name: "iOS 60pt" },
            { size: 76, name: "iOS 76pt" },
            { size: 83, name: "iOS 83.5pt" },
            { size: 1024, name: "iOS App Store" },
            { size: 48, name: "Android mdpi" },
            { size: 72, name: "Android hdpi" },
            { size: 96, name: "Android xhdpi" },
            { size: 144, name: "Android xxhdpi" },
            { size: 192, name: "Android xxxhdpi" },
            { size: 512, name: "Android Play Store" },
        ],
        splashSizes: [
            { width: 640, height: 960, name: "iPhone 4" },
            { width: 640, height: 1136, name: "iPhone 5" },
            { width: 750, height: 1334, name: "iPhone 6/7/8" },
            { width: 1242, height: 2208, name: "iPhone 6+/7+/8+" },
            { width: 1125, height: 2436, name: "iPhone X/XS/11 Pro" },
            { width: 828, height: 1792, name: "iPhone XR/11" },
            { width: 1242, height: 2688, name: "iPhone XS Max/11 Pro Max" },
            { width: 1170, height: 2532, name: "iPhone 12/13/14" },
            { width: 1284, height: 2778, name: "iPhone 12/13/14 Pro Max" },
            { width: 1290, height: 2796, name: "iPhone 14 Pro" },
            { width: 1320, height: 2868, name: "iPhone 14 Pro Max" },
            { width: 1536, height: 2048, name: "iPad" },
            { width: 2048, height: 2732, name: "iPad Pro 12.9\"" },
            { width: 1668, height: 2388, name: "iPad Pro 11\"" },
            { width: 320, height: 480, name: "Android HVGA" },
            { width: 480, height: 800, name: "Android WVGA800" },
            { width: 480, height: 854, name: "Android WVGA854" },
            { width: 540, height: 960, name: "Android qHD" },
            { width: 720, height: 1280, name: "Android 720p" },
            { width: 1080, height: 1920, name: "Android 1080p" },
            { width: 1440, height: 2560, name: "Android 1440p" },
        ],
    },
    {
        id: "expo",
        name: "Expo",
        iconSizes: [
            { size: 29, name: "iOS 29pt" },
            { size: 40, name: "iOS 40pt" },
            { size: 60, name: "iOS 60pt" },
            { size: 76, name: "iOS 76pt" },
            { size: 83, name: "iOS 83.5pt" },
            { size: 1024, name: "iOS App Store" },
            { size: 48, name: "Android mdpi" },
            { size: 72, name: "Android hdpi" },
            { size: 96, name: "Android xhdpi" },
            { size: 144, name: "Android xxhdpi" },
            { size: 192, name: "Android xxxhdpi" },
            { size: 512, name: "Android Play Store" },
        ],
        splashSizes: [
            { width: 640, height: 960, name: "iPhone 4" },
            { width: 640, height: 1136, name: "iPhone 5" },
            { width: 750, height: 1334, name: "iPhone 6/7/8" },
            { width: 1242, height: 2208, name: "iPhone 6+/7+/8+" },
            { width: 1125, height: 2436, name: "iPhone X/XS/11 Pro" },
            { width: 828, height: 1792, name: "iPhone XR/11" },
            { width: 1242, height: 2688, name: "iPhone XS Max/11 Pro Max" },
            { width: 1170, height: 2532, name: "iPhone 12/13/14" },
            { width: 1284, height: 2778, name: "iPhone 12/13/14 Pro Max" },
            { width: 1290, height: 2796, name: "iPhone 14 Pro" },
            { width: 1320, height: 2868, name: "iPhone 14 Pro Max" },
            { width: 1536, height: 2048, name: "iPad" },
            { width: 2048, height: 2732, name: "iPad Pro 12.9\"" },
            { width: 1668, height: 2388, name: "iPad Pro 11\"" },
            { width: 320, height: 480, name: "Android HVGA" },
            { width: 480, height: 800, name: "Android WVGA800" },
            { width: 480, height: 854, name: "Android WVGA854" },
            { width: 540, height: 960, name: "Android qHD" },
            { width: 720, height: 1280, name: "Android 720p" },
            { width: 1080, height: 1920, name: "Android 1080p" },
            { width: 1440, height: 2560, name: "Android 1440p" },
        ],
    },
    {
        id: "ionic",
        name: "Ionic/Cordova",
        iconSizes: [
            { size: 29, name: "iOS 29pt" },
            { size: 40, name: "iOS 40pt" },
            { size: 60, name: "iOS 60pt" },
            { size: 76, name: "iOS 76pt" },
            { size: 83, name: "iOS 83.5pt" },
            { size: 1024, name: "iOS App Store" },
            { size: 48, name: "Android mdpi" },
            { size: 72, name: "Android hdpi" },
            { size: 96, name: "Android xhdpi" },
            { size: 144, name: "Android xxhdpi" },
            { size: 192, name: "Android xxxhdpi" },
            { size: 512, name: "Android Play Store" },
        ],
        splashSizes: [
            { width: 640, height: 960, name: "iPhone 4" },
            { width: 640, height: 1136, name: "iPhone 5" },
            { width: 750, height: 1334, name: "iPhone 6/7/8" },
            { width: 1242, height: 2208, name: "iPhone 6+/7+/8+" },
            { width: 1125, height: 2436, name: "iPhone X/XS/11 Pro" },
            { width: 828, height: 1792, name: "iPhone XR/11" },
            { width: 1242, height: 2688, name: "iPhone XS Max/11 Pro Max" },
            { width: 1170, height: 2532, name: "iPhone 12/13/14" },
            { width: 1284, height: 2778, name: "iPhone 12/13/14 Pro Max" },
            { width: 1290, height: 2796, name: "iPhone 14 Pro" },
            { width: 1320, height: 2868, name: "iPhone 14 Pro Max" },
            { width: 1536, height: 2048, name: "iPad" },
            { width: 2048, height: 2732, name: "iPad Pro 12.9\"" },
            { width: 1668, height: 2388, name: "iPad Pro 11\"" },
            { width: 320, height: 480, name: "Android HVGA" },
            { width: 480, height: 800, name: "Android WVGA800" },
            { width: 480, height: 854, name: "Android WVGA854" },
            { width: 540, height: 960, name: "Android qHD" },
            { width: 720, height: 1280, name: "Android 720p" },
            { width: 1080, height: 1920, name: "Android 1080p" },
            { width: 1440, height: 2560, name: "Android 1440p" },
        ],
    },
];

export function AppIconSplashGeneratorTool() {
    const [mode, setMode] = useState<"icon" | "splash">("icon");
    const [framework, setFramework] = useState<string>("android");
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [backgroundColor, setBackgroundColor] = useState("#ffffff");
    const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
    const [useBackgroundImage, setUseBackgroundImage] = useState(false);
    const [splashBackgroundFit, setSplashBackgroundFit] = useState<"cover" | "contain" | "stretch">("stretch");
    const [addIconBackground, setAddIconBackground] = useState<"transparent" | "color" | "image">("transparent");
    const [iconBackgroundColor, setIconBackgroundColor] = useState("#ffffff");
    const [iconBackgroundFile, setIconBackgroundFile] = useState<File | null>(null);
    const [iconBackgroundFit, setIconBackgroundFit] = useState<"cover" | "contain" | "stretch">("cover");
    const [iconSizePercent, setIconSizePercent] = useState(50);
    const [iconPositionX, setIconPositionX] = useState(50);
    const [iconPositionY, setIconPositionY] = useState(50);
    const [generatedAssets, setGeneratedAssets] = useState<GeneratedAsset[]>([]);
    const [generating, setGenerating] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);

    const selectedFramework = frameworks.find(f => f.id === framework);

    const drawBackgroundImage = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, canvasWidth: number, canvasHeight: number, fit: "cover" | "contain" | "stretch") => {
        const imgAspect = img.width / img.height;
        const canvasAspect = canvasWidth / canvasHeight;

        let drawWidth = canvasWidth;
        let drawHeight = canvasHeight;
        let offsetX = 0;
        let offsetY = 0;

        if (fit === "stretch") {
            // Already set to canvas size
        } else if (fit === "cover") {
            if (imgAspect > canvasAspect) {
                // Image is wider, scale height to canvas height, crop width
                drawHeight = canvasHeight;
                drawWidth = drawHeight * imgAspect;
                offsetX = (canvasWidth - drawWidth) / 2;
            } else {
                // Image is taller, scale width to canvas width, crop height
                drawWidth = canvasWidth;
                drawHeight = drawWidth / imgAspect;
                offsetY = (canvasHeight - drawHeight) / 2;
            }
        } else if (fit === "contain") {
            if (imgAspect > canvasAspect) {
                // Image is wider, scale width to canvas width
                drawWidth = canvasWidth;
                drawHeight = drawWidth / imgAspect;
                offsetY = (canvasHeight - drawHeight) / 2;
            } else {
                // Image is taller, scale height to canvas height
                drawHeight = canvasHeight;
                drawWidth = drawHeight * imgAspect;
                offsetX = (canvasWidth - drawWidth) / 2;
            }
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    const BackgroundSelector = ({ mode }: { mode: "icon" | "splash" }) => {
        const isIcon = mode === "icon";

        const backgroundType = isIcon ? addIconBackground : (useBackgroundImage ? "image" : "color");
        const setBackgroundType = (value: string) => {
            if (isIcon) {
                setAddIconBackground(value as "transparent" | "color" | "image");
            } else {
                setUseBackgroundImage(value === "image");
            }
        };

        const bgColor = isIcon ? iconBackgroundColor : backgroundColor;
        const setBgColor = isIcon ? setIconBackgroundColor : setBackgroundColor;

        const bgFile = isIcon ? iconBackgroundFile : backgroundFile;
        const handleBgUpload = isIcon ? handleIconBackgroundUpload : handleBackgroundUpload;

        const bgFit = isIcon ? iconBackgroundFit : splashBackgroundFit;
        const setBgFit = isIcon ? setIconBackgroundFit : setSplashBackgroundFit;

        return (
            <div>
                <label className="block text-sm font-medium mb-2">{isIcon ? "Icon Background" : "Background Type"}</label>
                <Select
                    value={backgroundType}
                    onChange={(e) => setBackgroundType(e.target.value)}
                >
                    {isIcon && <option value="transparent">Transparent</option>}
                    <option value="color">Solid Color</option>
                    <option value="image">Background Image</option>
                </Select>
                {backgroundType === "color" && (
                    <div className="mt-3">
                        <label className="block text-sm font-medium mb-2">Background Color</label>
                        <ColorPicker value={bgColor} onChange={setBgColor} />
                        <input
                            type="text"
                            value={bgColor}
                            onChange={(e) => setBgColor(e.target.value)}
                            className="mt-2 w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="#000000"
                        />
                    </div>
                )}
                {backgroundType === "image" && (
                    <div className="mt-3 space-y-3">
                        <FileUpload
                            value={bgFile ? [bgFile] : []}
                            onChange={handleBgUpload}
                            accept="image/*"
                            multiple={false}
                            emptyText={`Upload background image${isIcon ? " for icons" : ""}`}
                        />
                        <div>
                            <label className="block text-sm font-medium mb-2">Background Fit</label>
                            <Select
                                value={bgFit}
                                onChange={(e) => setBgFit(e.target.value as "cover" | "contain" | "stretch")}
                            >
                                <option value="cover">Cover (scale to cover, may crop)</option>
                                <option value="contain">Contain (scale to fit, may have space)</option>
                                <option value="stretch">Stretch (stretch to fill)</option>
                            </Select>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const handleIconUpload = (files: File[]) => {
        if (files.length > 0) {
            setIconFile(files[0]);
        }
    };

    const handleBackgroundUpload = (files: File[]) => {
        if (files.length > 0) {
            setBackgroundFile(files[0]);
        }
    };

    const handleIconBackgroundUpload = (files: File[]) => {
        if (files.length > 0) {
            setIconBackgroundFile(files[0]);
        }
    };

    const generatePreview = useCallback(async () => {
        if (!iconFile) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Fixed preview size
        canvas.width = 300;
        canvas.height = 300;

        // Background
        if (mode === "splash") {
            if (useBackgroundImage && backgroundFile) {
                const bgImg = new Image();
                await new Promise(resolve => {
                    bgImg.onload = resolve;
                    bgImg.src = URL.createObjectURL(backgroundFile);
                });
                drawBackgroundImage(ctx, bgImg, canvas.width, canvas.height, splashBackgroundFit);
            } else {
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        } else if (mode === "icon") {
            if (addIconBackground === "color") {
                ctx.fillStyle = iconBackgroundColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            } else if (addIconBackground === "image" && iconBackgroundFile) {
                const bgImg = new Image();
                await new Promise(resolve => {
                    bgImg.onload = resolve;
                    bgImg.src = URL.createObjectURL(iconBackgroundFile);
                });
                drawBackgroundImage(ctx, bgImg, canvas.width, canvas.height, iconBackgroundFit);
            } else {
                // For transparent or no background, white for preview visibility
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }

        // Icon
        const iconImg = new Image();
        await new Promise(resolve => {
            iconImg.onload = resolve;
            iconImg.src = URL.createObjectURL(iconFile);
        });

        const iconSize = (iconSizePercent / 100) * canvas.width;
        const x = (iconPositionX / 100) * (canvas.width - iconSize);
        const y = (iconPositionY / 100) * (canvas.height - iconSize);

        ctx.drawImage(iconImg, x, y, iconSize, iconSize);

        setPreviewUrl(canvas.toDataURL());
    }, [iconFile, backgroundFile, backgroundColor, useBackgroundImage, iconSizePercent, iconPositionX, iconPositionY, mode, addIconBackground, iconBackgroundColor, iconBackgroundFile, iconBackgroundFit, splashBackgroundFit]);

    useEffect(() => {
        if (iconFile) {
            generatePreview();
        } else {
            setPreviewUrl(null);
        }
    }, [iconFile, backgroundFile, backgroundColor, useBackgroundImage, iconSizePercent, iconPositionX, iconPositionY, mode, addIconBackground, iconBackgroundColor, iconBackgroundFile, iconBackgroundFit, splashBackgroundFit, generatePreview]);

    const generateAssets = async () => {
        if (!iconFile || !selectedFramework) return;

        setGenerating(true);
        const assets: GeneratedAsset[] = [];

        const sizes = mode === "icon" ? selectedFramework.iconSizes : selectedFramework.splashSizes;

        // Preload images
        const iconImg = new Image();
        await new Promise(resolve => {
            iconImg.onload = resolve;
            iconImg.src = URL.createObjectURL(iconFile);
        });

        let bgImg: Image | null = null;
        if (mode === "splash" && useBackgroundImage && backgroundFile) {
            bgImg = new Image();
            await new Promise(resolve => {
                bgImg!.onload = resolve;
                bgImg!.src = URL.createObjectURL(backgroundFile);
            });
        }

        let iconBgImg: Image | null = null;
        if (mode === "icon" && addIconBackground === "image" && iconBackgroundFile) {
            iconBgImg = new Image();
            await new Promise(resolve => {
                iconBgImg!.onload = resolve;
                iconBgImg!.src = URL.createObjectURL(iconBackgroundFile);
            });
        }

        const promises = sizes.map(async (size) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            if (mode === "icon") {
                canvas.width = size.size;
                canvas.height = size.size;
            } else {
                canvas.width = size.width;
                canvas.height = size.height;
            }

            // Background
            if (mode === "splash") {
                if (bgImg) {
                    drawBackgroundImage(ctx, bgImg, canvas.width, canvas.height, splashBackgroundFit);
                } else {
                    ctx.fillStyle = backgroundColor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
            } else if (mode === "icon") {
                if (addIconBackground === "color") {
                    ctx.fillStyle = iconBackgroundColor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                } else if (addIconBackground === "image" && iconBgImg) {
                    drawBackgroundImage(ctx, iconBgImg, canvas.width, canvas.height, iconBackgroundFit);
                }
                // For transparent, no background
            }

            const iconSize = (iconSizePercent / 100) * Math.min(canvas.width, canvas.height);
            const x = (iconPositionX / 100) * (canvas.width - iconSize);
            const y = (iconPositionY / 100) * (canvas.height - iconSize);

            ctx.drawImage(iconImg, x, y, iconSize, iconSize);

            return new Promise<GeneratedAsset | null>((resolve) => {
                canvas.toBlob((blob) => {
                    if (blob) {
                        const name = mode === "icon" ? `icon_${size.size}x${size.size}.png` : `splash_${size.width}x${size.height}.png`;
                        resolve({
                            name,
                            blob,
                            url: URL.createObjectURL(blob)
                        });
                    } else {
                        resolve(null);
                    }
                }, 'image/png');
            });
        });

        const results = await Promise.all(promises);
        results.forEach(asset => {
            if (asset) assets.push(asset);
        });

        setGeneratedAssets(assets);
        setGenerating(false);
    };

    const downloadAll = async () => {
        const zip = new JSZip();
        const folder = zip.folder(mode === "icon" ? "icons" : "splash_screens");

        generatedAssets.forEach(asset => {
            folder?.file(asset.name, asset.blob);
        });

        const zipBlob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${mode}_assets_${framework}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="grid grid-cols-12 gap-6">
                    {/* Main Content */}
                    <div className="col-span-12 lg:col-span-8">
                        {/* Upload Section */}
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle>Upload Assets</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Icon</label>
                                    <FileUpload
                                        value={iconFile ? [iconFile] : []}
                                        onChange={handleIconUpload}
                                        accept="image/*"
                                        multiple={false}
                                        emptyText="Upload your app icon (PNG recommended)"
                                    />
                                </div>


                            </CardContent>
                        </Card>

                        {/* Settings */}
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Icon icon={Settings} size="sm" />
                                    Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Mode</label>
                                        <Select value={mode} onChange={(e) => setMode(e.target.value as "icon" | "splash")}>
                                            <option value="icon">App Icon</option>
                                            <option value="splash">Splash Screen</option>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Framework</label>
                                        <Select value={framework} onChange={(e) => setFramework(e.target.value)}>
                                            {frameworks.map(f => (
                                                <option key={f.id} value={f.id}>{f.name}</option>
                                            ))}
                                        </Select>
                                    </div>
                                </div>

                                <BackgroundSelector mode={mode} />

                                {mode === "splash" && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Icon Size: {iconSizePercent}%
                                            </label>
                                            <input
                                                type="range"
                                                min="10"
                                                max="90"
                                                value={iconSizePercent}
                                                onChange={(e) => setIconSizePercent(Number(e.target.value))}
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Horizontal Position: {iconPositionX}%
                                                </label>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={iconPositionX}
                                                    onChange={(e) => setIconPositionX(Number(e.target.value))}
                                                    className="w-full"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Vertical Position: {iconPositionY}%
                                                </label>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={iconPositionY}
                                                    onChange={(e) => setIconPositionY(Number(e.target.value))}
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Generate Button */}
                        <Card className="mb-6">
                            <CardContent className="pt-6">
                                <Button
                                    onClick={generateAssets}
                                    disabled={!iconFile || generating}
                                    loading={generating}
                                    size="lg"
                                    className="w-full"
                                >
                                    {generating ? "Generating..." : `Generate ${mode === "icon" ? "Icons" : "Splash Screens"}`}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Generated Assets */}
                        {generatedAssets.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Generated Assets ({generatedAssets.length})</CardTitle>
                                        <Button onClick={downloadAll} leftIcon={<Icon icon={Download} size="sm" />}>
                                            Download All as ZIP
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {generatedAssets.map((asset, index) => (
                                            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                                <div className="aspect-square bg-gray-100">
                                                    <img
                                                        src={asset.url}
                                                        alt={asset.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="p-2">
                                                    <p className="text-xs font-medium truncate">{asset.name}</p>
                                                    <Button
                                                        size="sm"
                                                        className="w-full mt-2"
                                                        onClick={() => {
                                                            const url = URL.createObjectURL(asset.blob);
                                                            const a = document.createElement('a');
                                                            a.href = url;
                                                            a.download = asset.name;
                                                            document.body.appendChild(a);
                                                            a.click();
                                                            document.body.removeChild(a);
                                                            URL.revokeObjectURL(url);
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

                    {/* Sidebar */}
                    <div className="col-span-12 lg:col-span-4">
                        <div className="sticky top-6 space-y-6">
                            {/* Preview */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Icon icon={Eye} size="sm" />
                                        Preview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" className="w-full border border-gray-200 rounded" />
                                    ) : (
                                        <div className="aspect-square bg-gray-100 border border-gray-200 rounded flex items-center justify-center">
                                            <p className="text-gray-500 text-sm">Upload icon to see preview</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Framework Info */}
                            {selectedFramework && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{selectedFramework.name} Assets</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-sm">
                                                {mode === "icon" ? "Icon Sizes:" : "Splash Screen Sizes:"}
                                            </h4>
                                            <ul className="text-xs text-gray-600 space-y-1">
                                                {(mode === "icon" ? selectedFramework.iconSizes : selectedFramework.splashSizes).slice(0, 5).map((size, index) => (
                                                    <li key={index}>
                                                        {mode === "icon" ? `${size.size}x${size.size}` : `${size.width}x${size.height}`} - {size.name}
                                                    </li>
                                                ))}
                                                {(mode === "icon" ? selectedFramework.iconSizes : selectedFramework.splashSizes).length > 5 && (
                                                    <li className="text-gray-500">... and {(mode === "icon" ? selectedFramework.iconSizes : selectedFramework.splashSizes).length - 5} more</li>
                                                )}
                                            </ul>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}