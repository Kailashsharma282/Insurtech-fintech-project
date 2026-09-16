'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Volume2, ArrowRight, CheckCircle2, Globe, Compass, X } from 'lucide-react';
import Link from 'next/link';

export const FloatingGuidanceBar: React.FC<{ onOpenLanguageModal?: () => void }> = ({ onOpenLanguageModal }) => {
  const { language, t, showVisualGuide, setShowVisualGuide, playVoiceAdvisory, isSpeaking } = useLanguage();

  if (language === 'en' || !showVisualGuide) {
    return null;
  }

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-3xl animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#071511]/95 backdrop-blur-2xl border-2 border-[#10B981] rounded-2xl p-3 sm:p-3.5 text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Left: Indicator & Guide prompt */}
        <div className="flex items-center space-x-2.5 w-full sm:w-auto">
          <div className="w-8 h-8 rounded-xl bg-[#10B981] text-white flex items-center justify-center font-bold text-sm shrink-0 animate-bounce" style={{ animationDuration: '2s' }}>
            🧭
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-xs sm:text-sm text-emerald-300 truncate">
                {t('guide.title')} • {t('guide.subtitle')}
              </span>
            </div>
            <div className="text-[11px] text-slate-300 flex items-center gap-1 font-semibold truncate">
              <span>🟢 {t('guide.step_health', 'Plant Health')}</span>
              <span>➡️</span>
              <span>💧 {t('guide.step_moisture', 'Moisture')}</span>
              <span>➡️</span>
              <span>⚡ {t('guide.step_pump', 'Pump')}</span>
              <span>➡️</span>
              <span>🛡️ {t('guide.step_insurance', 'Insurance')}</span>
            </div>
          </div>
        </div>

        {/* Right: Audio Voice Button & Action Links */}
        <div className="flex items-center space-x-2 shrink-0 w-full sm:w-auto justify-end">
          {/* Voice Prompt Button */}
          <button
            type="button"
            onClick={playVoiceAdvisory}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-md ${
              isSpeaking
                ? 'bg-amber-500 text-slate-950 animate-pulse'
                : 'bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] text-white'
            }`}
          >
            <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-spin' : ''}`} />
            <span>{isSpeaking ? t('guide.listening', 'Speaking...') : t('guide.listen', '🔊 Listen')}</span>
          </button>

          {/* Direct Link to Insurance */}
          <Link
            href="/farmer/insurance/apply"
            className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center space-x-1 shrink-0"
          >
            <span>{t('guide.apply_btn', '🛡️ Apply Insurance')}</span>
            <span>➡️</span>
          </Link>

          {/* Change Language Button */}
          {onOpenLanguageModal && (
            <button
              type="button"
              onClick={onOpenLanguageModal}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs"
              title="Change Language"
            >
              <Globe className="w-4 h-4" />
            </button>
          )}

          {/* Dismiss Guidance */}
          <button
            type="button"
            onClick={() => setShowVisualGuide(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 text-xs"
            title="Hide Guidance Bar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
