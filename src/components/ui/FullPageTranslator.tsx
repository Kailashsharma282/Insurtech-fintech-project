'use client';

import React, { useEffect } from 'react';
import { useLanguage, LanguageCode } from '@/context/LanguageContext';

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

export const FullPageTranslator: React.FC = () => {
  const { language } = useLanguage();

  useEffect(() => {
    // 1. Injected hidden container for Google Translate
    if (!document.getElementById('google_translate_element')) {
      const div = document.createElement('div');
      div.id = 'google_translate_element';
      div.style.display = 'none';
      document.body.appendChild(div);
    }

    // 2. Hide Google Translate branding bar and fix top offset
    const styleId = 'google-translate-custom-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .goog-te-banner-frame.skiptranslate, 
        .goog-te-banner-frame {
          display: none !important;
          visibility: hidden !important;
          height: 0 !important;
        }
        body {
          top: 0px !important;
          position: static !important;
        }
        #goog-gt-tt, 
        .goog-te-balloon-frame {
          display: none !important;
        }
        .goog-text-highlight {
          background: none !important;
          box-shadow: none !important;
        }
        .skiptranslate iframe {
          display: none !important;
        }
        #google_translate_element {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    // 3. Define the init callback
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,bn,hi,te,ta,kn,ml',
            autoDisplay: false,
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          'google_translate_element'
        );
      }
    };

    // 4. Load Google Translate API script
    const scriptId = 'google-translate-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }

    // 5. Apply translation cookie and trigger combo
    const applyTranslation = (lang: LanguageCode) => {
      if (typeof window === 'undefined') return;

      if (lang === 'en') {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      } else {
        document.cookie = `googtrans=/en/${lang}; path=/;`;
        document.cookie = `googtrans=/en/${lang}; path=/; domain=${window.location.hostname};`;
      }

      // Check if select combo exists
      const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (combo) {
        combo.value = lang;
        combo.dispatchEvent(new Event('change'));
      }
    };

    applyTranslation(language);

    const handleCustomChange = (e: any) => {
      if (e.detail && e.detail.language) {
        applyTranslation(e.detail.language);
      }
    };

    window.addEventListener('agrisure-language-changed', handleCustomChange);
    return () => {
      window.removeEventListener('agrisure-language-changed', handleCustomChange);
    };
  }, [language]);

  return null;
};
