import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import { StateCreator } from "zustand";

interface User {
  id: string;
  email?: string;
  name?: string;
  walletAddress?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setAuthData: (token: string, user: User) => void;
  clearAuthData: () => void;
  setWalletAddress: (walletAddress: string) => void;
  authMethod: "email" | "wallet" | null;
  setAuthMethod: (method: "email" | "wallet") => void;
}

type AuthPersist = (
  config: StateCreator<AuthState>,
  options: PersistOptions<AuthState>
) => StateCreator<AuthState>;

export const useAuthStore = create<AuthState>()(
  (persist as AuthPersist)(
    (set) => ({
      token: null,
      user: null,
      authMethod: null,
      setAuthData: (token: string, user: User) => set({ token, user }),
      clearAuthData: () => set({ token: null, user: null, authMethod: null }),
      setWalletAddress: (walletAddress: string) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, walletAddress }
            : { id: walletAddress, walletAddress },
        })),
      setAuthMethod: (authMethod: "email" | "wallet") => set({ authMethod }),
    }),
    {
      name: "auth-storage",
    }
  )
);
