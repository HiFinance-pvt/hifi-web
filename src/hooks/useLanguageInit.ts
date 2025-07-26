"use client";
import { useEffect } from "react";
import { useLanguageStore } from "@/stores/languageStore";
import { usePathname } from "next/navigation";

export function useLanguageInit() {
  const {
    currentLanguage,
    translateText,
    getPageTranslations,
    setPageTranslations,
  } = useLanguageStore();
  const pathname = usePathname();

  // Auto-translate entire page (including sidebar, layout, everything!)
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    if (currentLanguage.code !== "EN") {
      console.log(
        `Auto-translating page: ${pathname} to ${currentLanguage.native}`
      );

      // Check if we already have translations for this page
      const existingTranslations = getPageTranslations(pathname);

      const timer = setTimeout(async () => {
        // If we have cached translations for this page, apply them immediately
        if (
          existingTranslations &&
          Object.keys(existingTranslations).length > 0
        ) {
          console.log(
            `Found ${
              Object.keys(existingTranslations).length
            } cached translations for ${pathname}`
          );

          // Apply cached translations instantly
          Object.entries(existingTranslations).forEach(
            ([originalText, translatedText]) => {
              const walker = document.createTreeWalker(
                document.documentElement, // Start from HTML root to include everything!
                NodeFilter.SHOW_TEXT,
                {
                  acceptNode: (node) => {
                    const text = node.textContent?.trim();
                    return text === originalText
                      ? NodeFilter.FILTER_ACCEPT
                      : NodeFilter.FILTER_REJECT;
                  },
                }
              );

              let textNode;
              while ((textNode = walker.nextNode())) {
                if (textNode.textContent?.trim() === originalText) {
                  textNode.textContent = translatedText;
                  textNode.parentElement?.setAttribute(
                    "data-translated",
                    "true"
                  );
                  // Store original text for reverting to English
                  textNode.parentElement?.setAttribute(
                    "data-original-text",
                    originalText
                  );
                }
              }
            }
          );

          console.log("Applied cached translations instantly!");
          return; // Don't make API calls if we have cached translations
        }

        // Find ALL text nodes in the ENTIRE document (sidebar, nav, content, everything!)
        const walker = document.createTreeWalker(
          document.documentElement, // Start from HTML root to translate EVERYTHING
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: (node) => {
              const parent = node.parentElement;
              if (!parent) return NodeFilter.FILTER_REJECT;

              // Skip script, style, and other non-visible elements
              const tagName = parent.tagName.toLowerCase();
              if (
                [
                  "script",
                  "style",
                  "meta",
                  "link",
                  "title",
                  "noscript",
                ].includes(tagName)
              ) {
                return NodeFilter.FILTER_REJECT;
              }

              // Skip if text is just whitespace or very short
              const text = node.textContent?.trim() || "";
              if (text.length < 2) return NodeFilter.FILTER_REJECT;

              // Skip if already translated
              if (parent.hasAttribute("data-translated"))
                return NodeFilter.FILTER_REJECT;

              // Skip if it's just numbers or symbols
              if (
                /^[\d\s\-\.\,\(\)\[\]\/\\\|\+\=\*\&\%\$\#\@\!\?]+$/.test(text)
              ) {
                return NodeFilter.FILTER_REJECT;
              }

              return NodeFilter.FILTER_ACCEPT;
            },
          }
        );

        // Collect all text nodes to translate
        const textsToTranslate: string[] = [];
        const textNodes: Text[] = [];

        let textNode;
        while ((textNode = walker.nextNode()) as Text) {
          const text = textNode.textContent?.trim();
          if (text && text.length >= 2) {
            textsToTranslate.push(text);
            textNodes.push(textNode);
          }
        }

        console.log(
          `Found ${textsToTranslate.length} translatable elements on page: ${pathname}`
        );

        if (textsToTranslate.length === 0) return;

        // Process translations in smaller batches for better performance
        const batchSize = 10;
        const newTranslations: Record<string, string> = {};

        for (let i = 0; i < textsToTranslate.length; i += batchSize) {
          const batch = textsToTranslate.slice(i, i + batchSize);
          console.log(
            `Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
              textsToTranslate.length / batchSize
            )}`
          );

          // Process each text in the batch
          const batchPromises = batch.map(async (text, batchIndex) => {
            const actualIndex = i + batchIndex;
            try {
              const translated = await translateText(text, pathname);

              // Apply translation to DOM immediately
              const node = textNodes[actualIndex];
              if (node && node.textContent?.trim() === text) {
                node.textContent = translated;
                node.parentElement?.setAttribute("data-translated", "true");
                // Store original text for reverting to English
                node.parentElement?.setAttribute("data-original-text", text);
              }

              // Store for page cache
              newTranslations[text] = translated;
            } catch (error) {
              console.error(`Failed to translate: ${text}`, error);
            }
          });

          await Promise.allSettled(batchPromises);

          // Small delay between batches to prevent overwhelming the API
          if (i + batchSize < textsToTranslate.length) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        }

        // Store all new translations for this page
        if (Object.keys(newTranslations).length > 0) {
          setPageTranslations(pathname, newTranslations);
          console.log(
            `Stored ${
              Object.keys(newTranslations).length
            } translations for page: ${pathname}`
          );
        }

        // Dispatch custom event to trigger TranslatedText components
        window.dispatchEvent(new CustomEvent("language-change"));
      }, 500); // Small delay to ensure DOM is ready

      return () => clearTimeout(timer);
    } else {
      // Handle reverting to English
      if (typeof window !== "undefined" && typeof document !== "undefined") {
        const timer = setTimeout(() => {
          // Find all elements with data-translated and restore original text
          const translatedElements = document.querySelectorAll(
            "[data-translated='true'][data-original-text]"
          );

          translatedElements.forEach((element) => {
            const originalText = element.getAttribute("data-original-text");
            if (originalText) {
              // Find the text node within this element
              const walker = document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                null
              );

              let textNode;
              while ((textNode = walker.nextNode())) {
                if (textNode.textContent?.trim()) {
                  textNode.textContent = originalText;
                  break; // Only replace the first text node
                }
              }

              // Remove translation markers
              element.removeAttribute("data-translated");
              element.removeAttribute("data-original-text");
            }
          });

          console.log("Reverted page to English");

          // Dispatch custom event to trigger TranslatedText components
          window.dispatchEvent(new CustomEvent("language-change"));
        }, 200);

        return () => clearTimeout(timer);
      }
    }
  }, [
    pathname,
    currentLanguage.code,
    translateText,
    getPageTranslations,
    setPageTranslations,
  ]);
}
