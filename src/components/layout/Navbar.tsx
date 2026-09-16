'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useRole } from '@/context/RoleContext';
import { Role } from '@/lib/types';
import { 
  Satellite, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Activity, 
  AlertTriangle, 
  Menu, 
  X, 
  CloudRain, 
  Sparkles,
  ChevronDown,
  UserCheck,
  Zap
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { role, setRole, user, isAuthenticated, logout, isSimulating, setIsSimulating, unreadAlertsCount } = useRole();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [simulationModalOpen, setSimulationModalOpen] = useState(false);
  const [simLoading, setSimLoading] = useState(false);
  const [simMessage, setSimMessage] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    if (newRole === 'FARMER') router.push('/farmer/dashboard');
    else if (newRole === 'INSURER') router.push('/insurer/dashboard');
    else if (newRole === 'ADMIN') router.push('/operations/iot');
    else if (newRole === 'FIELD_AGENT') router.push('/intelligence/map');
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
      <header className="sticky top-0 z-50 bg-[#071511]/95 backdrop-blur-md border-b border-[#10B981]/20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Platform Name */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-lg shadow-[#10B981]/20 group-hover:scale-105 transition-transform">
                  <Satellite className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-emerald-100 to-[#34D399] bg-clip-text text-transparent">
                      AgriSure
                    </span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30">
                      INTELLIGENCE
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 hidden sm:block">
                    Satellite × Agronomic AI × IoT × Parametric Underwriting
                  </p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links based on role */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-medium">
              {role === 'FARMER' && (
                <>
                  <Link 
                    href="/farmer/dashboard" 
                    className={`px-3 py-1.5 rounded-lg transition-colors ${pathname === '/farmer/dashboard' ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/farmer/farms" 
                    className={`px-3 py-1.5 rounded-lg transition-colors ${pathname.startsWith('/farmer/farms') ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                  >
                    My Farms
                  </Link>
                  <Link 
                    href="/farmer/disease" 
                    className={`px-3 py-1.5 rounded-lg transition-colors ${pathname === '/farmer/disease' ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                  >
                    Disease AI
                  </Link>
                  <Link 
                    href="/farmer/optimization" 
                    className={`px-3 py-1.5 rounded-lg transition-colors ${pathname === '/farmer/optimization' ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                  >
                    GA-PSO Optimizer
                  </Link>
                  <Link 
                    href="/operations/iot" 
                    className={`px-3 py-1.5 rounded-lg transition-colors ${pathname === '/operations/iot' ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                  >
                    IoT Telemetry
                  </Link>
                </>
              )}

              {role === 'INSURER' && (
                <>
                  <Link 
                    href="/insurer/dashboard" 
                    className={`px-3 py-1.5 rounded-lg transition-colors ${pathname === '/insurer/dashboard' ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                  >
                    Underwriting Desk
                  </Link>
                  <Link 
                    href="/insurer/risk-map" 
                    className={`px-3 py-1.5 rounded-lg transition-colors ${pathname === '/insurer/risk-map' ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                  >
                    IU Risk Map
                  </Link>
                  <Link 
                    href="/insurer/claims" 
                    className={`px-3 py-1.5 rounded-lg transition-colors ${pathname.startsWith('/insurer/claims') ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                  >
                    Claims Desk
                  </Link>
                  <Link 
                    href="/insurer/payouts" 
                    className={`px-3 py-1.5 rounded-lg transition-colors ${pathname === '/insurer/payouts' ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                  >
                    Payout Engine
                  </Link>
                  <Link 
                    href="/insurer/audit" 
                    className={`px-3 py-1.5 rounded-lg transition-colors ${pathname === '/insurer/audit' ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                  >
                    Audit Trail
                  </Link>
                </>
              )}

              {(role === 'ADMIN' || role === 'FIELD_AGENT') && (
                <>
                  <Link 
                    href="/intelligence/map" 
                    className={`px-3 py-1.5 rounded-lg transition-colors ${pathname === '/intelligence/map' ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                  >
                    Satellite GIS Map
                  </Link>
                  <Link 
                    href="/intelligence/weather" 
                    className={`px-3 py-1.5 rounded-lg transition-colors ${pathname === '/intelligence/weather' ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                  >
                    Weather & Risk
                  </Link>
                  <Link 
                    href="/technology/chf" 
                    className={`px-3 py-1.5 rounded-lg transition-colors ${pathname === '/technology/chf' ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                  >
                    CHF Engine
                  </Link>
                </>
              )}

              {/* Public Quick Links dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5">
                  <span>Architecture</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <div className="absolute right-0 mt-1 w-56 bg-[#0B2119] border border-[#10B981]/20 rounded-xl shadow-xl py-2 hidden group-hover:block z-50">
                  <Link href="/how-it-works" className="block px-4 py-2 text-xs text-slate-200 hover:bg-[#10B981]/20 hover:text-[#34D399]">
                    01-06 Workflow Architecture
                  </Link>
                  <Link href="/technology/stress" className="block px-4 py-2 text-xs text-slate-200 hover:bg-[#10B981]/20 hover:text-[#34D399]">
                    Early Stress Detection (UV-NDVI)
                  </Link>
                  <Link href="/technology/chf" className="block px-4 py-2 text-xs text-slate-200 hover:bg-[#10B981]/20 hover:text-[#34D399]">
                    Shannon Entropy CHF Engine
                  </Link>
                  <Link href="/technology/baseline" className="block px-4 py-2 text-xs text-slate-200 hover:bg-[#10B981]/20 hover:text-[#34D399]">
                    4-Year Localized Baseline
                  </Link>
                  <div className="border-t border-emerald-900/50 my-1"></div>
                  <Link href="/research" className="block px-4 py-2 text-xs text-slate-200 hover:bg-[#10B981]/20 hover:text-[#34D399]">
                    Agronomic Research Papers
                  </Link>
                  <Link href="/team" className="block px-4 py-2 text-xs text-slate-200 hover:bg-[#10B981]/20 hover:text-[#34D399]">
                    University Demo Credentials
                  </Link>
                </div>
              </div>
            </nav>

            {/* Role Switcher & Live Simulation Control */}
            <div className="flex items-center space-x-3">
              {/* Live telemetry heartbeat indicator */}
              <div 
                onClick={() => setIsSimulating(!isSimulating)} 
                title={isSimulating ? "Live 3s IoT Telemetry Running (Click to pause)" : "Live Telemetry Paused (Click to resume)"}
                className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-[#10B981]/30 cursor-pointer hover:bg-emerald-900/50 transition-colors"
              >
                <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-[#10B981] pulse-indicator' : 'bg-slate-500'}`}></span>
                <span className="text-[11px] font-mono text-[#34D399]">
                  {isSimulating ? 'IOT 3s LIVE' : 'PAUSED'}
                </span>
              </div>

              {/* Simulation Events Modal Trigger */}
              <button
                onClick={() => setSimulationModalOpen(true)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-800/50 border border-[#10B981]/40 text-emerald-300 text-xs font-medium transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-[#34D399]" />
                <span className="hidden lg:inline">Simulate Event</span>
              </button>

              {/* Role Switcher */}
              <div className="relative hidden sm:block">
                <select
                  value={role}
                  onChange={(e) => handleRoleChange(e.target.value as Role)}
                  className="appearance-none bg-[#102820] border border-[#10B981]/40 text-[#34D399] text-xs font-semibold py-1.5 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#10B981] cursor-pointer"
                >
                  <option value="FARMER">🧑‍🌾 Farmer</option>
                  <option value="INSURER">🏛️ Insurer</option>
                  <option value="ADMIN">⚙️ Admin</option>
                  <option value="FIELD_AGENT">🔍 Field Agent</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#34D399] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* User Profile & Auth Controls */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/60 border border-[#10B981]/40 text-emerald-200 text-xs font-bold transition-all"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-500/30 flex items-center justify-center text-[10px]">
                      {role === 'FARMER' ? '🧑‍🌾' : (role === 'INSURER' ? '🏛️' : (role === 'FIELD_AGENT' ? '🔍' : '⚙️'))}
                    </div>
                    <span className="hidden md:inline max-w-[120px] truncate">{user.name}</span>
                    <ChevronDown className="w-3 h-3 text-emerald-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0B2119] border border-[#10B981]/30 shadow-2xl p-3 text-white z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="border-b border-emerald-900/60 pb-2 mb-2">
                        <div className="font-bold text-sm text-white">{user.name}</div>
                        <div className="text-[11px] text-emerald-400 font-mono">{user.role} &bull; {user.district || 'West Bengal'}</div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">{user.phone || user.email}</div>
                      </div>

                      <div className="space-y-1 text-xs">
                        <Link
                          href="/login"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-3 py-2 rounded-lg hover:bg-emerald-900/40 text-slate-200 transition-colors"
                        >
                          Switch Account / Sign In
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-3 py-2 rounded-lg hover:bg-emerald-900/40 text-slate-200 transition-colors"
                        >
                          Register New Plot or Carrier
                        </Link>
                        <button
                          onClick={() => { logout(); setUserDropdownOpen(false); router.push('/login'); }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-950/50 text-red-300 transition-colors font-semibold"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/login"
                    className="px-3 py-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-800/50 border border-[#10B981]/40 text-emerald-300 text-xs font-bold transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="hidden sm:inline-block px-3 py-1.5 rounded-lg bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-950/40 transition-all"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer with Glassmorphism */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#071511]/95 backdrop-blur-2xl border-b border-[#10B981]/30 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-900/50">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#34D399] uppercase tracking-wider block">
                  {user ? `${user.name} (${role})` : `ACTIVE ROLE: ${role}`}
                </span>
                <span className="text-[10px] text-slate-400">
                  {user?.district || 'Nadia Sector Hub'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs px-2.5 py-1 rounded bg-[#10B981]/20 border border-[#10B981]/40 text-[#34D399] font-bold"
                >
                  Switch Login
                </Link>
              </div>
            </div>
            
            <div className="space-y-1">
              {role === 'FARMER' && (
                <>
                  <Link href="/farmer/dashboard" onClick={() => setMobileMenuOpen(false)} className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${pathname === '/farmer/dashboard' ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40' : 'text-slate-200 hover:bg-white/5'}`}>
                    <Activity className="w-4 h-4 text-[#10B981]" />
                    <span>Farmer Dashboard (Plot #204)</span>
                  </Link>
                  <Link href="/farmer/farms" onClick={() => setMobileMenuOpen(false)} className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${pathname.startsWith('/farmer/farms') ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40' : 'text-slate-200 hover:bg-white/5'}`}>
                    <Layers className="w-4 h-4 text-[#10B981]" />
                    <span>My Farm Plots</span>
                  </Link>
                  <Link href="/farmer/disease" onClick={() => setMobileMenuOpen(false)} className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${pathname === '/farmer/disease' ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40' : 'text-slate-200 hover:bg-white/5'}`}>
                    <Sparkles className="w-4 h-4 text-[#10B981]" />
                    <span>Disease AI Scanner</span>
                  </Link>
                  <Link href="/farmer/optimization" onClick={() => setMobileMenuOpen(false)} className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${pathname === '/farmer/optimization' ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40' : 'text-slate-200 hover:bg-white/5'}`}>
                    <Cpu className="w-4 h-4 text-[#10B981]" />
                    <span>GA-PSO Nutrient Optimizer</span>
                  </Link>
                  <Link href="/operations/iot" onClick={() => setMobileMenuOpen(false)} className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${pathname === '/operations/iot' ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40' : 'text-slate-200 hover:bg-white/5'}`}>
                    <Activity className="w-4 h-4 text-[#10B981]" />
                    <span>IoT Telemetry & Pump Relay</span>
                  </Link>
                  <Link href="/farmer/insurance" onClick={() => setMobileMenuOpen(false)} className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${pathname === '/farmer/insurance' ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40' : 'text-slate-200 hover:bg-white/5'}`}>
                    <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                    <span>Parametric Insurance</span>
                  </Link>
                </>
              )}

              {role === 'INSURER' && (
                <>
                  <Link href="/insurer/dashboard" onClick={() => setMobileMenuOpen(false)} className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${pathname === '/insurer/dashboard' ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40' : 'text-slate-200 hover:bg-white/5'}`}>
                    <Activity className="w-4 h-4 text-[#10B981]" />
                    <span>Underwriting Portfolio</span>
                  </Link>
                  <Link href="/insurer/risk-map" onClick={() => setMobileMenuOpen(false)} className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${pathname === '/insurer/risk-map' ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40' : 'text-slate-200 hover:bg-white/5'}`}>
                    <Layers className="w-4 h-4 text-[#10B981]" />
                    <span>IU Spatial Risk Map</span>
                  </Link>
                  <Link href="/insurer/claims" onClick={() => setMobileMenuOpen(false)} className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${pathname.startsWith('/insurer/claims') ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40' : 'text-slate-200 hover:bg-white/5'}`}>
                    <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                    <span>Claims Desk & Evidence</span>
                  </Link>
                  <Link href="/insurer/payouts" onClick={() => setMobileMenuOpen(false)} className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${pathname === '/insurer/payouts' ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40' : 'text-slate-200 hover:bg-white/5'}`}>
                    <Zap className="w-4 h-4 text-[#10B981]" />
                    <span>Payout Engine & Banking</span>
                  </Link>
                  <Link href="/insurer/audit" onClick={() => setMobileMenuOpen(false)} className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${pathname === '/insurer/audit' ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40' : 'text-slate-200 hover:bg-white/5'}`}>
                    <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                    <span>Cryptographic Audit Trail</span>
                  </Link>
                </>
              )}

              {(role === 'ADMIN' || role === 'FIELD_AGENT') && (
                <>
                  <Link href="/intelligence/map" onClick={() => setMobileMenuOpen(false)} className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${pathname === '/intelligence/map' ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40' : 'text-slate-200 hover:bg-white/5'}`}>
                    <Satellite className="w-4 h-4 text-[#10B981]" />
                    <span>Satellite GIS Map</span>
                  </Link>
                  <Link href="/intelligence/weather" onClick={() => setMobileMenuOpen(false)} className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${pathname === '/intelligence/weather' ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40' : 'text-slate-200 hover:bg-white/5'}`}>
                    <CloudRain className="w-4 h-4 text-[#10B981]" />
                    <span>Weather & Shock Simulator</span>
                  </Link>
                  <Link href="/operations/iot" onClick={() => setMobileMenuOpen(false)} className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${pathname === '/operations/iot' ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40' : 'text-slate-200 hover:bg-white/5'}`}>
                    <Cpu className="w-4 h-4 text-[#10B981]" />
                    <span>IoT Fleet Console</span>
                  </Link>
                </>
              )}
            </div>

            <div className="border-t border-emerald-900/50 pt-2.5 space-y-1 text-xs">
              <Link href="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-400 hover:text-emerald-300">
                01-06 Operational Architecture
              </Link>
              <Link href="/technology/chf" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-400 hover:text-emerald-300">
                Shannon Entropy CHF Engine
              </Link>
              <Link href="/research" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-400 hover:text-emerald-300">
                Research Publications & Validation
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Simulation Modal */}
      {simulationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0B2119] border border-[#10B981]/40 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative">
            <button 
              onClick={() => setSimulationModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[#34D399]">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Real-Time Simulation Engine</h3>
                <p className="text-xs text-slate-300">Inject agronomic shocks and verify automated underwriting</p>
              </div>
            </div>

            {simMessage && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-200">
                {simMessage}
              </div>
            )}

            <div className="space-y-3">
              <button
                disabled={simLoading}
                onClick={() => triggerSimulation('heavy_rain')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#102820] hover:bg-emerald-900/60 border border-emerald-700/40 transition-colors text-left group"
              >
                <div>
                  <div className="font-semibold text-sm text-emerald-300 flex items-center space-x-2">
                    <CloudRain className="w-4 h-4 text-blue-400" />
                    <span>Heavy Rainfall Depression Shock</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    142mm precipitation downpour on Nadia Plot #204. Soil moisture spikes to 84%.
                  </p>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300 font-mono">142mm</span>
              </button>

              <button
                disabled={simLoading}
                onClick={() => triggerSimulation('claim_qualification')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#102820] hover:bg-emerald-900/60 border border-emerald-700/40 transition-colors text-left group"
              >
                <div>
                  <div className="font-semibold text-sm text-emerald-300 flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Parametric Claim Qualification</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Evaluates CHF drop (&lt; 0.55) and advances Claim #CLM-2026-084 to Approved.
                  </p>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-300 font-mono">Approve</span>
              </button>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSimulationModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
              >
                Close Controller
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
