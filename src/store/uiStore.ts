import { create } from "zustand";

type UiState = {
  selectedUserId: number | null;
  setSelectedUserId: (id: number | null) => void;
};

export const useUiStore = create<UiState>((set) => ({
  selectedUserId: null,
  setSelectedUserId: (selectedUserId) => set({ selectedUserId }),
}));