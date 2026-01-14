import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AdminRole, AdminUser, RolePermissions, ROLE_PERMISSIONS, hasPermission } from '@/types/admin';

interface AdminAuthContextType {
  currentUser: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => boolean;
  logout: () => void;
  hasPermission: (permission: keyof RolePermissions) => boolean;
  canAccessPath: (path: string) => boolean;
  updateCurrentUser: (user: AdminUser) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Mock admin users for demo
const MOCK_ADMIN_USERS: Record<string, { password: string; user: Omit<AdminUser, 'id'> }> = {
  'admin@truthlens.com': {
    password: 'admin123',
    user: {
      name: 'Admin User',
      email: 'admin@truthlens.com',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      isActive: true,
      createdAt: new Date('2024-01-01'),
    },
  },
  'editor@truthlens.com': {
    password: 'editor123',
    user: {
      name: 'Sarah Editor',
      email: 'editor@truthlens.com',
      role: 'editor',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      isActive: true,
      createdAt: new Date('2024-02-01'),
    },
  },
  'author@truthlens.com': {
    password: 'author123',
    user: {
      name: 'John Author',
      email: 'author@truthlens.com',
      role: 'author',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      isActive: true,
      createdAt: new Date('2024-03-01'),
    },
  },
  'journalist@truthlens.com': {
    password: 'journalist123',
    user: {
      name: 'Emily Journalist',
      email: 'journalist@truthlens.com',
      role: 'journalist',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      isActive: true,
      createdAt: new Date('2024-03-15'),
    },
  },
};

// Path to permission mapping
const PATH_PERMISSIONS: Record<string, keyof RolePermissions | 'always'> = {
  '/admin': 'always', // Dashboard - always accessible but content varies
  '/admin/featured': 'manageFeatured',
  '/admin/sections': 'manageSections',
  '/admin/menu': 'manageMenu',
  '/admin/editorial': 'manageEditorial',
  '/admin/articles': 'always', // Always accessible but features vary
  '/admin/comments': 'viewAllComments',
  '/admin/contact-info': 'manageContactInfo',
  '/admin/categories': 'manageCategories',
  '/admin/media': 'uploadMedia',
  '/admin/users': 'manageUsers',
  '/admin/jobs': 'manageJobs',
  '/admin/settings': 'manageSettings',
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  // Load user from storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser') || sessionStorage.getItem('adminUser');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // Ensure date is properly restored
        parsed.createdAt = new Date(parsed.createdAt);
        setCurrentUser(parsed);
      } catch {
        localStorage.removeItem('adminUser');
        sessionStorage.removeItem('adminUser');
      }
    }
  }, []);

  const login = useCallback((email: string, password: string, rememberMe = false): boolean => {
    const userEntry = MOCK_ADMIN_USERS[email.toLowerCase()];
    
    if (userEntry && userEntry.password === password && userEntry.user.isActive) {
      const user: AdminUser = {
        id: email.toLowerCase().replace(/[^a-z0-9]/g, ''),
        ...userEntry.user,
      };
      
      setCurrentUser(user);
      
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('adminUser', JSON.stringify(user));
      
      // Also set the old auth for backward compatibility
      storage.setItem('adminAuth', JSON.stringify({ isAuthenticated: true, timestamp: Date.now() }));
      
      return true;
    }
    
    return false;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('adminUser');
    sessionStorage.removeItem('adminUser');
    localStorage.removeItem('adminAuth');
    sessionStorage.removeItem('adminAuth');
  }, []);

  const checkPermission = useCallback((permission: keyof RolePermissions): boolean => {
    if (!currentUser) return false;
    return hasPermission(currentUser.role, permission);
  }, [currentUser]);

  const canAccessPath = useCallback((path: string): boolean => {
    if (!currentUser) return false;
    
    const permission = PATH_PERMISSIONS[path];
    if (!permission) return true; // Unknown paths are accessible
    if (permission === 'always') return true;
    
    return hasPermission(currentUser.role, permission);
  }, [currentUser]);

  const updateCurrentUser = useCallback((user: AdminUser) => {
    setCurrentUser(user);
    const storage = localStorage.getItem('adminUser') ? localStorage : sessionStorage;
    storage.setItem('adminUser', JSON.stringify(user));
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

// Export for backward compatibility with AdminLogin
export const isAdminAuthenticated = (): boolean => {
  const storedUser = localStorage.getItem('adminUser') || sessionStorage.getItem('adminUser');
  return !!storedUser;
};

export const adminLogout = (): void => {
  localStorage.removeItem('adminUser');
  sessionStorage.removeItem('adminUser');
  localStorage.removeItem('adminAuth');
  sessionStorage.removeItem('adminAuth');
};
