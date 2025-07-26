"use client";
import React, { useState, useEffect } from "react";
import { useLanguageStore } from "@/stores/languageStore";

interface TranslatedTextProps {
  children: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export function TranslatedText({
  children,
  as = "span",
  className,
}: TranslatedTextProps) {
  const { currentLanguage, getTranslation, translateText } = useLanguageStore();
  const [displayText, setDisplayText] = useState(children);
  const [isClient, setIsClient] = useState(false);

  // Ensure client-side only rendering for translations
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run translation logic on client side
    if (!isClient) return;

    if (currentLanguage.code === "EN") {
      setDisplayText(children);
      return;
    }

    // Check cache first
    const cached = getTranslation(children);
    if (cached !== children) {
      setDisplayText(cached);
      return;
    }

    // Translate if not cached
    translateText(children)
      .then((translated) => setDisplayText(translated))
      .catch(() => setDisplayText(children));
  }, [children, currentLanguage.code, getTranslation, translateText, isClient]);

  const Component = as;
  return <Component className={className}>{displayText}</Component>;
}
