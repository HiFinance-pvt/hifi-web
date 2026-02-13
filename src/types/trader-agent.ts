/**
 * TypeScript type definitions for Trader Agent Response Schema
 * Auto-generated from Python Pydantic models
 */

// Enum types
export type TradeAction = "BUY" | "SELL";
export type OrderType = "MARKET" | "LIMIT" | "SL" | "SL-M";
export type ProductType = "CNC" | "MIS" | "NRML";
export type Exchange = "NSE" | "BSE";
export type OrderStatusType = "OPEN" | "COMPLETE" | "REJECTED" | "CANCELLED" | "PENDING";
export type ResponseStatus = "success" | "error" | "pending" | "info" | "warning";
export type ActionRequired = "auth_required" | "confirmation_required" | "input_required" | "processing" | "completed" | "error";

export type QuestionInputType =
  | "text"
  | "number"
  | "select"
  | "multiselect"
  | "date"
  | "email"
  | "tel"
  | "file"
  | "button";

/**
 * Represents a single question with rich UI options for structured user interaction
 */
export interface QuestionOption {
  /** The question text to display */
  title: string;
  /** Additional context or help text for the question */
  description?: string;
  /** The input type for the question */
  type: QuestionInputType;
  /** Available options for select/multiselect types */
  options?: string[];
  /** Whether this question must be answered */
  required: boolean;
  /** Default value for the field */
  default?: string;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Pre-filled value if available */
  value?: string;
  /** Error message to display */
  error?: string;
  /** Minimum value for number inputs */
  min?: number;
  /** Maximum value for number inputs */
  max?: number;
}

/**
 * Authentication status information
 */
export interface AuthenticationStatus {
  /** Whether the user is currently authenticated */
  is_authenticated: boolean;
  /** Whether the current session is valid */
  session_valid: boolean;
  /** Login URL if authentication is required */
  login_url?: string;
  /** Authenticated user ID */
  user_id?: string;
  /** Broker name */
  broker: string;
  /** Authentication status message */
  message?: string;
}

/**
 * Parsed stock symbol information
 */
export interface SymbolInfo {
  /** Trading symbol (e.g., INFY, TCS) */
  symbol: string;
  /** Stock exchange */
  exchange: Exchange;
  /** Full company name */
  company_name?: string;
  /** Instrument token for API calls */
  instrument_token?: string;
  /** Minimum lot size for trading */
  lot_size: number;
  /** Minimum price movement */
  tick_size?: number;
  /** Last traded price */
  last_price?: number;
  /** ISIN code */
  isin?: string;
}

/**
 * Trade confirmation details to display to user
 */
export interface TradeConfirmation {
  /** Trade action: BUY or SELL */
  action: TradeAction;
  /** Resolved symbol information */
  symbol_info: SymbolInfo;
  /** Number of shares to trade */
  quantity: number;
  /** Order type */
  order_type: OrderType;
  /** Product type */
  product: ProductType;
  /** Limit price (for LIMIT orders) */
  price?: number;
  /** Estimated total cost/credit */
  estimated_cost?: number;
  /** Confirmation message to display */
  message: string;
  /** Any warnings or important notes */
  warnings?: string[];
  /** Whether user confirmation is required */
  requires_confirmation: boolean;
}

/**
 * Result of order placement
 */
export interface OrderResult {
  /** Unique order ID from broker */
  order_id: string;
  /** Current order status */
  status: OrderStatusType;
  /** Trade action executed */
  action: TradeAction;
  /** Trading symbol */
  symbol: string;
  /** Exchange */
  exchange: Exchange;
  /** Order quantity */
  quantity: number;
  /** Quantity filled */
  filled_quantity: number;
  /** Quantity pending */
  pending_quantity: number;
  /** Order price */
  price?: number;
  /** Average execution price */
  average_price?: number;
  /** Order type */
  order_type: OrderType;
  /** Product type */
  product: ProductType;
  /** Order placement timestamp */
  timestamp?: string;
  /** Result message */
  message: string;
}

/**
 * Individual portfolio holding
 */
export interface PortfolioHolding {
  /** Trading symbol */
  symbol: string;
  /** Exchange */
  exchange: Exchange;
  /** Total quantity held */
  quantity: number;
  /** Average buy price */
  average_price: number;
  /** Current market price */
  last_price?: number;
  /** Profit/Loss */
  pnl?: number;
  /** Profit/Loss percentage */
  pnl_percentage?: number;
  /** Day's change in value */
  day_change?: number;
  /** Day's change percentage */
  day_change_percentage?: number;
  /** Total invested amount */
  invested_value: number;
  /** Current market value */
  current_value?: number;
  /** Product type */
  product: ProductType;
}

/**
 * Portfolio summary information
 */
export interface PortfolioSummary {
  /** List of holdings */
  holdings: PortfolioHolding[];
  /** Total amount invested */
  total_invested: number;
  /** Total current value */
  total_current_value: number;
  /** Total profit/loss */
  total_pnl: number;
  /** Total P&L percentage */
  total_pnl_percentage: number;
  /** Today's profit/loss */
  day_pnl?: number;
  /** Today's P&L percentage */
  day_pnl_percentage?: number;
  /** Number of holdings */
  holdings_count: number;
}

/**
 * Detailed order status information
 */
export interface OrderStatus {
  /** Order ID */
  order_id: string;
  /** Parent order ID if applicable */
  parent_order_id?: string;
  /** Order status */
  status: OrderStatusType;
  /** Detailed status message */
  status_message?: string;
  /** Trading symbol */
  symbol: string;
  /** Exchange */
  exchange: Exchange;
  /** Trade action */
  action: TradeAction;
  /** Order type */
  order_type: OrderType;
  /** Product type */
  product: ProductType;
  /** Total quantity */
  quantity: number;
  /** Filled quantity */
  filled_quantity: number;
  /** Pending quantity */
  pending_quantity: number;
  /** Cancelled quantity */
  cancelled_quantity: number;
  /** Order price */
  price?: number;
  /** Trigger price for SL orders */
  trigger_price?: number;
  /** Average execution price */
  average_price?: number;
  /** Order placement time */
  placed_time?: string;
  /** Last update time */
  last_updated?: string;
  /** Order validity (DAY, IOC, etc.) */
  validity?: string;
  /** Rejection reason if rejected */
  rejection_reason?: string;
}

/**
 * User profile and account information
 */
export interface UserProfile {
  /** User ID */
  user_id: string;
  /** User's full name */
  user_name?: string;
  /** Email address */
  email?: string;
  /** Broker name */
  broker: string;
  /** Enabled exchanges */
  exchanges?: string[];
  /** Enabled products */
  products?: string[];
  /** Enabled order types */
  order_types?: string[];
}

/**
 * Progress tracking information
 */
export interface Progress {
  /** Current step number */
  current_step: number;
  /** Total number of steps */
  total_steps: number;
  /** Name of the current step */
  step_name: string;
  /** Array of all step names */
  steps?: string[];
}

/**
 * Main response schema for Trader Agent
 */
export interface TraderAgentResponse {
  /** Human-readable message to display to user */
  message: string;
  /** Response status */
  status: ResponseStatus;
  /** What action is expected from user (preferred field name) */
  action_required?: ActionRequired;
  /** Alias — some backends send `action` instead of `action_required` */
  action?: ActionRequired;

  /** Questions to ask the user — can be simple strings or rich question objects */
  questions?: string[] | QuestionOption[];

  /** Authentication status information */
  auth_status?: AuthenticationStatus;

  /** Parsed symbol information */
  symbol_info?: SymbolInfo;

  /** Trade confirmation details awaiting user approval */
  trade_confirmation?: TradeConfirmation;

  /** Order execution result */
  order_result?: OrderResult;

  /** Detailed order status */
  order_status?: OrderStatus;

  /** Portfolio summary and holdings */
  portfolio?: PortfolioSummary;

  /** User profile information */
  user_profile?: UserProfile;

  /** Additional contextual data */
  data?: Record<string, any>;

  /** Warning messages */
  warnings?: string[];

  /** Error messages */
  errors?: string[];

  /** Progress information */
  progress?: Progress;

  /** Suggested next steps for the user */
  next_steps?: string[];
}

// ─── Type Guards ─────────────────────────────────────────────────────

export const isTraderAgentResponse = (obj: any): obj is TraderAgentResponse => {
  if (
    !obj ||
    typeof obj !== "object" ||
    typeof obj.message !== "string" ||
    typeof obj.status !== "string" ||
    !["success", "error", "pending", "info", "warning"].includes(obj.status)
  ) {
    return false;
  }

  // ── Positive signals: fields only TraderAgent sends ──
  const traderSpecificFields = [
    "auth_status",
    "symbol_info",
    "trade_confirmation",
    "order_result",
    "order_status",
    "portfolio",
    "user_profile",
    "action_required",
  ];
  if (traderSpecificFields.some((f) => obj[f] !== undefined)) return true;

  // Unique action values that only TraderAgent uses
  if (
    typeof obj.action === "string" &&
    ["auth_required", "confirmation_required"].includes(obj.action)
  ) {
    return true;
  }
  if (
    typeof obj.action_required === "string" &&
    ["auth_required", "confirmation_required"].includes(obj.action_required)
  ) {
    return true;
  }

  // If it has `questions` array AND `action` with a shared value, still accept
  // because TaxMitra also uses `action` but never sends `questions` as rich objects
  // with `type` field — TaxMitra QuestionOption has a different shape.
  if (
    Array.isArray(obj.questions) &&
    obj.questions.length > 0 &&
    obj.questions[0]?.type !== undefined
  ) {
    return true;
  }

  // Fallback: if it has `action` AND no TaxMitra-specific `data` shape, still accept
  // This handles generic trader responses that overlap with TaxMitra enum values
  if (typeof obj.action === "string" && !obj.action_required) {
    // Could be either agent — require at least one more trader signal
    if (obj.data?.symbol || obj.data?.exchange || obj.next_steps) return true;
    // Otherwise reject to avoid hijacking TaxMitra responses
    return false;
  }

  // No `action` field at all — accept (plain info/message responses)
  return !obj.action;
};

export const hasAuthStatus = (response: TraderAgentResponse): response is TraderAgentResponse & { auth_status: AuthenticationStatus } => {
  return response.auth_status !== undefined && response.auth_status !== null;
};

export const hasTradeConfirmation = (response: TraderAgentResponse): response is TraderAgentResponse & { trade_confirmation: TradeConfirmation } => {
  return response.trade_confirmation !== undefined && response.trade_confirmation !== null;
};

export const hasOrderResult = (response: TraderAgentResponse): response is TraderAgentResponse & { order_result: OrderResult } => {
  return response.order_result !== undefined && response.order_result !== null;
};

export const hasOrderStatus = (response: TraderAgentResponse): response is TraderAgentResponse & { order_status: OrderStatus } => {
  return response.order_status !== undefined && response.order_status !== null;
};

export const hasPortfolio = (response: TraderAgentResponse): response is TraderAgentResponse & { portfolio: PortfolioSummary } => {
  return response.portfolio !== undefined && response.portfolio !== null;
};

export const hasUserProfile = (response: TraderAgentResponse): response is TraderAgentResponse & { user_profile: UserProfile } => {
  return response.user_profile !== undefined && response.user_profile !== null;
};

// ─── Constants ───────────────────────────────────────────────────────

export const DEFAULT_EXCHANGE: Exchange = "NSE";
export const DEFAULT_PRODUCT: ProductType = "CNC";
export const DEFAULT_BROKER = "Zerodha";

// ─── Helpers ─────────────────────────────────────────────────────────

/** Format Indian currency */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/** Format percentage with sign */
export const formatPercentage = (value: number): string => {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
};

/** Status → hex color */
export const getStatusColor = (status: ResponseStatus): string => {
  const colors: Record<ResponseStatus, string> = {
    success: "#10b981",
    error: "#ef4444",
    pending: "#f59e0b",
    info: "#3b82f6",
    warning: "#f97316",
  };
  return colors[status] || colors.info;
};

/** Order status → hex color */
export const getOrderStatusColor = (status: OrderStatusType): string => {
  const colors: Record<OrderStatusType, string> = {
    OPEN: "#3b82f6",
    COMPLETE: "#10b981",
    REJECTED: "#ef4444",
    CANCELLED: "#6b7280",
    PENDING: "#f59e0b",
  };
  return colors[status] || "#6b7280";
};

// ─── Question Helpers ────────────────────────────────────────────────

/** Type guard to check if questions are QuestionOption objects */
export function isQuestionOptions(
  questions: string[] | QuestionOption[]
): questions is QuestionOption[] {
  return questions.length > 0 && typeof questions[0] === "object" && "title" in questions[0];
}

// ─── Response Helpers ────────────────────────────────────────────────

/** Check if authentication is required */
export function isAuthRequired(response: TraderAgentResponse): boolean {
  const action = response.action_required || response.action;
  return (
    action === "auth_required" &&
    response.auth_status?.is_authenticated === false
  );
}

/** Check if confirmation is required */
export function isConfirmationRequired(response: TraderAgentResponse): boolean {
  const action = response.action_required || response.action;
  return (
    action === "confirmation_required" &&
    response.trade_confirmation !== undefined
  );
}

/** Helper to check if response is successful */
export function isSuccess(response: TraderAgentResponse): boolean {
  return response.status === "success";
}

/** Helper to check if response is an error */
export function isError(response: TraderAgentResponse): boolean {
  return response.status === "error";
}
