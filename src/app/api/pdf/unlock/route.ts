import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import qpdf from 'node-qpdf';

export async function POST(request: NextRequest) {
    const inputPath = path.join(os.tmpdir(), crypto.randomBytes(16).toString('hex') + '.pdf');
    const outputPath = path.join(os.tmpdir(), crypto.randomBytes(16).toString('hex') + '.pdf');

    console.log('Starting PDF unlock process');

    try {
        const formData = await request.formData();
        console.log('FormData received:', Array.from(formData.keys()));

        const file = formData.get('file');
        const passwordEntry = formData.get('password');

        console.log('File:', file ? { name: (file as File).name, size: (file as File).size } : 'null');
        console.log('Password entry:', passwordEntry ? { type: typeof passwordEntry, length: (passwordEntry as string).length } : 'null');

        if (!file || !passwordEntry || typeof passwordEntry !== 'string' || passwordEntry.trim() === '') {
            console.log('Validation failed: file or password missing/invalid');
            return new Response(JSON.stringify({ error: 'File and password are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const password = passwordEntry;
        console.log('Password validated, length:', password.length);

        const pdfBytes = await (file as File).arrayBuffer();
        console.log('PDF bytes length:', pdfBytes.byteLength);

        fs.writeFileSync(inputPath, Buffer.from(pdfBytes));
        console.log('Input file written to:', inputPath);

        console.log('Calling qpdf.decrypt with password:', password);

        const doc = qpdf.decrypt(inputPath, password);
        console.log('qpdf.decrypt called, doc:', typeof doc);

        let stream;
        if (doc && doc.stdout) {
            stream = doc.stdout;
        } else if (doc && typeof doc.on === 'function') {
            stream = doc;
        } else {
            throw new Error('qpdf.decrypt did not return a valid stream');
        }

        const chunks: Buffer[] = [];
        stream.on('data', (chunk: Buffer) => chunks.push(chunk));

        await new Promise<void>((resolve, reject) => {
            stream.on('end', () => resolve());
            stream.on('error', (err: Error) => reject(err));
        });

        const decryptedBytes = Buffer.concat(chunks);
        console.log('Decrypted bytes collected, length:', decryptedBytes.length);

        return new Response(decryptedBytes, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="unlocked_${(file as File).name}"`,
            },
        });
    } catch (error) {
        console.error('Error unlocking PDF:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
        });
        return new Response(JSON.stringify({ error: 'Failed to unlock PDF. Please check the password.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    } finally {
        console.log('Cleaning up temp files');
        if (fs.existsSync(inputPath)) {
            fs.unlinkSync(inputPath);
            console.log('Input file cleaned up');
        }
        if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
            console.log('Output file cleaned up');
        }
    }
}