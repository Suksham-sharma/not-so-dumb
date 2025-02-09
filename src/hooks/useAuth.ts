import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService, LoginFormData } from "@/services/auth";

export interface SignupFormData {
  email: string;
  password: string;
  name: string;
}

export const useAuth = () => {
  const router = useRouter();

  const login = async (data: LoginFormData) => {
    try {
      const { token, user } = await authService.login(data);
      authService.saveAuthData(token, user);
      toast.success("Login successful!");
      router.push("/quiz");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
      throw error;
    }
  };

  const signup = async (data: SignupFormData) => {
    try {
      const { token, user } = await authService.signup(data);
      authService.saveAuthData(token, user);
      toast.success("Account created successfully!");
      router.push("/quiz");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Signup failed");
      throw error;
    }
  };

  const logout = () => {
    authService.clearAuthData();
    router.push("/login");
  };

  const getAuthData = () => {
    return authService.getAuthData();
  };

  return { login, logout, signup, getAuthData };
};
