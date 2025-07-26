import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Language {
  code: string;
  name: string;
  native: string;
}

export const LANGUAGES: Language[] = [
  { code: "EN", name: "English", native: "English" },
  { code: "HI", name: "Hindi", native: "हिंदी" },
  { code: "MR", name: "Marathi", native: "मराठी" },
  { code: "KN", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "TA", name: "Tamil", native: "தமிழ்" },
  { code: "BN", name: "Bengali", native: "বাংলা" },
  { code: "TE", name: "Telugu", native: "తెలుగు" },
];

interface PageTranslations {
  [pathname: string]: {
    [originalText: string]: string;
  };
}

interface LanguageTranslations {
  [languageCode: string]: PageTranslations;
}

interface LanguageStore {
  currentLanguage: Language;
  isTranslating: boolean;
  translations: LanguageTranslations;

  setLanguage: (language: Language) => void;
  translateText: (text: string, pathname?: string) => Promise<string>;
  getTranslation: (text: string, pathname?: string) => string;
  getPageTranslations: (pathname: string) => Record<string, string> | null;
  setPageTranslations: (
    pathname: string,
    translations: Record<string, string>
  ) => void;
  clearTranslations: () => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      currentLanguage: LANGUAGES[0], // Default to English
      isTranslating: false,
      translations: {},

      setLanguage: (language: Language) => {
        console.log(
          `Setting language to: ${language.native} (${language.code})`
        );
        set({ currentLanguage: language });
      },

      translateText: async (text: string, pathname = "/") => {
        const { currentLanguage, translations } = get();

        if (currentLanguage.code === "EN") {
          return text;
        }

        // Check if we have this translation cached for this page
        const pageTranslations = translations[currentLanguage.code]?.[pathname];
        if (pageTranslations && pageTranslations[text]) {
          console.log(
            `Using cached translation for: ${text.substring(0, 50)}...`
          );
          return pageTranslations[text];
        }

        // Check global cache (any page)
        const globalCache = translations[currentLanguage.code];
        if (globalCache) {
          for (const pagePath in globalCache) {
            if (globalCache[pagePath][text]) {
              console.log(
                `Using global cached translation for: ${text.substring(
                  0,
                  50
                )}...`
              );
              return globalCache[pagePath][text];
            }
          }
        }

        set({ isTranslating: true });

        try {
          console.log(
            `Translating: ${text.substring(0, 50)}... to ${
              currentLanguage.native
            }`
          );

          const response = await fetch("/api/translate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text,
              targetLang: currentLanguage.code,
            }),
          });

          if (!response.ok) {
            throw new Error(`Translation failed: ${response.status}`);
          }

          const data = await response.json();
          const translatedText = data.translated || text;

          // Store in page-specific cache
          set((state) => ({
            translations: {
              ...state.translations,
              [currentLanguage.code]: {
                ...state.translations[currentLanguage.code],
                [pathname]: {
                  ...state.translations[currentLanguage.code]?.[pathname],
                  [text]: translatedText,
                },
              },
            },
          }));

          return translatedText;
        } catch (error) {
          console.error("Translation error:", error);
          return text;
        } finally {
          set({ isTranslating: false });
        }
      },

      getTranslation: (text: string, pathname = "/") => {
        const { currentLanguage, translations } = get();

        if (currentLanguage.code === "EN") {
          return text;
        }

        // Check page-specific cache first
        const pageTranslations = translations[currentLanguage.code]?.[pathname];
        if (pageTranslations && pageTranslations[text]) {
          return pageTranslations[text];
        }

        // Check global cache
        const globalCache = translations[currentLanguage.code];
        if (globalCache) {
          for (const pagePath in globalCache) {
            if (globalCache[pagePath][text]) {
              return globalCache[pagePath][text];
            }
          }
        }

        return text;
      },

      getPageTranslations: (pathname: string) => {
        const { currentLanguage, translations } = get();
        return translations[currentLanguage.code]?.[pathname] || null;
      },

      setPageTranslations: (
        pathname: string,
        pageTranslations: Record<string, string>
      ) => {
        const { currentLanguage } = get();

        set((state) => ({
          translations: {
            ...state.translations,
            [currentLanguage.code]: {
              ...state.translations[currentLanguage.code],
              [pathname]: {
                ...state.translations[currentLanguage.code]?.[pathname],
                ...pageTranslations,
              },
            },
          },
        }));
      },

      clearTranslations: () => {
        set({ translations: {} });
      },
    }),
    {
      name: "language-store",
      storage: createJSONStorage(() => {
        // SSR-safe storage
        if (typeof window !== "undefined") {
          return localStorage;
        }
        // Fallback for SSR
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({
        currentLanguage: state.currentLanguage,
        translations: state.translations,
      }),
    }
  )
);
