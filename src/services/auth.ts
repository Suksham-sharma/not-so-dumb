import { SignupFormData } from "@/hooks/useAuth";
import axios from "axios";

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  token: string;
  user: any;
}

import { useAuthStore } from "@/store/auth";

axios.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    try {
      const response = await axios.post("/api/auth/login", data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || "Login failed");
      }
      throw error;
    }
  },

  saveAuthData: (token: string, user: any) => {
    useAuthStore.getState().setAuthData(token, user);
  },

  getAuthData: () => {
    const { token, user } = useAuthStore.getState();
    return { token, user };
  },

  clearAuthData: () => {
    useAuthStore.getState().clearAuthData();
  },

  signup: async (data: SignupFormData) => {
    const response = await axios.post("/api/auth/signup", data);
    return response.data;
  },
};
