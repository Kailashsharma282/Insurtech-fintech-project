import React from 'react';
import { Users, ShieldCheck, Database, Code, CheckCircle2, Layers } from 'lucide-react';

export default function TeamPage() {
  const credentials = [
    { 
      role: 'FARMER', 
      user: 'Subhash Biswas', 
      id: 'usr-farmer-01', 
      focus: 'Plot #204 Ghatal, Paschim Medinipur (Aman Paddy 2.8ha)', 
      identifier: '+91 98321 44820', 
      password: 'Farmer@2026',
      loginHint: 'Sign in with registered mobile number & password' 
    },
    { 
      role: 'INSURER', 
      user: 'Dr. S. Sen (Chief Actuary)', 
      id: 'usr-insurer-01', 
      focus: 'Portfolio Loss Ratio & 11-Section Claim Appraisal', 
      identifier: 'underwriter@agrisure.in', 
      password: 'Insurer@2026',
      loginHint: 'Sign in with underwriter email & password' 
    },
    { 
      role: 'ADMIN', 
      user: 'AgriSure Ops Lead', 
      id: 'usr-admin-01', 
      focus: 'Earth Observation ingestion, IoT heartbeats & exceptions', 
      identifier: 'admin@agrisure.in', 
      password: 'Admin@2026',
      loginHint: 'Sign in with ops admin email & password' 
    },
    { 
      role: 'FIELD_AGENT', 
      user: 'Prabir Bhattacharya (FA-WB-441)', 
      id: 'usr-agent-01', 
      focus: 'Geotagged ground truth & loss verification', 
      identifier: '+91 94330 12345', 
      password: 'Agent@2026',
      loginHint: 'Sign in with field officer phone & password' 
    },
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
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-[#0F172A]">Pilot Stakeholder Roles & Access Scopes</h3>
              <p className="text-xs text-slate-500">Authenticated via PBKDF2 password hashes and signed HMAC-SHA256 JWT cookies</p>
            </div>
            <span className="text-xs text-[#059669] font-medium bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
              RBAC Enforcement Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {credentials.map((c) => (
              <div key={c.role} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#071511] text-[#34D399]">
                    {c.role}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">{c.id}</span>
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">{c.user}</div>
                  <p className="text-xs text-slate-600 mt-0.5">{c.focus}</p>
                </div>
                
                <div className="pt-2 border-t border-slate-200 text-xs font-mono space-y-1 bg-white p-3 rounded-xl border">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Login ID:</span>
                    <strong className="text-slate-900">{c.identifier}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Security Password:</span>
                    <code className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{c.password}</code>
                  </div>
                </div>

                <div className="text-[11px] text-emerald-700 font-medium">
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
