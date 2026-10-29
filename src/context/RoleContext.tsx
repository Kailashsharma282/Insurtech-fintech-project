'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role } from '@/lib/types';

export interface UserProfile {
  id: string;
  name: string;
  role: Role;
  phone?: string;
  email?: string;
  district?: string;
  village?: string;
  organization?: string;
  licenseId?: string;
  primaryCrop?: string;
  farmSizeHa?: number;
  bankAccount?: string;
  token?: string;
  createdAt: string;
}

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (credentials: { role: Role; identifier: string; passwordOrOtp?: string; name?: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  registerUser: (profileData: Partial<UserProfile>) => Promise<{ success: boolean; message?: string }>;
  isSimulating: boolean;
  setIsSimulating: (val: boolean) => void;
  unreadAlertsCount: number;
}

// Default role presets for instant evaluation or fallback
const DEFAULT_PROFILES: Record<Role, UserProfile> = {
  FARMER: {
    id: 'usr-farmer-01',
    name: 'Rajesh Mondal',
    role: 'FARMER',
    phone: '+91 98321 44820',
    district: 'Paschim Medinipur',
    village: 'Ghatal, West Bengal',
    primaryCrop: 'Aman Paddy',
    farmSizeHa: 2.8,
    bankAccount: 'State Bank of India (***4921)',
    createdAt: '2026-06-15T10:00:00Z',
  },
  INSURER: {
    id: 'usr-insurer-01',
    name: 'Dr. S. Sen (Chief Actuary)',
    role: 'INSURER',
    email: 'underwriter@agrisure.in',
    organization: 'Agriculture Insurance Co. of India',
    licenseId: 'IRDAI-AGR-2024-8842',
    district: 'Kolkata HQ (West Bengal Cluster)',
    createdAt: '2026-01-10T09:00:00Z',
  },
  ADMIN: {
    id: 'usr-admin-01',
    name: 'Dr. Arindam Banerjee',
    role: 'ADMIN',
    email: 'admin@agrisure.in',
    organization: 'AgriSure Geospatial Lab & Engineering',
    createdAt: '2025-11-01T08:00:00Z',
  },
  FIELD_AGENT: {
    id: 'usr-agent-01',
    name: 'Prabir Bhattacharya (FA-WB-441)',
    role: 'FIELD_AGENT',
    phone: '+91 94330 12345',
    district: 'Ghatal, Paschim Medinipur',
    organization: 'State Agri Extension Wing (FA-WB-441)',
    createdAt: '2026-03-20T11:30:00Z',
  },
};

const RoleContext = createContext<RoleContextType>({
  role: 'FARMER',
  setRole: () => {},
  user: DEFAULT_PROFILES.FARMER,
  isAuthenticated: true,
  login: async () => ({ success: true }),
  logout: () => {},
  registerUser: async () => ({ success: true }),
  isSimulating: true,
  setIsSimulating: () => {},
  unreadAlertsCount: 3,
});

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('FARMER');
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_PROFILES.FARMER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState<number>(3);

  // Initialize from server session or localStorage on client load
  useEffect(() => {
    async function initAuth() {
      try {
        // First check server session cookie via /api/auth/me
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setUser(data.user);
            setRole(data.user.role);
            setIsAuthenticated(true);
            return;
          }
        }
      } catch {
        // fallback to localStorage
      }

      if (typeof window !== 'undefined') {
        const savedUserJson = localStorage.getItem('agrisure_auth_user');
        if (savedUserJson) {
          try {
            const parsed = JSON.parse(savedUserJson);
            setUser(parsed);
            setRole(parsed.role || 'FARMER');
            setIsAuthenticated(true);
            return;
          } catch {
            // ignore parsing error
          }
        }

        const savedRole = localStorage.getItem('agrisure_user_role') as Role;
        if (savedRole && ['FARMER', 'INSURER', 'ADMIN', 'FIELD_AGENT'].includes(savedRole)) {
          setRole(savedRole);
          setUser(DEFAULT_PROFILES[savedRole]);
        }
      }
    }

    initAuth();
  }, []);

  const handleSetRole = async (newRole: Role) => {
    setRole(newRole);
    const newProfile = DEFAULT_PROFILES[newRole];
    setUser(newProfile);

    // Synchronize server cookie session with verified pilot credentials
    const pilotPasswords: Record<Role, string> = {
      FARMER: 'Farmer@2026',
      INSURER: 'Insurer@2026',
      ADMIN: 'Admin@2026',
      FIELD_AGENT: 'Agent@2026',
    };

    try {
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: newRole,
          identifier: newProfile.phone || newProfile.email || 'underwriter@agrisure.in',
          password: pilotPasswords[newRole],
        }),
      });
    } catch {
      // offline fallback
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('agrisure_user_role', newRole);
      localStorage.setItem('agrisure_auth_user', JSON.stringify(newProfile));
    }
  };

  const login = async (credentials: { role: Role; identifier: string; passwordOrOtp?: string; name?: string }) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: credentials.role,
          identifier: credentials.identifier,
          password: credentials.passwordOrOtp,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.user) {
        setUser(data.user);
        setRole(data.user.role || credentials.role);
        setIsAuthenticated(true);

        if (typeof window !== 'undefined') {
          localStorage.setItem('agrisure_user_role', data.user.role);
          localStorage.setItem('agrisure_auth_user', JSON.stringify(data.user));
        }

        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.error || 'Authentication failed.' };
      }
    } catch (err) {
      // Fallback for offline resilience
      const matchedProfile = DEFAULT_PROFILES[credentials.role];
      const loggedInUser: UserProfile = {
        ...matchedProfile,
        name: credentials.name || matchedProfile.name,
        phone: credentials.role === 'FARMER' || credentials.role === 'FIELD_AGENT' ? credentials.identifier : matchedProfile.phone,
        email: credentials.role === 'INSURER' || credentials.role === 'ADMIN' ? credentials.identifier : matchedProfile.email,
        role: credentials.role,
        token: `token_${Date.now()}`,
      };

      setUser(loggedInUser);
      setRole(credentials.role);
      setIsAuthenticated(true);

      if (typeof window !== 'undefined') {
        localStorage.setItem('agrisure_user_role', credentials.role);
        localStorage.setItem('agrisure_auth_user', JSON.stringify(loggedInUser));
      }

      return { success: true, message: 'Logged in in fallback mode' };
    }
  };

  const registerUser = async (profileData: Partial<UserProfile>) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      const data = await res.json();

      if (res.ok && data.success && data.user) {
        setUser(data.user);
        setRole(data.user.role);
        setIsAuthenticated(true);

        if (typeof window !== 'undefined') {
          localStorage.setItem('agrisure_user_role', data.user.role);
          localStorage.setItem('agrisure_auth_user', JSON.stringify(data.user));
        }

        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.error || 'Registration failed.' };
      }
    } catch (err) {
      return { success: false, message: 'Network error during registration' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }

    setUser(null);
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('agrisure_auth_user');
      localStorage.removeItem('agrisure_user_role');
    }
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole: handleSetRole,
        user,
        isAuthenticated,
        login,
        logout,
        registerUser,
        isSimulating,
        setIsSimulating,
        unreadAlertsCount,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
