'use client';

import React from 'react';
import Link from 'next/link';
import { Satellite, Shield, Cpu, BookOpen, GitFork } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useRole } from '@/context/RoleContext';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  const { role } = useRole();

  return (
    <footer className="bg-[#071511] border-t border-[#10B981]/20 text-slate-400 text-xs mt-16 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-[#10B981] flex items-center justify-center text-white">
                <Satellite className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-white">AgriSure Intelligence</span>
            </div>
            <p className="text-slate-400 max-w-md text-xs leading-relaxed">
              {t('footer.desc')}
            </p>
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-[#10B981]/20 text-[11px] text-emerald-300">
              {t('footer.academic')}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              {role === 'FARMER' ? t('footer.workflow') : 'Workflow & Tech'}
            </h4>
            <ul className="space-y-2">
              {role === 'FARMER' ? (
                <>
                  <li>
                    <Link href="/farmer/dashboard" className="hover:text-white transition-colors">
                      {t('nav.dashboard')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/farmer/farms" className="hover:text-white transition-colors">
                      {t('nav.farms')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/farmer/disease" className="hover:text-white transition-colors">
                      {t('nav.disease')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/farmer/optimization" className="hover:text-white transition-colors">
                      {t('nav.optimization')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/farmer/alerts" className="hover:text-white transition-colors">
                      {t('nav.iot')}
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/how-it-works" className="hover:text-white transition-colors">
                      01-06 Six-Stage Architecture
                    </Link>
                  </li>
                  <li>
                    <Link href="/technology/chf" className="hover:text-white transition-colors">
                      Shannon Entropy CHF Formula
                    </Link>
                  </li>
                  <li>
                    <Link href="/technology/stress" className="hover:text-white transition-colors">
                      UV-NDVI & Radar VH Backscatter
                    </Link>
                  </li>
                  <li>
                    <Link href="/technology/baseline" className="hover:text-white transition-colors">
                      4-Year Localized Baseline
                    </Link>
                  </li>
                  <li>
                    <Link href="/farmer/optimization" className="hover:text-white transition-colors">
                      GA-PSO Hybrid Optimizer
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              {role === 'FARMER' ? t('footer.support') : 'Underwriting & Auditing'}
            </h4>
            <ul className="space-y-2">
              {role === 'FARMER' ? (
                <>
                  <li>
                    <Link href="/farmer/insurance" className="hover:text-white transition-colors">
                      {t('nav.insurance')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/farmer/insurance/apply" className="hover:text-white transition-colors">
                      {t('ins.apply_title')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/farmer/payouts" className="hover:text-white transition-colors">
                      {t('nav.payments')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/farmer/dashboard" className="hover:text-white transition-colors">
                      {t('farmer.selected_farm')}: Plot #204
                    </Link>
                  </li>
                </>
              ) : (
                <>
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
                      11-Section Evidence Packages
                    </Link>
                  </li>
                  <li>
                    <Link href="/insurer/audit" className="hover:text-white transition-colors">
                      Cryptographic Audit Trail
                    </Link>
                  </li>
                  <li>
                    <Link href="/team" className="hover:text-white transition-colors">
                      University Demo Credentials
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <div>
            {t('footer.rights')}
          </div>
          <div className="flex items-center space-x-2 mt-2 sm:mt-0 font-mono text-[10px] text-emerald-400/80">
            <span>{t('cycle.s1_title')}</span>
            <span>&rarr;</span>
            <span>{t('cycle.s2_title')}</span>
            <span>&rarr;</span>
            <span>{t('cycle.s3_title')}</span>
            <span>&rarr;</span>
            <span>{t('cycle.s4_title')}</span>
            <span>&rarr;</span>
            <span>{t('cycle.s5_title')}</span>
            <span>&rarr;</span>
            <span>{t('cycle.s6_title')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
