'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, LanguageMode, getLanguageLabel } from '@/lib/LanguageContext';

const LANGUAGE_OPTIONS: LanguageMode[] = ['hindi-full', 'hindi-english', 'english-simplified'];

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      style={{
        position: 'relative',
        display: 'inline-block',
      }}
    >
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'rgba(139, 92, 246, 0.08)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '999px',
          padding: '10px 16px',
          fontSize: '13px',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#6b21a8',
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(139, 92, 246, 0.12)';
          e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(139, 92, 246, 0.08)';
          e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.2)';
        }}
      >
        <span style={{ fontSize: '16px' }}>🌐</span>
        {getLanguageLabel(language)}
        <span style={{ fontSize: '11px', marginLeft: '4px' }}>▼</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            background: 'white',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            zIndex: 100,
            minWidth: '220px',
            overflow: 'hidden',
          }}
        >
          {LANGUAGE_OPTIONS.map((lang, idx) => (
            <button
              key={lang}
              onClick={() => {
                setLanguage(lang);
                setIsOpen(false);
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                background: language === lang ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                borderLeft: language === lang ? '3px solid #8b5cf6' : '3px solid transparent',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                color: '#172033',
                transition: 'all 0.15s ease',
                borderBottom: idx < LANGUAGE_OPTIONS.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = language === lang ? 'rgba(139, 92, 246, 0.1)' : 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>
                  {language === lang ? '✓' : ' '}
                </span>
                {getLanguageLabel(lang)}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: '#999',
                  marginTop: '4px',
                  marginLeft: '24px',
                }}
              >
                {lang === 'hindi-full' && 'For native Hindi speakers'}
                {lang === 'hindi-english' && 'For bilingual learners'}
                {lang === 'english-simplified' && 'For non-Hindi speakers'}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
