import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TaxRegime = "old" | "new";

export interface TaxPreferences {
  totalSalary: number;
  otherIncomeSources: number;
  regime: TaxRegime;
  employeeTAN?: string; // Optional
  panNumber: string;
  residenceStatus: "indian" | "foreign";
  lastUpdated: string;
}

export interface TaxData {
  userId: string;
  preferences: TaxPreferences;
  totalIncome: number;
  estimatedTaxLiability: {
    oldRegime: number;
    newRegime: number;
  };
  taxSavings: number;
  recommendations: string[];
  deductions: {
    section80C: number;
    section80D: number;
    section80TTA: number;
    hra: number;
    otherDeductions: number;
  };
  lastAnalysis: string;
}

export interface TaxTraderStore {
  // State
  taxData: TaxData | null;
  preferences: TaxPreferences | null;
  isLoading: boolean;
  error: string | null;
  hasPreferences: boolean;

  // Actions
  setTaxData: (data: TaxData) => void;
  setPreferences: (preferences: TaxPreferences) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearTaxData: () => void;
  clearPreferences: () => void;

  // API Actions
  analyzeTax: () => Promise<void>;
  generateTaxPlan: () => Promise<void>;

  // Helper getters
  hasData: () => boolean;
  hasCompleteData: () => boolean;
  getDataForPrompt: () => string;
}

export const useTaxTraderStore = create<TaxTraderStore>()(
  persist(
    (set, get) => ({
      // Initial state
      taxData: null,
      preferences: null,
      isLoading: false,
      error: null,
      hasPreferences: false,

      // Basic actions
      setTaxData: (data) => set({ taxData: data }),
      setPreferences: (preferences) =>
        set({
          preferences,
          hasPreferences: true,
        }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearTaxData: () =>
        set({
          taxData: null,
          error: null,
        }),
      clearPreferences: () =>
        set({
          preferences: null,
          hasPreferences: false,
        }),

      // API Actions
      analyzeTax: async () => {
        const { setLoading, setError, preferences } = get();

        if (!preferences) {
          setError(
            "Preferences not set. Please provide your income details first."
          );
          return;
        }

        setLoading(true);
        setError(null);

        try {
          // TODO: Replace with actual tax analysis API call
          await new Promise((resolve) => setTimeout(resolve, 2000));

          const { totalSalary, otherIncomeSources, regime } = preferences;
          const totalIncome = totalSalary + otherIncomeSources;

          // Mock tax calculations (simplified)
          const oldRegimeTax = calculateOldRegimeTax(totalIncome);
          const newRegimeTax = calculateNewRegimeTax(totalIncome);
          const taxSavings = Math.abs(oldRegimeTax - newRegimeTax);

          // Mock tax analysis data
          const mockTaxData: TaxData = {
            userId: "current-user-id",
            preferences,
            totalIncome,
            estimatedTaxLiability: {
              oldRegime: oldRegimeTax,
              newRegime: newRegimeTax,
            },
            taxSavings,
            recommendations: [
              "Consider Section 80C investments up to ₹1.5L",
              "Health insurance premium under Section 80D",
              "HRA exemption if applicable",
              "NPS contribution for additional deduction",
            ],
            deductions: {
              section80C: Math.min(totalIncome * 0.1, 150000),
              section80D: 25000,
              section80TTA: 10000,
              hra: totalSalary * 0.4,
              otherDeductions: 50000,
            },
            lastAnalysis: new Date().toISOString(),
          };

          set({ taxData: mockTaxData });
        } catch (error) {
          setError(
            error instanceof Error ? error.message : "Failed to analyze tax"
          );
        } finally {
          setLoading(false);
        }
      },

      generateTaxPlan: async () => {
        const { setLoading, setError, taxData } = get();

        if (!taxData) {
          setError("No tax data available. Please analyze tax first.");
          return;
        }

        setLoading(true);
        setError(null);

        try {
          // TODO: Replace with actual tax plan generation
          await new Promise((resolve) => setTimeout(resolve, 1500));

          // Mock tax plan generation
          const { preferences, totalIncome, estimatedTaxLiability } = taxData;

          // Generate recommendations based on regime preference
          const recommendations =
            preferences.regime === "old"
              ? [
                  "Maximize Section 80C deductions",
                  "Consider ELSS funds for tax efficiency",
                  "Optimize HRA exemption",
                  "Plan NPS contributions",
                ]
              : [
                  "Focus on tax-efficient investments",
                  "Consider tax-free bonds",
                  "Optimize salary structure",
                  "Plan for long-term capital gains",
                ];

          set({
            taxData: {
              ...taxData,
              recommendations,
            },
          });
        } catch (error) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to generate tax plan"
          );
        } finally {
          setLoading(false);
        }
      },

      // Helper getters
      hasData: () => {
        const { taxData } = get();
        return taxData !== null;
      },

      hasCompleteData: () => {
        const { taxData, preferences } = get();
        return taxData !== null && preferences !== null;
      },

      getDataForPrompt: () => {
        const { taxData, preferences } = get();

        if (!taxData || !preferences) {
          return "No tax data available. Please provide income details and analyze tax first.";
        }

        const {
          totalIncome,
          estimatedTaxLiability,
          taxSavings,
          recommendations,
          deductions,
        } = taxData;
        const {
          totalSalary,
          otherIncomeSources,
          regime,
          employeeTAN,
          panNumber,
          residenceStatus,
        } = preferences;

        return `
TAX ANALYSIS SUMMARY:
- PAN Number: ${panNumber}
- Total Salary: ₹${totalSalary.toLocaleString()}
- Other Income Sources: ₹${otherIncomeSources.toLocaleString()}
- Total Income: ₹${totalIncome.toLocaleString()}
- Preferred Regime: ${regime === "old" ? "Old Tax Regime" : "New Tax Regime"}
- Residence Status: ${
          residenceStatus === "indian" ? "Indian Resident" : "Foreign Resident"
        }
${employeeTAN ? `- Employee TAN: ${employeeTAN}` : ""}

TAX LIABILITY COMPARISON:
- Old Regime Tax: ₹${estimatedTaxLiability.oldRegime.toLocaleString()}
- New Regime Tax: ₹${estimatedTaxLiability.newRegime.toLocaleString()}
- Potential Tax Savings: ₹${taxSavings.toLocaleString()}

AVAILABLE DEDUCTIONS (Old Regime):
- Section 80C: ₹${deductions.section80C.toLocaleString()}
- Section 80D (Health): ₹${deductions.section80D.toLocaleString()}
- Section 80TTA (Interest): ₹${deductions.section80TTA.toLocaleString()}
- HRA Exemption: ₹${deductions.hra.toLocaleString()}
- Other Deductions: ₹${deductions.otherDeductions.toLocaleString()}

RECOMMENDATIONS:
${recommendations.map((rec) => `- ${rec}`).join("\n")}

Use this tax information to provide personalized tax planning strategies and optimization advice.`;
      },
    }),
    {
      name: "tax-trader-storage",
      partialize: (state) => ({
        taxData: state.taxData,
        preferences: state.preferences,
        hasPreferences: state.hasPreferences,
      }),
    }
  )
);

// Helper functions for tax calculations (simplified)
function calculateOldRegimeTax(income: number): number {
  // Simplified tax calculation for old regime
  if (income <= 250000) return 0;
  if (income <= 500000) return (income - 250000) * 0.05;
  if (income <= 1000000) return 12500 + (income - 500000) * 0.2;
  return 112500 + (income - 1000000) * 0.3;
}

function calculateNewRegimeTax(income: number): number {
  // Simplified tax calculation for new regime
  if (income <= 300000) return 0;
  if (income <= 600000) return (income - 300000) * 0.05;
  if (income <= 900000) return 15000 + (income - 600000) * 0.1;
  if (income <= 1200000) return 45000 + (income - 900000) * 0.15;
  if (income <= 1500000) return 90000 + (income - 1200000) * 0.2;
  return 150000 + (income - 1500000) * 0.3;
}
