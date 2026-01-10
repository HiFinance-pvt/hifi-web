"use client";

import React, { useState, useEffect } from "react";
import {
  Target,
  Clock,
  TrendingDown,
  IndianRupee,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Calendar,
  PiggyBank,
  CreditCard,
  Scissors,
  Building,
  MessageCircle,
  Shield,
} from "lucide-react";

// Types for the debt strategy response
export interface DebtRecommendedAction {
  type:
  | "debt_prioritization"
  | "debt_payment_strategy"
  | "expense_cutting"
  | "debt_consolidation"
  | "advisory";
  description: string;
}

export interface DebtStrategyData {
  total_debt: string;
  target_duration_months: number;
  intensity: "mild" | "balanced" | "aggressive";
  monthly_payment_goal: string;
  strategy_summary: string;
  recommended_actions: DebtRecommendedAction[];
  estimated_interest_saved: string;
  debt_free_by: string;
  warning_flags: string[];
}

// Icon mapping for action types
const getActionIcon = (type: string) => {
  switch (type) {
    case "debt_prioritization":
      return CreditCard;
    case "debt_payment_strategy":
      return TrendingDown;
    case "expense_cutting":
      return Scissors;
    case "debt_consolidation":
      return Building;
    case "advisory":
      return MessageCircle;
    default:
      return Target;
  }
};

// Color mapping for action types
const getActionColors = (type: string) => {
  switch (type) {
    case "debt_prioritization":
      return {
        bg: "bg-rose-500/10",
        border: "border-rose-500/30",
        icon: "text-rose-400",
        badge: "bg-rose-500/20 text-rose-400",
      };
    case "debt_payment_strategy":
      return {
        bg: "bg-blue-500/10",
        border: "border-blue-500/30",
        icon: "text-blue-400",
        badge: "bg-blue-500/20 text-blue-400",
      };
    case "expense_cutting":
      return {
        bg: "bg-amber-500/10",
        border: "border-amber-500/30",
        icon: "text-amber-400",
        badge: "bg-amber-500/20 text-amber-400",
      };
    case "debt_consolidation":
      return {
        bg: "bg-purple-500/10",
        border: "border-purple-500/30",
        icon: "text-purple-400",
        badge: "bg-purple-500/20 text-purple-400",
      };
    case "advisory":
      return {
        bg: "bg-teal-500/10",
        border: "border-teal-500/30",
        icon: "text-teal-400",
        badge: "bg-teal-500/20 text-teal-400",
      };
    default:
      return {
        bg: "bg-gray-500/10",
        border: "border-gray-500/30",
        icon: "text-gray-400",
        badge: "bg-gray-500/20 text-gray-400",
      };
  }
};

// Format action type to readable label
const formatActionType = (type: string) => {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Individual Action Step Component
const ActionStep: React.FC<{
  action: DebtRecommendedAction;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  onToggle: () => void;
}> = ({ action, index, isActive, isCompleted, onToggle }) => {
  const Icon = getActionIcon(action.type);
  const colors = getActionColors(action.type);

  return (
    <div
      className={`relative transition-all duration-500 ease-out ${isActive ? "scale-[1.02]" : "scale-100"
        }`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Connector line */}
      {index > 0 && (
        <div className="absolute -top-4 left-6 w-0.5 h-4 bg-gradient-to-b from-[var(--surface-border)] to-[var(--brand-primary)]/30" />
      )}

      <button
        onClick={onToggle}
        className={`w-full text-left rounded-2xl border transition-all duration-300 ${isActive
            ? `${colors.bg} ${colors.border} shadow-lg`
            : "bg-[var(--surface)] border-[var(--surface-border)] hover:border-[var(--brand-primary)]/40"
          }`}
      >
        <div className="p-4 sm:p-5">
          <div className="flex items-start gap-4">
            {/* Step number and icon */}
            <div className="flex-shrink-0">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${isActive
                    ? `${colors.bg} ${colors.border} border`
                    : "bg-[var(--surface-hover)]"
                  }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-[var(--success)]" />
                ) : (
                  <Icon
                    className={`w-6 h-6 ${isActive ? colors.icon : "text-[var(--foreground-muted)]"}`}
                  />
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-[var(--foreground-muted)]">
                    Step {index + 1}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors.badge}`}
                  >
                    {formatActionType(action.type)}
                  </span>
                </div>
                <div
                  className={`transition-transform duration-200 ${isActive ? "rotate-180" : ""}`}
                >
                  <ChevronDown className="w-4 h-4 text-[var(--foreground-muted)]" />
                </div>
              </div>

              <p
                className={`text-sm leading-relaxed transition-all duration-300 ${isActive
                    ? "text-[var(--foreground)]"
                    : "text-[var(--foreground-secondary)] line-clamp-2"
                  }`}
              >
                {action.description}
              </p>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

// Overview Metric Card
const MetricCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
  color?: string;
  delay?: number;
}> = ({ icon, label, value, subValue, color = "brand-primary", delay = 0 }) => (
  <div
    className="bg-[var(--surface)] border border-[var(--surface-border)] rounded-xl p-4 
               hover:border-[var(--brand-primary)]/40 transition-all duration-300 
               hover:shadow-lg hover:shadow-[var(--brand-primary)]/5 animate-fade-in"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-start gap-3">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${color}/10`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[var(--foreground-muted)] mb-1">{label}</p>
        <p className="text-lg font-semibold text-[var(--foreground)] truncate">
          {value}
        </p>
        {subValue && (
          <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
            {subValue}
          </p>
        )}
      </div>
    </div>
  </div>
);

// Warning Flag Component
const WarningFlag: React.FC<{ message: string; index: number }> = ({
  message,
  index,
}) => (
  <div
    className="flex items-start gap-3 p-3 bg-[var(--warning-bg)] border border-[var(--warning)]/20 
               rounded-xl animate-fade-in"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <AlertTriangle className="w-4 h-4 text-[var(--warning)] flex-shrink-0 mt-0.5" />
    <p className="text-sm text-[var(--foreground-secondary)]">{message}</p>
  </div>
);

// Main Debt Strategy Display Component
export const DebtStrategyDisplay: React.FC<{ data: DebtStrategyData }> = ({
  data,
}) => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showAllWarnings, setShowAllWarnings] = useState(false);

  // Parse the debt free date
  const debtFreeDate = new Date(data.debt_free_by);
  const formattedDate = debtFreeDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Calculate days until debt free
  const daysUntilDebtFree = Math.ceil(
    (debtFreeDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  // Get intensity color
  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "mild":
        return "text-green-400 bg-green-500/10 border-green-500/30";
      case "balanced":
        return "text-blue-400 bg-blue-500/10 border-blue-500/30";
      case "aggressive":
        return "text-orange-400 bg-orange-500/10 border-orange-500/30";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/30";
    }
  };

  const toggleStep = (index: number) => {
    if (activeStep === index) {
      setActiveStep(null);
    } else {
      setActiveStep(index);
    }
  };

  const markStepComplete = (index: number) => {
    setCompletedSteps((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-[var(--surface)] to-[var(--background)] border border-[var(--surface-border)] rounded-2xl p-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--brand-primary)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/30 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[var(--brand-primary)]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)]">
                Your Debt Freedom Strategy
              </h2>
              <p className="text-sm text-[var(--foreground-muted)]">
                Personalized plan to eliminate {data.total_debt} in{" "}
                {data.target_duration_months} months
              </p>
            </div>
          </div>

          {/* Intensity Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getIntensityColor(data.intensity)}`}
            >
              {data.intensity.charAt(0).toUpperCase() + data.intensity.slice(1)}{" "}
              Approach
            </span>
          </div>

          {/* Strategy Summary */}
          <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed">
            {data.strategy_summary}
          </p>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          icon={<IndianRupee className="w-5 h-5 text-[var(--brand-primary)]" />}
          label="Total Debt"
          value={data.total_debt}
          delay={0}
        />
        <MetricCard
          icon={<Target className="w-5 h-5 text-blue-400" />}
          label="Monthly Payment"
          value={data.monthly_payment_goal}
          delay={100}
        />
        <MetricCard
          icon={<PiggyBank className="w-5 h-5 text-green-400" />}
          label="Interest Saved"
          value={data.estimated_interest_saved}
          delay={200}
        />
        <MetricCard
          icon={<Calendar className="w-5 h-5 text-purple-400" />}
          label="Debt Free By"
          value={formattedDate}
          subValue={`${daysUntilDebtFree} days to go`}
          delay={300}
        />
      </div>

      {/* Progress Tracker */}
      <div className="bg-[var(--surface)] border border-[var(--surface-border)] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-[var(--foreground)]">
            Your Progress
          </span>
          <span className="text-sm text-[var(--foreground-muted)]">
            {completedSteps.size} of {data.recommended_actions.length} steps
            completed
          </span>
        </div>
        <div className="h-2 bg-[var(--background)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-hover)] rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${(completedSteps.size / data.recommended_actions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Action Steps */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            Recommended Actions
          </h3>
          <span className="text-xs text-[var(--foreground-muted)]">
            Click each step for details
          </span>
        </div>

        <div className="space-y-3">
          {data.recommended_actions.map((action, index) => (
            <div key={index} className="relative">
              <ActionStep
                action={action}
                index={index}
                isActive={activeStep === index}
                isCompleted={completedSteps.has(index)}
                onToggle={() => toggleStep(index)}
              />

              {/* Mark complete button */}
              {activeStep === index && (
                <div
                  className="mt-2 ml-16 animate-fade-in"
                  style={{ animationDuration: "200ms" }}
                >
                  <button
                    onClick={() => markStepComplete(index)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${completedSteps.has(index)
                        ? "bg-[var(--success-bg)] text-[var(--success)] border border-[var(--success)]/20"
                        : "bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20 hover:bg-[var(--brand-primary)]/20"
                      }`}
                  >
                    {completedSteps.has(index) ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" />
                        Mark as Complete
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Warning Flags */}
      {data.warning_flags && data.warning_flags.length > 0 && (
        <div className="space-y-3">
          <button
            onClick={() => setShowAllWarnings(!showAllWarnings)}
            className="flex items-center gap-2 text-sm font-medium text-[var(--warning)]"
          >
            <AlertTriangle className="w-4 h-4" />
            Important Reminders ({data.warning_flags.length})
            {showAllWarnings ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showAllWarnings && (
            <div className="space-y-2 animate-fade-in">
              {data.warning_flags.map((warning, index) => (
                <WarningFlag key={index} message={warning} index={index} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-[var(--brand-primary)]/10 to-[var(--brand-primary)]/5 border border-[var(--brand-primary)]/20 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="font-medium text-[var(--foreground)]">
              Ready to start your debt-free journey?
            </p>
            <p className="text-sm text-[var(--foreground-muted)]">
              Follow these steps consistently and become debt-free by{" "}
              {formattedDate}
            </p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[var(--brand-primary)] text-white rounded-xl font-medium hover:bg-[var(--brand-primary-hover)] transition-colors duration-200 whitespace-nowrap">
            Track Progress
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebtStrategyDisplay;
