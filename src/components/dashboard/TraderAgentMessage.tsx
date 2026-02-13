"use client";

import React, { useState } from "react";
import {
  TraderAgentResponse,
  TradeConfirmation,
  OrderResult,
  OrderStatus,
  PortfolioSummary,
  PortfolioHolding,
  AuthenticationStatus,
  UserProfile,
  Progress,
  QuestionOption,
  ResponseStatus,
  hasAuthStatus,
  hasTradeConfirmation,
  hasOrderResult,
  hasOrderStatus,
  hasPortfolio,
  hasUserProfile,
  isQuestionOptions,
  formatCurrency,
  formatPercentage,
  getOrderStatusColor,
} from "@/types/trader-agent";


const ArrowUpIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M5 15l7-7 7 7" />
  </svg>
);

const ArrowDownIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M19 9l-7 7-7-7" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path d="M19 9l-7 7-7-7" />
  </svg>
);


/** Detect if a question is a confirmation-style prompt that should be a button */
const isConfirmationQuestion = (q: QuestionOption): boolean => {
  if (q.type === "button") return true;
  const titleLower = q.title.toLowerCase();
  // Single-value confirm/cancel prompts with a pre-filled default
  if (
    (q.default || q.value) &&
    (titleLower.includes("confirm") || titleLower.includes("reply"))
  ) {
    return true;
  }
  return false;
};

const QuestionForm: React.FC<{
  questions: QuestionOption[];
  onSubmit: (answers: Record<string, string>) => void;
}> = ({ questions, onSubmit }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    onSubmit(answers);
  };

  /** Quick-fire a single button answer */
  const handleButtonClick = (q: QuestionOption) => {
    const value = q.value || q.default || "Confirm";
    setSubmitted(true);
    onSubmit({ [q.title]: value });
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
        <CheckCircleIcon />
        <span className="text-sm font-medium text-emerald-400">Submitted</span>
      </div>
    );
  }

  // If ALL questions are confirmation-style, render as buttons only (no form)
  const allButtons = questions.every(isConfirmationQuestion);
  if (allButtons) {
    return (
      <div className="flex flex-wrap gap-2">
        {questions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleButtonClick(q)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm
                       bg-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/90 text-white
                       active:scale-[0.97] transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <CheckCircleIcon />
            {q.value || q.default || q.title}
          </button>
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {questions.map((q, idx) =>
        isConfirmationQuestion(q) ? (
          // Render confirmation questions as buttons inside the form
          <button
            key={idx}
            type="button"
            onClick={() => handleButtonClick(q)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                       font-medium text-sm bg-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/90
                       text-white active:scale-[0.97] transition-all duration-200 shadow-md"
          >
            <CheckCircleIcon />
            {q.value || q.default || q.title}
          </button>
        ) : (
          <div
            key={idx}
            className="bg-[var(--surface)]/40 border border-[var(--surface-border)] rounded-xl p-3.5
                       hover:border-[var(--brand-primary)]/30 transition-all duration-200"
          >
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              {q.title}
              {q.required && <span className="text-red-400 ml-1">*</span>}
            </label>

            {q.description && (
              <p className="text-xs text-[var(--foreground-muted)] mb-2 leading-relaxed">{q.description}</p>
            )}

            {q.type === "select" || q.type === "multiselect" ? (
              <select
                className="w-full bg-[var(--surface)] border border-[var(--surface-border)] rounded-lg
                           px-3 py-2 text-sm text-[var(--foreground)]
                           focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40
                           transition-all duration-200 appearance-none cursor-pointer"
                onChange={(e) => handleChange(q.title, e.target.value)}
                required={q.required}
                defaultValue={q.value || q.default || ""}
              >
                <option value="" disabled>
                  {q.placeholder || "Select an option"}
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
                className="w-full bg-[var(--surface)] border border-[var(--surface-border)] rounded-lg
                           px-3 py-2 text-sm text-[var(--foreground)] placeholder-[var(--foreground-muted)]
                           focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40
                           transition-all duration-200"
                placeholder={q.placeholder}
                defaultValue={q.value || q.default}
                onChange={(e) => handleChange(q.title, e.target.value)}
                required={q.required}
                min={q.min}
                max={q.max}
              />
            )}

            {q.error && (
              <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                <AlertIcon />
                {q.error}
              </p>
            )}
          </div>
        )
      )}

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2
                   bg-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/90 text-white font-medium
                   py-2.5 px-4 rounded-xl active:scale-[0.98]
                   transition-all duration-200 shadow-md hover:shadow-lg"
      >
        Submit
      </button>
    </form>
  );
};

// ─── Props ────────────────────────────────────────────────────────────

interface TraderAgentMessageProps {
  response: TraderAgentResponse;
  isInteractive?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  onSendMessage?: (message: string) => void;
}

// ─── Reusable Detail Item ─────────────────────────────────────────────

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-[var(--surface)]/40 rounded-lg p-2.5 border border-[var(--surface-border)]">
    <div className="text-[10px] uppercase tracking-wider text-[var(--foreground-muted)] mb-0.5">
      {label}
    </div>
    <div className="text-sm font-semibold text-[var(--foreground)]">{value}</div>
  </div>
);

// ─── Status Badge ─────────────────────────────────────────────────────

const StatusBadge: React.FC<{ status: ResponseStatus; actionRequired?: string }> = ({ status, actionRequired }) => {
  const config: Record<ResponseStatus, { icon: React.ReactNode; label: string; color: string; bg: string; border: string }> = {
    pending: { icon: <ClockIcon />, label: "Pending", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
    success: { icon: <CheckCircleIcon />, label: "Success", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
    error: { icon: <AlertIcon />, label: "Error", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" },
    info: { icon: <InfoIcon />, label: "Info", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
    warning: { icon: <AlertIcon />, label: "Warning", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30" },
  };

  const labelOverrides: Partial<Record<string, string>> = {
    auth_required: "Login Required",
    confirmation_required: "Confirmation Required",
    input_required: "Input Required",
    processing: "Processing",
    completed: "Completed",
  };

  const c = config[status];
  const label = (actionRequired && labelOverrides[actionRequired]) || c.label;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${c.color} ${c.bg} border ${c.border}`}>
      {c.icon}
      {label}
    </div>
  );
};

// ─── Auth Status Card ─────────────────────────────────────────────────

const AuthStatusCard: React.FC<{ auth: AuthenticationStatus; onSendMessage?: (msg: string) => void }> = ({ auth, onSendMessage }) => {
  const [opened, setOpened] = useState(false);

  const handleOpenLogin = () => {
    if (auth.login_url) {
      window.open(auth.login_url, "_blank", "width=600,height=700");
      setOpened(true);
    }
  };

  const handleConfirmLogin = () => {
    onSendMessage?.("I have completed the login");
  };

  return (
    <div className={`rounded-xl border p-4 space-y-3 ${auth.is_authenticated ? "border-emerald-500/30 bg-emerald-500/10" : "border-amber-500/30 bg-amber-500/10"}`}>
      <div className="flex items-center gap-2">
        <LockIcon />
        <span className="text-sm font-semibold text-[var(--foreground)]">
          {auth.is_authenticated ? "Authenticated" : "Authentication Required"}
        </span>
      </div>

      {auth.message && (
        <p className="text-sm text-[var(--foreground-secondary)]">{auth.message}</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <DetailItem label="Broker" value={auth.broker} />
        <DetailItem label="Session" value={auth.session_valid ? "Valid" : "Invalid"} />
        {auth.user_id && <DetailItem label="User ID" value={auth.user_id} />}
      </div>

      {!auth.is_authenticated && auth.login_url && (
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleOpenLogin}
            className="flex-1 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md"
          >
            Open Login
          </button>
          {opened && (
            <button
              onClick={handleConfirmLogin}
              className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md"
            >
              I&apos;ve Logged In
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Trade Confirmation Card ──────────────────────────────────────────

const TradeConfirmationCard: React.FC<{ confirmation: TradeConfirmation }> = ({ confirmation }) => {
  const isBuy = confirmation.action === "BUY";
  const actionColor = isBuy ? "text-emerald-400" : "text-red-400";
  const actionBg = isBuy ? "bg-emerald-500/10" : "bg-red-500/10";
  const actionBorder = isBuy ? "border-emerald-500/30" : "border-red-500/30";
  const ActionIcon = isBuy ? ArrowUpIcon : ArrowDownIcon;

  return (
    <div className={`rounded-xl border ${actionBorder} ${actionBg} p-4 space-y-4`}>
      {/* Header: Action + Symbol */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${actionBg} border ${actionBorder}`}>
            <span className={actionColor}><ActionIcon /></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold ${actionColor}`}>{confirmation.action}</span>
              <span className="text-lg font-semibold text-[var(--foreground)]">{confirmation.symbol_info.symbol}</span>
            </div>
            <span className="text-xs text-[var(--foreground-muted)]">
              {confirmation.symbol_info.exchange}
              {confirmation.symbol_info.company_name && ` · ${confirmation.symbol_info.company_name}`}
            </span>
          </div>
        </div>
      </div>

      {/* Confirmation message */}
      {confirmation.message && (
        <p className="text-sm text-[var(--foreground-secondary)]">{confirmation.message}</p>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3">
        <DetailItem label="Quantity" value={String(confirmation.quantity)} />
        <DetailItem label="Order Type" value={confirmation.order_type} />
        <DetailItem label="Product" value={confirmation.product} />
        {confirmation.price != null && (
          <DetailItem label="Price" value={formatCurrency(confirmation.price)} />
        )}
        {confirmation.symbol_info.last_price != null && (
          <DetailItem label="Last Price" value={formatCurrency(confirmation.symbol_info.last_price)} />
        )}
      </div>

      {/* Estimated Cost */}
      {confirmation.estimated_cost != null && (
        <div className="pt-3 border-t border-[var(--surface-border)]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--foreground-muted)]">Estimated Cost</span>
            <span className="text-lg font-bold text-[var(--foreground)]">{formatCurrency(confirmation.estimated_cost)}</span>
          </div>
        </div>
      )}

      {/* Warnings */}
      {confirmation.warnings && confirmation.warnings.length > 0 && (
        <div className="space-y-1.5 pt-2">
          {confirmation.warnings.map((w, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-orange-400">
              <AlertIcon />
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Order Result Card ────────────────────────────────────────────────

const OrderResultCard: React.FC<{ result: OrderResult }> = ({ result }) => {
  const statusColor = getOrderStatusColor(result.status);

  return (
    <div className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface)]/40 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {result.status === "COMPLETE" ? <CheckCircleIcon /> : result.status === "REJECTED" ? <XCircleIcon /> : <ClockIcon />}
          <span className="text-sm font-semibold text-[var(--foreground)]">Order {result.status}</span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ color: statusColor, backgroundColor: `${statusColor}20`, border: `1px solid ${statusColor}40` }}>
          {result.status}
        </span>
      </div>

      {result.message && (
        <p className="text-sm text-[var(--foreground-secondary)]">{result.message}</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <DetailItem label="Order ID" value={result.order_id} />
        <DetailItem label="Action" value={`${result.action} ${result.symbol}`} />
        <DetailItem label="Quantity" value={`${result.filled_quantity}/${result.quantity} filled`} />
        <DetailItem label="Exchange" value={result.exchange} />
        {result.average_price != null && (
          <DetailItem label="Avg. Price" value={formatCurrency(result.average_price)} />
        )}
        <DetailItem label="Type" value={`${result.order_type} · ${result.product}`} />
      </div>

      {result.timestamp && (
        <div className="text-xs text-[var(--foreground-muted)] text-right">
          {new Date(result.timestamp).toLocaleString("en-IN")}
        </div>
      )}
    </div>
  );
};

// ─── Order Status Card ────────────────────────────────────────────────

const OrderStatusCard: React.FC<{ order: OrderStatus }> = ({ order }) => {
  const statusColor = getOrderStatusColor(order.status);

  return (
    <div className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface)]/40 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-[var(--foreground)]">Order Status</span>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ color: statusColor, backgroundColor: `${statusColor}20`, border: `1px solid ${statusColor}40` }}>
          {order.status}
        </span>
      </div>

      {order.status_message && (
        <p className="text-sm text-[var(--foreground-secondary)]">{order.status_message}</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <DetailItem label="Order ID" value={order.order_id} />
        <DetailItem label="Action" value={`${order.action} ${order.symbol}`} />
        <DetailItem label="Filled" value={`${order.filled_quantity}/${order.quantity}`} />
        <DetailItem label="Type" value={`${order.order_type} · ${order.product}`} />
        {order.average_price != null && <DetailItem label="Avg Price" value={formatCurrency(order.average_price)} />}
        {order.trigger_price != null && <DetailItem label="Trigger" value={formatCurrency(order.trigger_price)} />}
      </div>

      {order.rejection_reason && (
        <div className="flex items-start gap-2 text-xs text-red-400 pt-1">
          <AlertIcon />
          <span>{order.rejection_reason}</span>
        </div>
      )}

      {order.last_updated && (
        <div className="text-xs text-[var(--foreground-muted)] text-right">
          Updated: {new Date(order.last_updated).toLocaleString("en-IN")}
        </div>
      )}
    </div>
  );
};

// ─── Portfolio Card ───────────────────────────────────────────────────

const PortfolioCard: React.FC<{ portfolio: PortfolioSummary }> = ({ portfolio }) => {
  const [expanded, setExpanded] = useState(false);
  const pnlColor = portfolio.total_pnl >= 0 ? "text-emerald-400" : "text-red-400";

  return (
    <div className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface)]/40 p-4 space-y-4">
      {/* Summary Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-[var(--foreground)]">Portfolio ({portfolio.holdings_count} holdings)</span>
        <button onClick={() => setExpanded(!expanded)} className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
          <ChevronIcon isOpen={expanded} />
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3">
        <DetailItem label="Invested" value={formatCurrency(portfolio.total_invested)} />
        <DetailItem label="Current Value" value={formatCurrency(portfolio.total_current_value)} />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[var(--surface-border)]">
        <span className="text-sm text-[var(--foreground-muted)]">Total P&L</span>
        <div className="text-right">
          <span className={`text-lg font-bold ${pnlColor}`}>{formatCurrency(portfolio.total_pnl)}</span>
          <span className={`text-xs ml-1.5 ${pnlColor}`}>({formatPercentage(portfolio.total_pnl_percentage)})</span>
        </div>
      </div>

      {portfolio.day_pnl != null && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--foreground-muted)]">Today&apos;s P&L</span>
          <span className={`text-sm font-medium ${(portfolio.day_pnl ?? 0) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {formatCurrency(portfolio.day_pnl)} {portfolio.day_pnl_percentage != null && `(${formatPercentage(portfolio.day_pnl_percentage)})`}
          </span>
        </div>
      )}

      {/* Holdings Table */}
      {expanded && portfolio.holdings.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-[var(--surface-border)]">
          <div className="text-xs uppercase tracking-wider text-[var(--foreground-muted)] font-medium">Holdings</div>
          <div className="space-y-2">
            {portfolio.holdings.map((h, i) => (
              <HoldingRow key={`${h.symbol}-${i}`} holding={h} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const HoldingRow: React.FC<{ holding: PortfolioHolding }> = ({ holding }) => {
  const pnlColor = (holding.pnl ?? 0) >= 0 ? "text-emerald-400" : "text-red-400";

  return (
    <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--surface)]/60 border border-[var(--surface-border)]">
      <div>
        <div className="text-sm font-medium text-[var(--foreground)]">{holding.symbol}</div>
        <div className="text-xs text-[var(--foreground-muted)]">{holding.quantity} × {formatCurrency(holding.average_price)}</div>
      </div>
      <div className="text-right">
        {holding.current_value != null && (
          <div className="text-sm font-medium text-[var(--foreground)]">{formatCurrency(holding.current_value)}</div>
        )}
        {holding.pnl != null && (
          <div className={`text-xs ${pnlColor}`}>
            {formatCurrency(holding.pnl)}
            {holding.pnl_percentage != null && ` (${formatPercentage(holding.pnl_percentage)})`}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── User Profile Card ────────────────────────────────────────────────

const UserProfileCard: React.FC<{ profile: UserProfile }> = ({ profile }) => (
  <div className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface)]/40 p-4 space-y-3">
    <div className="flex items-center gap-2">
      <UserIcon />
      <span className="text-sm font-semibold text-[var(--foreground)]">Account</span>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <DetailItem label="User ID" value={profile.user_id} />
      <DetailItem label="Broker" value={profile.broker} />
      {profile.user_name && <DetailItem label="Name" value={profile.user_name} />}
      {profile.email && <DetailItem label="Email" value={profile.email} />}
    </div>
    {profile.exchanges && profile.exchanges.length > 0 && (
      <div className="flex gap-2 flex-wrap">
        {profile.exchanges.map((ex) => (
          <span key={ex} className="px-2 py-0.5 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">{ex}</span>
        ))}
      </div>
    )}
  </div>
);

// ─── Progress Bar ─────────────────────────────────────────────────────

const ProgressBar: React.FC<{ progress: Progress }> = ({ progress }) => {
  const pct = progress.total_steps > 0
    ? (progress.current_step / progress.total_steps) * 100
    : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs text-[var(--foreground-muted)]">
        <span>{progress.step_name}</span>
        <span>Step {progress.current_step}/{progress.total_steps}</span>
      </div>
      <div className="h-1.5 bg-[var(--surface-hover)] rounded-full overflow-hidden">
        <div className="h-full bg-[var(--brand-primary)] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

// ─── Next Steps ───────────────────────────────────────────────────────

const NextStepsList: React.FC<{ steps: string[] }> = ({ steps }) => (
  <div className="space-y-2">
    <div className="text-xs uppercase tracking-wider text-[var(--foreground-muted)] font-medium">Next Steps</div>
    <ul className="space-y-1.5">
      {steps.map((step, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-[var(--foreground-secondary)]">
          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] flex-shrink-0" />
          {step}
        </li>
      ))}
    </ul>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────

export const TraderAgentMessage: React.FC<TraderAgentMessageProps> = ({
  response,
  isInteractive = true,
  onConfirm,
  onCancel,
  onSendMessage,
}) => {
  const [confirmed, setConfirmed] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    onConfirm?.();
  };

  const handleCancel = () => {
    setCancelled(true);
    onCancel?.();
  };

  const effectiveAction = response.action_required || response.action;

  const showActions =
    isInteractive &&
    effectiveAction === "confirmation_required" &&
    !confirmed &&
    !cancelled;

  // ── Determine if this is a "rich" response that needs structured cards ──
  // A response is rich when it carries actual structured data beyond just text.
  const hasStructuredContent =
    hasTradeConfirmation(response) ||
    hasOrderResult(response) ||
    hasOrderStatus(response) ||
    hasPortfolio(response) ||
    hasUserProfile(response) ||
    (hasAuthStatus(response) && !response.auth_status.is_authenticated) || // only show auth card when login is needed
    effectiveAction === "confirmation_required";

  // For conversational messages (input_required / info with no structured data),
  // render just the message text — no status badges, no cards, no next steps.
  if (!hasStructuredContent && !showActions) {
    return (
      <div className="space-y-3">
        <p className="text-sm leading-relaxed text-[var(--foreground-secondary)] whitespace-pre-wrap">
          {response.message}
        </p>

        {/* Show warnings/errors even in conversational mode */}
        {response.warnings && response.warnings.length > 0 && (
          <div className="space-y-1.5">
            {response.warnings.map((w, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-lg px-3 py-2">
                <AlertIcon />
                <span>{w}</span>
              </div>
            ))}
          </div>
        )}
        {response.errors && response.errors.length > 0 && (
          <div className="space-y-1.5">
            {response.errors.map((e, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                <XCircleIcon />
                <span>{e}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Rich / structured rendering ──
  return (
    <div className="space-y-4">
      {/* Status Badge — only for structured responses */}
      <StatusBadge
        status={confirmed ? "success" : cancelled ? "info" : response.status}
        actionRequired={effectiveAction}
      />

      {/* Message */}
      <p className="text-sm leading-relaxed text-[var(--foreground-secondary)]">
        {response.message}
      </p>

      {/* Progress */}
      {response.progress && <ProgressBar progress={response.progress} />}

      {/* Questions Form — for input_required responses */}
      {response.questions && response.questions.length > 0 && isQuestionOptions(response.questions) && (
        isInteractive ? (
          <QuestionForm
            questions={response.questions}
            onSubmit={(answers) => {
              if (onSendMessage) {
                const formatted = Object.entries(answers)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join("\n");
                onSendMessage(formatted);
              }
            }}
          />
        ) : (
          <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
            <CheckCircleIcon />
            <span className="text-sm font-medium text-emerald-400">Answers submitted</span>
          </div>
        )
      )}

      {/* Auth Status — only when login is actually needed */}
      {hasAuthStatus(response) && !response.auth_status.is_authenticated && (
        <AuthStatusCard auth={response.auth_status} onSendMessage={onSendMessage} />
      )}

      {/* Trade Confirmation Card */}
      {hasTradeConfirmation(response) && (
        <TradeConfirmationCard confirmation={response.trade_confirmation} />
      )}

      {/* Order Result */}
      {hasOrderResult(response) && (
        <OrderResultCard result={response.order_result} />
      )}

      {/* Order Status */}
      {hasOrderStatus(response) && (
        <OrderStatusCard order={response.order_status} />
      )}

      {/* Portfolio */}
      {hasPortfolio(response) && (
        <PortfolioCard portfolio={response.portfolio} />
      )}

      {/* User Profile */}
      {hasUserProfile(response) && (
        <UserProfileCard profile={response.user_profile} />
      )}

      {/* Warnings */}
      {response.warnings && response.warnings.length > 0 && (
        <div className="space-y-1.5">
          {response.warnings.map((w, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-lg px-3 py-2">
              <AlertIcon />
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}

      {/* Errors */}
      {response.errors && response.errors.length > 0 && (
        <div className="space-y-1.5">
          {response.errors.map((e, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              <XCircleIcon />
              <span>{e}</span>
            </div>
          ))}
        </div>
      )}

      {/* Next Steps — only for trade/order flows, not conversational */}
      {response.next_steps && response.next_steps.length > 0 && !confirmed && !cancelled &&
        (hasTradeConfirmation(response) || hasOrderResult(response) || hasOrderStatus(response)) && (
        <NextStepsList steps={response.next_steps} />
      )}

      {/* Action Buttons */}
      {showActions && (
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg hover:shadow-emerald-500/20"
          >
            Confirm Trade
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2.5 bg-[var(--surface-hover)] hover:bg-[var(--surface-active)] text-[var(--foreground-secondary)] text-sm font-medium rounded-xl border border-[var(--surface-border)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Confirmed / Cancelled feedback */}
      {confirmed && (
        <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
          <CheckCircleIcon />
          Trade confirmed — awaiting execution.
        </div>
      )}
      {cancelled && (
        <div className="flex items-center gap-2 text-[var(--foreground-muted)] text-sm">
          <XCircleIcon />
          Trade cancelled.
        </div>
      )}
    </div>
  );
};

