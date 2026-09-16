'use client';

import React from 'react';
import { 
  Volume2, 
  ArrowRight, 
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useRole } from '@/context/RoleContext';

export const FarmerVisualGuide: React.FC = () => {
  const { role } = useRole();
  const { language, t, showVisualGuide, setShowVisualGuide, playVoiceAdvisory, isSpeaking } = useLanguage();

  if (role !== 'FARMER' || (!showVisualGuide && language === 'en')) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-emerald-900/90 via-[#071511] to-teal-950/90 border-2 border-[#10B981] rounded-3xl p-4 sm:p-5 text-white shadow-2xl backdrop-blur-xl relative overflow-hidden animate-in fade-in slide-in-from-top-3 duration-300">
      
      {/* Decorative pulse background */}
      <div className="absolute -right-16 -top-16 w-48 h-48 bg-[#10B981]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-800/60 pb-3.5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#10B981] text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-emerald-950/50 shrink-0 animate-bounce" style={{ animationDuration: '2.5s' }}>
            🧭
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-sm sm:text-base text-white tracking-wide flex items-center gap-1.5">
                <span>সহজ নির্দেশিকা • ಚಿತ್ರ ಮಾರ್ಗದರ್ಶಿ • దృశ్య మార్గదర్శి • எளிய வழிகாட்டி</span>
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#34D399] border border-[#10B981]/40 font-bold">
                {t('nav.visual_guide_active')}
              </span>
            </div>
            <p className="text-xs text-emerald-200 mt-0.5">
              {t('guide.subtitle')}
            </p>
          </div>
        </div>

        {/* Audio Speaking Button */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={playVoiceAdvisory}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 shadow-lg transform active:scale-95 ${
              isSpeaking
                ? 'bg-amber-500 text-slate-950 animate-pulse shadow-amber-500/50'
                : 'bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] text-white shadow-emerald-950/50'
            }`}
          >
            <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-spin' : ''}`} />
            <span>{isSpeaking ? t('guide.audio_speaking') : t('guide.audio_prompt')}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowVisualGuide(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 text-xs"
            title="Hide Visual Guidance"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 4 Step Visual Progression Arrows (Crucial for Low-Literacy / Illiterate Farmers) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3.5">
        
        {/* Step 1 */}
        <div className="p-3 rounded-2xl bg-[#102820]/90 border border-emerald-500/30 flex items-center justify-between group hover:border-[#10B981] transition-all">
          <div className="flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs">
              1
            </span>
            <div>
              <div className="font-bold text-xs text-emerald-300">🟢 {t('farmer.crop_health')}</div>
              <div className="text-[11px] text-slate-300 font-semibold">{t('farmer.crop_health_status')}</div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-emerald-400 animate-pulse shrink-0 hidden sm:block" />
        </div>

        {/* Step 2 */}
        <div className="p-3 rounded-2xl bg-[#102820]/90 border border-emerald-500/30 flex items-center justify-between group hover:border-[#10B981] transition-all">
          <div className="flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-xs">
              2
            </span>
            <div>
              <div className="font-bold text-xs text-blue-300">💧 {t('farmer.soil_moisture')}</div>
              <div className="text-[11px] text-slate-300 font-semibold">{t('farmer.soil_moisture_desc')}</div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-blue-400 animate-pulse shrink-0 hidden sm:block" />
        </div>

        {/* Step 3 */}
        <div className="p-3 rounded-2xl bg-[#102820]/90 border border-emerald-500/30 flex items-center justify-between group hover:border-[#10B981] transition-all">
          <div className="flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs">
              3
            </span>
            <div>
              <div className="font-bold text-xs text-amber-300">⚡ {t('farmer.next_action')}</div>
              <div className="text-[11px] text-slate-300 font-semibold">{t('farmer.actuate_pump')}</div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-amber-400 animate-pulse shrink-0 hidden sm:block" />
        </div>

        {/* Step 4 */}
        <div className="p-3 rounded-2xl bg-[#102820]/90 border border-emerald-500/30 flex items-center justify-between group hover:border-[#10B981] transition-all">
          <div className="flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-xs">
              4
            </span>
            <div>
              <div className="font-bold text-xs text-teal-300">🛡️ {t('ins.active_policy')}</div>
              <div className="text-[11px] text-slate-300 font-semibold">{t('ins.apply_subtitle')}</div>
            </div>
          </div>
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
        </div>

      </div>

    </div>
  );
};
