import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  login: (payload: { token: string; user: AuthUser }) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      login: ({ token, user }) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      isAuthenticated: () => Boolean(get().token),
    }),
    {
      name: "lost-found-auth",
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
);
