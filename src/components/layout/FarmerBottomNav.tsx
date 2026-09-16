'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRole } from '@/context/RoleContext';
import { Home, Sprout, Bell, Shield, User } from 'lucide-react';

export const FarmerBottomNav: React.FC = () => {
  const { role, unreadAlertsCount } = useRole();
  const pathname = usePathname();

  // Show bottom nav on mobile when role is FARMER
  if (role !== 'FARMER') return null;

  const navItems = [
    { label: 'Home', href: '/farmer/dashboard', icon: Home },
    { label: 'Farm', href: '/farmer/farms', icon: Sprout },
    { label: 'Alerts', href: '/farmer/alerts', icon: Bell, badge: unreadAlertsCount },
    { label: 'Insurance', href: '/farmer/insurance', icon: Shield },
    { label: 'Profile', href: '/team', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#071511]/95 backdrop-blur-md border-t border-[#10B981]/20 px-2 py-2">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/farmer/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all relative ${
                isActive ? 'text-[#34D399] bg-[#10B981]/15 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
              {item.badge && item.badge > 0 ? (
                <span className="absolute top-0.5 right-3 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
