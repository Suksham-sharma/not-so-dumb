"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import AuthFormWrapper from "../components/AuthFormWrapper";
import FormInput from "../components/FormInput";
import Link from "next/link";
import { useSolanaAuth } from "@/hooks/useSolanaAuth";
import SolanaWalletButton from "@/components/SolanaWalletButton";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { login } = useAuth();
  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <AuthFormWrapper title="Login" subtitle="Welcome Back! 👋">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 relative z-10"
      >
        <FormInput
          label="Email"
          id="email"
          type="email"
          placeholder="Enter your email"
          error={errors.email?.message}
          register={register}
          name="email"
          disabled={isSubmitting}
        />

        <FormInput
          label="Password"
          id="password"
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          register={register}
          name="password"
          disabled={isSubmitting}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center space-x-2 cursor-pointer group">
            <input
              {...register("rememberMe")}
              type="checkbox"
              className="w-4 h-4 border-2 border-black rounded focus:ring-0 focus:ring-offset-0 transition-transform group-hover:scale-110"
            />
            <span>Remember me</span>
          </label>
          <a
            href="#"
            className="text-blue-600 hover:underline hover:text-blue-700 transition-colors"
          >
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-400 text-black font-bold py-4 px-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-green-300 transform translate-y-full group-hover:translate-y-0 transition-transform" />
          <span className="relative z-10">
            {isSubmitting ? "Logging in..." : "Login →"}
          </span>
        </Button>

        <div className="relative flex items-center pt-2">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-2 text-gray-600 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="flex justify-center mb-2">
          <SolanaWalletButton onLogin={() => router.push("/quiz")} />
        </div>

        <div className="text-center text-sm mt-6">
          <span className="text-gray-600">Don&apos;t have an account? </span>
          <Link
            href="/signup"
            className="text-blue-600 hover:underline font-medium hover:text-blue-700 transition-colors"
          >
            Sign up
          </Link>
        </div>
      </form>
    </AuthFormWrapper>
  );
}
