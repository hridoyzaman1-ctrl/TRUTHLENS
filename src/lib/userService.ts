import { supabase } from './supabaseClient';
import { AdminUser, UserRole } from '@/types/news';

export type { AdminUser };

export const userService = {
    // Get current session
    getSession: async () => {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        return session;
    },

    // Get current user profile
    getCurrentUser: async (): Promise<AdminUser | null> => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profile) {
            return {
                id: profile.id,
                name: profile.full_name || user.email?.split('@')[0] || 'User',
                email: user.email || '',
                role: (profile.role as UserRole) || 'author',
                avatar: profile.avatar_url || '',
                isActive: true,
                createdAt: new Date(user.created_at),
                permissions: [] // populate based on role if needed
            };
        }
        return null;
    },

    // Sign in
    login: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    },

    // Sign out
    logout: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    // Update profile
    updateProfile: async (userId: string, updates: Partial<any>) => {
        const { data, error } = await supabase
            .from('profiles')
            .update({
                full_name: updates.name,
                avatar_url: updates.avatar,
                website: updates.website,
                // map other fields as needed
            })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
