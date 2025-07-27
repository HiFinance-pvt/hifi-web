import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BoolStore {
  // states
  fiConnection: boolean;

  // actions
  setFiConnection: (fiConnection: boolean) => void;
}

export const useBoolStore = create<BoolStore>()(
  persist(
    (set) => ({
      fiConnection: false,

      setFiConnection: (fiConnection: boolean) => set({ fiConnection }),
    }),
    {
      name: "bool-store",
    }
  )
);
