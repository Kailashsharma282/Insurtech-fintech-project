'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from '@/context/LanguageContext';
import { useRole } from '@/context/RoleContext';
import { Volume2, CheckCircle2, Sparkles, X, Globe, ArrowRight } from 'lucide-react';

interface LanguageModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  forceOpen?: boolean;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen: controlledIsOpen, onClose, forceOpen = false }) => {
  const { role } = useRole();
  const { language, setLanguage, playVoiceAdvisory, setShowVisualGuide } = useLanguage();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedCode, setSelectedCode] = useState<LanguageCode>(language);

  useEffect(() => {
    // Language modal is specifically targeted for Farmers
    if (role !== 'FARMER' && !forceOpen) {
      setIsOpen(false);
      return;
    }

    if (typeof window !== 'undefined') {
      const hasChosen = localStorage.getItem('agrisure_language_selected');
      if (!hasChosen || forceOpen) {
        setIsOpen(true);
      }
    }
  }, [forceOpen, role]);

  useEffect(() => {
    if (controlledIsOpen !== undefined) {
      setIsOpen(controlledIsOpen);
    }
  }, [controlledIsOpen]);

  if (!isOpen) return null;

  const handleSelectLanguage = (code: LanguageCode) => {
    setSelectedCode(code);
    setLanguage(code);

    if (typeof window !== 'undefined') {
      localStorage.setItem('agrisure_language_selected', 'true');
      localStorage.setItem('agrisure_language', code);
      
      // Set google translate cookie to translate entire DOM
      if (code === 'en') {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';';
      } else {
        document.cookie = `googtrans=/en/${code}; path=/;`;
        document.cookie = `googtrans=/en/${code}; path=/; domain=${window.location.hostname};`;
      }
    }

    // When switching to any regional language, start low-literacy guidance & audio
    if (code !== 'en') {
      setShowVisualGuide(true);
      setTimeout(() => {
        playVoiceAdvisory();
      }, 400);
    }

    setIsOpen(false);
    if (onClose) onClose();

    // Trigger full-page DOM translation event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('agrisure-language-changed', { detail: { language: code } }));
      
      // Trigger Google Translate combo if present
      const selectElem = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectElem) {
        selectElem.value = code;
        selectElem.dispatchEvent(new Event('change'));
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-[#0B2119] via-[#071511] to-[#040D0A] border-2 border-[#10B981]/50 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        
        {/* Ambient glow */}
        <div className="absolute -right-24 -top-24 w-60 h-60 bg-[#10B981]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-60 h-60 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close button if user already had a language */}
        <button
          onClick={() => {
            setIsOpen(false);
            if (onClose) onClose();
          }}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-sm"
          title="Dismiss"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" />
            <span>Select Your Language • ভাষা নির্বাচন করুন</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Welcome to AgriSure Intelligence
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            Choose your language for full-page translation, voice advisories, and step-by-step visual guidance.
          </p>

          <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-amber-300 font-semibold">
            <span>🎙️ Regional Voice Assistance Available</span>
            <span>&bull;</span>
            <span>🧭 Visual Picture Guidance</span>
          </div>
        </div>

        {/* Language Grid (7 Languages) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = selectedCode === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelectLanguage(lang.code)}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between group text-left ${
                  isSelected
                    ? 'bg-emerald-950/80 border-[#10B981] shadow-lg shadow-emerald-950/50 scale-[1.02]'
                    : 'bg-[#102820]/70 border-emerald-900/60 hover:border-emerald-500/50 hover:bg-[#102820]'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <span className="text-2xl sm:text-3xl shrink-0 drop-shadow">{lang.flag}</span>
                  <div>
                    <div className="font-black text-base sm:text-lg text-white group-hover:text-[#34D399] transition-colors">
                      {lang.native}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">
                      {lang.label} {lang.code !== 'en' ? '• Voice Active 🔊' : '• Global'}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center space-x-1">
                  {isSelected ? (
                    <CheckCircle2 className="w-5 h-5 text-[#34D399]" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Informative Footer */}
        <div className="mt-6 pt-4 border-t border-emerald-900/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span>ℹ️</span>
            <span>You can change language anytime from the top navigation bar.</span>
          </span>
          <button
            type="button"
            onClick={() => handleSelectLanguage('en')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold underline"
          >
            Continue in English
          </button>
        </div>

      </div>
    </div>
  );
};
