import express from 'express';
import multer from 'multer';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// For Vercel, we need to use memory storage instead of disk storage
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

        // Generate dynamic URL based on deployment URL
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

// Remove app.listen for Vercel
export default app;
