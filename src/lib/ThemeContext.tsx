"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { themes, getThemeById, type ThemeId, type ThemeDefinition } from "@/lib/themes";

interface ThemeContextValue {
  theme: ThemeDefinition;
  themeId: ThemeId;
  setTheme: (id: ThemeId) => void;
  allThemes: ThemeDefinition[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "autentizity-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>("editorial");

  /* Restore from localStorage on mount */
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    if (stored && themes.some((t) => t.id === stored)) {
      setThemeId(stored);
    }
  }, []);

  /* Apply CSS vars + body class whenever theme changes */
  useEffect(() => {
    const theme = getThemeById(themeId);
    const root = document.documentElement;

    // Set CSS custom properties
    Object.entries(theme.vars).forEach(([prop, value]) => {
      root.style.setProperty(prop, value);
    });

    // Set body class
    document.body.classList.remove(...themes.map((t) => t.bodyClass));
    document.body.classList.add(theme.bodyClass);

    // Persist
    localStorage.setItem(STORAGE_KEY, themeId);
  }, [themeId]);

  const setTheme = useCallback((id: ThemeId) => {
    setThemeId(id);
  }, []);

  const theme = getThemeById(themeId);

  return (
    <ThemeContext.Provider value={{ theme, themeId, setTheme, allThemes: themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
