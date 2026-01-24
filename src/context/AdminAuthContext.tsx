import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { RolePermissions, ROLE_PERMISSIONS, hasPermission } from '@/types/admin';
import { userService, AdminUser } from '@/lib/userService';

// Export for compatibility
export type { AdminUser as ExtendedAdminUser };

interface AdminAuthContextType {
  currentUser: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  hasPermission: (permission: keyof RolePermissions) => boolean;
  canAccessPath: (path: string) => boolean;
  updateCurrentUser: (user: AdminUser) => Promise<void>;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Path to permission mapping
const PATH_PERMISSIONS: Record<string, keyof RolePermissions | 'always'> = {
  '/admin': 'always',
  '/admin/featured': 'manageFeatured',
  '/admin/sections': 'manageSections',
  '/admin/menu': 'manageMenu',
  '/admin/editorial': 'manageEditorial',
  '/admin/articles': 'always',
  '/admin/comments': 'viewAllComments',
  '/admin/contact-info': 'manageContactInfo',
  '/admin/categories': 'manageCategories',
  '/admin/media': 'uploadMedia',
  '/admin/users': 'manageUsers',
  '/admin/jobs': 'manageJobs',
  '/admin/settings': 'manageSettings',
  '/admin/profile': 'always',
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const session = await userService.getSession();
        if (session) {
          const user = await userService.getCurrentUser();
          if (user) {
            setCurrentUser(user);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string, rememberMe = false): Promise<boolean> => {
    try {
      const { user } = await userService.login(email, password);
      if (user) {
        // Fetch full profile including role
        const profile = await userService.getCurrentUser();
        if (profile) {
          setCurrentUser(profile);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await userService.logout();
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  const checkPermission = useCallback((permission: keyof RolePermissions): boolean => {
    if (!currentUser) return false;
    return hasPermission(currentUser.role, permission);
  }, [currentUser]);

  const canAccessPath = useCallback((path: string): boolean => {
    if (!currentUser) return false;

    const permission = PATH_PERMISSIONS[path];
    if (!permission) return true;
    if (permission === 'always') return true;

    return hasPermission(currentUser.role, permission);
  }, [currentUser]);

  const updateCurrentUser = useCallback(async (user: AdminUser) => {
    try {
      await userService.updateProfile(user.id, user);
      setCurrentUser(user);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
        hasPermission: checkPermission,
        canAccessPath,
        updateCurrentUser,
        isLoading
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};
