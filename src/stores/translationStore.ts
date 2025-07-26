import { create } from "zustand";
import { persist } from "zustand/middleware";

type TranslationStore = {
  translations: Record<string, Record<string, string>>;
  addTranslation: (lang: string, original: string, translated: string) => void;
  getTranslation: (lang: string, text: string) => string | null;
  clearTranslations: () => void;
};

export const useTranslationStore = create<TranslationStore>()(
  persist(
    (set, get) => ({
      translations: {},
      addTranslation: (lang, original, translated) => {
        set((state) => ({
          translations: {
            ...state.translations,
            [lang]: {
              ...state.translations[lang],
              [original]: translated,
            },
          },
        }));
      },
      getTranslation: (lang, text) => {
        const langTranslations = get().translations[lang];
        return langTranslations ? langTranslations[text] || null : null;
      },
      clearTranslations: () => set({ translations: {} }),
    }),
    {
      name: "hifi-translations",
    }
  )
);
