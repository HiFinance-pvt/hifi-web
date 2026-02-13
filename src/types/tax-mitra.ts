/**
 * TypeScript types for Tax Mitra Agent output schema
 * Matches the Pydantic models in output_schema.py
 */

export type InputType =
  | "text"
  | "number"
  | "select"
  | "multiselect"
  | "date"
  | "email"
  | "tel"
  | "file";

export type Status = "success" | "error" | "pending" | "info";

export type Action = "input_required" | "processing" | "completed" | "error";

/**
 * Represents a single question with rich UI options
 */
export interface QuestionOption {
  /** The question text to display */
  title: string;

  /** Additional context or help text for the question */
  description?: string;

  /** The input type for the question */
  type: InputType;

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
 * Progress information for multi-step processes
 */
export interface Progress {
  /** Current step number */
  current_step: number;

  /** Total number of steps */
  total_steps: number;

  /** Name/description of the current step */
  step_name: string;
}

/**
 * Tax calculation summary data
 */
export interface TaxCalculationSummary {
  gross_income: number;
  total_deductions: number;
  taxable_income: number;
  total_tax: number;
  tds_paid?: number;
  refund_amount?: number;
  tax_payable?: number;
}

/**
 * Breakdown of deductions
 */
export interface DeductionBreakdown {
  standard_deduction?: number;
  section_80c?: number;
  section_80d?: number;
  section_80e?: number;
  section_80g?: number;
  section_24?: number;
  hra_exemption?: number;
  [key: string]: number | undefined;
}

/**
 * Tax slab-wise breakdown
 */
export interface TaxBreakdown {
  slab_0_to_250000?: number;
  slab_250000_to_500000?: number;
  slab_500000_to_1000000?: number;
  slab_1000000_to_1500000?: number;
  slab_above_1000000?: number;
  cess_4_percent?: number;
  surcharge?: number;
  [key: string]: number | undefined;
}

/**
 * Tax optimization suggestion
 */
export interface OptimizationSuggestion {
  type: string;
  current: number;
  max_limit: number;
  potential_additional: number;
  tax_saving: number;
  description?: string;
}

/**
 * Tax regime comparison
 */
export interface RegimeComparison {
  old_regime_tax: number;
  new_regime_tax: number;
  savings_with_old?: number;
  savings_with_new?: number;
  recommended?: "old" | "new";
}

/**
 * Result of ITR form submission
 */
export interface ITRSubmissionResult {
  /** Acknowledgement number from tax department */
  acknowledgement_number: string;

  /** Date when ITR was submitted */
  submission_date: string;

  /** Type of ITR form used (ITR1, ITR2, etc.) */
  itr_form_type: string;

  /** Current status of the submission */
  status: string;

  /** Additional message or information */
  message: string;
}

/**
 * Result of refund tracking
 */
export interface RefundTrackingResult {
  /** Acknowledgement number of the filed ITR */
  acknowledgement_number: string;

  /** Refund amount if applicable */
  refund_amount?: number;

  /** Current status of the refund */
  refund_status: string;

  /** Expected date of refund credit */
  expected_date?: string;

  /** Any additional remarks */
  remarks?: string;
}

/**
 * Income source details
 */
export interface IncomeSource {
  type: string;
  amount: number;
  source?: string;
  employer_tan?: string;
  [key: string]: any;
}

/**
 * Extended data that can be included in responses
 */
export interface TaxMitraResponseData {
  // Tax calculation data
  summary?: TaxCalculationSummary;
  deduction_breakdown?: DeductionBreakdown;
  tax_breakdown?: TaxBreakdown;
  optimization_suggestions?: OptimizationSuggestion[];

  // Comparison data
  quick_comparison?: RegimeComparison;
  regime_comparison?: RegimeComparison;

  // Income data
  income_sources?: IncomeSource[];
  detected_deductions?: Record<string, number>;
  remaining_potential?: string[];

  // Submission/tracking data
  itr_submission?: ITRSubmissionResult;
  refund_tracking?: RefundTrackingResult;

  // Additional flexible data
  [key: string]: any;
}

/**
 * Main structured response format for Tax Mitra agent
 */
export interface TaxMitraResponse {
  /** The main response message to display to the user */
  message: string;

  /** Questions to ask the user - can be simple strings or rich question objects */
  questions?: string[] | QuestionOption[];

  /** Any additional data or results to display */
  data?: TaxMitraResponseData;

  /** Status of the response */
  status?: Status;

  /** What action is expected next */
  action?: Action;

  /** Progress information for multi-step processes */
  progress?: Progress;
}

/**
 * Type guard to check if questions are QuestionOption objects
 */
export function isQuestionOptions(
  questions: string[] | QuestionOption[]
): questions is QuestionOption[] {
  return questions.length > 0 && typeof questions[0] === "object";
}

/**
 * Type guard to check if data contains tax calculation summary
 */
export function hasTaxCalculationSummary(
  data: TaxMitraResponseData | undefined
): data is TaxMitraResponseData & { summary: TaxCalculationSummary } {
  return !!data?.summary;
}

/**
 * Type guard to check if data contains regime comparison
 */
export function hasRegimeComparison(
  data: TaxMitraResponseData | undefined
): data is TaxMitraResponseData & {
  quick_comparison: RegimeComparison;
} {
  return !!data?.quick_comparison || !!data?.regime_comparison;
}

/**
 * Type guard to check if data contains ITR submission result
 */
export function hasITRSubmission(
  data: TaxMitraResponseData | undefined
): data is TaxMitraResponseData & { itr_submission: ITRSubmissionResult } {
  return !!data?.itr_submission;
}

/**
 * Type guard to check if data contains refund tracking result
 */
export function hasRefundTracking(
  data: TaxMitraResponseData | undefined
): data is TaxMitraResponseData & { refund_tracking: RefundTrackingResult } {
  return !!data?.refund_tracking;
}

/**
 * Helper to format Indian currency
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Global type guard for the entire response structure.
 * Requires both `message` (string) AND `action` (valid Action enum value)
 * to avoid false positives on generic assistant text responses.
 */
export function isTaxMitraResponse(data: any): data is TaxMitraResponse {
  return (
    data &&
    typeof data === "object" &&
    typeof data.message === "string" &&
    typeof data.action === "string" &&
    ["input_required", "processing", "completed", "error"].includes(data.action)
  );
}
