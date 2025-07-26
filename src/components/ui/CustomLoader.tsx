"use client";
import React from "react";
import { useLanguageStore } from "@/stores/languageStore";

interface CustomLoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "session" | "message";
}

export const CustomLoader: React.FC<CustomLoaderProps> = ({
  message = "Loading...",
  size = "md",
  variant = "default",
}) => {
  const { currentLanguage } = useLanguageStore();
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "session":
        return {
          container:
            "flex flex-col items-center justify-center p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50",
          spinner: "text-teal-400",
          message: "text-gray-300 text-sm font-medium",
        };
      case "message":
        return {
          container:
            "flex items-center space-x-3 p-4 bg-gray-700/80 rounded-lg",
          spinner: "text-emerald-400",
          message: "text-gray-200 text-sm",
        };
      default:
        return {
          container: "flex flex-col items-center justify-center",
          spinner: "text-blue-400",
          message: "text-gray-400 text-sm",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={styles.container}>
      <div className="relative">
        {/* Main spinner */}
        <div
          className={`${sizeClasses[size]} border-2 border-gray-600 rounded-full animate-spin`}
        >
          <div
            className={`absolute inset-0 border-2 border-transparent border-t-current rounded-full ${styles.spinner}`}
          ></div>
        </div>

        {/* Inner pulse effect for session variant */}
        {variant === "session" && (
          <div className="absolute inset-0 animate-ping">
            <div
              className={`${sizeClasses[size]} border-2 border-teal-400/30 rounded-full`}
            ></div>
          </div>
        )}
      </div>

      {message && <p className={`mt-3 ${styles.message}`}>{message}</p>}

      {/* Additional visual elements for session variant */}
      {variant === "session" && (
        <div className="mt-4 flex space-x-1">
          <div
            className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      )}
    </div>
  );
};

// Specialized session creation loader
export const SessionCreationLoader: React.FC = () => {
  const { currentLanguage } = useLanguageStore();
  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800/95 border border-gray-700 rounded-2xl p-8 shadow-2xl">
        <CustomLoader
          message="Creating new chat session..."
          size="lg"
          variant="session"
        />
      </div>
    </div>
  );
};

// Inline message loader
export const MessageLoader: React.FC = () => {
  const { currentLanguage } = useLanguageStore();
  return (
    <CustomLoader message="Sending message..." size="sm" variant="message" />
  );
};
