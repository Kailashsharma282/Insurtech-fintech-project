'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useRole } from '@/context/RoleContext';
import { useLanguage, SUPPORTED_LANGUAGES } from '@/context/LanguageContext';
import { Role } from '@/lib/types';
import { 
  Satellite, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Activity, 
  Menu, 
  X, 
  Sparkles,
  ChevronDown,
  Zap,
  Globe,
  ArrowRight,
  FileText,
  LogOut,
  LogIn,
  UserCheck,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface NavItem {
  name: string;
  href: string;
  icon?: any;
  highlight?: boolean;
}

const ROLE_NAV_LINKS: Record<Role, NavItem[]> = {
  FARMER: [
    { name: 'Dashboard', href: '/farmer/dashboard', icon: Satellite },
    { name: 'My Farms', href: '/farmer/farms', icon: Layers },
    { name: 'Photo AI & NPK', href: '/farmer/disease', icon: Sparkles },
    { name: 'Insurance Claims', href: '/farmer/insurance-validation', icon: ShieldCheck, highlight: true },
    { name: 'Weather Telemetry', href: '/intelligence/weather', icon: Activity },
    { name: 'Policies', href: '/farmer/insurance', icon: FileText },
  ],
  INSURER: [
    { name: 'Underwriting Desk', href: '/insurer/dashboard', icon: Activity },
    { name: 'Cadastral Risk Map', href: '/insurer/risk-map', icon: Satellite, highlight: true },
    { name: 'Parametric Claims', href: '/insurer/claims', icon: ShieldCheck },
    { name: 'Policies Portfolio', href: '/insurer/policies', icon: FileText },
    { name: 'Settlement Payouts', href: '/insurer/payouts', icon: Zap },
    { name: 'Audit Trail', href: '/insurer/audit', icon: Layers },
  ],
  ADMIN: [
    { name: 'System Overview', href: '/admin/overview', icon: Activity },
    { name: 'IoT Relays', href: '/operations/iot', icon: Cpu, highlight: true },
    { name: 'AI Models', href: '/admin/ai-models', icon: Sparkles },
    { name: 'Exceptions Desk', href: '/admin/exceptions', icon: ShieldCheck },
    { name: 'Cadastral Map', href: '/insurer/risk-map', icon: Satellite },
  ],
  FIELD_AGENT: [
    { name: 'Field Risk Map', href: '/insurer/risk-map', icon: Satellite, highlight: true },
    { name: 'Farms Registry', href: '/farmer/farms', icon: Layers },
    { name: 'Leaf AI Scanner', href: '/farmer/disease', icon: Sparkles },
    { name: 'Ground Inspection', href: '/insurer/claims', icon: ShieldCheck },
    { name: 'Weather Station', href: '/intelligence/weather', icon: Activity },
  ],
};

export const Navbar: React.FC = () => {
  const { role, setRole, user, logout } = useRole();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [simulationModalOpen, setSimulationModalOpen] = useState(false);
  const [simLoading, setSimLoading] = useState(false);
  const [simMessage, setSimMessage] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const activeNavLinks = ROLE_NAV_LINKS[role] || ROLE_NAV_LINKS.FARMER;

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    if (newRole === 'FARMER') router.push('/farmer/dashboard');
    else if (newRole === 'INSURER') router.push('/insurer/dashboard');
    else if (newRole === 'ADMIN') router.push('/admin/overview');
    else if (newRole === 'FIELD_AGENT') router.push('/insurer/risk-map');
  };

  const triggerSimulation = async (eventType: string) => {
    setSimLoading(true);
    setSimMessage(null);
    try {
      const res = await fetch('/api/simulate/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType })
      });
      const data = await res.json();
      setSimMessage(data.details || data.message || 'Simulation event injected successfully.');
      setTimeout(() => {
        router.refresh();
      }, 500);
    } catch {
      setSimMessage('Simulation dispatch failed.');
    } finally {
      setSimLoading(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#0F172A] border-b border-slate-800 text-white shadow-md w-full">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-1.5 sm:gap-4">
            
            {/* 1. Left: Brand Logo */}
            <div className="flex items-center shrink-0">
              <Link 
                href={role === 'INSURER' ? '/insurer/dashboard' : role === 'ADMIN' ? '/admin/overview' : role === 'FIELD_AGENT' ? '/insurer/risk-map' : '/farmer/dashboard'} 
                className="flex items-center space-x-1.5 sm:space-x-2.5 group"
              >
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Satellite className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-white" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center space-x-1 sm:space-x-1.5 leading-none">
                    <span className="font-extrabold text-xs sm:text-base tracking-tight text-white">
                      AgriSure
                    </span>
                    <span className="text-[8px] sm:text-[9px] uppercase font-mono font-bold px-1 sm:px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      DEMO
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-medium tracking-wide hidden sm:block mt-0.5">
                    Ghatal Parametric InsurTech Hub
                  </span>
                </div>
              </Link>
            </div>

            {/* 2. Center: Dynamic Role-Specific Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 text-xs font-semibold overflow-x-hidden">
              {activeNavLinks.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/farmer/dashboard' && item.href !== '/insurer/dashboard' && item.href !== '/admin/overview' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-blue-600/25 text-blue-300 border border-blue-500/40'
                        : item.highlight
                        ? 'text-blue-400 hover:text-white hover:bg-slate-800'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* 3. Right: Demo Persona Pill & Quick Controls (NO LOGIN/SIGNUP) */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
              
              {/* Simulate Weather Shock - Hidden on mobile header, accessible inside mobile drawer */}
              <button
                type="button"
                onClick={() => setSimulationModalOpen(true)}
                className="hidden sm:flex h-9 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-blue-300 text-xs font-bold transition-all items-center justify-center space-x-1 shrink-0"
                title="Inject Satellite / Weather Event Simulation"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-[11px]">Simulate Shock</span>
              </button>

              {/* Instant Role Switcher (1-Click Demo) */}
              <div className="relative shrink-0">
                <select
                  value={role}
                  onChange={(e) => handleRoleChange(e.target.value as Role)}
                  className="h-8 sm:h-9 appearance-none bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-[11px] sm:text-xs font-bold pl-1.5 pr-5 sm:pl-2.5 sm:pr-6 rounded-lg focus:outline-none cursor-pointer transition-colors max-w-[86px] sm:max-w-none shrink-0"
                  title="Switch Demo Role"
                >
                  <option value="FARMER">🧑‍🌾 Farmer</option>
                  <option value="INSURER">🏛️ Insurer</option>
                  <option value="ADMIN">⚙️ Admin</option>
                  <option value="FIELD_AGENT">🔍 Agent</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1 sm:right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Dark / Light Mode Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white flex items-center justify-center transition-colors shrink-0"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Dark / Light Mode"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-blue-300" />
                )}
              </button>

              {/* User Account & Logout */}
              <Link
                href="/login"
                className="h-8 sm:h-9 px-2 sm:px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                title="Switch Demo Account"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="hidden xl:inline truncate max-w-[100px]">{user?.name?.split(' ')[0] || 'Demo'}</span>
              </Link>

              <button
                type="button"
                onClick={async () => {
                  await logout();
                  router.push('/login');
                }}
                className="h-8 sm:h-9 px-2 sm:px-2.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-800/80 text-red-200 text-[11px] sm:text-xs font-bold flex items-center gap-1 transition-colors shrink-0"
                title="Log Out of Session"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span className="hidden sm:inline">Logout</span>
              </button>

              {/* Mobile Drawer Trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:text-white flex items-center justify-center transition-colors shrink-0"
                aria-label="Toggle navigation drawer"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>

            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer (Clean, Solid, No Login/Signup) */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0F172A] border-b border-slate-800 px-4 pt-3 pb-5 space-y-3">
            
            {/* Quick Simulation Trigger */}
            <button
              type="button"
              onClick={() => { setSimulationModalOpen(true); setMobileMenuOpen(false); }}
              className="w-full p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-blue-300 text-xs font-bold flex items-center justify-between transition-colors shadow-sm"
            >
              <span className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Simulate 142mm Cloudburst Shock</span>
              </span>
              <span className="text-blue-300 text-[10px] font-mono uppercase bg-blue-950 px-2 py-0.5 rounded border border-blue-800">Trigger</span>
            </button>

            {/* Mobile Nav Links */}
            <div className="space-y-1 border-t border-slate-800 pt-2">
              <div className="px-3 py-1 flex items-center justify-between text-[10px] uppercase font-mono font-bold text-slate-400">
                <span>{role} Workspace Navigation</span>
                <span className="text-blue-400">{activeNavLinks.length} Links</span>
              </div>
              {activeNavLinks.map((item) => {
                const Icon = item.icon || Layers;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                      isActive 
                        ? 'bg-blue-600/30 text-blue-300 border border-blue-500/30' 
                        : 'text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <Icon className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>{item.name}</span>
                    </span>
                    <span className="text-slate-500">&rarr;</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Dark / Light Mode Toggle */}
            <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-bold">
                {theme === 'dark' ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
                <span>Display Theme:</span>
              </span>
              <button
                type="button"
                onClick={toggleTheme}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Dark (Switch to Light)</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-blue-300" />
                    <span>Light (Switch to Dark)</span>
                  </>
                )}
              </button>
            </div>

            {/* Language Switcher in Mobile Drawer */}
            <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-xs text-slate-400">
              <span>Language:</span>
              <div className="flex gap-1.5">
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      language === l.code ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {l.native}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}
      </header>

      {/* Simulation Modal (Clean Slate / Blue Styling) */}
      {simulationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 max-w-md w-full space-y-4 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-base text-slate-900">Inject Weather / Stress Event</h3>
              </div>
              <button
                onClick={() => setSimulationModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Dispatches real-time simulated telemetry shocks across Ghatal Block to test automated parametric trigger evaluation.
            </p>

            <div className="space-y-2 text-xs font-semibold">
              <button
                onClick={() => triggerSimulation('heavy_rain')}
                disabled={simLoading}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-slate-900">142mm Cloudburst (Flood Inundation)</div>
                  <span className="text-[11px] text-slate-500">Drops Sentinel-1 VH to -19.8 dB & triggers CHF deficit</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </button>

              <button
                onClick={() => triggerSimulation('pest_infestation')}
                disabled={simLoading}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-slate-900">Brown Spot Fungal Outbreak</div>
                  <span className="text-[11px] text-slate-500">Spikes canopy disease score & suggests MOP treatment</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </button>

              <button
                onClick={() => triggerSimulation('drought')}
                disabled={simLoading}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-slate-900">Prolonged Dry Spell (Soil Moisture 18%)</div>
                  <span className="text-[11px] text-slate-500">Triggers emergency water requirement advisory</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </button>
            </div>

            {simMessage && (
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 font-medium">
                {simMessage}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSimulationModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
