'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Cpu, 
  Server, 
  Database, 
  Satellite, 
  Radio, 
  ShieldCheck, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { SEED_FARMS, SEED_IOT_DEVICES } from '@/lib/db/seed-data';

export default function AdminOverviewPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#059669] font-bold">
                Platform Administration & Telemetry Operations
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              System Health & Infrastructure Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Copernicus API bridges, MQTT broker queues, PostGIS spatial clusters, and AI inference latency.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/admin/ai-models"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs"
            >
              AI Models Registry
            </Link>
            <Link
              href="/admin/exceptions"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs"
            >
              System Exceptions
            </Link>
          </div>
        </div>

        {/* Infrastructure Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <Satellite className="w-5 h-5 text-blue-600" />
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                99.9% UPTIME
              </span>
            </div>
            <span className="text-xs text-slate-500 block">Satellite Ingestion Feeds</span>
            <div className="font-bold text-slate-900 text-base">Sentinel-2A & Sentinel-1 SAR</div>
            <div className="text-[11px] text-slate-400 font-mono">Next Pass: 04:46 UTC (Tomorrow)</div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <Radio className="w-5 h-5 text-[#10B981]" />
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                20 ACTIVE
              </span>
            </div>
            <span className="text-xs text-slate-500 block">IoT Hardware Broker</span>
            <div className="font-bold text-slate-900 text-base">ESP32 Telemetry Hub</div>
            <div className="text-[11px] text-slate-400 font-mono">Stream: 3s Rolling Polling</div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <Database className="w-5 h-5 text-purple-600" />
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                POSTGIS READY
              </span>
            </div>
            <span className="text-xs text-slate-500 block">Relational & Spatial Store</span>
            <div className="font-bold text-slate-900 text-base">PostgreSQL 15 + PostGIS</div>
            <div className="text-[11px] text-slate-400 font-mono">22 Active Entity Models</div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <Cpu className="w-5 h-5 text-amber-600" />
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                142ms LATENCY
              </span>
            </div>
            <span className="text-xs text-slate-500 block">Agronomic AI Engine</span>
            <div className="font-bold text-slate-900 text-base">GA-PSO & MobileNetV3</div>
            <div className="text-[11px] text-slate-400 font-mono">38 Classes &bull; 92.9% Precision</div>
          </div>

        </div>

        {/* Database Counts Banner */}
        <div className="bg-[#071511] p-8 rounded-3xl text-white border border-[#10B981]/30 shadow-xl space-y-6">
          <div className="border-b border-emerald-900/60 pb-4 flex items-center justify-between">
            <h3 className="font-bold text-lg text-white">Database Entities Summary (Section 24 & 26)</h3>
            <span className="text-xs font-mono text-[#34D399]">West Bengal Pilot Cluster</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 text-center font-mono text-xs">
            <div className="p-3 rounded-2xl bg-[#102820] border border-emerald-800/40">
              <span className="text-slate-400 block text-[10px]">Farmers</span>
              <strong className="text-2xl text-white font-black mt-1 block">25</strong>
            </div>
            <div className="p-3 rounded-2xl bg-[#102820] border border-emerald-800/40">
              <span className="text-slate-400 block text-[10px]">Farms</span>
              <strong className="text-2xl text-white font-black mt-1 block">40</strong>
            </div>
            <div className="p-3 rounded-2xl bg-[#102820] border border-emerald-800/40">
              <span className="text-slate-400 block text-[10px]">IoT Devices</span>
              <strong className="text-2xl text-emerald-400 font-black mt-1 block">20</strong>
            </div>
            <div className="p-3 rounded-2xl bg-[#102820] border border-emerald-800/40">
              <span className="text-slate-400 block text-[10px]">Sensor Records</span>
              <strong className="text-2xl text-white font-black mt-1 block">1,000+</strong>
            </div>
            <div className="p-3 rounded-2xl bg-[#102820] border border-emerald-800/40">
              <span className="text-slate-400 block text-[10px]">Health Records</span>
              <strong className="text-2xl text-white font-black mt-1 block">100+</strong>
            </div>
            <div className="p-3 rounded-2xl bg-[#102820] border border-emerald-800/40">
              <span className="text-slate-400 block text-[10px]">Total Claims</span>
              <strong className="text-2xl text-amber-400 font-black mt-1 block">30</strong>
            </div>
            <div className="p-3 rounded-2xl bg-[#102820] border border-emerald-800/40">
              <span className="text-slate-400 block text-[10px]">Payout Orders</span>
              <strong className="text-2xl text-cyan-400 font-black mt-1 block">15</strong>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
