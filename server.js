import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Initialize database table
const initDB = async () => {
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
        console.error('Database init error:', error);
    }
};

// Get data by key
const getData = async (key) => {
    try {
        const result = await pool.query('SELECT value FROM app_data WHERE key = $1', [key]);
        return result.rows[0]?.value || null;
    } catch (error) {
        console.error('Error getting data:', error);
        return null;
    }
};

// Save data by key
const saveData = async (key, value) => {
    try {
        await pool.query(`
      INSERT INTO app_data (key, value, updated_at) 
      VALUES ($1, $2, NOW())
      ON CONFLICT (key) 
      DO UPDATE SET value = $2, updated_at = NOW()
    `, [key, JSON.stringify(value)]);
        return true;
    } catch (error) {
        console.error('Error saving data:', error);
        return false;
    }
};

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes
app.get('/api/:key', async (req, res) => {
    const data = await getData(req.params.key);
    res.json(data);
});

app.post('/api/:key', async (req, res) => {
    const success = await saveData(req.params.key, req.body);
    res.json({ success });
});

// Get all data
app.get('/api', async (req, res) => {
    try {
        const result = await pool.query('SELECT key, value FROM app_data');
        const data = {};
        result.rows.forEach(row => {
            data[row.key] = row.value;
        });
        res.json(data);
    } catch (error) {
        res.json({});
    }
});

// Handle SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
const start = async () => {
    if (process.env.DATABASE_URL) {
        await initDB();
    }
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Database: ${process.env.DATABASE_URL ? 'PostgreSQL connected' : 'No database configured'}`);
    });
};

start();
