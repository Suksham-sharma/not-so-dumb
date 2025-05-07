"use client";

import React from "react";
import AuthFormWrapper from "../components/AuthFormWrapper";
import MultiStepSignupForm from "./components/MultiStepSignupForm";
import SolanaWalletButton from "@/components/SolanaWalletButton";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  return (
    <AuthFormWrapper title="Sign Up" subtitle="Join Us! 🎉">
      <div className="flex flex-col space-y-5">
        <MultiStepSignupForm />
        <div className="relative flex items-center pt-2">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-2 text-gray-600 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="flex justify-center mb-2">
          <SolanaWalletButton onLogin={() => router.push("/quiz")} />
        </div>
        <div className="text-center text-sm mt-6">
          <span className="text-gray-600">Already have an account? </span>
          <Link
            href="/login"
            className="text-blue-600 hover:underline font-medium hover:text-blue-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </AuthFormWrapper>
  );
}
