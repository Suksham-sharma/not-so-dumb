import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService, LoginFormData } from "@/services/auth";
import { toastStyles } from "@/lib/styles";
import axios from "axios";
import { useAuthStore } from "@/store/auth";

export interface SignupFormData {
  email: string;
  password: string;
  name: string;
}

export const useAuth = () => {
  const router = useRouter();
  const setAuthMethod = useAuthStore((state) => state.setAuthMethod);

  const login = async (data: LoginFormData) => {
    try {
      const { token, user } = await authService.login(data);
      authService.saveAuthData(token, user);
      setAuthMethod("email");
      document.cookie = `token=${token}; path=/; max-age=604800`;
      toast.success("Login successful!", {
        className: toastStyles.success,
      });
      await router.push("/quiz");
      router.refresh();
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message ||
          error.response?.data?.error ||
          "An error occurred during login"
        : error instanceof Error
        ? error.message
        : "An unexpected error occurred during login";

      toast.error(errorMessage, {
        className: toastStyles.error,
      });
      throw error;
    }
  };

  const signup = async (data: SignupFormData) => {
    try {
      const { token, user } = await authService.signup(data);
      authService.saveAuthData(token, user);
      setAuthMethod("email");
      document.cookie = `token=${token}; path=/; max-age=604800`;
      toast.success("Account created successfully!", {
        className: toastStyles.success,
      });
      router.push("/quiz");
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message ||
          error.response?.data?.error ||
          "An error occurred during signup"
        : error instanceof Error
        ? error.message
        : "An unexpected error occurred during signup";

      toast.error(errorMessage, {
        className: toastStyles.error,
      });
      throw error;
    }
  };

  const logout = () => {
    authService.clearAuthData();
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

  const isAuthenticated = () => {
    const { token } = authService.getAuthData();
    return !!token;
  };

  const getAuthData = () => {
    return authService.getAuthData();
  };

  const { user } = getAuthData();
  return { login, logout, signup, getAuthData, isAuthenticated, user };
};
