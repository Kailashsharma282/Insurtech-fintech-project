import React from 'react';
import Link from 'next/link';
import { Users, ShieldCheck, Database, Code, CheckCircle2, Layers, ArrowRight } from 'lucide-react';

export default function TeamPage() {
  const personas = [
    { 
      role: 'FARMER', 
      user: 'Subhash Biswas', 
      id: 'usr-farmer-01', 
      focus: 'Plot #204 Ghatal, Paschim Medinipur (Aman Paddy 2.8ha)', 
      portalLink: '/farmer/dashboard',
      dashboardName: 'Farmer Dashboard & Insurance Validation',
      status: 'Active Pilot'
    },
    { 
      role: 'INSURER', 
      user: 'Dr. S. Sen (Chief Actuary)', 
      id: 'usr-insurer-01', 
      focus: 'Portfolio Loss Ratio & 11-Section Claim Appraisal', 
      portalLink: '/insurer/dashboard',
      dashboardName: 'Parametric Underwriting Desk',
      status: 'Verified Actuary'
    },
    { 
      role: 'ADMIN', 
      user: 'AgriSure Ops Lead', 
      id: 'usr-admin-01', 
      focus: 'Earth Observation ingestion, IoT heartbeats & exceptions', 
      portalLink: '/admin/overview',
      dashboardName: 'Platform Telemetry & Infrastructure',
      status: 'Super Administrator'
    },
    { 
      role: 'FIELD_AGENT', 
      user: 'Prabir Bhattacharya (FA-WB-441)', 
      id: 'usr-agent-01', 
      focus: 'Geotagged ground truth & CCE loss verification', 
      portalLink: '/intelligence/map',
      dashboardName: 'Geospatial Field Reconnaissance',
      status: 'Field Officer'
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>Platform Governance & Access Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            System Architecture & Demo Directory
          </h1>
          <p className="text-slate-600 text-xs sm:text-base leading-relaxed">
            Multi-role operational access for autonomous parametric underwriting, real-time agronomic telemetry, and risk management. No login required in demo mode—switch roles anytime from the top navigation bar.
          </p>
        </div>

        {/* Personas Directory */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-8 space-y-6">
          <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#0F172A]">Pilot Stakeholder Roles & Access Scopes</h3>
              <p className="text-xs text-slate-500">Pre-authenticated demo profiles with active telemetry and simulated claims</p>
            </div>
            <span className="text-xs text-blue-700 font-semibold bg-blue-50 px-3 py-1 rounded-full border border-blue-200 self-start sm:self-auto">
              1-Click Instant Demo Access
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {personas.map((p) => (
              <div key={p.role} className="p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#0F172A] text-blue-400">
                    {p.role}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">{p.id}</span>
                </div>
                <div>
                  <div className="font-bold text-sm sm:text-base text-slate-900">{p.user}</div>
                  <p className="text-xs text-slate-600 mt-0.5">{p.focus}</p>
                </div>
                
                <div className="pt-2 border-t border-slate-200 text-xs font-mono bg-white p-3 rounded-xl border flex items-center justify-between">
                  <span className="text-slate-500 font-sans">Role Status:</span>
                  <strong className="text-blue-700">{p.status}</strong>
                </div>

                <Link
                  href={p.portalLink}
                  className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <span>Open {p.dashboardName}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Auditability */}
        <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#0F172A] text-white border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-blue-400 font-bold text-base">
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
