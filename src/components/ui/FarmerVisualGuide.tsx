'use client';

import React from 'react';
import { 
  Volume2, 
  ArrowRight, 
  Sprout, 
  Droplets, 
  Zap, 
  ShieldCheck, 
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const FarmerVisualGuide: React.FC = () => {
  const { language, t, showVisualGuide, setShowVisualGuide, playVoiceAdvisory, isSpeaking } = useLanguage();

  if (!showVisualGuide && language === 'en') {
    return null;
  }

  return (
    <div className="bg-[#0F172A] border border-slate-700 rounded-2xl p-4 sm:p-5 text-white shadow-md relative overflow-hidden w-full max-w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shrink-0">
            🧭
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="font-extrabold text-sm sm:text-base text-white tracking-wide">
                সহজ নির্দেশিকা • ಚಿತ್ರ ಮಾರ್ಗದರ್ಶಿ • దృశ్య మార్గదర్శి
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold">
                VISUAL GUIDE
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Follow steps in order &bull; Tap speaker to listen in your regional language
            </p>
          </div>
        </div>

        {/* Audio Speaking Button */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={playVoiceAdvisory}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shadow-xs ${
              isSpeaking
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isSpeaking ? t('guide.speaking') : t('guide.audio_prompt')}</span>
          </button>

          <button
            onClick={() => setShowVisualGuide(false)}
            className="text-[11px] text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800"
          >
            {t('common.dismiss', 'Dismiss')}
          </button>
        </div>
      </div>

      {/* 4 Pictorial Steps */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 pt-3.5 w-full">
        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs space-y-1">
          <div className="flex items-center justify-between text-blue-400 font-bold">
            <span className="text-[10px] uppercase font-mono">1. Health</span>
            <Sprout className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-sm font-extrabold text-white">0.71 Normal</div>
          <p className="text-[11px] text-slate-300">{t('guide.step1')}</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs space-y-1">
          <div className="flex items-center justify-between text-blue-400 font-bold">
            <span className="text-[10px] uppercase font-mono">2. Moisture</span>
            <Droplets className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-sm font-extrabold text-white">58% Moist</div>
          <p className="text-[11px] text-slate-300">{t('guide.step2')}</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs space-y-1">
          <div className="flex items-center justify-between text-blue-400 font-bold">
            <span className="text-[10px] uppercase font-mono">3. Pump</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-sm font-extrabold text-white">Pump Ready</div>
          <p className="text-[11px] text-slate-300">{t('guide.step3')}</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs space-y-1">
          <div className="flex items-center justify-between text-blue-400 font-bold">
            <span className="text-[10px] uppercase font-mono">4. Insurance</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-sm font-extrabold text-white">Cover Active</div>
          <p className="text-[11px] text-slate-300">{t('guide.step4')}</p>
        </div>
      </div>
    </div>
  );
};
