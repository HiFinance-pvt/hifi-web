"use client";
import React, { useState } from "react";
import { Globe } from "lucide-react";
import { useLanguageStore, LANGUAGES, Language } from "@/stores/languageStore";

export function LanguageSelector() {
  const [showDropdown, setShowDropdown] = useState(false);
  const { currentLanguage, isTranslating, setLanguage } = useLanguageStore();

  const handleLanguageChange = (language: Language) => {
    try {
      setShowDropdown(false);
      setLanguage(language);
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-1 px-2 py-1.5 sm:px-3 sm:py-2 bg-gray-900/80 border border-gray-700/50 rounded-lg backdrop-blur-sm hover:bg-gray-800/80 transition-all duration-200"
        disabled={isTranslating}
      >
        <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300" />
        <span
          className="text-xs sm:text-sm text-gray-300"
          data-translate="true"
        >
          {currentLanguage.code}
        </span>
        <span
          className="text-xs sm:text-sm text-gray-400 ml-1"
          data-translate="true"
        >
          {currentLanguage.native}
        </span>
        {isTranslating && (
          <span className="ml-1 w-3 h-3 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
        )}
      </button>

      {showDropdown && (
        <div className="absolute top-full mt-2 right-0 w-52 max-h-[280px] overflow-y-auto bg-gray-900/95 border border-gray-700/50 rounded-lg backdrop-blur-sm shadow-xl transition-all duration-300 hide-scrollbar z-50">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang)}
              disabled={isTranslating}
              className={`w-full px-3 py-2 text-left hover:bg-gray-800/50 transition-colors ${
                currentLanguage.code === lang.code
                  ? "bg-gray-800/50 text-green-400"
                  : "text-gray-300"
              } ${isTranslating ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{lang.name}</div>
                  <div className="text-xs text-gray-400">{lang.native}</div>
                </div>
                <span className="text-xs text-gray-500">{lang.code}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
