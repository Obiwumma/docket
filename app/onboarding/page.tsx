"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function OnboardingPage() {
  const router = useRouter();
  const { update } = useSession();
  const [selectedRole, setSelectedRole] = useState<"lead" | "member" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorBanner, setShowErrorBanner] = useState(false);

  const handleSelectRole = async (role: "lead" | "member") => {
    setSelectedRole(role);
    setIsSubmitting(true);
    setShowErrorBanner(false);

    if (typeof window !== "undefined") {
      localStorage.setItem("docket_user_role", role);
    }

    try {
      // 1. Asynchronous API call to update user document in Firestore
      const response = await fetch("/api/user/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        throw new Error("Failed to update role in Firestore");
      }

      // 2. Update NextAuth session in browser
      await update({ role });

      // 3. Redirect user to their role dashboard
      setIsSubmitting(false);
      if (role === "lead") {
        router.push("/dashboard/lead");
      } else {
        router.push("/dashboard/member");
      }
    } catch (error) {
      console.error("Error saving role to Firestore:", error);
      setShowErrorBanner(true);
      setIsSubmitting(false);
    }
  };

  const resetSelection = () => {
    setSelectedRole(null);
    setIsSubmitting(false);
    setShowErrorBanner(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#091540] text-white flex flex-col justify-between">
      <header className="w-full max-w-6xl mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight text-white">
          Docket<span className="text-[#1B2CC1]">.</span>
        </Link>
      </header>

      <main className="w-full max-w-6xl mx-auto px-6 py-10 flex-1 flex flex-col justify-center">
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1B2CC1] bg-white px-3 py-1 mb-4 inline-block">
            ROLE SELECTION
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight uppercase leading-tight mt-2">
            HOW WILL YOU USE DOCKET?
          </h1>
          <p className="text-lg text-gray-300 mt-3 font-normal">
            Choose the option that best describes your role to get started with your workspace.
          </p>
        </div>

        {showErrorBanner && (
          <div className="mb-6 border-2 border-white bg-[#091540] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 border-2 border-white flex items-center justify-center font-bold text-xs">
                !
              </span>
              <p className="text-sm font-semibold uppercase tracking-wide">
                Something went wrong saving your selection. Please try again.
              </p>
            </div>
            <button
              onClick={resetSelection}
              className="px-4 py-1 bg-white text-[#091540] text-xs font-bold uppercase hover:bg-[#1B2CC1] hover:text-white transition"
            >
              TRY AGAIN
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            onClick={() => handleSelectRole("lead")}
            className={`border-2 p-8 transition cursor-pointer flex flex-col justify-between ${
              selectedRole === "lead"
                ? "bg-[#1B2CC1] border-white"
                : selectedRole === "member"
                ? "bg-[#091540] border-white/20 opacity-40 pointer-events-none"
                : "bg-[#091540] border-white/40 hover:border-white hover:bg-[#1B2CC1]"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="text-4xl font-bold border-b-2 border-white pb-1">
                  01
                </span>
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 40 40" stroke="currentColor">
                  <rect x="3" y="3" width="14" height="14" strokeWidth="2.5" />
                  <rect x="23" y="3" width="14" height="14" strokeWidth="2.5" fill="currentColor" />
                  <rect x="13" y="23" width="14" height="14" strokeWidth="2.5" />
                </svg>
              </div>

              <p className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-2">
                I&apos;M A TEAM LEAD
              </p>
              <h2 className="text-3xl font-bold uppercase tracking-tight mb-4">
                CREATE A TEAM.
              </h2>
              <p className="text-gray-200 text-sm leading-relaxed">
                Create a workspace, assign tasks, track project velocity, and manage team members with absolute clarity.
              </p>
            </div>

            <div className="pt-10 border-t border-white/20 mt-8 flex items-center justify-between">
              <span className="text-lg font-bold uppercase tracking-wide flex items-center gap-2">
                {selectedRole === "lead" && isSubmitting ? (
                  <>CREATING YOUR TEAM...</>
                ) : (
                  <>CREATE A TEAM &rarr;</>
                )}
              </span>
              <span className="text-xs font-bold uppercase border border-white px-2 py-1">
                ADMIN
              </span>
            </div>
          </div>

          <div
            onClick={() => handleSelectRole("member")}
            className={`border-2 p-8 transition cursor-pointer flex flex-col justify-between ${
              selectedRole === "member"
                ? "bg-[#1B2CC1] border-white"
                : selectedRole === "lead"
                ? "bg-[#091540] border-white/20 opacity-40 pointer-events-none"
                : "bg-[#091540] border-white/40 hover:border-white hover:bg-[#1B2CC1]"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="text-4xl font-bold border-b-2 border-white pb-1">
                  02
                </span>
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 40 40" stroke="currentColor">
                  <circle cx="12" cy="12" r="7" strokeWidth="2.5" />
                  <circle cx="28" cy="12" r="7" strokeWidth="2.5" />
                  <circle cx="20" cy="28" r="7" strokeWidth="2.5" fill="currentColor" />
                </svg>
              </div>

              <p className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-2">
                I&apos;M A MEMBER
              </p>
              <h2 className="text-3xl font-bold uppercase tracking-tight mb-4">
                JOIN A TEAM.
              </h2>
              <p className="text-gray-200 text-sm leading-relaxed">
                Join your organization&apos;s workspace, view assigned work, and complete tasks without distraction.
              </p>
            </div>

            <div className="pt-10 border-t border-white/20 mt-8 flex items-center justify-between">
              <span className="text-lg font-bold uppercase tracking-wide flex items-center gap-2">
                {selectedRole === "member" && isSubmitting ? (
                  <>JOINING YOUR TEAM...</>
                ) : (
                  <>JOIN A TEAM &rarr;</>
                )}
              </span>
              <span className="text-xs font-bold uppercase border border-white px-2 py-1">
                MEMBER
              </span>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}