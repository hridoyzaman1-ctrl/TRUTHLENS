import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection (only if DATABASE_URL exists)
let pool = null;
if (process.env.DATABASE_URL) {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
}

// In-memory storage fallback
let memoryStore = {};

// Initialize database table
const initDB = async () => {
    if (!pool) return;
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS app_data (
        key VARCHAR(255) PRIMARY KEY,
        value JSONB,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
        console.log('Database initialized');
    } catch (error) {
        console.error('Database init error:', error.message);
    }
};

// Get data by key
const getData = async (key) => {
    if (pool) {
        try {
            const result = await pool.query('SELECT value FROM app_data WHERE key = $1', [key]);
            return result.rows[0]?.value || null;
        } catch (error) {
            console.error('DB get error:', error.message);
        }
    }
    return memoryStore[key] || null;
};

// Save data by key
const saveData = async (key, value) => {
    memoryStore[key] = value;
    if (pool) {
        try {
            await pool.query(`
        INSERT INTO app_data (key, value, updated_at) 
        VALUES ($1, $2, NOW())
        ON CONFLICT (key) 
        DO UPDATE SET value = $2, updated_at = NOW()
      `, [key, JSON.stringify(value)]);
            return true;
        } catch (error) {
            console.error('DB save error:', error.message);
        }
    }
    return true;
};

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', database: !!pool });
});

app.get('/api/:key', async (req, res) => {
    const data = await getData(req.params.key);
    res.json(data);
});

app.post('/api/:key', async (req, res) => {
    await saveData(req.params.key, req.body);
    res.json({ success: true });
});

// Handle SPA routing - Express 4 syntax
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
const start = async () => {
    await initDB();
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Database: ${pool ? 'PostgreSQL connected' : 'Using memory storage'}`);
    });
};

start().catch(err => {
    console.error('Server start error:', err);
    process.exit(1);
});
