import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Data file path
const DATA_DIR = process.env.DATA_DIR || './data';
const DATA_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize data file if it doesn't exist
const initData = () => {
    if (!fs.existsSync(DATA_FILE)) {
        const defaultData = {
            articles: [],
            featuredSettings: null,
            sectionsSettings: null,
            menuSettings: null,
            siteSettings: null,
            socialLinks: null,
            categories: null,
            contacts: null,
            aboutInfo: null,
            jobs: null,
            teamMembers: null,
            comments: {}
        };
        fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
    }
};

const readData = () => {
    initData();
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
};

const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes
// Get all data for a key
app.get('/api/:key', (req, res) => {
    const data = readData();
    res.json(data[req.params.key] || null);
});

// Save data for a key
app.post('/api/:key', (req, res) => {
    const data = readData();
    data[req.params.key] = req.body;
    writeData(data);
    res.json({ success: true });
});

// Get all data (for initial load)
app.get('/api', (req, res) => {
    res.json(readData());
});

// Handle SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Data stored in: ${DATA_FILE}`);
});
