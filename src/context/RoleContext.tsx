'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role } from '@/lib/types';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  isSimulating: boolean;
  setIsSimulating: (val: boolean) => void;
  unreadAlertsCount: number;
}

const RoleContext = createContext<RoleContextType>({
  role: 'FARMER',
  setRole: () => {},
  isSimulating: true,
  setIsSimulating: () => {},
  unreadAlertsCount: 3
});

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('FARMER');
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState<number>(3);

  // Read saved role if any
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('agrisure_user_role') as Role;
      if (saved && ['FARMER', 'INSURER', 'ADMIN', 'FIELD_AGENT'].includes(saved)) {
        setRole(saved);
      }
    }
  }, []);

  const handleSetRole = (newRole: Role) => {
    setRole(newRole);
    if (typeof window !== 'undefined') {
      localStorage.setItem('agrisure_user_role', newRole);
    }
  };

  return (
    <RoleContext.Provider value={{ role, setRole: handleSetRole, isSimulating, setIsSimulating, unreadAlertsCount }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
