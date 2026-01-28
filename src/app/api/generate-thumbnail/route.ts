import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
    let tempPdfPath: string | null = null;
    let tempJpegPath: string | null = null;

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Create temp files
        const tempDir = '/tmp';
        const timestamp = Date.now();
        tempPdfPath = path.join(tempDir, `input-${timestamp}.pdf`);
        tempJpegPath = path.join(tempDir, `thumb-${timestamp}.jpg`);

        // Write PDF to temp file
        await fs.writeFile(tempPdfPath, buffer);

        // Use ImageMagick to convert first page of PDF to JPEG
        const convertCommand = `convert -density 150 "${tempPdfPath}[0]" -quality 80 -resize 200x200 -background white -flatten "${tempJpegPath}"`;

        await execAsync(convertCommand);

        // Read the generated JPEG
        const jpegBuffer = await fs.readFile(tempJpegPath);
        const base64 = jpegBuffer.toString('base64');

        const thumbnail = `data:image/jpeg;base64,${base64}`;
        return NextResponse.json({ thumbnail });

    } catch (error) {
        console.error('Thumbnail generation error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        // Clean up temp files
        try {
            if (tempPdfPath) await fs.unlink(tempPdfPath).catch(() => {});
            if (tempJpegPath) await fs.unlink(tempJpegPath).catch(() => {});
        } catch (cleanupError) {
            console.error('Cleanup error:', cleanupError);
        }
    }
}