import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static('public'));  // if your frontend files are in a 'public' folder
// or
app.use(express.static('.'));  // if your frontend files are in the root directory

// Add this route to serve your index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 500 * 1024 * 1024
    }
});

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

        const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
        const testInstallUrl = `itms-services://?action=download-manifest&url=${baseUrl}/signed-ipas/manifest.plist`;
        
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

export default app;
