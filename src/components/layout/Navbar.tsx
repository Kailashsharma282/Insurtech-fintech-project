'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useRole } from '@/context/RoleContext';
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from '@/context/LanguageContext';
import { LanguageModal } from '@/components/ui/LanguageModal';
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
  Compass,
  ArrowRight,
  Volume2
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { role, setRole, user, isAuthenticated, logout, isSimulating, setIsSimulating } = useRole();
  const { language, setLanguage, t, showVisualGuide, setShowVisualGuide, playVoiceAdvisory, isSpeaking } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [simulationModalOpen, setSimulationModalOpen] = useState(false);
  const [simLoading, setSimLoading] = useState(false);
  const [simMessage, setSimMessage] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

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
      <header className="sticky top-0 z-50 bg-[#071511]/95 backdrop-blur-xl border-b border-emerald-500/20 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3 lg:gap-6">
            
            {/* 1. Left: Brand Logo */}
            <div className="flex items-center shrink-0">
              <Link href="/" className="flex items-center space-x-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-md shadow-[#10B981]/25 group-hover:scale-105 transition-transform shrink-0">
                  <Satellite className="w-4.5 h-4.5 text-white" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center space-x-1.5 leading-none">
                    <span className="font-black text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-emerald-100 to-[#34D399] bg-clip-text text-transparent">
                      AgriSure
                    </span>
                    <span className="text-[9px] uppercase font-mono font-bold px-1 py-0.5 rounded bg-emerald-500/20 text-[#34D399] border border-emerald-500/30">
                      INTELLIGENCE
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-medium tracking-wide hidden sm:block mt-0.5">
                    Satellite × AI × Parametric Underwriting
                  </span>
                </div>
              </Link>
            </div>

            {/* 2. Center: Primary Navigation Links (Clean & Non-wrapping) */}
            <nav className="hidden lg:flex items-center space-x-1 text-xs font-semibold overflow-x-hidden">
              {pathname === '/' ? (
                <>
                  <Link 
                    href="/" 
                    className="px-2.5 py-1.5 rounded-lg transition-all bg-emerald-500/20 text-[#34D399] border border-emerald-500/40 whitespace-nowrap shrink-0"
                  >
                    {t('nav.overview')}
                  </Link>
                  <Link 
                    href="/how-it-works" 
                    className="px-2.5 py-1.5 rounded-lg transition-all text-slate-300 hover:text-white hover:bg-white/5 whitespace-nowrap shrink-0"
                  >
                    {t('nav.workflow')}
                  </Link>
                  <Link 
                    href="/farmer/farms" 
                    className="px-2.5 py-1.5 rounded-lg transition-all text-slate-300 hover:text-white hover:bg-white/5 whitespace-nowrap shrink-0"
                  >
                    {t('nav.farms')}
                  </Link>
                  <Link 
                    href="/farmer/insurance" 
                    className="px-2.5 py-1.5 rounded-lg transition-all text-slate-300 hover:text-white hover:bg-white/5 whitespace-nowrap shrink-0"
                  >
                    {t('nav.insurance')}
                  </Link>
                </>
              ) : role === 'FARMER' ? (
                <>
                  <Link 
                    href="/farmer/dashboard" 
                    className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${pathname === '/farmer/dashboard' ? 'bg-emerald-500/20 text-[#34D399] border border-emerald-500/40' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                  >
                    {t('nav.dashboard')}
                  </Link>
                  <Link 
                    href="/farmer/farms" 
                    className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${pathname.startsWith('/farmer/farms') ? 'bg-emerald-500/20 text-[#34D399] border border-emerald-500/40' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                  >
                    {t('nav.farms')}
                  </Link>
                  <Link 
                    href="/farmer/insurance" 
                    className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${pathname === '/farmer/insurance' ? 'bg-emerald-500/20 text-[#34D399] border border-emerald-500/40' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                  >
                    {t('nav.insurance')}
                  </Link>
                  <Link 
                    href="/farmer/disease" 
                    className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${pathname === '/farmer/disease' ? 'bg-emerald-500/20 text-[#34D399] border border-emerald-500/40' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                  >
                    {t('nav.disease')}
                  </Link>
                  <Link 
                    href="/farmer/optimization" 
                    className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${pathname === '/farmer/optimization' ? 'bg-emerald-500/20 text-[#34D399] border border-emerald-500/40' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                  >
                    {t('nav.optimization')}
                  </Link>
                  <Link 
                    href="/operations/iot" 
                    className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${pathname === '/operations/iot' ? 'bg-emerald-500/20 text-[#34D399] border border-emerald-500/40' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                  >
                    {t('nav.iot')}
                  </Link>
                </>
              ) : role === 'INSURER' ? (
                <>
                  <Link 
                    href="/insurer/dashboard" 
                    className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${pathname === '/insurer/dashboard' ? 'bg-emerald-500/20 text-[#34D399] border border-emerald-500/40' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                  >
                    {t('nav.underwriting')}
                  </Link>
                  <Link 
                    href="/insurer/policies" 
                    className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${pathname === '/insurer/policies' ? 'bg-emerald-500/20 text-[#34D399] border border-emerald-500/40' : 'text-amber-300 hover:text-amber-200 hover:bg-white/5'}`}
                  >
                    <span className="flex items-center gap-1 font-bold">
                      <span>{t('nav.policy_review')}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                    </span>
                  </Link>
                  <Link 
                    href="/insurer/risk-map" 
                    className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${pathname === '/insurer/risk-map' ? 'bg-emerald-500/20 text-[#34D399] border border-emerald-500/40' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                  >
                    {t('nav.risk_map')}
                  </Link>
                  <Link 
                    href="/insurer/claims" 
                    className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${pathname.startsWith('/insurer/claims') ? 'bg-emerald-500/20 text-[#34D399] border border-emerald-500/40' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                  >
                    {t('nav.claims')}
                  </Link>
                  <Link 
                    href="/insurer/payouts" 
                    className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${pathname === '/insurer/payouts' ? 'bg-emerald-500/20 text-[#34D399] border border-emerald-500/40' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                  >
                    {t('nav.payments')}
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    href="/intelligence/map" 
                    className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${pathname === '/intelligence/map' ? 'bg-emerald-500/20 text-[#34D399] border border-emerald-500/40' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                  >
                    Satellite GIS Map
                  </Link>
                  <Link 
                    href="/intelligence/weather" 
                    className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${pathname === '/intelligence/weather' ? 'bg-emerald-500/20 text-[#34D399] border border-emerald-500/40' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                  >
                    Weather & Risk
                  </Link>
                  <Link 
                    href="/technology/chf" 
                    className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${pathname === '/technology/chf' ? 'bg-emerald-500/20 text-[#34D399] border border-emerald-500/40' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                  >
                    CHF Engine
                  </Link>
                </>
              )}

              {/* Public Tech Dropdown */}
              <div className="relative group shrink-0">
                <button className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 whitespace-nowrap">
                  <span>{t('nav.architecture')}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <div className="absolute left-0 mt-1 w-52 bg-[#0B2119] border border-emerald-500/30 rounded-2xl shadow-2xl py-2 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-1">
                  <Link href="/how-it-works" className="block px-4 py-2 text-xs text-slate-200 hover:bg-emerald-900/40 hover:text-[#34D399]">
                    01-06 Closed Loop Architecture
                  </Link>
                  <Link href="/technology/stress" className="block px-4 py-2 text-xs text-slate-200 hover:bg-emerald-900/40 hover:text-[#34D399]">
                    Early Stress Detection (UV-NDVI)
                  </Link>
                  <Link href="/technology/chf" className="block px-4 py-2 text-xs text-slate-200 hover:bg-emerald-900/40 hover:text-[#34D399]">
                    Shannon Entropy Engine
                  </Link>
                  <Link href="/technology/baseline" className="block px-4 py-2 text-xs text-slate-200 hover:bg-emerald-900/40 hover:text-[#34D399]">
                    4-Year Localized Baseline
                  </Link>
                  <div className="border-t border-emerald-900/50 my-1"></div>
                  <Link href="/research" className="block px-4 py-2 text-xs text-slate-200 hover:bg-emerald-900/40 hover:text-[#34D399]">
                    Agronomic Research Papers
                  </Link>
                </div>
              </div>
            </nav>

            {/* 3. Right Toolbar: Uniform 36px Height, Pristine Spacing */}
            <div className="flex items-center space-x-2 shrink-0 flex-nowrap">
              
              {/* Language Selector Button */}
              <button
                type="button"
                onClick={() => setLanguageModalOpen(true)}
                className="h-9 px-2.5 rounded-xl bg-[#0B2119] hover:bg-[#102820] border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm shrink-0 whitespace-nowrap"
                title="Select Regional Language"
              >
                <span className="text-base">{currentLangObj.flag}</span>
                <span className="max-w-[70px] sm:max-w-[85px] truncate">{currentLangObj.native}</span>
                <ChevronDown className="w-3 h-3 text-emerald-400 shrink-0" />
              </button>

              {/* Audio Voice Guide Button */}
              {language !== 'en' && (
                <button
                  type="button"
                  onClick={playVoiceAdvisory}
                  className={`h-9 px-2.5 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 whitespace-nowrap ${
                    isSpeaking
                      ? 'bg-amber-500/30 border-amber-500 text-amber-300 animate-pulse'
                      : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300'
                  }`}
                  title={t('guide.audio_prompt')}
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce text-amber-300' : 'text-amber-400'}`} />
                  <span className="hidden xl:inline text-[11px]">{t('guide.listen_short')}</span>
                </button>
              )}

              {/* Simulation Quick Trigger */}
              <button
                type="button"
                onClick={() => setSimulationModalOpen(true)}
                className="h-9 px-2.5 rounded-xl bg-emerald-900/40 hover:bg-emerald-800/50 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 whitespace-nowrap"
                title="Inject Satellite / Weather Event Simulation"
              >
                <Zap className="w-3.5 h-3.5 text-[#34D399]" />
                <span className="hidden sm:inline text-[11px]">Simulate</span>
              </button>

              {/* Role Switcher Pill */}
              <div className="relative hidden md:block shrink-0">
                <select
                  value={role}
                  onChange={(e) => handleRoleChange(e.target.value as Role)}
                  className="h-9 appearance-none bg-[#0B2119] hover:bg-[#102820] border border-emerald-500/40 text-[#34D399] text-xs font-bold pl-2.5 pr-7 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer transition-colors shrink-0"
                >
                  <option value="FARMER">🧑‍🌾 Farmer</option>
                  <option value="INSURER">🏛️ Insurer</option>
                  <option value="ADMIN">⚙️ Admin</option>
                  <option value="FIELD_AGENT">🔍 Agent</option>
                </select>
                <ChevronDown className="w-3 h-3 text-emerald-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* User Profile / Auth Button */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="h-9 px-2.5 rounded-xl bg-[#0B2119] hover:bg-[#102820] border border-emerald-500/40 text-emerald-200 text-xs font-bold transition-all flex items-center space-x-1.5"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-500/30 flex items-center justify-center text-[10px]">
                      {role === 'FARMER' ? '🧑‍🌾' : (role === 'INSURER' ? '🏛️' : (role === 'FIELD_AGENT' ? '🔍' : '⚙️'))}
                    </div>
                    <span className="hidden sm:inline max-w-[80px] truncate text-[11px]">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="w-3 h-3 text-emerald-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#0B2119] border border-emerald-500/30 shadow-2xl p-3 text-white z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="border-b border-emerald-900/60 pb-2 mb-2">
                        <div className="font-bold text-xs text-white truncate">{user.name}</div>
                        <div className="text-[10px] text-emerald-400 font-mono">{user.role} &bull; {user.district || 'West Bengal'}</div>
                      </div>
                      <div className="space-y-1 text-xs">
                        <button
                          onClick={() => { setLanguageModalOpen(true); setUserDropdownOpen(false); }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-emerald-900/40 text-slate-200 transition-colors flex items-center justify-between"
                        >
                          <span>Language ({currentLangObj.native})</span>
                          <span>🌐</span>
                        </button>
                        <Link
                          href="/login"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-2.5 py-1.5 rounded-lg hover:bg-emerald-900/40 text-slate-200 transition-colors"
                        >
                          Switch Account
                        </Link>
                        <button
                          onClick={() => { logout(); setUserDropdownOpen(false); router.push('/login'); }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-red-950/50 text-red-300 transition-colors font-semibold"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="h-9 px-3 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-950/40 transition-all flex items-center"
                >
                  {t('nav.sign_in')}
                </Link>
              )}

              {/* Mobile Drawer Trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden h-9 w-9 rounded-xl bg-[#0B2119] border border-emerald-500/30 text-slate-200 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Toggle navigation drawer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#071511]/98 backdrop-blur-2xl border-b border-emerald-500/30 px-4 pt-4 pb-6 space-y-4 animate-in slide-in-from-top-3 duration-200">
            
            {/* Quick Action Tiles in Mobile Drawer */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setLanguageModalOpen(true); setMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl bg-[#0B2119] border border-emerald-500/40 text-left flex items-center space-x-2"
              >
                <span className="text-xl">{currentLangObj.flag}</span>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-slate-400 block leading-tight">Language</span>
                  <span className="text-xs font-bold text-emerald-300 truncate block">{currentLangObj.native}</span>
                </div>
              </button>

              <div className="p-2.5 rounded-xl bg-[#0B2119] border border-emerald-500/40 text-left">
                <span className="text-[10px] text-slate-400 block leading-tight">Current Role</span>
                <select
                  value={role}
                  onChange={(e) => { handleRoleChange(e.target.value as Role); setMobileMenuOpen(false); }}
                  className="bg-transparent text-xs font-bold text-[#34D399] w-full focus:outline-none"
                >
                  <option value="FARMER" className="bg-[#0B2119]">🧑‍🌾 Farmer</option>
                  <option value="INSURER" className="bg-[#0B2119]">🏛️ Insurer</option>
                  <option value="ADMIN" className="bg-[#0B2119]">⚙️ Admin</option>
                  <option value="FIELD_AGENT" className="bg-[#0B2119]">🔍 Field Agent</option>
                </select>
              </div>
            </div>

            {/* Mobile Nav Links */}
            <div className="space-y-1 border-t border-emerald-900/50 pt-3">
              {role === 'FARMER' && (
                <>
                  <Link href="/farmer/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-emerald-900/30">
                    <span className="flex items-center space-x-2"><Activity className="w-4 h-4 text-[#10B981]" /><span>{t('nav.dashboard')}</span></span>
                    <span>➡️</span>
                  </Link>
                  <Link href="/farmer/farms" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-emerald-900/30">
                    <span className="flex items-center space-x-2"><Layers className="w-4 h-4 text-[#10B981]" /><span>{t('nav.farms')}</span></span>
                    <span>➡️</span>
                  </Link>
                  <Link href="/farmer/insurance" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-emerald-900/30">
                    <span className="flex items-center space-x-2"><ShieldCheck className="w-4 h-4 text-[#10B981]" /><span>{t('nav.insurance')}</span></span>
                    <span>➡️</span>
                  </Link>
                  <Link href="/farmer/insurance/apply" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-black text-emerald-400 bg-emerald-950/60 border border-emerald-500/30">
                    <span className="flex items-center space-x-2"><Sparkles className="w-4 h-4 text-[#10B981]" /><span>👉 {t('ins.apply_title')}</span></span>
                    <span>➡️</span>
                  </Link>
                  <Link href="/farmer/disease" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-emerald-900/30">
                    <span className="flex items-center space-x-2"><Sparkles className="w-4 h-4 text-[#10B981]" /><span>{t('nav.disease')}</span></span>
                    <span>➡️</span>
                  </Link>
                  <Link href="/farmer/optimization" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-emerald-900/30">
                    <span className="flex items-center space-x-2"><Cpu className="w-4 h-4 text-[#10B981]" /><span>{t('nav.optimization')}</span></span>
                    <span>➡️</span>
                  </Link>
                  <Link href="/operations/iot" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-emerald-900/30">
                    <span className="flex items-center space-x-2"><Activity className="w-4 h-4 text-[#10B981]" /><span>{t('nav.iot')}</span></span>
                    <span>➡️</span>
                  </Link>
                </>
              )}

              {role === 'INSURER' && (
                <>
                  <Link href="/insurer/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-emerald-900/30">
                    <span className="flex items-center space-x-2"><Activity className="w-4 h-4 text-[#10B981]" /><span>{t('nav.underwriting')}</span></span>
                    <span>➡️</span>
                  </Link>
                  <Link href="/insurer/policies" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-black text-amber-300 bg-amber-950/40 border border-amber-500/30">
                    <span className="flex items-center space-x-2"><ShieldCheck className="w-4 h-4 text-amber-400" /><span>👉 {t('nav.policy_review')}</span></span>
                    <span>➡️</span>
                  </Link>
                  <Link href="/insurer/risk-map" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-emerald-900/30">
                    <span className="flex items-center space-x-2"><Layers className="w-4 h-4 text-[#10B981]" /><span>{t('nav.risk_map')}</span></span>
                    <span>➡️</span>
                  </Link>
                  <Link href="/insurer/claims" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-emerald-900/30">
                    <span className="flex items-center space-x-2"><ShieldCheck className="w-4 h-4 text-[#10B981]" /><span>{t('nav.claims')}</span></span>
                    <span>➡️</span>
                  </Link>
                  <Link href="/insurer/payouts" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-emerald-900/30">
                    <span className="flex items-center space-x-2"><Zap className="w-4 h-4 text-[#10B981]" /><span>{t('nav.payments')}</span></span>
                    <span>➡️</span>
                  </Link>
                </>
              )}
            </div>

            {/* Switch Account */}
            <div className="border-t border-emerald-900/50 pt-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 rounded-xl bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 text-xs font-bold"
              >
                Sign In / Switch Account
              </Link>
            </div>

          </div>
        )}
      </header>

      {/* Language Selection Modal (Available Anywhere via Language Button & On First Visit) */}
      <LanguageModal
        isOpen={languageModalOpen}
        onClose={() => setLanguageModalOpen(false)}
      />

      {/* Simulation Modal */}
      {simulationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#0B2119] border border-emerald-500/40 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl relative">
            <button 
              onClick={() => setSimulationModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-[#34D399] flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-black text-lg text-white">Event Simulation Console</h3>
            </div>
            <p className="text-xs text-slate-300 mb-6">
              Trigger instant synthetic parametric stress conditions to test satellite NDVI decay, root zone soil moisture depletion, and automated insurance claim settlement workflows.
            </p>

            <div className="space-y-3">
              <button
                disabled={simLoading}
                onClick={() => triggerSimulation('DROUGHT_STRESS')}
                className="w-full text-left p-3.5 rounded-2xl bg-[#102820] hover:bg-emerald-900/40 border border-emerald-500/30 transition-all flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-xs text-amber-300">☀️ Extreme Drought & Moisture Deficit</div>
                  <div className="text-[11px] text-slate-400">Depletes soil moisture to 14% and drops rolling CHF below 0.550</div>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>

              <button
                disabled={simLoading}
                onClick={() => triggerSimulation('INUNDATION_FLOOD')}
                className="w-full text-left p-3.5 rounded-2xl bg-[#102820] hover:bg-emerald-900/40 border border-emerald-500/30 transition-all flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-xs text-blue-300">🌊 Flash Monsoon Inundation (220mm Rain)</div>
                  <div className="text-[11px] text-slate-400">Triggers flood damage index & qualifies automated claim #CLM-084</div>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-400" />
              </button>
            </div>

            {simMessage && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-950 border border-emerald-500 text-xs text-emerald-200">
                {simMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
