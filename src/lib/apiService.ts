// API service for persistent storage (replaces localStorage when deployed)

const isProduction = import.meta.env.PROD;
const API_BASE = '/api';

// Helper to make API calls
const apiCall = async (key: string, method: 'GET' | 'POST' = 'GET', data?: any) => {
    try {
        const options: RequestInit = {
            method,
            headers: { 'Content-Type': 'application/json' },
        };
        if (data) options.body = JSON.stringify(data);

        const response = await fetch(`${API_BASE}/${key}`, options);
        if (!response.ok) throw new Error('API error');
        return response.json();
    } catch (error) {
        console.error('API call failed:', error);
        return null;
    }
};

// Storage wrapper - uses API in production, localStorage in development
export const storage = {
    async get(key: string): Promise<any> {
        if (isProduction) {
            return apiCall(key);
        }
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },

    async set(key: string, value: any): Promise<void> {
        if (isProduction) {
            await apiCall(key, 'POST', value);
        } else {
            localStorage.setItem(key, JSON.stringify(value));
        }
    },

    // Synchronous versions for components that need immediate values
    getSync(key: string): any {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },

    setSync(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value));
    }
};

// Initialize: Load data from server on app start (production only)
export const initializeStorage = async () => {
    if (!isProduction) return;

    try {
        const data = await fetch(API_BASE).then(r => r.json());
        // Cache in localStorage for faster access
        Object.entries(data).forEach(([key, value]) => {
            if (value) localStorage.setItem(key, JSON.stringify(value));
        });
    } catch (error) {
        console.error('Failed to initialize storage:', error);
    }
};

// Sync local changes to server (call this after any save)
export const syncToServer = async (key: string, value: any) => {
    if (isProduction) {
        await apiCall(key, 'POST', value);
    }
};
