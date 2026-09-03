"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  // Simple beginner state management
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Toggle visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation alert banner state
  const [showErrorBanner, setShowErrorBanner] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form submission handler matching design logic
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setShowErrorBanner(true);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <main className="relative w-full min-h-screen lg:pt-0">
      <div className="flex flex-col w-full bg-[#091540] text-white">
        <div className="w-full max-w-6xl mx-auto px-margin-mobile lg:px-gutter py-xl lg:py-xxl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl items-start">
            
            {/* Left Column: Brand & Architecture */}
            <div className="lg:col-span-6 flex flex-col space-y-xl">
              <div className="space-y-md">
                <div className="font-display text-display uppercase tracking-tight text-white">
                  Docket<span className="text-[#1B2CC1]">.</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg uppercase font-bold text-white tracking-tight leading-tight">
                  PROJECT MANAGEMENT.<br />WITHOUT THE NOISE.
                </h1>
                <p className="font-body-lg text-body-lg text-white max-w-md font-normal opacity-90">
                  Organize your team&apos;s work, assign tasks, and keep projects moving with absolute clarity.
                </p>
              </div>

              {/* Embedded Flat Geometric Productivity Illustration Container */}
              <div className="border-2 border-white/20 bg-[#091540] p-md">
                <div className="w-full h-64 relative bg-[#091540] flex items-center justify-center overflow-hidden border border-white/10">
                  <img
                    alt="Docket project management architectural diagram"
                    className="w-full h-full object-contain p-4 filter contrast-125"
                    src="https://lh3.googleusercontent.com/aida/AEtjO1WNECsCPAbeFtux0639YhMe2HbK3f0_x3hs-7EGYRORc7E4LAxncwfTMPW-56BXEXQKx5EmdfPcRF8t9BjnlbGSJpO0RPRrgkhYa-TM-d7lOJga83RWRu9GqXIHMyBqPiZ9u8C7zugUROHIfnV7-hoeSL8GAP28326Z_cubELg-534CiYFo9KrTMryQxc6eUbawVbGwO_Hv4NjcjEptpf9Rx7V9BOXFsXLP9RQKs1JH05j_X0Elr80OZR0"
                  />
                </div>
              </div>

              {/* Strict Structural Value Propositions */}
              <div className="border-t-2 border-white/20 pt-lg space-y-md">
                <div className="flex items-start space-x-md">
                  <span className="font-label-md text-label-md text-[#1B2CC1] font-bold tracking-widest pt-1">
                    01
                  </span>
                  <div>
                    <span className="font-label-md text-label-md uppercase font-bold text-white tracking-wider">
                      CREATE
                    </span>
                    <p className="font-body-md text-body-md text-white/80">
                      Define tasks with rigorous, distraction-free clarity.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-md">
                  <span className="font-label-md text-label-md text-[#1B2CC1] font-bold tracking-widest pt-1">
                    02
                  </span>
                  <div>
                    <span className="font-label-md text-label-md uppercase font-bold text-white tracking-wider">
                      ASSIGN
                    </span>
                    <p className="font-body-md text-body-md text-white/80">
                      Distribute team deliverables seamlessly across modules.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-md">
                  <span className="font-label-md text-label-md text-[#1B2CC1] font-bold tracking-widest pt-1">
                    03
                  </span>
                  <div>
                    <span className="font-label-md text-label-md uppercase font-bold text-white tracking-wider">
                      COMPLETE
                    </span>
                    <p className="font-body-md text-body-md text-white/80">
                      Track project velocity directly without redundant noise.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Sign Up Form */}
            <div className="lg:col-span-6 bg-white text-[#091540] p-lg lg:p-xl border-2 border-white rounded-none">
              
              {/* Header */}
              <div className="border-b-2 border-[#091540] pb-md mb-lg">
                <div className="font-label-sm text-label-sm uppercase font-bold tracking-widest text-[#1B2CC1] mb-xs">
                  GET STARTED
                </div>
                <h2 className="font-headline-lg text-headline-lg uppercase font-bold text-[#091540] tracking-tight">
                  CREATE YOUR ACCOUNT.
                </h2>
                <p className="font-body-md text-body-md text-[#091540] mt-xs">
                  Start organizing your team&apos;s work with Docket.
                </p>
              </div>

              {/* Form Interface */}
              <div className="space-y-sm mb-md">
                <button
                  type="button"
                  className="w-full h-12 border-2 border-[#091540] bg-white hover:bg-[#091540] text-[#091540] hover:text-white transition-colors flex items-center justify-center space-x-sm font-label-md text-label-md uppercase font-bold tracking-wider"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                  <span>Sign in with Google</span>
                </button>

                <button
                  type="button"
                  className="w-full h-12 border-2 border-[#091540] bg-white hover:bg-[#091540] text-[#091540] hover:text-white transition-colors flex items-center justify-center space-x-sm font-label-md text-label-md uppercase font-bold tracking-wider"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                  <span>Sign in with GitHub</span>
                </button>

                <div className="relative flex items-center justify-center py-xs">
                  <div className="w-full border-t-2 border-[#091540]/20 absolute"></div>
                  <span className="relative bg-white px-md font-label-sm text-label-sm uppercase font-bold text-[#091540] tracking-widest">
                    OR WITH EMAIL
                  </span>
                </div>
              </div>

              <form className="space-y-md" id="signupForm" onSubmit={handleFormSubmit}>
                {/* Full Name */}
                <div className="flex flex-col space-y-xs">
                  <label className="font-label-md text-label-md uppercase font-bold text-[#091540]" htmlFor="fullName">
                    FULL NAME
                  </label>
                  <input
                    className="w-full h-12 px-md border-2 border-[#091540] text-[#091540] placeholder:text-[#091540]/40 font-body-md text-body-md bg-white focus:outline-none focus:border-[#1B2CC1]"
                    id="fullName"
                    name="fullName"
                    placeholder="Enter your full name"
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                {/* Email Address */}
                <div className="flex flex-col space-y-xs">
                  <label className="font-label-md text-label-md uppercase font-bold text-[#091540]" htmlFor="email">
                    EMAIL ADDRESS
                  </label>
                  <input
                    className="w-full h-12 px-md border-2 border-[#091540] text-[#091540] placeholder:text-[#091540]/40 font-body-md text-body-md bg-white focus:outline-none focus:border-[#1B2CC1]"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Password Field */}
                <div className="flex flex-col space-y-xs">
                  <label className="font-label-md text-label-md uppercase font-bold text-[#091540]" htmlFor="password">
                    PASSWORD
                  </label>
                  <div className="relative flex items-center">
                    <input
                      className={`w-full h-12 pl-md pr-12 border-2 border-[#091540] text-[#091540] placeholder:text-[#091540]/40 font-body-md text-body-md bg-white focus:outline-none focus:border-[#1B2CC1] ${
                        showErrorBanner ? "border-4" : ""
                      }`}
                      id="password"
                      minLength={8}
                      name="password"
                      placeholder="Create a password"
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      aria-label="Toggle password visibility"
                      className="absolute right-0 top-0 bottom-0 px-md flex items-center justify-center text-[#091540] hover:text-[#1B2CC1] transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-headline-md" id="passwordToggleIcon">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>

                  {/* Requirement Note */}
                  <div className="flex items-center space-x-xs pt-xs">
                    <span className="w-1.5 h-1.5 bg-[#1B2CC1] inline-block"></span>
                    <p className="font-label-sm text-label-sm text-[#091540]">
                      Password must contain at least 8 characters.
                    </p>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="flex flex-col space-y-xs">
                  <label className="font-label-md text-label-md uppercase font-bold text-[#091540]" htmlFor="confirmPassword">
                    CONFIRM PASSWORD
                  </label>
                  <div className="relative flex items-center">
                    <input
                      className={`w-full h-12 pl-md pr-12 border-2 border-[#091540] text-[#091540] placeholder:text-[#091540]/40 font-body-md text-body-md bg-white focus:outline-none focus:border-[#1B2CC1] ${
                        showErrorBanner ? "border-4" : ""
                      }`}
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      required
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      aria-label="Toggle confirm password visibility"
                      className="absolute right-0 top-0 bottom-0 px-md flex items-center justify-center text-[#091540] hover:text-[#1B2CC1] transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-headline-md" id="confirmPasswordToggleIcon">
                        {showConfirmPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Simulated High-Contrast Validation Demonstration Alert Box */}
                <div
                  className={`border-2 border-[#091540] bg-[#091540] text-white p-md space-y-xs ${
                    showErrorBanner ? "" : "hidden"
                  }`}
                  id="errorDemoBanner"
                >
                  <div className="flex items-center space-x-xs font-label-md text-label-md uppercase font-bold text-white">
                    <span className="material-symbols-outlined text-headline-md text-white">error</span>
                    <span>ATTENTION REQUIRED</span>
                  </div>
                  <p className="font-body-md text-body-md text-white">
                    [DEMO ERROR STATE]: Passwords must match exactly and contain at least 8 characters.
                  </p>
                </div>

                {/* Terms Checkbox */}
                <div className="pt-xs flex items-start space-x-sm">
                  <input
                    className="mt-1 w-4 h-4 rounded-none border-2 border-[#091540] text-[#1B2CC1] focus:ring-0 focus:outline-none cursor-pointer"
                    id="terms"
                    name="terms"
                    required
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                  <label className="font-body-md text-body-md text-[#091540] select-none cursor-pointer" htmlFor="terms">
                    I agree to the{" "}
                    <a className="font-bold text-[#1B2CC1] underline hover:text-[#091540]" href="#">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a className="font-bold text-[#1B2CC1] underline hover:text-[#091540]" href="#">
                      Privacy Policy
                    </a>
                    .
                  </label>
                </div>

                {/* Primary Submit CTA */}
                <div className="pt-sm">
                  <button
                    className={`w-full h-14 font-label-md text-label-md uppercase font-bold tracking-wider transition-colors flex items-center justify-center ${
                      isSubmitted
                        ? "bg-[#091540] text-white"
                        : isSubmitting
                        ? "bg-[#1B2CC1] text-white opacity-90"
                        : "bg-[#1B2CC1] text-white hover:bg-[#091540]"
                    }`}
                    id="submitBtn"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitted ? "ACCOUNT CREATED" : isSubmitting ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                  </button>
                </div>

                {/* Account Switch Link */}
                <div className="text-center pt-xs">
                  <p className="font-body-md text-body-md text-[#091540]">
                    Already have an account?{" "}
                    <Link className="font-bold text-[#1B2CC1] underline hover:text-[#091540] ml-xs" href="/login">
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>

              {/* Minimal Error State Demonstration Trigger */}
              <div className="mt-lg pt-md border-t-2 border-[#091540] flex items-center justify-between">
                <span className="font-label-sm text-label-sm uppercase font-bold text-[#091540]">
                  Test Design System State:
                </span>
                <button
                  className="font-label-sm text-label-sm uppercase font-bold text-white bg-[#091540] px-sm py-1 hover:bg-[#1B2CC1] transition-colors"
                  onClick={() => setShowErrorBanner(!showErrorBanner)}
                  type="button"
                >
                  Toggle Validation Alert
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
