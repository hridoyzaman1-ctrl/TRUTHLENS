import { supabase } from './supabaseClient';
import { MenuItem, SiteSettings } from '@/types/news';

// Helper to get/set JSON settings
const getSetting = async <T>(key: string, defaultValue: T): Promise<T> => {
    const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', key)
        .single();

    if (error || !data) return defaultValue;
    return data.value as T;
};

const saveSetting = async <T>(key: string, value: T) => {
    const { error } = await supabase
        .from('site_settings')
        .upsert({ key, value: value as any });

    if (error) console.error(`Error saving setting ${key}:`, error);
    else window.dispatchEvent(new Event(`${key}SettingsUpdated`));
};

// --- Definitions ---
// Types are imported, defaults defined here

export const defaultFeaturedSettings = {
    breakingNewsIds: [],
    heroFeaturedIds: [],
    heroSideArticleIds: [],
    maxBreakingNews: 5,
    maxHeroArticles: 5,
    breakingAutoSwipe: true,
    autoSwipeInterval: 5000,
    heroAutoSwipe: true
};

export const getFeaturedSettings = () => getSetting('featured', defaultFeaturedSettings);
export const saveFeaturedSettings = (s: any) => saveSetting('featured', s);

// Sections
export const getSectionsSettings = async (defaultSections: any[]) => {
    const saved = await getSetting<any[]>('sections', []);
    if (!saved || saved.length === 0) return defaultSections;

    // Merge logic: simplistic merge based on ID
    const savedMap = new Map(saved.map((s: any) => [s.id, s]));
    return defaultSections.map(def => {
        const s = savedMap.get(def.id);
        return s ? { ...def, ...s, icon: def.icon } : def;
    });
};
export const saveSectionsSettings = (s: any[]) => saveSetting('sections', s.map(({ icon, ...rest }) => rest));

// Menu
export const getMenuSettings = (def: any[]) => getSetting('menu', def);
export const saveMenuSettings = (s: any[]) => saveSetting('menu', s);

// Site Settings
export const defaultSiteSettings = {
    siteName: 'TruthLens',
    tagline: 'Authentic Stories. Unbiased Voices.',
    siteDescription: 'Your trusted source for fact-based journalism.',
    contactEmail: 'contact@truthlens.com',
    enableComments: true,
    moderateComments: true,
    enableNewsletter: true,
    articlesPerPage: '10',
    defaultCategory: 'national',
    timezone: 'UTC',
    dateFormat: 'MMM d, yyyy',
    maintenanceMode: false
};
export const getSiteSettings = () => getSetting('site', defaultSiteSettings);
export const saveSiteSettings = (s: any) => saveSetting('site', s);

// Social
export const getSocialLinks = (def: any[]) => getSetting('social', def);
export const saveSocialLinks = (s: any[]) => saveSetting('social', s);

// Categories
export const getCategories = (def: any[]) => getSetting('categories', def);
export const saveCategories = (s: any[]) => saveSetting('categories', s);

// Contact Info
export const defaultContactInfo = {
    email: 'contact@truthlens.com',
    phone: '+1 (555) 123-4567',
    address: '123 News Street, Media City, MC 12345',
    officeHours: 'Mon-Fri 9:00 AM - 6:00 PM'
};
export const getContactInfo = () => getSetting('contact', defaultContactInfo);
export const saveContactInfo = (s: any) => saveSetting('contact', s);

// Internships - DEPRECATED/Merged? 
// If specific config is needed, store in 'internships-config'. 
// Actual internship listings should be in 'jobs' table.
export const getInternships = (def: any[]) => getSetting('internship_config', def);
export const saveInternships = (s: any[]) => saveSetting('internship_config', s);

// Jobs - DEPRECATED here?
// Use jobService for CRUD. If this is for 'job settings' (like labels), then keep it. 
// But original seemed to store the jobs themselves.
// We redirect to jobService logic or return empty/default if UI expects configs.
// Assuming this was storing actual JOB POSTINGS in the original file:
// We should NOT use this for jobs anymore.
export const getJobs = (def: any[]) => {
    console.warn('getJobs in settingsService is deprecated. Use jobService.');
    return def;
};
export const saveJobs = (s: any[]) => {
    console.warn('saveJobs in settingsService is deprecated. Use jobService.');
};
