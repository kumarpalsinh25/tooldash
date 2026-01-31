"use client";

import { useState } from "react";
import { Colord, colord } from "colord";
import {
    Palette,
    Settings,
    Eye,
    EyeOff,
    Plus,
    Copy,
    Download,
    Code,
    FileText,
    Zap,
    Check,
    X,
    RotateCcw,
    ChevronDown
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Typography } from "@/components/ui/typography";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";

// Custom styles for range sliders
const sliderStyles = `
<style>
.slider-hue::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: linear-gradient(45deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.slider-hue::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: linear-gradient(45deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.slider-saturation::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: linear-gradient(90deg, #808080, #ff6b6b);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.slider-saturation::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: linear-gradient(90deg, #808080, #ff6b6b);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.slider-lightness::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: linear-gradient(90deg, #000000, #ffffff);
  cursor: pointer;
  border: 2px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.slider-lightness::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: linear-gradient(90deg, #000000, #ffffff);
  cursor: pointer;
  border: 2px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
</style>
`;

type Framework = "tailwind" | "material-ui" | "bootstrap" | "chakra-ui" | "ant-design" | "mantine" | "nextui" | "shadcn" | "css-variables" | "scss-variables";

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
        case "chakra-ui":
            return generateTailwindPalette(baseColor); // Similar to Tailwind
        case "mantine":
            return generateTailwindPalette(baseColor); // Similar to Tailwind
        case "nextui":
            return generateTailwindPalette(baseColor); // Similar to Tailwind
        case "shadcn":
            return generateTailwindPalette(baseColor); // Similar to Tailwind
        case "material-ui":
            return generateMaterialPalette(baseColor);
        case "ant-design":
            return generateMaterialPalette(baseColor); // Similar to Material UI
        case "bootstrap":
            return generateBootstrapPalette(baseColor);
        case "css-variables":
            return generateTailwindPalette(baseColor); // Generic color scale
        case "scss-variables":
            return generateTailwindPalette(baseColor); // Generic color scale
        default:
            return [];
    }
};



// Accessibility and contrast checking
const getContrastRatio = (color1: string, color2: string): number => {
    // Manual contrast calculation to avoid colord version issues
    const getLuminance = (color: string): number => {
        const rgb = colord(color).toRgb();
        const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map(c =>
            c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
        );
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
};

const isWCAGCompliant = (ratio: number, level: 'AA' | 'AAA', isLargeText: boolean = false): boolean => {
    if (level === 'AA') return isLargeText ? ratio >= 3 : ratio >= 4.5;
    return isLargeText ? ratio >= 4.5 : ratio >= 7;
};

// Color blindness simulation (simplified)
const simulateColorBlindness = (color: Colord, type: 'protanopia' | 'deuteranopia' | 'tritanopia'): Colord => {
    const rgb = color.toRgb();
    switch(type) {
        case 'protanopia':
            // Simplified protanopia simulation
            return colord({
                r: rgb.r * 0.567 + rgb.g * 0.433,
                g: rgb.r * 0.558 + rgb.g * 0.442,
                b: rgb.b
            });
        case 'deuteranopia':
            // Simplified deuteranopia simulation
            return colord({
                r: rgb.r * 0.625 + rgb.g * 0.375,
                g: rgb.r * 0.7 + rgb.g * 0.3,
                b: rgb.b
            });
        case 'tritanopia':
            // Simplified tritanopia simulation
            return colord({
                r: rgb.r * 0.95 + rgb.b * 0.05,
                g: rgb.g,
                b: rgb.r * 0.433 + rgb.b * 0.567
            });
        default:
            return color;
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
    } else if (framework === "chakra-ui") {
        const colorDefinitions = palettes.map(palette => {
            const colorMap = palette.colors.map(item => `      ${item.name}: "${item.color}"`).join(",\n");
            return `    ${palette.name}: {\n${colorMap}\n    }`;
        }).join(",\n");
        return `import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {\n${colorDefinitions}\n  }
});

export default theme;`;

// Usage: color="primary.500", bg="secondary.200", etc.`;
    } else if (framework === "ant-design") {
        const colorDefinitions = palettes.map(palette => {
            const colorMap = palette.colors.slice(0, 10).map(item => `    "${item.name}": "${item.color}"`).join(",\n");
            return `  ${palette.name}: {\n${colorMap}\n  }`;
        }).join(",\n");
        return `import { ConfigProvider } from 'antd';

const theme = {
  token: {\n${colorDefinitions}\n  }
};

export default theme;`;

// Usage in Ant Design components with token prop`;
    } else if (framework === "mantine") {
        const colorDefinitions = palettes.map(palette => {
            const colorMap = palette.colors.map(item => `      ${item.name}: "${item.color}"`).join(",\n");
            return `    ${palette.name}: [\n${colorMap}\n    ]`;
        }).join(",\n");
        return `import { MantineProvider, createTheme } from '@mantine/core';

const theme = createTheme({
  colors: {\n${colorDefinitions}\n  }
});

function App() {
  return (
    <MantineProvider theme={theme}>
      {/* Your app */}
    </MantineProvider>
  );
}`;

// Usage: color="primary.5", bg="secondary.2", etc.`;
    } else if (framework === "nextui") {
        const colorDefinitions = palettes.map(palette => {
            const colorMap = palette.colors.map(item => `      ${item.name}: "${item.color}"`).join(",\n");
            return `    ${palette.name}: {\n${colorMap}\n    }`;
        }).join(",\n");
        return `import { NextUIProvider } from '@nextui-org/react';

const theme = {
  colors: {\n${colorDefinitions}\n  }
};

export default theme;`;

// Add to your tailwind.config.js or use with NextUI components`;
    } else if (framework === "shadcn") {
        const colorDefinitions = palettes.map(palette => {
            const colorMap = palette.colors.map(item => `      ${item.name}: "${item.color}"`).join(",\n");
            return `    ${palette.name}: {\n${colorMap}\n    }`;
        }).join(",\n");
        return `// Add to your CSS variables or tailwind.config.js
// For shadcn/ui components

:root {\n${palettes.map(palette =>
    palette.colors.map(item => `  --${palette.name}-${item.name}: ${item.color};`).join("\n")
).join("\n")}\n}

// Then use in your components:
// className="bg-primary-500 text-primary-50"`;
    } else if (framework === "css-variables") {
        let cssVars = "";
        palettes.forEach(palette => {
            cssVars += palette.colors.map(item => `  --color-${palette.name}-${item.name}: ${item.color};`).join("\n") + "\n";
        });
        return `/* Add to your CSS file */
:root {\n${cssVars}}

/* Usage examples: */
.my-element {
  background-color: var(--color-primary-500);
  color: var(--color-primary-50);
  border: 1px solid var(--color-secondary-300);
}`;
    } else if (framework === "scss-variables") {
        let scssVars = "";
        palettes.forEach(palette => {
            scssVars += palette.colors.map(item => `$${palette.name}-${item.name}: ${item.color};`).join("\n") + "\n";
        });
        return `/* Add to your SCSS file */
${scssVars}
/* Usage examples: */
.my-element {
  background-color: $${palettes[0]?.name}-500;
  color: $${palettes[0]?.name}-50;
  border: 1px solid $${palettes[1]?.name || 'secondary'}-300;
}`;
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
        if (framework === "tailwind" || framework === "chakra-ui" || framework === "mantine" || framework === "nextui" || framework === "shadcn") {
            cssVars += palette.colors.map(item => `  --color-${palette.name}-${item.name}: ${item.color};`).join("\n") + "\n";
        } else if (framework === "material-ui" || framework === "ant-design") {
            cssVars += palette.colors.map(item => `  --mui-color-${palette.name}-${item.name}: ${item.color};`).join("\n") + "\n";
        } else if (framework === "bootstrap") {
            cssVars += palette.colors.map(item => `  --bs-${palette.name}-${item.name}: ${item.color};`).join("\n") + "\n";
        } else {
            // css-variables and scss-variables
            cssVars += palette.colors.map(item => `  --color-${palette.name}-${item.name}: ${item.color};`).join("\n") + "\n";
        }
    });
    return `:root {\n${cssVars}}`;
};

export function ColorPaletteGeneratorTool() {
    const [framework, setFramework] = useState<Framework>("tailwind");
    const [version, setVersion] = useState<string>("v3");
    const [palettes, setPalettes] = useState<ColorPalette[]>([
        { id: '1', name: 'primary', baseColor: '#3b82f6', colors: generatePalette('#3b82f6', 'tailwind') }
    ]);
    const [codeTab, setCodeTab] = useState<'framework' | 'css'>('framework');

    // New state for advanced features
    const [colorBlindnessMode, setColorBlindnessMode] = useState<'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia'>('normal');
    const [showAdvancedControls, setShowAdvancedControls] = useState<string | null>(null); // palette id or null

    // Update version when framework changes
    const handleFrameworkChange = (newFramework: Framework) => {
        setFramework(newFramework);
        if (newFramework === "tailwind") setVersion("v3");
        else if (newFramework === "material-ui") setVersion("v5");
        else if (newFramework === "bootstrap") setVersion("v5");
        else if (newFramework === "chakra-ui") setVersion("v3");
        else if (newFramework === "ant-design") setVersion("v5");
        else if (newFramework === "mantine") setVersion("v7");
        else if (newFramework === "nextui") setVersion("v2");
        else if (newFramework === "shadcn") setVersion("latest");
        else if (newFramework === "css-variables") setVersion("latest");
        else if (newFramework === "scss-variables") setVersion("latest");
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
            colors: generatePalette(defaultColors[nextName] || '#10b981', framework)
        };
        setPalettes([...palettes, newPalette]);
    };

    const removePalette = (id: string) => {
        if (palettes.length > 1) {
            setPalettes(palettes.filter(p => p.id !== id));
        }
    };

    const updatePalette = (id: string, updates: Partial<ColorPalette>) => {
        setPalettes(palettes.map(p => {
            if (p.id === id) {
                const updated = { ...p, ...updates };
                // Always regenerate colors
                updated.colors = generatePalette(updated.baseColor, framework);
                return updated;
            }
            return p;
        }));
    };



    // Use palettes directly
    const displayPalettes = palettes;

    const allColorsGenerated = displayPalettes.every(p => p.colors.length > 0);
    const code = allColorsGenerated ? formatCombinedPaletteAsCode(displayPalettes, framework, version) : "";
    const cssCode = allColorsGenerated ? formatCombinedPaletteAsCSS(displayPalettes, framework) : "";

    return (
        <>
            <div dangerouslySetInnerHTML={{ __html: sliderStyles }} />
            <div className="space-y-8">

            {/* Settings Bar */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Framework & Version Settings */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Framework</label>
                            <Select value={framework} onChange={(e) => handleFrameworkChange(e.target.value as Framework)} className="w-48">
                                <option value="tailwind">Tailwind CSS</option>
                                <option value="material-ui">Material UI</option>
                                <option value="bootstrap">Bootstrap</option>
                                <option value="chakra-ui">Chakra UI</option>
                                <option value="ant-design">Ant Design</option>
                                <option value="mantine">Mantine</option>
                                <option value="nextui">NextUI</option>
                                <option value="shadcn">shadcn/ui</option>
                                <option value="css-variables">CSS Variables</option>
                                <option value="scss-variables">SCSS Variables</option>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Version</label>
                            <Select value={version} onChange={(e) => setVersion(e.target.value)} className="w-40">
                                {framework === "tailwind" && (
                                    <>
                                        <option value="v3">v3</option>
                                        <option value="v4">v4</option>
                                    </>
                                )}
                                {framework === "material-ui" && (
                                    <>
                                        <option value="v4">v4</option>
                                        <option value="v5">v5</option>
                                    </>
                                )}
                                {framework === "bootstrap" && (
                                    <>
                                        <option value="v4">v4</option>
                                        <option value="v5">v5</option>
                                    </>
                                )}
                                {framework === "chakra-ui" && (
                                    <>
                                        <option value="v2">v2</option>
                                        <option value="v3">v3</option>
                                    </>
                                )}
                                {framework === "ant-design" && (
                                    <>
                                        <option value="v4">v4</option>
                                        <option value="v5">v5</option>
                                    </>
                                )}
                                {framework === "mantine" && (
                                    <>
                                        <option value="v6">v6</option>
                                        <option value="v7">v7</option>
                                    </>
                                )}
                                {framework === "nextui" && (
                                    <>
                                        <option value="v1">v1</option>
                                        <option value="v2">v2</option>
                                    </>
                                )}
                                {(framework === "shadcn" || framework === "css-variables" || framework === "scss-variables") && (
                                    <option value="latest">Latest</option>
                                )}
                            </Select>
                        </div>
                    </div>

                    {/* Color Blindness Simulation */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Accessibility Simulation</label>
                        <div className="flex flex-wrap gap-2">
                            {([
                                { key: 'normal', label: 'Normal', icon: Eye },
                                { key: 'protanopia', label: 'Protanopia', icon: Eye },
                                { key: 'deuteranopia', label: 'Deuteranopia', icon: Eye },
                                { key: 'tritanopia', label: 'Tritanopia', icon: Eye }
                            ] as const).map((mode) => (
                                <Button
                                    key={mode.key}
                                    onClick={() => setColorBlindnessMode(mode.key)}
                                    variant={colorBlindnessMode === mode.key ? "default" : "outline"}
                                    size="sm"
                                    className="px-3 py-1.5 h-auto text-xs font-medium"
                                    leftIcon={<Icon icon={mode.icon} size="xs" />}
                                >
                                    {mode.label}
                                </Button>
                            ))}
                        </div>
                        {colorBlindnessMode !== 'normal' && (
                            <div className="flex items-center mt-2">
                                <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200 text-xs px-2 py-1">
                                    <Icon icon={EyeOff} size="xs" className="mr-1" />
                                    Simulating {colorBlindnessMode}
                                </Badge>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Side - Color Palettes */}
                <div className="xl:col-span-2 space-y-6">


                {/* Color Palettes Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">Color Palettes</h3>
                            <p className="text-gray-600 mt-1">Design beautiful color systems with harmony and accessibility</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                                {palettes.length} palette{palettes.length !== 1 ? 's' : ''}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {displayPalettes.map((palette, paletteIndex) => (
                            <div key={palette.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                                {/* Palette Header */}
                                <div className="px-6 py-5 border-b border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            {/* Color Preview */}
                                            <div className="relative group">
                                                <div
                                                    className="w-14 h-14 rounded-2xl shadow-lg cursor-pointer hover:scale-105 transition-all duration-200 border-4 border-white"
                                                    style={{
                                                        backgroundColor: colorBlindnessMode !== 'normal'
                                                            ? simulateColorBlindness(colord(palette.baseColor), colorBlindnessMode).toHex()
                                                            : palette.baseColor,
                                                        boxShadow: `0 10px 25px -5px ${palette.baseColor}20, 0 4px 6px -2px ${palette.baseColor}10`
                                                    }}
                                                    onClick={() => document.getElementById(`color-input-${palette.id}`)?.click()}
                                                />
                                                {colorBlindnessMode !== 'normal' && (
                                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                                                        <span className="text-white text-xs font-bold">A</span>
                                                    </div>
                                                )}
                                                {/* Mini color swatches */}
                                                {palette.colors.length > 0 && (
                                                    <div className="absolute -bottom-1 -right-1 flex space-x-0.5">
                                                        {palette.colors.slice(0, 3).map((color, i) => {
                                                            const simulatedColor = colorBlindnessMode !== 'normal'
                                                                ? simulateColorBlindness(colord(color.color), colorBlindnessMode).toHex()
                                                                : color.color;
                                                            return (
                                                                <div
                                                                    key={i}
                                                                    className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                                                                    style={{ backgroundColor: simulatedColor }}
                                                                />
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Palette Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-3 mb-1">
                                                    <input
                                                        type="text"
                                                        value={palette.name}
                                                        onChange={(e) => updatePalette(palette.id, { name: e.target.value })}
                                                        className="text-xl font-bold text-gray-900 bg-transparent border-none p-0 focus:ring-0 focus:outline-none hover:bg-gray-50 px-2 py-1 rounded-md transition-colors"
                                                        placeholder="Palette name"
                                                    />
                                                    {palettes.length > 1 && (
                                                        <Button
                                                            onClick={() => removePalette(palette.id)}
                                                            variant="ghost"
                                                            size="sm"
                                                            color="danger"
                                                            className="p-1 h-8 w-8 hover:bg-red-50"
                                                        >
                                                            <Icon icon={X} size="sm" />
                                                        </Button>
                                                    )}
                                                </div>
                                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                    <div className="flex items-center space-x-1">
                                                        <input
                                                            id={`color-input-${palette.id}`}
                                                            type="color"
                                                            value={palette.baseColor}
                                                            onChange={(e) => updatePalette(palette.id, { baseColor: e.target.value })}
                                                            className="w-6 h-6 rounded border border-gray-300 cursor-pointer"
                                                        />
                                                        <code className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                                            {palette.baseColor.toUpperCase()}
                                                        </code>
                                                    </div>
                                                    <span>•</span>
                                                    <span>{palette.colors.length} shades</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                onClick={() => setShowAdvancedControls(showAdvancedControls === palette.id ? null : palette.id)}
                                                variant="outline"
                                                size="sm"
                                                className="px-4 py-2 text-sm font-medium"
                                                leftIcon={<Icon icon={Settings} size="sm" />}
                                            >
                                                {showAdvancedControls === palette.id ? 'Hide' : 'Tune'} HSL
                                            </Button>
                                        </div>
                                    </div>


                                </div>

                                {/* HSL Controls */}
                                {showAdvancedControls === palette.id && (
                                    <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-2">
                                                <Icon icon={Settings} className="text-primary" />
                                                <h4 className="text-lg font-semibold text-gray-900">Fine-tune Color</h4>
                                            </div>
                                            {(() => {
                                                const hsl = colord(palette.baseColor).toHsl();
                                                return (
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between items-center">
                                                                <label className="text-sm font-medium text-gray-700">Hue</label>
                                                                <span className="text-sm font-mono text-gray-600 bg-white px-2 py-1 rounded border">{Math.round(hsl.h)}°</span>
                                                            </div>
                                                            <input
                                                                type="range"
                                                                min="0"
                                                                max="360"
                                                                value={hsl.h}
                                                                onChange={(e) => {
                                                                    const newColor = colord({ h: Number(e.target.value), s: hsl.s, l: hsl.l }).toHex();
                                                                    updatePalette(palette.id, { baseColor: newColor });
                                                                }}
                                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-hue"
                                                            />
                                                        </div>
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between items-center">
                                                                <label className="text-sm font-medium text-gray-700">Saturation</label>
                                                                <span className="text-sm font-mono text-gray-600 bg-white px-2 py-1 rounded border">{Math.round(hsl.s)}%</span>
                                                            </div>
                                                            <input
                                                                type="range"
                                                                min="0"
                                                                max="100"
                                                                value={hsl.s}
                                                                onChange={(e) => {
                                                                    const newColor = colord({ h: hsl.h, s: Number(e.target.value), l: hsl.l }).toHex();
                                                                    updatePalette(palette.id, { baseColor: newColor });
                                                                }}
                                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-saturation"
                                                            />
                                                        </div>
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between items-center">
                                                                <label className="text-sm font-medium text-gray-700">Lightness</label>
                                                                <span className="text-sm font-mono text-gray-600 bg-white px-2 py-1 rounded border">{Math.round(hsl.l)}%</span>
                                                            </div>
                                                            <input
                                                                type="range"
                                                                min="0"
                                                                max="100"
                                                                value={hsl.l}
                                                                onChange={(e) => {
                                                                    const newColor = colord({ h: hsl.h, s: hsl.s, l: Number(e.target.value) }).toHex();
                                                                    updatePalette(palette.id, { baseColor: newColor });
                                                                }}
                                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-lightness"
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                )}

                                {/* Color Shades */}
                                {palette.colors.length > 0 && (
                                    <div className="px-6 py-6 bg-gray-50">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-lg font-semibold text-gray-900">Color Shades</h4>
                                                <div className="flex items-center space-x-4 text-xs">
                                                    <div className="flex items-center space-x-1">
                                                        <div className="w-3 h-3 rounded-full bg-success border border-success"></div>
                                                        <span className="text-muted-foreground">AAA Compliant</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <div className="w-3 h-3 rounded-full bg-amber-500 border border-amber-500"></div>
                                                        <span className="text-muted-foreground">AA Compliant</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <div className="w-3 h-3 rounded-full bg-destructive border border-destructive"></div>
                                                        <span className="text-muted-foreground">Low Contrast</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Modern Shade Grid - Compact & Beautiful */}
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                                                {palette.colors.map((color, i) => {
                                                    const simulatedColor = colorBlindnessMode !== 'normal'
                                                        ? simulateColorBlindness(colord(color.color), colorBlindnessMode).toHex()
                                                        : color.color;

                                                    // Calculate contrast with white and black text
                                                    const contrastWithWhite = getContrastRatio(simulatedColor, '#ffffff');
                                                    const contrastWithBlack = getContrastRatio(simulatedColor, '#000000');
                                                    const aaCompliant = isWCAGCompliant(Math.max(contrastWithWhite, contrastWithBlack), 'AA');
                                                    const aaaCompliant = isWCAGCompliant(Math.max(contrastWithWhite, contrastWithBlack), 'AAA');

                                                    return (
                                                        <div key={i} className="group relative">
                                                            <div className="bg-card rounded-lg border border-border hover:shadow-md transition-all duration-200 relative">
                                                                {/* Color Swatch Header */}
                                                                <div className="relative h-12 flex items-center justify-center">
                                                                    <div
                                                                        className="w-full h-full cursor-pointer hover:brightness-110 transition-all duration-200 rounded-t-lg"
                                                                        style={{ backgroundColor: simulatedColor }}
                                                                        title={`${palette.name}-${color.name}: ${simulatedColor}${colorBlindnessMode !== 'normal' ? ` (${colorBlindnessMode})` : ''}`}
                                                                        onClick={() => navigator.clipboard.writeText(colorBlindnessMode !== 'normal' ? simulatedColor : color.color)}
                                                                    />

                                                                    {/* Status Badge - Top Right */}
                                                                    <div className="absolute -top-1 -right-1 z-10">
                                                                        {aaaCompliant ? (
                                                                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                                                                                <Icon icon={Check} size="xs" className="text-white" />
                                                                            </div>
                                                                        ) : aaCompliant ? (
                                                                            <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                                                                                <Icon icon={Check} size="xs" className="text-white" />
                                                                            </div>
                                                                        ) : (
                                                                            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                                                                                <Icon icon={X} size="xs" className="text-white" />
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Copy Success Overlay */}
                                                                    <div className="absolute inset-0 bg-success/95 text-success-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-t-lg">
                                                                        <div className="text-xs font-medium flex items-center gap-1">
                                                                            <Icon icon={Check} size="xs" />
                                                                            Copied!
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Shade Information */}
                                                                <div className="p-2">
                                                                    <div className="text-center space-y-1">
                                                                        <div className="text-xs font-semibold text-card-foreground">
                                                                            {color.name}
                                                                        </div>
                                                                        <div className="text-xs font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                                                                            {simulatedColor.toUpperCase()}
                                                                        </div>
                                                                        <div className="text-xs text-muted-foreground">
                                                                            {Math.max(contrastWithWhite, contrastWithBlack).toFixed(1)}:1
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Add Palette Button */}
                    <div className="flex justify-center pt-6">
                        <Button
                            onClick={addPalette}
                            variant="solid"
                            size="lg"
                            className="px-8 py-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            leftIcon={<Icon icon={Plus} size="md" />}
                        >
                            Add New Palette
                        </Button>
                    </div>
                </div>
            </div>

                {/* Export Code - Right Side */}
                <div className="xl:col-span-1">
                    {allColorsGenerated && (
                        <div className="sticky top-6">

                            {/* Code Export Tabs */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                {/* Tab Headers */}
                                <div className="flex border-b border-gray-200 bg-gray-50">
                                    <Button
                                        onClick={() => setCodeTab('framework')}
                                        variant="ghost"
                                        className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-none border-b-2 ${
                                            codeTab === 'framework'
                                                ? 'text-emerald-700 bg-white border-emerald-500'
                                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-transparent'
                                        }`}
                                        leftIcon={<Icon icon={Code} size="sm" />}
                                    >
                                        {framework === "tailwind" ? `Tailwind ${version}` : framework === "material-ui" ? `Material UI ${version}` : `Bootstrap ${version}`}
                                    </Button>
                                    <Button
                                        onClick={() => setCodeTab('css')}
                                        variant="ghost"
                                        className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-none border-b-2 ${
                                            codeTab === 'css'
                                                ? 'text-emerald-700 bg-white border-emerald-500'
                                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-transparent'
                                        }`}
                                        leftIcon={<Icon icon={FileText} size="sm" />}
                                    >
                                        CSS Variables
                                    </Button>
                                </div>

                                {/* Code Content */}
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium text-gray-700">
                                                {codeTab === 'framework' ? 'Framework Configuration' : 'CSS Custom Properties'}
                                            </span>
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-mono">
                                                {codeTab === 'framework' ? code.split('\n').length : cssCode.split('\n').length} lines
                                            </span>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-auto max-h-96 text-sm font-mono leading-relaxed border border-gray-200">
                                            {codeTab === 'framework' ? code : cssCode}
                                        </pre>

                                        {/* Copy success indicator */}
                                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="bg-success text-success-foreground px-2 py-1 rounded text-xs font-medium">
                                                Copied!
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-3 mt-4">
                                        <Button
                                            onClick={() => navigator.clipboard.writeText(codeTab === 'framework' ? code : cssCode)}
                                            variant="solid"
                                            size="sm"
                                            className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg transition-colors"
                                            leftIcon={<Icon icon={Copy} size="sm" />}
                                        >
                                            Copy Code
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                const blob = new Blob([codeTab === 'framework' ? code : cssCode], { type: 'text/plain' });
                                                const url = URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = codeTab === 'framework' ? `${framework}-config.${framework === 'tailwind' ? 'js' : 'js'}` : 'colors.css';
                                                document.body.appendChild(a);
                                                a.click();
                                                document.body.removeChild(a);
                                                URL.revokeObjectURL(url);
                                            }}
                                            variant="outline"
                                            size="sm"
                                            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                                            leftIcon={<Icon icon={Download} size="sm" />}
                                        >
                                            Download
                                        </Button>
                                    </div>

                                    {/* Usage Instructions */}
                                    <div className="mt-4 p-4 bg-muted rounded-lg border border-border">
                                        <div className="flex items-start space-x-3">
                                            <Icon icon={Zap} className="text-primary mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h4 className="text-sm font-semibold text-foreground mb-1">How to use</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {codeTab === 'framework'
                                                        ? `Copy this configuration to your ${framework} project. The color palette will be available as CSS custom properties and utility classes.`
                                                        : 'Copy these CSS variables to your stylesheet. Use them with var() function in your CSS.'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </>
    );
}
