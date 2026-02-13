
const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DEBUG: Log all requests
app.use((req, res, next) => {
    console.log(`[DEBUG] ${req.method} ${req.url}`);
    next();
});

// Upload Directory Setup
const UPLOAD_DIR = path.join(__dirname, 'uploads');
fs.ensureDirSync(UPLOAD_DIR);

// Clean up old files (older than 1 hour)
const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour
setInterval(async () => {
    try {
        const files = await fs.readdir(UPLOAD_DIR);
        const now = Date.now();
        for (const file of files) {
            const filePath = path.join(UPLOAD_DIR, file);
            const stats = await fs.stat(filePath);
            if (now - stats.mtimeMs > CLEANUP_INTERVAL) {
                await fs.remove(filePath);
                console.log(`Deleted old file: ${file}`);
            }
        }
    } catch (err) {
        console.error('Cleanup error:', err);
    }
}, CLEANUP_INTERVAL);

// Serve uploaded/processed files for download
app.use('/download', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => {
    res.send('Docmify Backend is Running');
});

const pdfRoutes = require('./routes/pdf');
app.use('/api/pdf', pdfRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
