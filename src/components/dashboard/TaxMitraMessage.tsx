"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  TaxMitraResponse,
  QuestionOption,
  TaxCalculationResult,
  ITRSubmissionResult,
  RefundTrackingResult,
  isQuestionOptions,
  isTaxCalculationResult,
  isITRSubmissionResult,
  isRefundTrackingResult,
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

const FileTextIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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

// ─── Tax Calculation Breakdown ────────────────────────────────────────
const TaxBreakdownRenderer = ({ data }: { data: TaxCalculationResult }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
            <p className="text-xs text-[var(--foreground-muted)]">{data.tax_regime} Tax Regime</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-px bg-[var(--surface-border)]">
        <div className="bg-[var(--surface)] p-4">
          <p className="text-xs text-[var(--foreground-muted)] mb-1">Gross Income</p>
          <p className="text-lg font-semibold text-[var(--foreground)]">₹{data.gross_income.toLocaleString()}</p>
        </div>
        <div className="bg-[var(--surface)] p-4">
          <p className="text-xs text-[var(--foreground-muted)] mb-1">Taxable Income</p>
          <p className="text-lg font-semibold text-[var(--foreground)]">₹{data.taxable_income.toLocaleString()}</p>
        </div>
        <div className="bg-[var(--surface)] p-4">
          <p className="text-xs text-[var(--foreground-muted)] mb-1">Total Tax</p>
          <p className="text-lg font-bold text-[var(--brand-primary)]">₹{data.total_tax.toLocaleString()}</p>
        </div>
        <div className="bg-[var(--surface)] p-4">
          <p className="text-xs text-[var(--foreground-muted)] mb-1">Deductions</p>
          <p className="text-lg font-semibold text-[var(--success)]">
            {data.deductions ? `₹${data.deductions.toLocaleString()}` : "—"}
          </p>
        </div>
      </div>

      {/* Breakdown Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-sm font-medium text-[var(--foreground-muted)]
                   hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-all duration-200"
      >
        <span>Slab-wise Breakdown</span>
        <ChevronIcon isOpen={isExpanded} />
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-2 animate-fade-in">
          {Object.entries(data.breakdown).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center py-2 border-b border-[var(--surface-border)] last:border-0">
              <span className="text-sm text-[var(--foreground-secondary)] capitalize">{key.replace(/_/g, " ")}</span>
              <span className="text-sm font-medium text-[var(--foreground)]">₹{(value as number).toLocaleString()}</span>
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
            <span className="text-sm font-semibold text-[var(--brand-primary)]">₹{data.refund_amount.toLocaleString()}</span>
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

// ─── Main Component ───────────────────────────────────────────────────
export const TaxMitraMessage: React.FC<TaxMitraMessageProps> = ({ response, onAnswerSubmit, isInteractive = true }) => {
  const { message, questions, data, progress, status, action } = response;

  return (
    <div className="w-full space-y-4 animate-fade-in">
      {/* Main Message */}
      {message && (
        <div className="bg-[var(--surface)] text-[var(--foreground)] rounded-2xl rounded-tl-md px-4 py-3 border border-[var(--surface-border)]">
          <div className="prose prose-sm max-w-none">
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
                code: ({ children }) => <code className="bg-[var(--brand-primary-muted)] px-1.5 py-0.5 rounded text-sm text-[var(--brand-primary)] font-mono">{children}</code>,
              }}
            >
              {message}
            </ReactMarkdown>
          </div>
        </div>
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
      {questions && questions.length > 0 && isQuestionOptions(questions as any) && (
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
      {data && (
        <>
          {isTaxCalculationResult(data) && <TaxBreakdownRenderer data={data} />}
          {isITRSubmissionResult(data) && <ITRSubmissionRenderer data={data} />}
          {isRefundTrackingResult(data) && <RefundStatusRenderer data={data} />}
        </>
      )}
    </div>
  );
};
