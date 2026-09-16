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
    district: 'Nadia',
    village: 'Baganchra, Santipur',
    primaryCrop: 'Aman Paddy',
    farmSizeHa: 2.8,
    bankAccount: 'State Bank of India (***4921)',
    createdAt: '2026-06-15T10:00:00Z',
  },
  INSURER: {
    id: 'usr-insurer-01',
    name: 'Priya Sengupta',
    role: 'INSURER',
    email: 'p.sengupta@agrisure.in',
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
    name: 'Bikram Sen',
    role: 'FIELD_AGENT',
    phone: '+91 94330 19284',
    district: 'Nadia & Murshidabad',
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

  // Initialize from localStorage on client load
  useEffect(() => {
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
  }, []);

  const handleSetRole = (newRole: Role) => {
    setRole(newRole);
    const newProfile = DEFAULT_PROFILES[newRole];
    setUser(newProfile);
    if (typeof window !== 'undefined') {
      localStorage.setItem('agrisure_user_role', newRole);
      localStorage.setItem('agrisure_auth_user', JSON.stringify(newProfile));
    }
  };

  const login = async (credentials: { role: Role; identifier: string; passwordOrOtp?: string; name?: string }) => {
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

    return { success: true, message: 'Login successful' };
  };

  const registerUser = async (profileData: Partial<UserProfile>) => {
    const newRole = profileData.role || 'FARMER';
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: profileData.name || 'Registered User',
      role: newRole,
      phone: profileData.phone,
      email: profileData.email,
      district: profileData.district || 'Nadia',
      village: profileData.village || 'Santipur',
      organization: profileData.organization,
      licenseId: profileData.licenseId,
      primaryCrop: profileData.primaryCrop || 'Aman Paddy',
      farmSizeHa: profileData.farmSizeHa || 2.5,
      bankAccount: profileData.bankAccount || 'Bank Direct Transfer Registered',
      token: `token_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    setRole(newRole);
    setIsAuthenticated(true);

    if (typeof window !== 'undefined') {
      localStorage.setItem('agrisure_user_role', newRole);
      localStorage.setItem('agrisure_auth_user', JSON.stringify(newUser));
    }

    return { success: true, message: 'Account registered successfully' };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('agrisure_auth_user');
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
