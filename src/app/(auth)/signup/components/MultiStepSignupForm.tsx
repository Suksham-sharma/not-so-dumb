"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import React, { useState } from "react";
import FormInput from "../../components/FormInput";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

const basicInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

const passwordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type BasicInfoData = z.infer<typeof basicInfoSchema>;
type PasswordData = z.infer<typeof passwordSchema>;

interface MultiStepSignupFormProps {
  destination?: string;
}

export default function MultiStepSignupForm({
  destination = "quiz",
}: MultiStepSignupFormProps) {
  const [step, setStep] = useState(1);
  const [basicInfo, setBasicInfo] = useState<BasicInfoData | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register: registerBasicInfo,
    handleSubmit: handleBasicInfoSubmit,
    formState: { errors: basicInfoErrors, isSubmitting: isBasicInfoSubmitting },
  } = useForm<BasicInfoData>({
    resolver: zodResolver(basicInfoSchema),
    mode: "onChange",
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
  });

  const { signup } = useAuth();

  const onBasicInfoSubmit = async (data: BasicInfoData) => {
    setBasicInfo(data);
    setStep(2);
  };

  const onPasswordSubmit = async (data: PasswordData) => {
    if (!basicInfo) return;

    try {
      await signup(
        {
          email: basicInfo.email,
          name: basicInfo.name,
          password: data.password,
        },
        destination
      );
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="space-y-6 relative z-10">
      {step === 1 ? (
        <form
          onSubmit={handleBasicInfoSubmit(onBasicInfoSubmit)}
          className="space-y-6"
        >
          <FormInput
            label="Name"
            id="name"
            type="text"
            placeholder="Enter your name"
            error={basicInfoErrors.name?.message}
            register={registerBasicInfo}
            name="name"
          />

          <FormInput
            label="Email"
            id="email"
            type="email"
            placeholder="Enter your email"
            error={basicInfoErrors.email?.message}
            register={registerBasicInfo}
            name="email"
          />

          <Button
            type="submit"
            disabled={isBasicInfoSubmitting}
            className="w-full bg-green-400 text-black font-bold py-4 px-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-green-300 transform translate-y-full group-hover:translate-y-0 transition-transform" />
            <span className="relative z-10">Next</span>
          </Button>
        </form>
      ) : (
        <form
          onSubmit={handlePasswordSubmit(onPasswordSubmit)}
          className="space-y-6"
        >
          <div className="relative">
            <FormInput
              label="Password"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              error={passwordErrors.password?.message}
              register={registerPassword}
              name="password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[2.85rem] p-2 text-black hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 bg-gray-200 text-black font-bold py-4 px-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
            >
              Back
            </Button>

            <Button
              type="submit"
              disabled={isPasswordSubmitting}
              className="flex-1 bg-green-400 text-black font-bold py-4 px-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-green-300 transform translate-y-full group-hover:translate-y-0 transition-transform" />
              <span className="relative z-10">
                {isPasswordSubmitting ? "Creating Account..." : "Sign Up"}
              </span>
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
