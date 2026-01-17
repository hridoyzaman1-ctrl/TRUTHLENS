import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);

    // Log static file status
    const distPath = path.join(__dirname, 'dist');
    const indexPath = path.join(distPath, 'index.html');

    import('fs').then(fs => {
        if (fs.existsSync(distPath)) {
            console.log(`dist directory exists at: ${distPath}`);
            try {
                const files = fs.readdirSync(distPath);
                console.log('dist contents:', files);
            } catch (e) {
                console.error('Error reading dist directory:', e);
            }
        } else {
            console.error(`CRITICAL: dist directory missing at: ${distPath}`);
            console.error('Current directory contents:', fs.readdirSync(__dirname));
        }

        if (fs.existsSync(indexPath)) {
            console.log('index.html found');
        } else {
            console.error('CRITICAL: index.html missing');
        }
    });
});

// Handle SPA routing with error handling
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error loading application');
        }
    });
});
