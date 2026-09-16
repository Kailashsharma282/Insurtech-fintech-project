import React from 'react';
import { Users, GraduationCap, ShieldCheck, Database, Code, CheckCircle2 } from 'lucide-react';

export default function TeamPage() {
  const credentials = [
    { role: 'FARMER', user: 'Subhash Biswas', id: 'farmer-1', focus: 'Plot #204 Nadia (Aman Paddy 2.8ha)', loginHint: 'Select "Farmer" in top navigation' },
    { role: 'INSURER', user: 'Dr. S. Sen (Chief Actuary)', id: 'underwriter-01', focus: 'Portfolio Loss Ratio & 11-Section Claim Approval', loginHint: 'Select "Insurer" in top navigation' },
    { role: 'ADMIN', user: 'AgriSure Ops Lead', id: 'admin-01', focus: 'Satellite ingestion, IoT heartbeats & exceptions', loginHint: 'Select "Admin" in top navigation' },
    { role: 'FIELD_AGENT', user: 'Prabir Bhattacharya (ID: FA-WB-441)', id: 'agent-441', focus: 'Geotagged ground truth & loss appraisal', loginHint: 'Select "Field Agent" in top navigation' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Capstone / University Research Project</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Project Architecture & Demo Credentials
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Designed as an end-to-end operational demonstrator for autonomous parametric risk transfer and precision agricultural resilience.
          </p>
        </div>

        {/* Credentials Table */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#0F172A]">Demo Role Credentials (Instant Switcher)</h3>
            <span className="text-xs text-[#059669] font-medium bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              No password required for evaluation
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {credentials.map((c) => (
              <div key={c.role} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#071511] text-[#34D399]">
                    {c.role}
                  </span>
                  <span className="text-xs text-slate-500">{c.id}</span>
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

        {/* University & Academic Disclosure */}
        <div className="p-8 rounded-3xl bg-[#071511] text-white border border-[#10B981]/30 space-y-4">
          <div className="flex items-center space-x-2 text-[#34D399] font-bold text-base">
            <ShieldCheck className="w-5 h-5" />
            <span>Demonstration & Simulation Integrity Policy</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            In compliance with project specifications, this application features fully functioning workflows, mathematical algorithms, 
            interactive maps, and reactive databases. All satellite scenes (Sentinel-2A/B and Sentinel-1 SAR), IoT hardware telemetry 
            (ESP32 3s ticks), and banking transaction identifiers (RBI NEFT/IMPS) are engineered as faithful, high-fidelity 
            research simulations. No commercial banking or paid ESA Copernicus API keys are billed.
          </p>
        </div>

      </div>
    </div>
  );
}
