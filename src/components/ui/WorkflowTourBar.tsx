'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  CloudRain, 
  FileText, 
  Banknote, 
  Lock, 
  ChevronUp, 
  ChevronDown,
  Sparkles,
  Play
} from 'lucide-react';
import { useRole } from '@/context/RoleContext';

export const WorkflowTourBar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { role, setRole } = useRole();
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [runningAction, setRunningAction] = useState<string | null>(null);

  // 6 Lifecycle Stages
  const stages = [
    {
      id: 'step1',
      number: '01',
      title: 'Apply Policy',
      role: 'FARMER',
      href: '/farmer/insurance/apply',
      desc: 'Farmer submits Plot #204 Ghatal for parametric CHF cover',
      isActive: pathname.includes('/farmer/insurance'),
    },
    {
      id: 'step2',
      number: '02',
      title: 'Underwrite',
      role: 'INSURER',
      href: '/insurer/policies',
      desc: 'Chief Actuary reviews Ghatal spatial baseline & issues policy',
      isActive: pathname.includes('/insurer/policies'),
    },
    {
      id: 'step3',
      number: '03',
      title: 'Weather Shock',
      role: 'ALL',
      href: '/intelligence/weather',
      desc: '142mm Shilabati basin flood shock drops CHF < 0.55',
      isActive: pathname.includes('/intelligence/weather'),
    },
    {
      id: 'step4',
      number: '04',
      title: 'Adjudicate Claim',
      role: 'INSURER',
      href: '/insurer/claims/claim-clm-084',
      desc: '11-section transparent satellite + IoT evidence dossier',
      isActive: pathname.includes('/insurer/claims'),
    },
    {
      id: 'step5',
      number: '05',
      title: 'Payout Review',
      role: 'INSURER',
      href: '/insurer/payouts',
      desc: 'Disbursements held for Ghatal pilot; clearance verified',
      isActive: pathname.includes('/insurer/payouts'),
    },
    {
      id: 'step6',
      number: '06',
      title: 'Audit & Receipt',
      role: 'FARMER',
      href: '/farmer/payments',
      desc: 'Farmer voucher review & SHA-256 immutable ledger',
      isActive: pathname.includes('/farmer/payments') || pathname.includes('/insurer/audit'),
    },
  ];

  const handleStepClick = (targetRole: string, href: string) => {
    if (targetRole === 'FARMER' && role !== 'FARMER') {
      setRole('FARMER');
    } else if (targetRole === 'INSURER' && role !== 'INSURER') {
      setRole('INSURER');
    }
    router.push(href);
  };

  const handleQuickTriggerShock = async () => {
    setRunningAction('shock');
    try {
      await fetch('/api/simulate/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: 'heavy_rain' }),
      });
      router.push('/intelligence/weather');
    } catch {
      // offline
    } finally {
      setRunningAction(null);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-5xl transition-all duration-300">
      <div className="bg-[#071511]/95 backdrop-blur-xl border border-emerald-500/40 rounded-2xl shadow-2xl text-white overflow-hidden">
        
        {/* Toggle Bar */}
        <div className="px-4 py-2.5 flex items-center justify-between border-b border-emerald-950/60 bg-gradient-to-r from-emerald-950/50 via-[#071511] to-emerald-950/50">
          <div className="flex items-center space-x-2.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-xs sm:text-sm tracking-tight text-emerald-300 truncate">
              <span className="sm:hidden">Workflow Tour</span>
              <span className="hidden sm:inline">End-to-End Parametric Workflow Tour</span>
            </span>
            <span className="text-[10px] hidden md:inline px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
              6-Stage Lifecycle
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleQuickTriggerShock}
              disabled={runningAction === 'shock'}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center space-x-1 shadow-md shadow-emerald-900/40 transition-all"
              title="Instantly inject 142mm cloudburst shock"
            >
              <Zap className="w-3 h-3 text-amber-300" />
              <span>{runningAction === 'shock' ? 'Simulating...' : '<span className="hidden sm:inline">Simulate </span>Shock'}</span>
            </button>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 transition-colors"
              title={collapsed ? 'Expand workflow guide' : 'Minimize guide'}
            >
              {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expandable Stages Grid */}
        {!collapsed && (
          <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 bg-[#0B2119]/90 max-h-[55vh] overflow-y-auto">
            {stages.map((stage) => {
              const active = stage.isActive;
              return (
                <button
                  key={stage.id}
                  onClick={() => handleStepClick(stage.role, stage.href)}
                  className={`text-left p-2.5 rounded-xl border transition-all relative group flex flex-col justify-between ${
                    active 
                      ? 'bg-emerald-500/25 border-emerald-400 shadow-lg shadow-emerald-950/50' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-emerald-500/30'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-black text-emerald-400">
                        {stage.number}
                      </span>
                      <span className="text-[9px] font-semibold px-1 py-0.2 rounded bg-black/40 text-slate-300">
                        {stage.role}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors leading-tight">
                      {stage.title}
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                      {stage.desc}
                    </p>
                  </div>

                  <div className="mt-2 flex items-center text-[10px] font-semibold text-emerald-300 group-hover:translate-x-0.5 transition-transform">
                    <span>Open Step</span>
                    <ArrowRight className="w-2.5 h-2.5 ml-1" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
