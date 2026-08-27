import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeName, ThemeConfig } from '../types/cursor';

export const THEMES: ThemeConfig[] = [
  {
    id: 'sophisticated',
    name: 'Sophisticated Dark',
    primaryColor: '#0a0a0a',
    accentColor: '#c5a059',
    isDark: true,
    badge: 'Signature',
  },
  {
    id: 'graphite',
    name: 'Graphite',
    primaryColor: '#121316',
    accentColor: '#6366f1',
    isDark: true,
  },
  {
    id: 'dark',
    name: 'Deep Dark',
    primaryColor: '#090a0f',
    accentColor: '#38bdf8',
    isDark: true,
  },
  {
    id: 'light',
    name: 'Pure Light',
    primaryColor: '#f8fafc',
    accentColor: '#2563eb',
    isDark: false,
  },
  {
    id: 'cloud',
    name: 'Cloud Mist',
    primaryColor: '#f1f5f9',
    accentColor: '#0284c7',
    isDark: false,
  },
  {
    id: 'sunset',
    name: 'Amber Sunset',
    primaryColor: '#180f0b',
    accentColor: '#f97316',
    isDark: true,
  },
  {
    id: 'aurora',
    name: 'Aurora Borealis',
    primaryColor: '#081412',
    accentColor: '#10b981',
    isDark: true,
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    primaryColor: '#0d071a',
    accentColor: '#f43f5e',
    isDark: true,
  },
  {
    id: 'pastel',
    name: 'Pastel Dream',
    primaryColor: '#faf5ff',
    accentColor: '#a855f7',
    isDark: false,
  },
  {
    id: 'forest',
    name: 'Forest Moss',
    primaryColor: '#0c140d',
    accentColor: '#84cc16',
    isDark: true,
  },
];

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  currentThemeConfig: ThemeConfig;
  themes: ThemeConfig[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    try {
      const saved = localStorage.getItem('cursed_cursors_theme') as ThemeName;
      if (saved && THEMES.some(t => t.id === saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'sophisticated';
  });

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('cursed_cursors_theme', newTheme);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const currentThemeConfig = THEMES.find(t => t.id === theme) || THEMES[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, currentThemeConfig, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
