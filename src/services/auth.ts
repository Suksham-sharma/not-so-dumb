import { SignupFormData } from "@/hooks/useAuth";
import axios from "axios";

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  token: string;
  user: any; // TODO: Define proper user type
}

export const authService = {
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    try {
      const response = await axios.post("/api/auth/login", data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Login failed");
      }
      throw error;
    }
  },

  saveAuthData: (token: string, user: any) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },

  getAuthData: () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return {
      token,
      user: user ? JSON.parse(user) : null,
    };
  },

  clearAuthData: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  signup: async (data: SignupFormData) => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Signup failed");
    }

    return response.json();
  },
};
