import express from 'express';
import multer from 'multer';
import fs from 'fs-extra';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.static('public'));

// Increase the limits to handle any size IPA file
app.use(express.json({ limit: '0' }));
app.use(express.urlencoded({ extended: true, limit: '0' }));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads';
        fs.ensureDirSync(uploadDir);
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 0  // No file size limit
    }
});

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';
const OUTPUT_DIR = path.join(__dirname, 'signed-ipas');
const TEMP_DIR = path.join(__dirname, 'temp');

fs.ensureDirSync(OUTPUT_DIR);
fs.ensureDirSync(TEMP_DIR);

app.post('/api/sign-ipa', upload.fields([
    { name: 'ipa', maxCount: 1 },
    { name: 'p12', maxCount: 1 },
    { name: 'provision', maxCount: 1 }
]), async (req, res) => {
    try {
        if (!req.files) {
            throw new Error('No files uploaded');
        }

        console.log('Files received:', req.files);
        console.log('Password received:', req.body.p12Password);

        // Perform your IPA signing logic here

        const testInstallUrl = `itms-services://?action=download-manifest&url=${SERVER_URL}/signed-ipas/manifest.plist`;
        
        res.json({
            success: true,
            installUrl: testInstallUrl
        });
        
    } catch (error) {
        console.error('Error in /api/sign-ipa:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
