import React from 'react';
import { Users, ShieldCheck, Database, Code, CheckCircle2, Layers } from 'lucide-react';

export default function TeamPage() {
  const credentials = [
    { role: 'FARMER', user: 'Subhash Biswas', id: 'farmer-1', focus: 'Plot #204 Ghatal, Paschim Medinipur (Aman Paddy 2.8ha)', loginHint: 'Switch role via top navigation' },
    { role: 'INSURER', user: 'Dr. S. Sen (Chief Underwriter)', id: 'underwriter-01', focus: 'Portfolio Loss Ratio & 11-Section Claim Appraisal', loginHint: 'Switch role via top navigation' },
    { role: 'ADMIN', user: 'AgriSure Ops Lead', id: 'admin-01', focus: 'Earth Observation ingestion, IoT heartbeats & exceptions', loginHint: 'Switch role via top navigation' },
    { role: 'FIELD_AGENT', user: 'Prabir Bhattacharya (ID: FA-WB-441)', id: 'agent-441', focus: 'Geotagged ground truth & loss verification', loginHint: 'Switch role via top navigation' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>Platform Governance & Access Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            System Architecture & Role Directory
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Multi-role operational access control for autonomous parametric underwriting, real-time agronomic telemetry, and risk management.
          </p>
        </div>

        {/* Credentials / Roles Table */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#0F172A]">Pilot Stakeholder Roles & Access Scopes</h3>
            <span className="text-xs text-[#059669] font-medium bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Role-Based Access Control Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {credentials.map((c) => (
              <div key={c.role} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#071511] text-[#34D399]">
                    {c.role}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">{c.id}</span>
                </div>
                <div className="font-bold text-sm text-slate-900">{c.user}</div>
                <p className="text-xs text-slate-600">{c.focus}</p>
                <div className="pt-2 text-[11px] text-emerald-700 font-medium">
                  &rarr; {c.loginHint}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Auditability */}
        <div className="p-8 rounded-3xl bg-[#071511] text-white border border-[#10B981]/30 space-y-4">
          <div className="flex items-center space-x-2 text-[#34D399] font-bold text-base">
            <ShieldCheck className="w-5 h-5" />
            <span>Platform Integrity & Cryptographic Verifiability</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            AgriSure Intelligence implements immutable SHA-256 hash chains across all underwriting decisions, satellite telemetry captures, 
            and payout authorizations. All parametric triggers are cross-verified against multi-spectral Sentinel-2 indices, Sentinel-1 SAR 
            backscatter data, and IoT ground sensor readings before claims are executed.
          </p>
        </div>

      </div>
    </div>
  );
}
