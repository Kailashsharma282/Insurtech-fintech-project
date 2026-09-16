'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Radio, 
  Satellite, 
  Droplets, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { store } from '@/lib/db/store';
import { Alert } from '@/lib/types';

export default function FarmerAlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(store.getAlerts());
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filtered = alerts.filter(a => {
    if (filterSeverity === 'ALL') return true;
    return a.severity === filterSeverity;
  });

  const markRead = (id: string) => {
    store.markAlertRead(id);
    setAlerts([...store.getAlerts()]);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 pb-24 md:pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              Alerts & Precision Advisories
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Early stress triggers, disease signatures, and automated policy qualification notices.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-500 font-medium">Filter Severity:</span>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="p-2 rounded-xl border border-slate-300 bg-white font-semibold"
            >
              <option value="ALL">All Alerts ({alerts.length})</option>
              <option value="CRITICAL">Critical Alerts</option>
              <option value="WARNING">Warnings</option>
              <option value="INFO">Informational</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map((a) => (
            <div
              key={a.id}
              className={`p-6 rounded-3xl bg-white border transition-all space-y-3 ${
                !a.isRead ? 'border-emerald-300 shadow-sm ring-1 ring-emerald-500/10' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    a.severity === 'CRITICAL' ? 'bg-red-50 text-red-600' :
                    a.severity === 'WARNING' ? 'bg-amber-50 text-amber-600' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                    {a.severity === 'CRITICAL' ? <AlertTriangle className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-base text-slate-900">{a.title}</h3>
                      {!a.isRead && (
                        <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                          NEW
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      Plot: <strong className="text-slate-700">{a.farmPlot}</strong> &bull; Source: <span className="uppercase text-emerald-700">{a.source}</span> &bull; {a.timestamp}
                    </div>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                  a.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                  a.severity === 'WARNING' ? 'bg-amber-100 text-amber-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {a.severity}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-13">
                {a.description}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs pl-13">
                {!a.isRead ? (
                  <button
                    onClick={() => markRead(a.id)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Mark as read
                  </button>
                ) : (
                  <span className="text-slate-400">Read</span>
                )}

                <Link
                  href={a.actionLink || '/farmer/dashboard'}
                  className="inline-flex items-center font-semibold text-[#059669] hover:text-emerald-800"
                >
                  <span>{a.actionText || 'Take Action'}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
