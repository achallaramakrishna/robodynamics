'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageMode = 'hindi-full' | 'hindi-english' | 'english-simplified';

export interface LanguageContextType {
  language: LanguageMode;
  setLanguage: (lang: LanguageMode) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'vaani_language_preference';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageMode>('hindi-full');
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as LanguageMode | null;
    if (stored && ['hindi-full', 'hindi-english', 'english-simplified'].includes(stored)) {
      setLanguageState(stored);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage when language changes
  const setLanguage = (lang: LanguageMode) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  if (!isHydrated) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

// Helper function to get display text based on language mode
export const getLanguageLabel = (lang: LanguageMode): string => {
  switch (lang) {
    case 'hindi-full':
      return '🇮🇳 Hindi (Full)';
    case 'hindi-english':
      return '🇮🇳🇬🇧 Hindi-English Mix';
    case 'english-simplified':
      return '🇬🇧 English (Simplified)';
    default:
      return 'Select Language';
  }
};
