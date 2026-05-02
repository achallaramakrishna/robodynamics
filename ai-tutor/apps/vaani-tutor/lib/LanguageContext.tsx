'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageMode = 'hindi-full' | 'hindi-english' | 'english-simplified';

export interface LanguageContextType {
  language: LanguageMode;
  setLanguage: (lang: LanguageMode) => void;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'vaani_language_preference';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/ai-tutor-api';

// Extract user_id from URL query params or session storage
function getUserId(): number | null {
  try {
    if (typeof window === 'undefined') return null;

    // Try URL query params first (e.g., ?userId=123)
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId') || params.get('user_id');
    if (userId) {
      return parseInt(userId, 10);
    }

    // Try session/local storage (from appSession)
    const appSession = localStorage.getItem('rd_user_session');
    if (appSession) {
      try {
        const parsed = JSON.parse(appSession);
        if (parsed.userId && !isNaN(parseInt(parsed.userId, 10))) {
          return parseInt(parsed.userId, 10);
        }
      } catch {
        // Silently fail, will use localStorage fallback
      }
    }

    return null;
  } catch {
    return null;
  }
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageMode>('hindi-full');
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load language preference: from DB → localStorage → default
  useEffect(() => {
    const loadPreference = async () => {
      try {
        const userId = getUserId();

        // If we have a userId, try to fetch from database
        if (userId && userId > 0) {
          try {
            const response = await fetch(
              `${API_BASE}/student/preferences/${userId}`,
              {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
              }
            );

            if (response.ok) {
              const data = await response.json();
              const pref = data.language_preference as LanguageMode;

              if (['hindi-full', 'hindi-english', 'english-simplified'].includes(pref)) {
                setLanguageState(pref);
                // Also save to localStorage as cache
                localStorage.setItem(STORAGE_KEY, pref);
                setIsHydrated(true);
                setIsLoading(false);
                return;
              }
            }
          } catch (error) {
            console.warn('[LanguageContext] Failed to fetch preference from DB:', error);
            // Fall through to localStorage
          }
        }
      } catch (error) {
        console.warn('[LanguageContext] Unexpected error loading preference:', error);
      }

      // Fallback: load from localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY) as LanguageMode | null;
        if (stored && ['hindi-full', 'hindi-english', 'english-simplified'].includes(stored)) {
          setLanguageState(stored);
        }
      } catch {
        // Silently use default
      }

      setIsHydrated(true);
      setIsLoading(false);
    };

    loadPreference();
  }, []);

  // Save to both localStorage AND database when language changes
  const setLanguage = async (lang: LanguageMode) => {
    // Update UI immediately
    setLanguageState(lang);

    // Save to localStorage immediately (instant cache)
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Silently fail if localStorage is unavailable
    }

    // Save to database asynchronously (don't block UI)
    try {
      const userId = getUserId();
      if (userId && userId > 0) {
        await fetch(`${API_BASE}/student/preferences/${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language_preference: lang }),
        }).catch((error) => {
          console.warn('[LanguageContext] Failed to save preference to DB:', error);
          // Still works via localStorage, so this is not critical
        });
      }
    } catch (error) {
      console.warn('[LanguageContext] Error saving to database:', error);
      // Silently fail - localStorage fallback is already in place
    }
  };

  if (!isHydrated) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isLoading }}>
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
