'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Satellite, 
  Cpu, 
  Radio, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  Activity,
  Layers,
  ChevronRight,
  Droplets,
  AlertTriangle,
  Play,
  Crosshair,
  Wifi,
  Globe2,
  Maximize2
} from 'lucide-react';
import { Card3D } from '@/components/ui/Card3D';
import { CyberBackground } from '@/components/ui/CyberBackground';
import { useLanguage } from '@/context/LanguageContext';
import { useRole } from '@/context/RoleContext';

export default function HomePage() {
  const { t } = useLanguage();
  const { role } = useRole();
  const [activeTab, setActiveTab] = useState<'pipeline' | 'radar'>('pipeline');

  const kpiCards = [
    { value: '38', unit: t('kpi.unit_classes'), label: t('kpi.dis_taxonomy'), desc: t('kpi.dis_desc') },
    { value: '92.9%', unit: t('kpi.unit_accuracy'), label: t('kpi.precision'), desc: t('kpi.precision_desc') },
    { value: '0.85', unit: t('kpi.unit_score'), label: t('kpi.chf_yield'), desc: t('kpi.chf_desc') },
    { value: '30–45', unit: t('kpi.unit_days'), label: t('kpi.claims_speed'), desc: t('kpi.claims_desc') },
    { value: '3s', unit: t('kpi.unit_interval'), label: t('kpi.iot_stream'), desc: t('kpi.iot_desc') },
  ];

  const workflowSteps = [
    { step: '01', title: t('cycle.s1_title'), desc: t('cycle.s1_desc'), icon: Satellite, color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30' },
    { step: '02', title: t('cycle.s2_title'), desc: t('cycle.s2_desc'), icon: Activity, color: 'from-amber-500/20 to-yellow-500/20', border: 'border-amber-500/30' },
    { step: '03', title: t('cycle.s3_title'), desc: t('cycle.s3_desc'), icon: Cpu, color: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30' },
    { step: '04', title: t('cycle.s4_title'), desc: t('cycle.s4_desc'), icon: Droplets, color: 'from-purple-500/20 to-indigo-500/20', border: 'border-purple-500/30' },
    { step: '05', title: t('cycle.s5_title'), desc: t('cycle.s5_desc'), icon: CheckCircle2, color: 'from-teal-500/20 to-emerald-500/20', border: 'border-teal-500/30' },
    { step: '06', title: t('cycle.s6_title'), desc: t('cycle.s6_desc'), icon: ShieldCheck, color: 'from-rose-500/20 to-red-500/20', border: 'border-rose-500/30' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      
      {/* Hero Section with 3D Cyber Background */}
      <section className="relative overflow-hidden bg-[#071511] text-white pt-16 sm:pt-24 pb-28 md:pb-36 border-b border-[#10B981]/20">
        
        {/* Dynamic 3D Particle, Topographic Grid & Ambient Glows */}
        <CyberBackground variant="hero" showParticles={true} showGrid={true} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            
            {/* Holographic Pill Badge with 3D Float */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#10B981]/15 border border-[#10B981]/40 text-emerald-300 text-xs font-semibold tracking-wide backdrop-blur-md animate-float-slow shadow-lg shadow-emerald-950/50">
              <span className="w-2 h-2 rounded-full bg-[#10B981] pulse-indicator"></span>
              <span className="font-mono uppercase tracking-wider text-[11px]">{t('hero.badge')}</span>
            </div>

            {/* Main Headline with High-Impact Gradient */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
              {t('hero.title_start')} <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#34D399] via-[#10B981] to-teal-300 bg-clip-text text-transparent drop-shadow-[0_10px_20px_rgba(16,185,129,0.3)]">
                {t('hero.title_gradient')}
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed px-2">
              {t('hero.description')}
            </p>

            {/* Call to Action Buttons - Role Restrictive */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4 px-4">
              {role === 'FARMER' ? (
                <>
                  <Link
                    href="/farmer/dashboard"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#10B981] via-[#059669] to-emerald-600 hover:from-[#34D399] hover:to-[#10B981] text-white font-bold text-sm shadow-xl shadow-[#10B981]/30 hover:shadow-[#10B981]/50 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
                  >
                    <span>{t('hero.cta_farmer')}</span>
                    <ArrowRight className="w-4 h-4 ml-2.5" />
                  </Link>
                  <Link
                    href="/farmer/insurance/apply"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-semibold text-sm backdrop-blur-md transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <ShieldCheck className="w-4 h-4 mr-2 text-emerald-400" />
                    <span>{t('ins.apply_title')}</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/insurer/dashboard"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#10B981] via-[#059669] to-emerald-600 hover:from-[#34D399] hover:to-[#10B981] text-white font-bold text-sm shadow-xl shadow-[#10B981]/30 hover:shadow-[#10B981]/50 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
                  >
                    <ShieldCheck className="w-4 h-4 mr-2 text-white" />
                    <span>Launch Underwriter Desk</span>
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm backdrop-blur-md transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <span>{t('hero.cta_workflow')}</span>
                    <Play className="w-3.5 h-3.5 ml-2.5 fill-white text-white" />
                  </Link>
                </>
              )}
            </div>

            {/* Philosophy Axiom Callout */}
            <div className="pt-4">
              <p className="text-xs text-slate-400 italic max-w-xl mx-auto border-t border-emerald-900/60 pt-4 px-4">
                {t('hero.philosophy')}
              </p>
            </div>
          </div>

          {/* 3D Interactive Hero Cockpit: Interactive Pipeline Showcase */}
          <div className="mt-12 sm:mt-16 max-w-5xl mx-auto">
            <Card3D depth={10} glowColor="rgba(16, 185, 129, 0.4)" className="glass-card-3d-dark border border-[#10B981]/40 shadow-2xl">
              <div className="p-5 sm:p-7 md:p-8 space-y-6">
                
                {/* Header bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-900/60 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[#34D399]">
                      <Crosshair className="w-5 h-5 animate-spin" style={{ animationDuration: '18s' }} />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-[#34D399] uppercase tracking-widest block font-bold">
                        {t('hero.runtime_title')}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {t('hero.runtime_pilot')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[#34D399] text-[11px] font-mono">
                      <Wifi className="w-3 h-3 text-emerald-400 animate-pulse" />
                      <span>TELEMETRY SYNCED (3s)</span>
                    </span>
                  </div>
                </div>

                {/* 5-Step Grid Cards with 3D Stagger Depth */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
                  
                  <div className="p-4 rounded-2xl bg-[#102820]/90 border border-emerald-500/20 text-center space-y-2.5 hover:border-emerald-400/60 transition-colors group">
                    <div className="w-11 h-11 mx-auto rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                      <Satellite className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-sm text-white">{t('hero.card1_title')}</div>
                    <p className="text-[11px] text-slate-300 leading-snug">{t('hero.card1_desc')}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#102820]/90 border border-emerald-500/20 text-center space-y-2.5 hover:border-emerald-400/60 transition-colors group">
                    <div className="w-11 h-11 mx-auto rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[#34D399] group-hover:scale-110 transition-transform">
                      <Radio className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-sm text-white">{t('hero.card2_title')}</div>
                    <p className="text-[11px] text-slate-300 leading-snug">{t('hero.card2_desc')}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#102820]/90 border border-emerald-500/20 text-center space-y-2.5 hover:border-emerald-400/60 transition-colors group">
                    <div className="w-11 h-11 mx-auto rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-sm text-white">{t('hero.card3_title')}</div>
                    <p className="text-[11px] text-slate-300 leading-snug">{t('hero.card3_desc')}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#102820]/90 border border-emerald-500/20 text-center space-y-2.5 hover:border-emerald-400/60 transition-colors group">
                    <div className="w-11 h-11 mx-auto rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                      <Droplets className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-sm text-white">{t('hero.card4_title')}</div>
                    <p className="text-[11px] text-slate-300 leading-snug">{t('hero.card4_desc')}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#102820]/90 border border-emerald-500/20 text-center space-y-2.5 hover:border-emerald-400/60 transition-colors group sm:col-span-2 md:col-span-1">
                    <div className="w-11 h-11 mx-auto rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-sm text-white">{t('hero.card5_title')}</div>
                    <p className="text-[11px] text-slate-300 leading-snug">{t('hero.card5_desc')}</p>
                  </div>

                </div>

                {/* Bottom ticker bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 border-t border-emerald-900/50 pt-4 gap-2">
                  <span className="font-mono text-[11px] text-emerald-400 text-center sm:text-left tracking-wide">
                    OBSERVE &rarr; DIAGNOSE &rarr; PRESCRIBE &rarr; ACTUATE &rarr; VERIFY &rarr; INSURE
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    LAT 23.472°N • LON 88.556°E • ALT 786 KM
                  </span>
                </div>

              </div>
            </Card3D>
          </div>

        </div>
      </section>

      {/* 5 KPI Benchmark Cards with 3D Elevation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {kpiCards.map((kpi, idx) => (
            <Card3D
              key={idx}
              depth={8}
              glowColor="rgba(16, 185, 129, 0.25)"
              className="bg-white border border-[#E2E8F0] shadow-xl shadow-slate-900/5 hover:border-[#10B981] transition-all"
            >
              <div className="p-5 h-full flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">{kpi.value}</span>
                    <span className="text-xs font-bold text-[#059669] uppercase tracking-wider">{kpi.unit}</span>
                  </div>
                  <div className="font-bold text-sm text-slate-800 mt-1">{kpi.label}</div>
                </div>
                <p className="text-xs text-slate-500 leading-snug">{kpi.desc}</p>
              </div>
            </Card3D>
          ))}
        </div>
        <div className="mt-4 text-center">
          <span className="text-[11px] text-slate-500 italic">
            {t('kpi.footnote')}
          </span>
        </div>
      </section>

      {/* The 6-Stage Resilience Cycle Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#059669] text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('cycle.badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0F172A] tracking-tight">
            {t('cycle.title')}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            {t('cycle.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflowSteps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <Card3D
                key={idx}
                depth={10}
                glowColor="rgba(16, 185, 129, 0.2)"
                className="bg-white border border-[#E2E8F0] hover:border-emerald-400/60 shadow-lg shadow-slate-900/5 transition-all"
              >
                <div className="p-6 h-full flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-extrabold text-[#059669] px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200">
                        {s.title.split('.')[0] || `0${idx + 1}`}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-[#0F172A] tracking-tight">{s.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                  </div>
                  
                  <div className="pt-2 border-t border-slate-100">
                    <Link href={role === 'FARMER' ? '/farmer/dashboard' : '/how-it-works'} className="inline-flex items-center text-xs font-bold text-[#059669] hover:text-emerald-700 transition-colors">
                      <span>{t('cycle.inspect')}</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              </Card3D>
            );
          })}
        </div>
      </section>

      {/* Role-Aware Operational Portals Showcase with 3D Depth */}
      <section className="bg-[#071511] text-white py-20 relative overflow-hidden border-t border-b border-[#10B981]/20">
        <CyberBackground variant="dark" showParticles={true} showGrid={true} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            
            <div className="space-y-5">
              <span className="text-xs font-mono uppercase tracking-widest text-[#34D399] font-bold">
                {t('arch.badge')}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                {t('arch.title')}
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {t('arch.desc')}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                {role === 'FARMER' ? (
                  <>
                    <Link
                      href="/farmer/dashboard"
                      className="px-6 py-3 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-bold shadow-lg shadow-emerald-900/50 transition-all transform hover:-translate-y-0.5"
                    >
                      {t('arch.btn_farmer')}
                    </Link>
                    <Link
                      href="/farmer/insurance/apply"
                      className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all transform hover:-translate-y-0.5"
                    >
                      {t('ins.apply_title')}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/insurer/dashboard"
                      className="px-6 py-3 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-bold shadow-lg shadow-emerald-900/50 transition-all transform hover:-translate-y-0.5"
                    >
                      Insurer Underwriting Desk
                    </Link>
                    <Link
                      href="/how-it-works"
                      className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all transform hover:-translate-y-0.5"
                    >
                      Technical Architecture
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* 3D Glassmorphic Live Unit Card */}
            <div>
              <Card3D depth={12} glowColor="rgba(16, 185, 129, 0.45)" className="glass-card-3d-dark border border-[#10B981]/40 shadow-2xl">
                <div className="p-6 sm:p-7 space-y-5">
                  <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[#34D399]">
                        <Activity className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-sm text-white">{t('arch.live_unit')}</span>
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-[#34D399] border border-emerald-500/30 font-bold">
                      {role === 'FARMER' ? t('farmer.plot_name') : 'Nadia / Aman Paddy'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-[#102820]/80 border border-emerald-900/50">
                      <div className="text-slate-400 text-[11px]">{t('arch.plot_id')}</div>
                      <div className="font-bold text-white text-sm mt-0.5">{t('farmer.plot_name')}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#102820]/80 border border-emerald-900/50">
                      <div className="text-slate-400 text-[11px]">{t('arch.comp_health')}</div>
                      <div className="font-bold text-[#34D399] text-sm mt-0.5">0.71 ({t('farmer.crop_health_status')})</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#102820]/80 border border-emerald-900/50">
                      <div className="text-slate-400 text-[11px]">{t('arch.soil_moist')}</div>
                      <div className="font-bold text-blue-400 text-sm mt-0.5">58.0% VWC</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#102820]/80 border border-emerald-900/50">
                      <div className="text-slate-400 text-[11px]">{t('arch.weather_state')}</div>
                      <div className="font-bold text-emerald-400 text-sm mt-0.5">{t('farmer.weather_risk_desc')}</div>
                    </div>
                  </div>

                  <Link
                    href={role === 'FARMER' ? '/farmer/farms' : '/intelligence/map'}
                    className="w-full flex items-center justify-center py-3 rounded-xl bg-gradient-to-r from-emerald-600/40 to-teal-600/40 hover:from-emerald-600/60 hover:to-teal-600/60 border border-emerald-500/50 text-emerald-200 text-xs font-bold transition-all shadow-md"
                  >
                    <span>{t('arch.inspect_plot')}</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </Card3D>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
