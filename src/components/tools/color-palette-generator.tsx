"use client";

import { useState, useEffect } from "react";
import { Colord, colord } from "colord";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Typography } from "@/components/ui/typography";
import { CopyButton } from "@/components/copy-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Helper function to determine if a color is light or dark for text contrast
const getContrastTextColor = (backgroundColor: string): string => {
    const color = colord(backgroundColor);
    return color.brightness() > 0.5 ? '#1f2937' : '#ffffff'; // Dark text on light bg, light text on dark bg
};

type Framework = "tailwind" | "material-ui" | "bootstrap";

interface PaletteItem {
    name: string;
    color: string;
}

interface ColorPalette {
    id: string;
    name: string;
    baseColor: string;
    colors: PaletteItem[];
}

const generateTailwindPalette = (baseColor: Colord): PaletteItem[] => {
    const hsl = baseColor.toHsl();
    const shades = [
        { name: "50", lightness: 97 },
        { name: "100", lightness: 94 },
        { name: "200", lightness: 89 },
        { name: "300", lightness: 83 },
        { name: "400", lightness: 64 },
        { name: "500", lightness: 45 },
        { name: "600", lightness: 32 },
        { name: "700", lightness: 25 },
        { name: "800", lightness: 20 },
        { name: "900", lightness: 15 },
        { name: "950", lightness: 9 },
    ];
    return shades.map(shade => ({
        name: shade.name,
        color: colord({ h: hsl.h, s: hsl.s, l: shade.lightness }).toHex(),
    }));
};

const generateMaterialPalette = (baseColor: Colord): PaletteItem[] => {
    const hsl = baseColor.toHsl();
    const shades = [
        { name: "50", lightness: 98 },
        { name: "100", lightness: 96 },
        { name: "200", lightness: 90 },
        { name: "300", lightness: 81 },
        { name: "400", lightness: 70 },
        { name: "500", lightness: 62 },
        { name: "600", lightness: 55 },
        { name: "700", lightness: 48 },
        { name: "800", lightness: 39 },
        { name: "900", lightness: 27 },
        { name: "A100", lightness: 88, saturation: hsl.s + 20 },
        { name: "A200", lightness: 75, saturation: hsl.s + 20 },
        { name: "A400", lightness: 57, saturation: hsl.s + 20 },
        { name: "A700", lightness: 40, saturation: hsl.s + 20 },
    ];
    return shades.map(shade => {
        const s = shade.saturation !== undefined ? shade.saturation : hsl.s;
        const color = colord({ h: hsl.h, s: Math.min(s, 100), l: shade.lightness });
        return {
            name: shade.name,
            color: color.toHex(),
        };
    });
};

const generateBootstrapPalette = (baseColor: Colord): PaletteItem[] => {
    const hsl = baseColor.toHsl();
    const shades = [
        { name: "100", lightness: 96 },
        { name: "200", lightness: 90 },
        { name: "300", lightness: 81 },
        { name: "400", lightness: 70 },
        { name: "500", lightness: 62 },
        { name: "600", lightness: 55 },
        { name: "700", lightness: 48 },
        { name: "800", lightness: 39 },
        { name: "900", lightness: 27 },
    ];
    return shades.map(shade => ({
        name: shade.name,
        color: colord({ h: hsl.h, s: hsl.s, l: shade.lightness }).toHex(),
    }));
};

const generatePalette = (baseHex: string, framework: Framework): PaletteItem[] => {
    const baseColor = colord(baseHex);
    switch (framework) {
        case "tailwind":
            return generateTailwindPalette(baseColor);
        case "material-ui":
            return generateMaterialPalette(baseColor);
        case "bootstrap":
            return generateBootstrapPalette(baseColor);
        default:
            return [];
    }
};

const formatCombinedPaletteAsCode = (palettes: ColorPalette[], framework: Framework, version?: string): string => {
    if (framework === "tailwind") {
        if (version === "v4") {
            // Tailwind v4 uses CSS variables
            let cssVars = "";
            palettes.forEach(palette => {
                cssVars += palette.colors.map(item => `  --color-${palette.name}-${item.name}: ${item.color};`).join("\n") + "\n";
            });
            return `@theme {\n${cssVars}}\n\n/* Usage in Tailwind classes: */\n/* bg-primary-50, text-secondary-100, etc. */`;
        } else {
            // Tailwind v3 config
            const colorDefinitions = palettes.map(palette => {
                const colorMap = palette.colors.map(item => `      ${item.name}: "${item.color}"`).join(",\n");
                return `    ${palette.name}: {\n${colorMap}\n    }`;
            }).join(",\n");
            return `// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {\n${colorDefinitions}\n      }
    }
  }
}

// Usage: bg-primary-50, text-secondary-100, etc.`;
        }
    } else if (framework === "material-ui") {
        if (version === "v5") {
            const paletteDefinitions = palettes.map(palette => {
                const colorMap = palette.colors.slice(0, 10).map(item => `      ${item.name}: "${item.color}"`).join(",\n");
                return `    ${palette.name}: {\n${colorMap}\n    }`;
            }).join(",\n");
            return `import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {\n${paletteDefinitions}\n  }
});

export default theme;`;
        } else {
            // v4 and earlier
            const paletteDefinitions = palettes.map(palette => {
                const colorMap = palette.colors.slice(0, 10).map(item => `      ${item.name}: "${item.color}"`).join(",\n");
                return `    ${palette.name}: {\n${colorMap}\n    }`;
            }).join(",\n");
            return `import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {\n${paletteDefinitions}\n  }
});

export default theme;`;
        }
    } else if (framework === "bootstrap") {
        if (version === "v5") {
            // Bootstrap 5 with CSS variables
            let cssVars = "";
            palettes.forEach(palette => {
                cssVars += palette.colors.map(item => `  --bs-${palette.name}-${item.name}: ${item.color};`).join("\n") + "\n";
            });
            return `/* Add to your CSS/SCSS file */
:root {\n${cssVars}}

/* Usage in Bootstrap classes: */
/* You can extend Bootstrap utilities or use custom CSS */
/* Example: .bg-primary-500 { background-color: var(--bs-primary-500); } */`;
        } else {
            // Bootstrap 4 and earlier
            let scssVars = "";
            palettes.forEach(palette => {
                scssVars += palette.colors.map(item => `$${palette.name}-${item.name}: ${item.color};`).join("\n") + "\n";
            });
            return `// Add to your SCSS file
${scssVars}// Usage example:
.my-${palettes[0]?.name}-bg {
  background-color: $${palettes[0]?.name}-500;
  color: $${palettes[0]?.name}-50;
}`;
        }
    }
    return "";
};

const formatCombinedPaletteAsCSS = (palettes: ColorPalette[], framework: Framework): string => {
    let cssVars = "";
    palettes.forEach(palette => {
        if (framework === "tailwind") {
            cssVars += palette.colors.map(item => `  --color-${palette.name}-${item.name}: ${item.color};`).join("\n") + "\n";
        } else if (framework === "material-ui") {
            cssVars += palette.colors.map(item => `  --mui-color-${palette.name}-${item.name}: ${item.color};`).join("\n") + "\n";
        } else {
            cssVars += palette.colors.map(item => `  --bs-${palette.name}-${item.name}: ${item.color};`).join("\n") + "\n";
        }
    });
    return `:root {\n${cssVars}}`;
};

export function ColorPaletteGeneratorTool() {
    const [framework, setFramework] = useState<Framework>("tailwind");
    const [version, setVersion] = useState<string>("v3");
    const [palettes, setPalettes] = useState<ColorPalette[]>([
        { id: '1', name: 'primary', baseColor: '#3b82f6', colors: [] }
    ]);
    const [codeTab, setCodeTab] = useState<'framework' | 'css'>('framework');

    // Update version when framework changes
    const handleFrameworkChange = (newFramework: Framework) => {
        setFramework(newFramework);
        if (newFramework === "tailwind") setVersion("v3");
        else if (newFramework === "material-ui") setVersion("v5");
        else if (newFramework === "bootstrap") setVersion("v5");
    };

    const addPalette = () => {
        // Default names in sequence
        const defaultNames = ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'accent'];
        const usedNames = palettes.map(p => p.name);
        const availableNames = defaultNames.filter(name => !usedNames.includes(name));

        // If all default names are used, create a numbered name
        const nextName = availableNames.length > 0 ? availableNames[0] : `color${palettes.length + 1}`;

        // Default colors for each palette type
        const defaultColors: Record<string, string> = {
            primary: '#3b82f6',
            secondary: '#6b7280',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#06b6d4',
            accent: '#8b5cf6'
        };

        const newPalette: ColorPalette = {
            id: Date.now().toString(),
            name: nextName,
            baseColor: defaultColors[nextName] || '#10b981',
            colors: []
        };
        setPalettes([...palettes, newPalette]);
    };

    const removePalette = (id: string) => {
        if (palettes.length > 1) {
            setPalettes(palettes.filter(p => p.id !== id));
        }
    };

    const updatePalette = (id: string, updates: Partial<ColorPalette>) => {
        setPalettes(palettes.map(p =>
            p.id === id ? { ...p, ...updates } : p
        ));
    };

    // Auto-generate colors when palettes change
    useEffect(() => {
        const updatedPalettes = palettes.map(palette => ({
            ...palette,
            colors: generatePalette(palette.baseColor, framework)
        }));
        setPalettes(updatedPalettes);
    }, [palettes.map(p => p.baseColor + p.name).join(','), framework]);

    const allColorsGenerated = palettes.every(p => p.colors.length > 0);
    const code = allColorsGenerated ? formatCombinedPaletteAsCode(palettes, framework, version) : "";
    const cssCode = allColorsGenerated ? formatCombinedPaletteAsCSS(palettes, framework) : "";

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-2 space-y-8">
                {/* Framework Settings - Compact */}
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                        <div className="flex flex-col sm:flex-row gap-4 items-end">
                            <div className="flex-1">
                                <Typography variant="caption" className="text-xs font-medium mb-1">Framework</Typography>
                                <Select value={framework} onChange={(e) => handleFrameworkChange(e.target.value as Framework)} className="h-10">
                                    <option value="tailwind">Tailwind CSS</option>
                                    <option value="material-ui">Material UI</option>
                                    <option value="bootstrap">Bootstrap</option>
                                </Select>
                            </div>
                            <div className="flex-1">
                                <Typography variant="caption" className="text-xs font-medium mb-1">Version</Typography>
                                <Select value={version} onChange={(e) => setVersion(e.target.value)} className="h-10">
                                    {framework === "tailwind" && (
                                        <>
                                            <option value="v3">Tailwind v3</option>
                                            <option value="v4">Tailwind v4</option>
                                        </>
                                    )}
                                    {framework === "material-ui" && (
                                        <>
                                            <option value="v4">Material UI v4</option>
                                            <option value="v5">Material UI v5</option>
                                        </>
                                    )}
                                    {framework === "bootstrap" && (
                                        <>
                                            <option value="v4">Bootstrap v4</option>
                                            <option value="v5">Bootstrap v5</option>
                                        </>
                                    )}
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Color Palettes Section */}
                <div className="space-y-4">
                    <div>
                        <Typography variant="h3" className="text-xl font-semibold">Color Palettes</Typography>
                        <Typography variant="caption" className="text-muted-foreground">Create and customize your color system</Typography>
                    </div>

                    <div className="grid gap-4">
                        {palettes.map((palette, index) => (
                            <Card key={palette.id} className="relative overflow-hidden">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-4">
                                        {/* Color Preview Circle */}
                                        <div className="relative">
                                            <div
                                                className="w-16 h-16 rounded-full border-4 border-white shadow-lg cursor-pointer hover:scale-105 transition-transform"
                                                style={{ backgroundColor: palette.baseColor }}
                                                onClick={() => document.getElementById(`color-input-${palette.id}`)?.click()}
                                            />
                                            {palette.colors.length > 0 && (
                                                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white shadow-sm overflow-hidden">
                                                    <div className="flex">
                                                        {palette.colors.slice(0, 4).map((color, i) => (
                                                            <div
                                                                key={i}
                                                                className="w-3 h-6"
                                                                style={{ backgroundColor: color.color }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Palette Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Input
                                                    type="text"
                                                    value={palette.name}
                                                    onChange={(e) => updatePalette(palette.id, { name: e.target.value })}
                                                    className="text-lg font-semibold border-none p-0 h-auto focus:ring-0 bg-transparent"
                                                    placeholder="Palette name"
                                                />
                                                {palettes.length > 1 && (
                                                    <Button
                                                        onClick={() => removePalette(palette.id)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        ✕
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        id={`color-input-${palette.id}`}
                                                        type="color"
                                                        value={palette.baseColor}
                                                        onChange={(e) => updatePalette(palette.id, { baseColor: e.target.value })}
                                                        className="w-10 h-10 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
                                                    />
                                                    <Input
                                                        type="text"
                                                        value={palette.baseColor}
                                                        onChange={(e) => updatePalette(palette.id, { baseColor: e.target.value })}
                                                        className="w-28 font-mono text-sm h-10 bg-gray-50 border-gray-200 focus:bg-white"
                                                        placeholder="#000000"
                                                    />
                                                </div>
                                                <Typography variant="caption" className="text-muted-foreground">
                                                    {palette.colors.length > 0 ? `${palette.colors.length} shades generated` : 'Generating shades...'}
                                                </Typography>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Generated Colors Preview */}
                                    {palette.colors.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <div className="flex gap-1 overflow-x-auto pb-2">
                                                {palette.colors.map((color, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex-shrink-0 w-8 h-8 rounded border border-white shadow-sm cursor-pointer hover:scale-110 transition-transform"
                                                        style={{ backgroundColor: color.color }}
                                                        title={`${palette.name}-${color.name}: ${color.color}`}
                                                        onClick={() => navigator.clipboard.writeText(color.color)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Add Palette Button at Bottom */}
                    <div className="flex justify-center pt-4">
                        <Button onClick={addPalette} variant="outline" size="sm" className="border-dashed">
                            <span className="mr-2">+</span> Add Palette
                        </Button>
                    </div>
                </div>
            </div>

            {/* Export Code - Right Side Sticky */}
            <div className="lg:col-span-1">
                <div className="sticky top-6">
                    {allColorsGenerated && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Typography variant="h3" className="text-lg font-semibold">Export Code</Typography>
                                    <Typography variant="caption" className="text-muted-foreground text-xs">Ready-to-use configuration</Typography>
                                </div>
                                <Button
                                    onClick={() => navigator.clipboard.writeText(codeTab === 'framework' ? code : cssCode)}
                                    variant="outline"
                                    size="sm"
                                >
                                    Copy
                                </Button>
                            </div>

                            {/* Code Tabs */}
                            <Card className="shadow-lg">
                                <CardContent className="p-0">
                                    <div className="flex border-b border-gray-200">
                                        <button
                                            onClick={() => setCodeTab('framework')}
                                            className={`flex-1 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                                                codeTab === 'framework'
                                                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            {framework === "tailwind" ? `Tailwind ${version}` : framework === "material-ui" ? `Material UI ${version}` : `Bootstrap ${version}`}
                                        </button>
                                        <button
                                            onClick={() => setCodeTab('css')}
                                            className={`flex-1 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                                                codeTab === 'css'
                                                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            CSS Variables
                                        </button>
                                    </div>

                                    <div className="p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-medium text-gray-700">
                                                {codeTab === 'framework' ? 'Configuration' : 'CSS Properties'}
                                            </span>
                                            <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                                                {codeTab === 'framework' ? code.split('\n').length : cssCode.split('\n').length}
                                            </span>
                                        </div>
                                        <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-auto max-h-96 text-xs font-mono leading-relaxed">
                                            {codeTab === 'framework' ? code : cssCode}
                                        </pre>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
