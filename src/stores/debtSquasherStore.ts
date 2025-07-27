import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DebtIntensity = 'mild' | 'balance' | 'aggressive';

export interface DebtPreferences {
  duration_months: number;
  intensity: DebtIntensity;
  lastUpdated: string;
}

export interface DebtData {
  userId: string;
  preferences: DebtPreferences;
  totalDebt: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  debtToIncomeRatio: number;
  debts: Array<{
    id: string;
    name: string;
    balance: number;
    interestRate: number;
    minimumPayment: number;
    type: 'credit_card' | 'personal_loan' | 'home_loan' | 'car_loan' | 'other';
  }>;
  payoffPlan?: {
    method: 'snowball' | 'avalanche';
    totalMonths: number;
    totalInterest: number;
    monthlyPayment: number;
    schedule: Array<{
      month: number;
      payment: number;
      principal: number;
      interest: number;
      remainingBalance: number;
    }>;
  };
  lastAnalysis: string;
}

export interface DebtSquasherStore {
  // State
  debtData: DebtData | null;
  preferences: DebtPreferences | null;
  isLoading: boolean;
  error: string | null;
  hasPreferences: boolean;

  // Actions
  setDebtData: (data: DebtData) => void;
  setPreferences: (preferences: DebtPreferences) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearDebtData: () => void;
  clearPreferences: () => void;

  // API Actions
  analyzeDebt: () => Promise<void>;
  generatePayoffPlan: () => Promise<void>;

  // Helper getters
  hasData: () => boolean;
  hasCompleteData: () => boolean;
  getDataForPrompt: () => string;
}

export const useDebtSquasherStore = create<DebtSquasherStore>()(
  persist(
    (set, get) => ({
      // Initial state
      debtData: null,
      preferences: null,
      isLoading: false,
      error: null,
      hasPreferences: false,

      // Basic actions
      setDebtData: (data) => set({ debtData: data }),
      setPreferences: (preferences) => set({ 
        preferences, 
        hasPreferences: true 
      }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearDebtData: () => set({ 
        debtData: null, 
        error: null 
      }),
      clearPreferences: () => set({ 
        preferences: null, 
        hasPreferences: false 
      }),

      // API Actions
      analyzeDebt: async () => {
        const { setLoading, setError, preferences } = get();
        
        if (!preferences) {
          setError('Preferences not set. Please set duration and intensity first.');
          return;
        }

        setLoading(true);
        setError(null);

        try {
          // TODO: Replace with actual debt analysis API call
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Mock debt analysis data
          const mockDebtData: DebtData = {
            userId: 'current-user-id',
            preferences,
            totalDebt: 250000,
            monthlyIncome: 80000,
            monthlyExpenses: 45000,
            debtToIncomeRatio: 31.25, // (250000 / (80000 * 12)) * 100
            debts: [
              {
                id: 'debt-1',
                name: 'Credit Card 1',
                balance: 50000,
                interestRate: 24.0,
                minimumPayment: 2500,
                type: 'credit_card'
              },
              {
                id: 'debt-2',
                name: 'Personal Loan',
                balance: 150000,
                interestRate: 12.0,
                minimumPayment: 8000,
                type: 'personal_loan'
              },
              {
                id: 'debt-3',
                name: 'Car Loan',
                balance: 50000,
                interestRate: 8.5,
                minimumPayment: 3000,
                type: 'car_loan'
              }
            ],
            lastAnalysis: new Date().toISOString()
          };

          set({ debtData: mockDebtData });
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Failed to analyze debt');
        } finally {
          setLoading(false);
        }
      },

      generatePayoffPlan: async () => {
        const { setLoading, setError, debtData } = get();
        
        if (!debtData) {
          setError('No debt data available. Please analyze debt first.');
          return;
        }

        setLoading(true);
        setError(null);

        try {
          // TODO: Replace with actual payoff plan generation
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Generate mock payoff plan based on intensity
          const { intensity, duration_months } = debtData.preferences;
          const availableForDebt = debtData.monthlyIncome - debtData.monthlyExpenses;
          
          let multiplier = 1;
          switch (intensity) {
            case 'mild':
              multiplier = 1.2;
              break;
            case 'balance':
              multiplier = 1.5;
              break;
            case 'aggressive':
              multiplier = 2.0;
              break;
          }

          const suggestedPayment = Math.min(
            availableForDebt * multiplier,
            debtData.totalDebt / duration_months
          );

          const mockPayoffPlan = {
            method: 'avalanche' as const,
            totalMonths: duration_months,
            totalInterest: 25000, // Mock calculation
            monthlyPayment: suggestedPayment,
            schedule: Array.from({ length: Math.min(duration_months, 12) }, (_, i) => ({
              month: i + 1,
              payment: suggestedPayment,
              principal: suggestedPayment * 0.7,
              interest: suggestedPayment * 0.3,
              remainingBalance: debtData.totalDebt - (suggestedPayment * 0.7 * (i + 1))
            }))
          };

          set({
            debtData: {
              ...debtData,
              payoffPlan: mockPayoffPlan
            }
          });
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Failed to generate payoff plan');
        } finally {
          setLoading(false);
        }
      },

      // Helper getters
      hasData: () => {
        const { debtData } = get();
        return debtData !== null;
      },

      hasCompleteData: () => {
        const { debtData, preferences } = get();
        return debtData !== null && preferences !== null;
      },

      getDataForPrompt: () => {
        const { debtData, preferences } = get();
        
        if (!debtData || !preferences) {
          return 'No debt data available. Please set preferences and analyze debt first.';
        }

        const { totalDebt, monthlyIncome, monthlyExpenses, debtToIncomeRatio, debts, payoffPlan } = debtData;
        const { duration_months, intensity } = preferences;

        return `
DEBT ANALYSIS SUMMARY:
- Total Debt: ₹${totalDebt.toLocaleString()}
- Monthly Income: ₹${monthlyIncome.toLocaleString()}
- Monthly Expenses: ₹${monthlyExpenses.toLocaleString()}
- Debt-to-Income Ratio: ${debtToIncomeRatio.toFixed(2)}%
- Available for Debt Payment: ₹${(monthlyIncome - monthlyExpenses).toLocaleString()}

USER PREFERENCES:
- Target Duration: ${duration_months} months
- Payment Intensity: ${intensity}

DEBT BREAKDOWN:
${debts.map(debt => 
  `  ${debt.name}: ₹${debt.balance.toLocaleString()} @ ${debt.interestRate}% (Min: ₹${debt.minimumPayment})`
).join('\n')}

${payoffPlan ? `
PAYOFF PLAN (${payoffPlan.method.toUpperCase()}):
- Monthly Payment: ₹${payoffPlan.monthlyPayment.toLocaleString()}
- Total Duration: ${payoffPlan.totalMonths} months
- Total Interest: ₹${payoffPlan.totalInterest.toLocaleString()}
` : 'No payoff plan generated yet.'}

Use this debt information to provide personalized debt reduction strategies and financial advice.`;
      },
    }),
    {
      name: 'debt-squasher-storage',
      partialize: (state) => ({
        debtData: state.debtData,
        preferences: state.preferences,
        hasPreferences: state.hasPreferences,
      }),
    }
  )
); 