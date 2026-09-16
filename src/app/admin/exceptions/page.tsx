'use client';

import React, { useState } from 'react';
import { EmptyState, EmptyStateType } from '@/components/ui/EmptyState';
import { AlertTriangle, Layers } from 'lucide-react';

export default function AdminExceptionsPage() {
  const [selectedState, setSelectedState] = useState<EmptyStateType>('no_satellite');

  const states: { id: EmptyStateType; label: string }[] = [
    { id: 'no_satellite', label: '1. No Satellite Data' },
    { id: 'iot_disconnected', label: '2. IoT Disconnected' },
    { id: 'model_unavailable', label: '3. Model Unavailable' },
    { id: 'claim_verification_pending', label: '4. Claim Verification Pending' },
    { id: 'payout_failed', label: '5. Payout Failed' },
    { id: 'no_alerts', label: '6. No Alerts' },
    { id: 'no_farms', label: '7. No Farms' },
    { id: 'invalid_disease_image', label: '8. Invalid Disease Image' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            Polished Empty & Error States (Section 31)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            "Design polished states for: no satellite data, IoT disconnected, model unavailable, claim verification pending, payout failed, no alerts, no farms, invalid disease image. Never leave blank cards."
          </p>
        </div>

        {/* State Selector Buttons */}
        <div className="flex flex-wrap gap-2">
          {states.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedState(s.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedState === s.id
                  ? 'bg-[#071511] text-[#34D399] shadow-md'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Live Rendering of the Polished State */}
        <div className="p-12 rounded-3xl bg-slate-100/70 border border-slate-200 flex items-center justify-center">
          <EmptyState 
            type={selectedState} 
            onRetry={() => alert(`Retry triggered for: ${selectedState}`)} 
          />
        </div>

      </div>
    </div>
  );
}
