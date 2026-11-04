import React from 'react';
import Link from 'next/link';
import { Satellite } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0F172A] border-t border-slate-800 text-slate-400 text-xs mt-16 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Satellite className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-white">AgriSure Intelligence</span>
            </div>
            <p className="text-slate-400 max-w-md text-xs leading-relaxed">
              Enterprise Agricultural Parametric InsurTech Platform combining Sentinel-2/1 satellite remote sensing, localized Shannon entropy Crop Health Factor (CHF) computation, agricultural IoT telemetry, and autonomous underwriting.
            </p>
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 text-[11px] text-blue-300">
              <strong>West Bengal Pilot Coverage:</strong> Operational telemetry, Earth Observation algorithms, and parametric underwriting calibrated for Ghatal Block, Paschim Medinipur.
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Workflow & Tech
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/farmer/dashboard" className="hover:text-white transition-colors">
                  Farmer Dashboard
                </Link>
              </li>
              <li>
                <Link href="/farmer/insurance-validation" className="hover:text-white transition-colors">
                  Insurance Claim Validation Hub
                </Link>
              </li>
              <li>
                <Link href="/farmer/disease" className="hover:text-white transition-colors">
                  Photo AI (NPK & Water Diagnostic)
                </Link>
              </li>
              <li>
                <Link href="/technology/chf" className="hover:text-white transition-colors">
                  Ghatal Block CHF Engine
                </Link>
              </li>
              <li>
                <Link href="/intelligence/map" className="hover:text-white transition-colors">
                  Satellite Map & Earth Engine
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Underwriting & Auditing
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/insurer/dashboard" className="hover:text-white transition-colors">
                  Insurer Underwriting Desk
                </Link>
              </li>
              <li>
                <Link href="/insurer/risk-map" className="hover:text-white transition-colors">
                  Insurance Unit Risk Map
                </Link>
              </li>
              <li>
                <Link href="/insurer/claims" className="hover:text-white transition-colors">
                  Parametric Claims
                </Link>
              </li>
              <li>
                <Link href="/insurer/audit" className="hover:text-white transition-colors">
                  Cryptographic Audit Trail
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <div className="text-center sm:text-left">
            © 2026 AgriSure Intelligence. West Bengal Parametric Pilot.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1 sm:space-x-2 font-mono text-[10px] text-slate-400">
            <span>OBSERVE</span>
            <span>&rarr;</span>
            <span>DIAGNOSE</span>
            <span>&rarr;</span>
            <span>PRESCRIBE</span>
            <span>&rarr;</span>
            <span>VERIFY</span>
            <span>&rarr;</span>
            <span>INSURE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
