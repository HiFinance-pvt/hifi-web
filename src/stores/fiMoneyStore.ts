import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FiMoneyData {
  userId: string;
  accounts: Array<{
    id: string;
    name: string;
    type: string;
    balance: number;
    currency: string;
    lastUpdated: string;
  }>;
  transactions: Array<{
    id: string;
    accountId: string;
    amount: number;
    description: string;
    category: string;
    date: string;
    type: "debit" | "credit";
  }>;
  totalBalance: number;
  lastSyncTime: number;
  isConnected: boolean;
}

export interface FiMoneyStore {
  // State
  fiData: FiMoneyData | null;
  isLoading: boolean;
  error: string | null;
  connectionStatus: "disconnected" | "connecting" | "connected" | "failed";

  // Actions
  setFiData: (data: FiMoneyData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setConnectionStatus: (
    status: "disconnected" | "connecting" | "connected" | "failed"
  ) => void;
  clearFiData: () => void;
  updateLastSync: () => void;

  // API Actions
  connectToFiMoney: () => Promise<void>;
  fetchFiData: () => Promise<void>;
  disconnectFiMoney: () => void;

  // Helper getters
  hasData: () => boolean;
  isDataStale: () => boolean;
}

export const useFiMoneyStore = create<FiMoneyStore>()(
  persist(
    (set, get) => ({
      // Initial state
      fiData: null,
      isLoading: false,
      error: null,
      connectionStatus: "disconnected",

      // Basic actions
      setFiData: (data) => set({ fiData: data, connectionStatus: "connected" }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setConnectionStatus: (status) => set({ connectionStatus: status }),
      clearFiData: () =>
        set({
          fiData: null,
          connectionStatus: "disconnected",
          error: null,
        }),
      updateLastSync: () =>
        set((state) => ({
          fiData: state.fiData
            ? {
                ...state.fiData,
                lastSyncTime: Date.now(),
              }
            : null,
        })),

      // API Actions
      connectToFiMoney: async () => {
        const { setLoading, setError, setConnectionStatus, setFiData } = get();
        setLoading(true);
        setError(null);
        setConnectionStatus("connecting");

        try {
          // TODO: Replace with actual FI Money API call
          // For now, simulate the connection
          await new Promise((resolve) => setTimeout(resolve, 2000));

          // Mock data - replace with actual API response
          const mockData: FiMoneyData = {
            userId: "current-user-id", // This should come from auth
            accounts: [
              {
                id: "acc-1",
                name: "Main Savings",
                type: "savings",
                balance: 150000,
                currency: "INR",
                lastUpdated: new Date().toISOString(),
              },
              {
                id: "acc-2",
                name: "Checking Account",
                type: "checking",
                balance: 25000,
                currency: "INR",
                lastUpdated: new Date().toISOString(),
              },
            ],
            transactions: [
              {
                id: "txn-1",
                accountId: "acc-1",
                amount: -5000,
                description: "ATM Withdrawal",
                category: "cash",
                date: new Date().toISOString(),
                type: "debit",
              },
              {
                id: "txn-2",
                accountId: "acc-1",
                amount: 50000,
                description: "Salary Credit",
                category: "salary",
                date: new Date().toISOString(),
                type: "credit",
              },
            ],
            totalBalance: 175000,
            lastSyncTime: Date.now(),
            isConnected: true,
          };

          setFiData(mockData);
          setConnectionStatus("connected");
        } catch (error) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to connect to FI Money"
          );
          setConnectionStatus("failed");
        } finally {
          setLoading(false);
        }
      },

      fetchFiData: async () => {
        const { setLoading, setError, setFiData, connectionStatus } = get();

        if (connectionStatus !== "connected") {
          setError("Not connected to FI Money");
          return;
        }

        setLoading(true);
        setError(null);

        try {
          // TODO: Replace with actual FI Money API call to fetch latest data
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // For now, just update the lastSyncTime
          get().updateLastSync();
        } catch (error) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to fetch FI Money data"
          );
        } finally {
          setLoading(false);
        }
      },

      disconnectFiMoney: () => {
        const { clearFiData } = get();
        clearFiData();
      },

      // Helper getters
      hasData: () => {
        const { fiData } = get();
        return fiData !== null && fiData.isConnected;
      },

      isDataStale: () => {
        const { fiData } = get();
        if (!fiData) return true;

        const now = Date.now();
        const oneHour = 60 * 60 * 1000;
        return now - fiData.lastSyncTime > oneHour;
      },
    }),
    {
      name: "fi-money-storage",
      partialize: (state) => ({
        fiData: state.fiData,
        connectionStatus: state.connectionStatus,
      }),
    }
  )
);
