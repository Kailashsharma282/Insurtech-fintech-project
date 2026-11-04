'use client';

import React, { useState } from 'react';
import { EmptyState, EmptyStateType } from '@/components/ui/EmptyState';
import { 
  AlertTriangle, 
  Layers, 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  RefreshCw,
  Server,
  Cpu,
  Radio,
  Satellite,
  Clock,
  Landmark
} from 'lucide-react';

export default function AdminExceptionsPage() {
  const [selectedState, setSelectedState] = useState<EmptyStateType>('no_satellite');

  const states: { 
    id: EmptyStateType; 
    label: string; 
    subsystem: string;
    protocol: string;
    sla: string;
    icon: any;
  }[] = [
    { 
      id: 'no_satellite', 
      label: '1. Satellite Cloud Occlusion', 
      subsystem: 'Sentinel-2 Optical Pass',
      protocol: 'Autonomous Sentinel-1 C-Band SAR Synthetic Aperture Radar & CHIRPS Pentad Interpolation',
      sla: 'Instant (< 250ms fallback)',
      icon: Satellite
    },
    { 
      id: 'iot_disconnected', 
      label: '2. IoT In-Situ Probe Offline', 
      subsystem: 'Soil & Microclimate Telemetry',
      protocol: 'Cellular 2G/4G GSM Heartbeat Ping + Automatic RS-485 Modbus Circuit Re-initialization',
      sla: '15-second retry interval',
      icon: Radio
    },
    { 
      id: 'model_unavailable', 
      label: '3. AI Vision Worker Warming', 
      subsystem: 'Biophysical Leaf Classifier',
      protocol: 'Deterministic Colorimetric ExG / ExR & Agronomic Heuristic Rule-Engine Serving',
      sla: 'Zero-latency fallback',
      icon: Cpu
    },
    { 
      id: 'claim_verification_pending', 
      label: '4. Claim Telemetry Cross-Check', 
      subsystem: 'Underwriter Audit Desk',
      protocol: 'Autonomous Dual-Telemetry Sentinel CHF Baseline & AWS Weather Station Corroboration',
      sla: '24-hour adjudication window',
      icon: Clock
    },
    { 
      id: 'payout_failed', 
      label: '5. Direct Benefit Settlement Retry', 
      subsystem: 'RBI NEFT / PFMS Switch',
      protocol: 'Secondary Clearing Batch Dispatch via Linked PNB / Bank Branch Account Identifier',
      sla: 'Scheduled Next-Cycle Batch',
      icon: Landmark
    },
    { 
      id: 'no_alerts', 
      label: '6. Zero Risk Breaches', 
      subsystem: 'Spatial Risk Engine',
      protocol: 'Optimal Canopy Hydration Monitoring across Silabati & Upland Cadastral Plots',
      sla: 'Continuous real-time stream',
      icon: CheckCircle2
    },
    { 
      id: 'no_farms', 
      label: '7. Cadastral Boundary Query Empty', 
      subsystem: 'GIS Spatial Query Engine',
      protocol: 'Spatial Filter Broadening & Pan-India Nominatim Geocoding Directory Resolution',
      sla: 'Instant prompt guide',
      icon: Layers
    },
    { 
      id: 'invalid_disease_image', 
      label: '8. Unidentifiable Crop Foliage', 
      subsystem: 'Cellular Computer Vision',
      protocol: 'Adaptive Brightness Normalization & User Guidance Prompts for Focus & Illumination',
      sla: 'Interactive user guide',
      icon: AlertTriangle
    },
  ];

  const currentStateMeta = states.find(s => s.id === selectedState)!;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 pb-24 md:pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Console */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest">
              <ShieldAlert className="w-4 h-4" />
              <span>Operational Incident & Resilience Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              System Exceptions & Telemetry Fallback Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
              Inspect, test, and manage system resilience fallbacks for orbital satellite cloud masking, in-situ probe timeouts, machine learning cold-starts, and banking settlement exceptions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-xs font-bold font-mono inline-flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>All 8 Fallbacks Active</span>
            </span>
          </div>
        </div>

        {/* State Selector Buttons */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Select Telemetry Exception to Simulate & Inspect:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {states.map(s => {
              const Icon = s.icon;
              const isSelected = selectedState === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedState(s.id)}
                  className={`p-3.5 rounded-2xl text-left transition-all border flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'bg-blue-700 border-blue-600 text-white shadow-md shadow-blue-900/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                    <span className={`text-[10px] font-mono uppercase font-bold px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {s.id.split('_')[0]}
                    </span>
                  </div>
                  <div className="text-xs font-bold line-clamp-1">
                    {s.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Fallback Resolution Architecture Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Monitored Subsystem</span>
            <strong className="text-sm text-slate-900 dark:text-white font-bold mt-0.5 block">
              {currentStateMeta.subsystem}
            </strong>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Automated Fallback Architecture</span>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 font-medium leading-relaxed">
              {currentStateMeta.protocol}
            </p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Failover SLA</span>
            <strong className="text-sm text-emerald-700 dark:text-emerald-400 font-mono font-bold mt-0.5 block">
              {currentStateMeta.sla}
            </strong>
          </div>
        </div>

        {/* Live Rendering of the Polished State Component */}
        <div className="p-8 sm:p-14 rounded-3xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
          <EmptyState 
            type={selectedState} 
            onRetry={() => alert(`Diagnostic fallback re-check executed for: ${currentStateMeta.label}`)} 
          />
        </div>

      </div>
    </div>
  );
}
