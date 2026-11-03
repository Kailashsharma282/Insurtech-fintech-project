'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from '@/context/LanguageContext';
import { Volume2, CheckCircle2, Globe, X } from 'lucide-react';

interface LanguageModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  forceOpen?: boolean;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen: controlledIsOpen, onClose, forceOpen = false }) => {
  const { language, setLanguage, playVoiceAdvisory, setShowVisualGuide } = useLanguage();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedCode, setSelectedCode] = useState<LanguageCode>(language);

  // In demo mode: only open when explicitly commanded, do not block first-time visitors
  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
    }
  }, [forceOpen]);

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
      
      if (code === 'en') {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';';
      } else {
        document.cookie = `googtrans=/en/${code}; path=/;`;
        document.cookie = `googtrans=/en/${code}; path=/; domain=${window.location.hostname};`;
      }
    }

    if (code !== 'en') {
      setShowVisualGuide(true);
      setTimeout(() => {
        playVoiceAdvisory();
      }, 400);
    }

    setIsOpen(false);
    if (onClose) onClose();

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('agrisure-language-changed', { detail: { language: code } }));
      
      const selectElem = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectElem) {
        selectElem.value = code;
        selectElem.dispatchEvent(new Event('change'));
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-3 sm:p-4">
      <div className="bg-[#0F172A] border border-slate-700 rounded-2xl w-full max-w-lg p-5 sm:p-6 text-white shadow-2xl relative overflow-hidden">
        
        {/* Close button */}
        <button
          onClick={() => {
            setIsOpen(false);
            if (onClose) onClose();
          }}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-xs"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 mb-5 pr-6 sm:pr-0">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-950 border border-blue-800 text-blue-300 text-[11px] font-bold font-mono uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>Select Language &bull; ভাষা নির্বাচন</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Choose Preferred Language
          </h2>

          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Full UI translation, voice assistance, and visual crop advisories.
          </p>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[55vh] overflow-y-auto pr-1">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = selectedCode === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelectLanguage(lang.code)}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between text-left ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-700 text-blue-300'
                  }`}>
                    {lang.flag}
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-sm leading-tight truncate">{lang.native}</div>
                    <div className={`text-[11px] leading-tight truncate ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                      {lang.label}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                  <Volume2 className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-200' : 'text-slate-400'}`} />
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Language can be changed anytime from the top bar.</span>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              if (onClose) onClose();
            }}
            className="text-blue-400 hover:text-blue-300 font-bold ml-2 shrink-0"
          >
            Continue &rarr;
          </button>
        </div>

      </div>
    </div>
  );
};
