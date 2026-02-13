"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  TaxMitraResponse,
  TaxMitraResponseData,
  QuestionOption,
  TaxCalculationSummary,
  DeductionBreakdown,
  OptimizationSuggestion,
  RegimeComparison,
  ITRSubmissionResult,
  RefundTrackingResult,
  isQuestionOptions,
  hasTaxCalculationSummary,
  hasRegimeComparison,
  hasITRSubmission,
  hasRefundTracking,
  formatINR,
} from "@/types/tax-mitra";

// ─── Minimal SVG Icons ───────────────────────────────────────────────
const SendIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path d="M19 9l-7 7-7-7" />
  </svg>
);

const ReceiptIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path d="M9 14l6-6M9 8h.01M15 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const RefundIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const CompareIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
  </svg>
);

const LightbulbIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

// ─── Props ────────────────────────────────────────────────────────────
interface TaxMitraMessageProps {
  response: TaxMitraResponse;
  isInteractive?: boolean;
  onAnswerSubmit?: (answers: Record<string, any>) => void;
}

// ─── Question Renderer ────────────────────────────────────────────────
const QuestionRenderer = ({
  questions,
  onSubmit,
}: {
  questions: QuestionOption[];
  onSubmit: (answers: Record<string, any>) => void;
}) => {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (key: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    onSubmit(answers);
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-3 p-4 bg-[var(--success-bg)] border border-[var(--success)]/20 rounded-2xl animate-fade-in">
        <CheckCircleIcon />
        <span className="text-sm font-medium text-[var(--success)]">Answers submitted successfully</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {questions.map((q, idx) => (
        <div
          key={idx}
          className="bg-[var(--surface)] border border-[var(--surface-border)] rounded-xl p-4
                     hover:border-[var(--brand-primary)]/30 transition-all duration-200"
        >
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
            {q.title}
            {q.required && <span className="text-[var(--error)] ml-1">*</span>}
          </label>

          {q.description && (
            <p className="text-xs text-[var(--foreground-muted)] mb-3 leading-relaxed">{q.description}</p>
          )}

          {q.type === "select" || q.type === "multiselect" ? (
            <select
              className="w-full bg-[var(--background)] border border-[var(--surface-border)] rounded-xl
                         px-3 py-2.5 text-sm text-[var(--foreground)]
                         focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40 focus:border-[var(--brand-primary)]/60
                         transition-all duration-200 appearance-none cursor-pointer"
              onChange={(e) => handleChange(q.title, e.target.value)}
              required={q.required}
              defaultValue=""
            >
              <option value="" disabled>
                Select an option
              </option>
              {q.options?.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={q.type as string}
              className="w-full bg-[var(--background)] border border-[var(--surface-border)] rounded-xl
                         px-3 py-2.5 text-sm text-[var(--foreground)] placeholder-[var(--foreground-muted)]
                         focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40 focus:border-[var(--brand-primary)]/60
                         transition-all duration-200"
              placeholder={q.placeholder}
              onChange={(e) => handleChange(q.title, e.target.value)}
              required={q.required}
              min={q.min}
              max={q.max}
            />
          )}

          {q.error && (
            <p className="text-xs text-[var(--error)] mt-1.5 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M12 9v4m0 4h.01M12 3l9 16H3L12 3z" />
              </svg>
              {q.error}
            </p>
          )}
        </div>
      ))}

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2
                   bg-[var(--brand-primary)] text-white font-medium py-3 px-4 rounded-xl
                   hover:bg-[var(--brand-primary-hover)] active:scale-[0.98]
                   transition-all duration-200 shadow-lg shadow-[var(--brand-primary)]/20"
      >
        <SendIcon />
        Submit Answers
      </button>
    </form>
  );
};

// ─── Tax Calculation Summary ──────────────────────────────────────────
const TaxSummaryRenderer = ({ summary, deductions, taxBreakdown }: {
  summary: TaxCalculationSummary;
  deductions?: DeductionBreakdown;
  taxBreakdown?: Record<string, number | undefined>;
}) => {
  const [isDeductionsExpanded, setIsDeductionsExpanded] = useState(false);
  const [isTaxSlabsExpanded, setIsTaxSlabsExpanded] = useState(false);

  return (
    <div className="bg-[var(--surface)] border border-[var(--surface-border)] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--brand-primary)]/10 to-transparent p-5 border-b border-[var(--surface-border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/30 flex items-center justify-center">
            <ReceiptIcon />
          </div>
          <div>
            <h4 className="text-base font-semibold text-[var(--foreground)]">Tax Calculation Summary</h4>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-px bg-[var(--surface-border)]">
        <div className="bg-[var(--surface)] p-4">
          <p className="text-xs text-[var(--foreground-muted)] mb-1">Gross Income</p>
          <p className="text-lg font-semibold text-[var(--foreground)]">{formatINR(summary.gross_income)}</p>
        </div>
        <div className="bg-[var(--surface)] p-4">
          <p className="text-xs text-[var(--foreground-muted)] mb-1">Total Deductions</p>
          <p className="text-lg font-semibold text-[var(--success)]">{formatINR(summary.total_deductions)}</p>
        </div>
        <div className="bg-[var(--surface)] p-4">
          <p className="text-xs text-[var(--foreground-muted)] mb-1">Taxable Income</p>
          <p className="text-lg font-semibold text-[var(--foreground)]">{formatINR(summary.taxable_income)}</p>
        </div>
        <div className="bg-[var(--surface)] p-4">
          <p className="text-xs text-[var(--foreground-muted)] mb-1">Total Tax</p>
          <p className="text-lg font-bold text-[var(--brand-primary)]">{formatINR(summary.total_tax)}</p>
        </div>
        {summary.tds_paid !== undefined && (
          <div className="bg-[var(--surface)] p-4">
            <p className="text-xs text-[var(--foreground-muted)] mb-1">TDS Paid</p>
            <p className="text-lg font-semibold text-[var(--foreground)]">{formatINR(summary.tds_paid)}</p>
          </div>
        )}
        {summary.refund_amount !== undefined && summary.refund_amount > 0 && (
          <div className="bg-[var(--surface)] p-4">
            <p className="text-xs text-[var(--foreground-muted)] mb-1">Refund</p>
            <p className="text-lg font-bold text-[var(--success)]">{formatINR(summary.refund_amount)}</p>
          </div>
        )}
        {summary.tax_payable !== undefined && summary.tax_payable > 0 && (
          <div className="bg-[var(--surface)] p-4">
            <p className="text-xs text-[var(--foreground-muted)] mb-1">Tax Payable</p>
            <p className="text-lg font-bold text-[var(--error)]">{formatINR(summary.tax_payable)}</p>
          </div>
        )}
      </div>

      {/* Deduction Breakdown Toggle */}
      {deductions && Object.keys(deductions).length > 0 && (
        <>
          <button
            onClick={() => setIsDeductionsExpanded(!isDeductionsExpanded)}
            className="w-full flex items-center justify-between p-4 text-sm font-medium text-[var(--foreground-muted)]
                       hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-all duration-200
                       border-t border-[var(--surface-border)]"
          >
            <span>Deduction Breakdown</span>
            <ChevronIcon isOpen={isDeductionsExpanded} />
          </button>

          {isDeductionsExpanded && (
            <div className="px-4 pb-4 space-y-2 animate-fade-in">
              {Object.entries(deductions)
                .filter(([, value]) => value !== undefined && value > 0)
                .map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-2 border-b border-[var(--surface-border)] last:border-0">
                    <span className="text-sm text-[var(--foreground-secondary)] capitalize">{key.replace(/_/g, " ")}</span>
                    <span className="text-sm font-medium text-[var(--foreground)]">{formatINR(value as number)}</span>
                  </div>
                ))}
            </div>
          )}
        </>
      )}

      {/* Tax Slab Breakdown Toggle */}
      {taxBreakdown && Object.keys(taxBreakdown).length > 0 && (
        <>
          <button
            onClick={() => setIsTaxSlabsExpanded(!isTaxSlabsExpanded)}
            className="w-full flex items-center justify-between p-4 text-sm font-medium text-[var(--foreground-muted)]
                       hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-all duration-200
                       border-t border-[var(--surface-border)]"
          >
            <span>Slab-wise Breakdown</span>
            <ChevronIcon isOpen={isTaxSlabsExpanded} />
          </button>

          {isTaxSlabsExpanded && (
            <div className="px-4 pb-4 space-y-2 animate-fade-in">
              {Object.entries(taxBreakdown)
                .filter(([, value]) => value !== undefined && value > 0)
                .map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-2 border-b border-[var(--surface-border)] last:border-0">
                    <span className="text-sm text-[var(--foreground-secondary)] capitalize">{key.replace(/_/g, " ")}</span>
                    <span className="text-sm font-medium text-[var(--foreground)]">{formatINR(value as number)}</span>
                  </div>
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ─── Regime Comparison ────────────────────────────────────────────────
const RegimeComparisonRenderer = ({ comparison }: { comparison: RegimeComparison }) => (
  <div className="bg-[var(--surface)] border border-[var(--surface-border)] rounded-2xl overflow-hidden">
    <div className="bg-gradient-to-r from-blue-500/10 to-transparent p-5 border-b border-[var(--surface-border)]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
          <CompareIcon />
        </div>
        <div>
          <h4 className="text-base font-semibold text-[var(--foreground)]">Regime Comparison</h4>
          {comparison.recommended && (
            <p className="text-xs text-[var(--foreground-muted)]">
              Recommended: <span className="text-[var(--brand-primary)] font-medium">{comparison.recommended === "old" ? "Old" : "New"} Regime</span>
            </p>
          )}
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-px bg-[var(--surface-border)]">
      <div className={`bg-[var(--surface)] p-4 ${comparison.recommended === "old" ? "ring-1 ring-inset ring-[var(--brand-primary)]/30" : ""}`}>
        <p className="text-xs text-[var(--foreground-muted)] mb-1">Old Regime Tax</p>
        <p className="text-lg font-semibold text-[var(--foreground)]">{formatINR(comparison.old_regime_tax)}</p>
        {comparison.savings_with_old !== undefined && comparison.savings_with_old > 0 && (
          <p className="text-xs text-[var(--success)] mt-1">Save {formatINR(comparison.savings_with_old)}</p>
        )}
      </div>
      <div className={`bg-[var(--surface)] p-4 ${comparison.recommended === "new" ? "ring-1 ring-inset ring-[var(--brand-primary)]/30" : ""}`}>
        <p className="text-xs text-[var(--foreground-muted)] mb-1">New Regime Tax</p>
        <p className="text-lg font-semibold text-[var(--foreground)]">{formatINR(comparison.new_regime_tax)}</p>
        {comparison.savings_with_new !== undefined && comparison.savings_with_new > 0 && (
          <p className="text-xs text-[var(--success)] mt-1">Save {formatINR(comparison.savings_with_new)}</p>
        )}
      </div>
    </div>
  </div>
);

// ─── Optimization Suggestions ─────────────────────────────────────────
const OptimizationSuggestionsRenderer = ({ suggestions }: { suggestions: OptimizationSuggestion[] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[var(--surface)] border border-[var(--surface-border)] rounded-2xl overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-sm font-medium text-[var(--foreground)]
                   hover:bg-[var(--surface-hover)] transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--warning)]/10 border border-[var(--warning)]/30 flex items-center justify-center text-[var(--warning)]">
            <LightbulbIcon />
          </div>
          <span>Tax Optimization Suggestions ({suggestions.length})</span>
        </div>
        <ChevronIcon isOpen={isExpanded} />
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 animate-fade-in border-t border-[var(--surface-border)] pt-3">
          {suggestions.map((suggestion, idx) => (
            <div key={idx} className="bg-[var(--background)] rounded-xl p-4 border border-[var(--surface-border)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[var(--foreground)]">{suggestion.type}</span>
                {suggestion.tax_saving > 0 && (
                  <span className="text-xs font-medium text-[var(--success)] bg-[var(--success)]/10 px-2 py-0.5 rounded-full">
                    Save {formatINR(suggestion.tax_saving)}
                  </span>
                )}
              </div>
              {suggestion.description && (
                <p className="text-xs text-[var(--foreground-muted)] mb-2">{suggestion.description}</p>
              )}
              <div className="flex gap-4 text-xs text-[var(--foreground-secondary)]">
                <span>Current: {formatINR(suggestion.current)}</span>
                <span>Limit: {formatINR(suggestion.max_limit)}</span>
                {suggestion.potential_additional > 0 && (
                  <span className="text-[var(--brand-primary)]">+{formatINR(suggestion.potential_additional)} available</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── ITR Submission Status ────────────────────────────────────────────
const ITRSubmissionRenderer = ({ data }: { data: ITRSubmissionResult }) => (
  <div className="bg-[var(--success-bg)] border border-[var(--success)]/20 rounded-2xl p-5">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl bg-[var(--success)]/10 border border-[var(--success)]/30 flex items-center justify-center text-[var(--success)]">
        <CheckCircleIcon />
      </div>
      <div>
        <h4 className="font-semibold text-[var(--success)]">ITR Submitted Successfully</h4>
        <p className="text-xs text-[var(--foreground-muted)]">{data.status}</p>
      </div>
    </div>

    <div className="space-y-3 bg-[var(--background)]/50 rounded-xl p-4">
      {[
        { label: "Acknowledgement No.", value: data.acknowledgement_number, mono: true },
        { label: "Form Type", value: data.itr_form_type },
        { label: "Submission Date", value: data.submission_date },
      ].map(({ label, value, mono }) => (
        <div key={label} className="flex justify-between items-center">
          <span className="text-sm text-[var(--foreground-muted)]">{label}</span>
          <span className={`text-sm font-medium text-[var(--foreground)] ${mono ? "font-mono" : ""}`}>{value}</span>
        </div>
      ))}
    </div>

    {data.message && (
      <p className="mt-4 text-sm text-[var(--foreground-secondary)] leading-relaxed">{data.message}</p>
    )}
  </div>
);

// ─── Refund Status ────────────────────────────────────────────────────
const RefundStatusRenderer = ({ data }: { data: RefundTrackingResult }) => {
  const isIssued = data.refund_status.toLowerCase().includes("issued") || data.refund_status.toLowerCase().includes("processed");

  return (
    <div className="bg-[var(--surface)] border border-[var(--surface-border)] rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
          <RefundIcon />
        </div>
        <div>
          <h4 className="font-semibold text-[var(--foreground)]">Refund Tracking</h4>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
            isIssued
              ? "bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20"
              : "bg-[var(--warning)]/10 text-[var(--warning)] border border-[var(--warning)]/20"
          }`}>
            {data.refund_status}
          </span>
        </div>
      </div>

      <div className="space-y-3 bg-[var(--background)]/50 rounded-xl p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-[var(--foreground-muted)]">Ack. Number</span>
          <span className="text-sm font-medium font-mono text-[var(--foreground)]">{data.acknowledgement_number}</span>
        </div>
        {data.refund_amount && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-[var(--foreground-muted)]">Refund Amount</span>
            <span className="text-sm font-semibold text-[var(--brand-primary)]">{formatINR(data.refund_amount)}</span>
          </div>
        )}
        {data.expected_date && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-[var(--foreground-muted)]">Expected Date</span>
            <span className="text-sm font-medium text-[var(--foreground)]">{data.expected_date}</span>
          </div>
        )}
      </div>

      {data.remarks && (
        <p className="mt-4 text-sm text-[var(--foreground-secondary)] leading-relaxed">{data.remarks}</p>
      )}
    </div>
  );
};

// ─── Progress Bar ─────────────────────────────────────────────────────
const ProgressBar = ({ current, total, stepName }: { current: number; total: number; stepName: string }) => {
  const pct = Math.round((current / total) * 100);

  return (
    <div className="bg-[var(--surface)] border border-[var(--surface-border)] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-[var(--foreground)]">{stepName}</span>
        <span className="text-xs text-[var(--foreground-muted)]">Step {current} of {total}</span>
      </div>
      <div className="h-2 bg-[var(--background)] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-hover)] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

// ─── Login Card (interactive login flow) ──────────────────────────────
const extractLoginUrl = (text: string): string | null => {
  // Match URLs that look like login/auth links
  const urlMatch = text.match(/https?:\/\/[^\s)]+/);
  return urlMatch ? urlMatch[0] : null;
};

const isLoginStep = (message: string, progress?: { step_name: string } | null): boolean => {
  const loginKeywords = ['log in', 'login', 'sign in', 'authenticate', 'authorization'];
  const msgLower = message.toLowerCase();
  const stepLower = progress?.step_name?.toLowerCase() || '';
  return loginKeywords.some(kw => msgLower.includes(kw) || stepLower.includes(kw));
};

const LoginCard = ({
  loginUrl,
  onConfirm,
  isInteractive,
}: {
  loginUrl: string;
  onConfirm: () => void;
  isInteractive: boolean;
}) => {
  const [confirmed, setConfirmed] = useState(false);
  const [opened, setOpened] = useState(false);

  const handleOpenLogin = () => {
    window.open(loginUrl, '_blank', 'noopener,noreferrer');
    setOpened(true);
  };

  const handleConfirm = () => {
    setConfirmed(true);
    onConfirm();
  };

  if (confirmed || !isInteractive) {
    return (
      <div className="flex items-center gap-3 p-4 bg-[var(--success-bg)] border border-[var(--success)]/20 rounded-2xl animate-fade-in">
        <CheckCircleIcon />
        <span className="text-sm font-medium text-[var(--success)]">Login confirmed</span>
      </div>
    );
  }

  return (
    <div className="bg-[var(--surface)] border border-[var(--surface-border)] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500/10 to-transparent p-5 border-b border-[var(--surface-border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
          </div>
          <div>
            <h4 className="text-base font-semibold text-[var(--foreground)]">Login Required</h4>
            <p className="text-xs text-[var(--foreground-muted)]">Connect your account to proceed</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-5 space-y-3">
        <button
          onClick={handleOpenLogin}
          className="w-full flex items-center justify-center gap-2.5
                     bg-[var(--brand-primary)] text-white font-medium py-3 px-4 rounded-xl
                     hover:bg-[var(--brand-primary-hover)] active:scale-[0.98]
                     transition-all duration-200 shadow-lg shadow-[var(--brand-primary)]/20"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          Open Login Page
        </button>

        {opened && (
          <button
            onClick={handleConfirm}
            className="w-full flex items-center justify-center gap-2.5
                       bg-[var(--success)]/10 text-[var(--success)] font-medium py-3 px-4 rounded-xl
                       border border-[var(--success)]/30
                       hover:bg-[var(--success)]/20 active:scale-[0.98]
                       transition-all duration-200 animate-fade-in"
          >
            <CheckCircleIcon />
            I&apos;ve Logged In
          </button>
        )}

        {!opened && (
          <p className="text-xs text-center text-[var(--foreground-muted)]">
            Click above to open the login page in a new tab
          </p>
        )}
      </div>
    </div>
  );
};

// ─── Rich Data Renderer ───────────────────────────────────────────────
const DataRenderer = ({ data }: { data: TaxMitraResponseData }) => {
  const comparison = data.quick_comparison || data.regime_comparison;

  return (
    <>
      {hasTaxCalculationSummary(data) && (
        <TaxSummaryRenderer
          summary={data.summary}
          deductions={data.deduction_breakdown}
          taxBreakdown={data.tax_breakdown}
        />
      )}
      {comparison && <RegimeComparisonRenderer comparison={comparison} />}
      {data.optimization_suggestions && data.optimization_suggestions.length > 0 && (
        <OptimizationSuggestionsRenderer suggestions={data.optimization_suggestions} />
      )}
      {hasITRSubmission(data) && <ITRSubmissionRenderer data={data.itr_submission} />}
      {hasRefundTracking(data) && <RefundStatusRenderer data={data.refund_tracking} />}
    </>
  );
};

// ─── Main Component ───────────────────────────────────────────────────
export const TaxMitraMessage: React.FC<TaxMitraMessageProps> = ({ response, onAnswerSubmit, isInteractive = true }) => {
  const { message, questions, data, progress, status, action } = response;

  // Detect login flow
  const loginUrl = message ? extractLoginUrl(message) : null;
  const showLoginCard = loginUrl && isLoginStep(message, progress);

  // Strip raw URL from the message for cleaner rendering when login card is shown
  const displayMessage = showLoginCard && loginUrl
    ? message.replace(loginUrl, '').replace(/Please click on this link to log in:\s*/i, '').replace(/\s*Once you've successfully logged in[\s\S]*$/i, '').trim()
    : message;

  return (
    <div className="w-full min-w-0 space-y-4 animate-fade-in">
      {/* Main Message */}
      {displayMessage && (
        <div className="bg-[var(--surface)] text-[var(--foreground)] rounded-2xl rounded-tl-md px-4 py-3 border border-[var(--surface-border)] overflow-hidden">
          <div className="prose prose-sm max-w-none break-words">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h1 className="text-lg font-semibold mb-2 text-[var(--foreground)]">{children}</h1>,
                h2: ({ children }) => <h2 className="text-base font-semibold mb-2 text-[var(--foreground)]">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-semibold mb-2 text-[var(--foreground)]">{children}</h3>,
                p: ({ children }) => <p className="mb-2 text-[var(--foreground-secondary)] leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-2 text-[var(--foreground-secondary)]">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-2 text-[var(--foreground-secondary)]">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold text-[var(--foreground)]">{children}</strong>,
                em: ({ children }) => <em className="italic text-[var(--foreground-muted)]">{children}</em>,
                code: ({ children }) => <code className="bg-[var(--brand-primary-muted)] px-1.5 py-0.5 rounded text-sm text-[var(--brand-primary)] font-mono break-all whitespace-pre-wrap">{children}</code>,
                pre: ({ children }) => <pre className="overflow-x-auto rounded-lg p-3 bg-[var(--background)] border border-[var(--surface-border)] text-sm">{children}</pre>,
                a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-[var(--brand-primary)] underline underline-offset-2 hover:text-[var(--brand-primary-hover)] break-all">{children}</a>,
              }}
            >
              {displayMessage}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* Login Card — interactive login flow */}
      {showLoginCard && loginUrl && (
        <LoginCard
          loginUrl={loginUrl}
          isInteractive={isInteractive}
          onConfirm={() => {
            if (onAnswerSubmit) {
              onAnswerSubmit({ login_status: "I have successfully logged in. Please proceed." });
            }
          }}
        />
      )}

      {/* Status Badge */}
      {status && status !== "info" && (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
          status === "success"
            ? "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20"
            : status === "error"
            ? "bg-[var(--error)]/10 text-[var(--error)] border-[var(--error)]/20"
            : "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20"
        }`}>
          {status === "success" && <CheckCircleIcon />}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      )}

      {/* Progress Bar */}
      {progress && (
        <ProgressBar current={progress.current_step} total={progress.total_steps} stepName={progress.step_name} />
      )}

      {/* Interactive Questions — only shown when this is the active message */}
      {!showLoginCard && questions && questions.length > 0 && isQuestionOptions(questions as any) && (
        isInteractive ? (
          <QuestionRenderer
            questions={questions as QuestionOption[]}
            onSubmit={(answers) => onAnswerSubmit && onAnswerSubmit(answers)}
          />
        ) : (
          <div className="flex items-center gap-3 p-3 bg-[var(--success-bg)] border border-[var(--success)]/20 rounded-xl">
            <CheckCircleIcon />
            <span className="text-sm font-medium text-[var(--success)]">Answers submitted</span>
          </div>
        )
      )}

      {/* Rich Data Displays */}
      {data && <DataRenderer data={data} />}
    </div>
  );
};

