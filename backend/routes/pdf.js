
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const { createCanvas, Image } = require('canvas');
// Move pdfjs-dist import to usage site to avoid load errors
// const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// --- MERGE PDF ---
router.post('/merge', upload.array('files'), async (req, res) => {
    try {
        const mergedPdf = await PDFDocument.create();
        for (const file of req.files) {
            const pdfBytes = await fs.readFile(file.path);
            const pdf = await PDFDocument.load(pdfBytes);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const mergedPdfBytes = await mergedPdf.save();
        const outputFilename = `merged_${Date.now()}.pdf`;
        const outputPath = path.join('uploads', outputFilename);
        await fs.writeFile(outputPath, mergedPdfBytes);

        res.json({ downloadUrl: `/download/${outputFilename}` }); // Placeholder URL logic
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to merge PDFs' });
    }
});


// --- SPLIT PDF ---
router.post('/split', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ error: 'No file uploaded' });

        console.log('Split Request Body:', req.body);
        let range = req.body.range || "1";
        // Handle case where range might be an array due to duplicate appending
        if (Array.isArray(range)) range = range[0];

        // Load Document
        const pdfBytes = await fs.readFile(file.path);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const totalPages = pdfDoc.getPageCount();

        // Parse Range
        // 1-based index from user -> 0-based for pdf-lib
        const pagesToKeep = new Set();

        const parts = range.split(',').map(p => p.trim());
        for (const part of parts) {
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(n => parseInt(n));
                if (!isNaN(start) && !isNaN(end)) {
                    for (let i = start; i <= end; i++) {
                        if (i >= 1 && i <= totalPages) pagesToKeep.add(i - 1);
                    }
                }
            } else {
                const pageNum = parseInt(part);
                if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                    pagesToKeep.add(pageNum - 1);
                }
            }
        }

        if (pagesToKeep.size === 0) {
            return res.status(400).json({ error: 'Invalid page range' });
        }

        // Create new PDF
        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(pdfDoc, Array.from(pagesToKeep));
        copiedPages.forEach((page) => newPdf.addPage(page));

        const outputFilename = `split_${Date.now()}.pdf`;
        const outputPath = path.join('uploads', outputFilename);
        const newPdfBytes = await newPdf.save();
        await fs.writeFile(outputPath, newPdfBytes);

        res.json({ downloadUrl: `/download/${outputFilename}` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to split PDF' });
    }
});


// --- COMPRESS PDF ---
router.post('/compress', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ error: 'No file uploaded' });

        const level = req.body.level || 'medium';
        const outputFilename = `compressed_${Date.now()}_${file.filename}`;
        const outputPath = path.join('uploads', outputFilename);

        // Load the document
        const originalPdfBytes = await fs.readFile(file.path);
        const pdfDoc = await PDFDocument.load(originalPdfBytes);

        // STRATEGY:
        // 'low' (High Quality) -> Standard optimization (lossless-ish). Good for vector/text docs.
        // 'medium' (Balanced) -> Light Rasterization (Quality 0.6). Good guaranteed reduction.
        // 'high' (Small Size) -> Heavy Rasterization (Quality 0.4). Aggressive reduction.

        let shouldRasterize = false;
        let jpegQuality = 0.8;
        let scale = 1.0;

        if (level === 'medium') {
            shouldRasterize = true;
            jpegQuality = 0.60;
            scale = 0.9;
        } else if (level === 'high' || level === 'extreme') {
            shouldRasterize = true;
            jpegQuality = 0.40;
            scale = 0.7; // 70% of original size dimensions
        }

        if (shouldRasterize) {
            // RASTERIZATION STRATEGY (Guarantees Reduction usually)
            // Convert pages to images, compress images, rebuild PDF.

            const data = new Uint8Array(originalPdfBytes);
            // Dynamic import to handle dependency issues gracefully
            const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
            const loadingTask = pdfjsLib.getDocument({ data });
            const pdfDocument = await loadingTask.promise;

            const newPdf = await PDFDocument.create();

            for (let i = 1; i <= pdfDocument.numPages; i++) {
                const page = await pdfDocument.getPage(i);
                const viewport = page.getViewport({ scale: scale });

                const canvas = createCanvas(viewport.width, viewport.height);
                const context = canvas.getContext('2d');

                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;

                // Compress to JPEG
                const jpgBuffer = canvas.toBuffer('image/jpeg', { quality: jpegQuality, progressive: true, chromaSubsampling: true });

                // Embed in new PDF
                const jpgImage = await newPdf.embedJpg(jpgBuffer);
                const newPage = newPdf.addPage([viewport.width, viewport.height]);
                newPage.drawImage(jpgImage, {
                    x: 0,
                    y: 0,
                    width: viewport.width,
                    height: viewport.height,
                });
            }

            const pdfBytes = await newPdf.save();

            // Fallback: If new file bigger than original (rare with low quality), use original
            // UNLESS user specifically asked for High Compression, then we respect the raster even if bigger (rare)
            // But usually we respect size.
            if (pdfBytes.length < file.size) {
                await fs.writeFile(outputPath, pdfBytes);
            } else {
                console.log(`Compression (Raster) failed to reduce size (New: ${pdfBytes.length}, Old: ${file.size}). using Raster anyway to force change format.`);
                // Actually, if it's bigger, it's usually better to stick with original unless format change is desired.
                // Let's stick to original for safety, BUT if the user wants "Small Size" and we failed, maybe we should try lower quality?
                // For now, let's just write the new file if it's reasonably close, or original if it blew up.

                if (level === 'high' || level === 'extreme') {
                    // Force write if they wanted extreme, maybe they want the image format
                    await fs.writeFile(outputPath, pdfBytes);
                } else {
                    await fs.copy(file.path, outputPath);
                }
            }

        } else {
            // LOW COMPRESSION (High Quality) / STRUCTURE OPTIMIZATION
            // Keeps vector text. Good for minimal reduction requirements.

            const newPdf = await PDFDocument.create();
            const copiedPages = await newPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
            copiedPages.forEach((page) => newPdf.addPage(page));

            const pdfBytes = await newPdf.save({ useObjectStreams: false });
            await fs.writeFile(outputPath, pdfBytes);
        }

        const stats = await fs.stat(outputPath);

        res.json({
            downloadUrl: `/download/${outputFilename}`,
            originalSize: file.size,
            newSize: stats.size
        });

    } catch (error) {
        console.error('Compression error:', error);
        res.status(500).json({ error: 'Compression failed', details: error.message });
    }
});

module.exports = router;
