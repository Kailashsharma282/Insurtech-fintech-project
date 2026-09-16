'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useRole } from '@/context/RoleContext';
import { Role } from '@/lib/types';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Strict Role-Based Route Definitions
const ROLE_ALLOWED_ROUTES: Record<Role, { prefixes: string[]; home: string; label: string }> = {
  FARMER: {
    prefixes: [
      '/farmer',
      '/',
      '/login',
      '/register',
    ],
    home: '/farmer/dashboard',
    label: 'Farmer',
  },
  INSURER: {
    prefixes: [
      '/insurer',
      '/',
      '/how-it-works',
      '/technology',
      '/research',
      '/team',
      '/login',
      '/register',
    ],
    home: '/insurer/dashboard',
    label: 'Underwriting Insurer',
  },
  ADMIN: {
    prefixes: [
      '/admin',
      '/operations',
      '/intelligence',
      '/technology',
      '/research',
      '/team',
      '/',
      '/login',
      '/register',
    ],
    home: '/admin/overview',
    label: 'System Administrator',
  },
  FIELD_AGENT: {
    prefixes: [
      '/intelligence',
      '/farmer/farms',
      '/farmer/disease',
      '/',
      '/login',
      '/register',
    ],
    home: '/intelligence/map',
    label: 'Field Extension Agent',
  },
};

export const RouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role } = useRole();
  const pathname = usePathname();
  const router = useRouter();
  const [denied, setDenied] = useState<{ forbiddenPath: string; allowedHome: string; roleLabel: string } | null>(null);

  useEffect(() => {
    if (!pathname) return;

    // Homepage and authentication routes are universally accessible
    if (pathname === '/' || pathname === '/login' || pathname === '/register') {
      setDenied(null);
      return;
    }

    const config = ROLE_ALLOWED_ROUTES[role] || ROLE_ALLOWED_ROUTES.FARMER;

    // Check if the current route is allowed by any allowed prefix for this role
    const isAllowed = config.prefixes.some((prefix) => {
      if (prefix === '/') return pathname === '/';
      return pathname.startsWith(prefix);
    });

    if (!isAllowed) {
      setDenied({
        forbiddenPath: pathname,
        allowedHome: config.home,
        roleLabel: config.label,
      });

      // Immediate redirect to authorized workspace
      const timer = setTimeout(() => {
        router.replace(config.home);
      }, 1200);

      return () => clearTimeout(timer);
    } else {
      setDenied(null);
    }
  }, [pathname, role, router]);

  if (denied) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#071511]">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[#0B2119] border border-amber-500/40 text-center shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Restricted by Role</h2>
          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            Your active role is <strong className="text-amber-400 font-mono">{denied.roleLabel}</strong>. 
            Access to <code className="px-1.5 py-0.5 rounded bg-black/40 text-rose-300 font-mono text-[11px]">{denied.forbiddenPath}</code> is restricted.
          </p>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 mb-5 font-mono">
            Redirecting to {denied.roleLabel} Portal in 1.2s...
          </div>
          <Link
            href={denied.allowedHome}
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-white font-bold text-xs transition-all shadow-lg"
          >
            <span>Go to My Portal</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
