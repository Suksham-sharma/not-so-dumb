"use client";

import TopBar from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { FadeIn, GradientBlob } from "@/components/ui/motion";
import YellowButton from "@/components/ui/yellow-button";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] relative overflow-hidden">
      <div className="pt-14 pb-24 relative">
        <div className="absolute inset-0 bg-white/50" />
        <main className="mx-auto p-4 relative">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-12">
              <FadeIn>
                <YellowButton className="mb-6">Welcome Back!</YellowButton>
              </FadeIn>
              <FadeIn delay={0.1} className="text-4xl font-heading mb-4">
                Login to Your Account
              </FadeIn>
            </div>

            <FadeIn
              delay={0.2}
              className="space-y-6 bg-orange-100/80 p-8 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <form>
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-lg font-bold text-black mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all focus:translate-x-[3px] focus:translate-y-[3px] focus:shadow-none"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-lg font-bold text-black mb-2"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all focus:translate-x-[3px] focus:translate-y-[3px] focus:shadow-none"
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 border-2 border-black rounded focus:ring-0 focus:ring-offset-0"
                      />
                      <span>Remember me</span>
                    </label>
                    <a href="#" className="text-blue-600 hover:underline">
                      Forgot password?
                    </a>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-green-400 text-black font-bold py-3 px-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
                  >
                    Login
                  </Button>

                  <div className="text-center text-sm">
                    Do not have an account?{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Sign up
                    </a>
                  </div>
                </div>
              </form>
            </FadeIn>
          </div>
        </main>
      </div>
    </div>
  );
}
