"use client";

import React from "react";
import AuthFormWrapper from "../components/AuthFormWrapper";
import MultiStepSignupForm from "./components/MultiStepSignupForm";

export default function SignupPage() {
  return (
    <AuthFormWrapper title="Sign Up" subtitle="Join Us! 🎉">
      <MultiStepSignupForm />
    </AuthFormWrapper>
  );
}
