import React, { useState } from "react";

// Minimal SVG Icons
const CloseIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const TargetIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const TrendingUpIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path d="M22 7l-8.5 8.5-5-5L2 17M22 7h-6m6 0v6" />
  </svg>
);
import { DebtIntensity } from "@/stores/debtSquasherStore";

interface DebtPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (preferences: {
    duration_months: number;
    intensity: DebtIntensity;
  }) => void;
  isLoading?: boolean;
}

const INTENSITY_OPTIONS: Array<{
  value: DebtIntensity;
  label: string;
  description: string;
  color: string;
}> = [
  {
    value: "mild",
    label: "Mild",
    description: "Conservative approach with smaller payments",
    color: "text-green-400 border-green-400/50",
  },
  {
    value: "balance",
    label: "Balance",
    description: "Balanced approach between comfort and speed",
    color: "text-orange-400 border-orange-400/50",
  },
  {
    value: "aggressive",
    label: "Aggressive",
    description: "Maximum payments to clear debt quickly",
    color: "text-red-400 border-red-400/50",
  },
];

export default function DebtPreferencesModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: DebtPreferencesModalProps) {
  const [duration, setDuration] = useState<number>(24);
  const [intensity, setIntensity] = useState<DebtIntensity>("balance");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (duration < 6 || duration > 120) {
      alert("Duration must be between 6 and 120 months");
      return;
    }

    onSubmit({
      duration_months: duration,
      intensity,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#109CA3]/20 rounded-full flex items-center justify-center">
              <TargetIcon className="w-5 h-5 text-[var(--brand-primary)]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Debt Analysis Preferences
              </h2>
              <p className="text-sm text-gray-400">
                Set your debt reduction goals
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
            disabled={isLoading}
          >
            <CloseIcon className="w-4 h-4 text-[var(--foreground-muted)]" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Duration Input */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              Target Duration (months)
            </label>
            <div className="relative">
              <input
                type="number"
                min="6"
                max="120"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 24)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#109CA3] focus:border-transparent"
                placeholder="24"
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                months
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Choose between 6-120 months for your debt payoff goal
            </p>
          </div>

          {/* Intensity Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              Payment Intensity
            </label>
            <div className="grid gap-3">
              {INTENSITY_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-800/50 ${
                    intensity === option.value
                      ? `${option.color} bg-gray-800/30`
                      : "border-gray-600 bg-gray-800/20"
                  }`}
                >
                  <input
                    type="radio"
                    name="intensity"
                    value={option.value}
                    checked={intensity === option.value}
                    onChange={(e) =>
                      setIntensity(e.target.value as DebtIntensity)
                    }
                    className="sr-only"
                  />

                  <div className="flex items-center space-x-3 flex-1">
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        intensity === option.value
                          ? option.color
                          : "border-gray-600"
                      }`}
                    >
                      <TrendingUpIcon
                        className={`w-4 h-4 ${
                          intensity === option.value ? "" : "text-[var(--foreground-subtle)]"
                        }`}
                      />
                    </div>

                    <div className="flex-1">
                      <div
                        className={`font-medium ${
                          intensity === option.value ? "" : "text-gray-300"
                        }`}
                      >
                        {option.label}
                      </div>
                      <div className="text-sm text-gray-400">
                        {option.description}
                      </div>
                    </div>
                  </div>

                  {intensity === option.value && (
                    <div
                      className={`w-3 h-3 rounded-full ${option.color
                        .replace("text-", "bg-")
                        .replace("border-", "bg-")}`}
                    />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 text-white bg-[#109CA3] hover:bg-[#109CA3]/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </div>
              ) : (
                "Start Analysis"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
