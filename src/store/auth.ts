import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setAuthData: (token: string, user: User) => void;
  clearAuthData: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuthData: (token, user) => set({ token, user }),
      clearAuthData: () => set({ token: null, user: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);
