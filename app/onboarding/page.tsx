"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CreateTeamForm from "@/app/components/CreateTeamForm";
import JoinTeamForm from "@/app/components/JoinTeamForm";

/**
 * OnboardingPage Component ("The Onboarding Traffic Cop")
 * Directs users based on their Firestore document status:
 * - If they already belong to a team, redirects to their dashboard.
 * - If they have a pending join request, strictly renders a "Waiting for Approval" screen.
 * - Otherwise, displays two large block buttons: 'CREATE A TEAM' or 'JOIN A TEAM'.
 */
export default function OnboardingPage() {
  // Step 1: Initialize hooks and component states
  const router = useRouter();
  const { data: session } = useSession();

  // State to toggle active view: "menu" | "create" | "join"
  const [activeView, setActiveView] = useState<"menu" | "create" | "join">("menu");

  // State for pending join request status
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [pendingTeamName, setPendingTeamName] = useState("");
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  // Step 2: Use useEffect to fetch user's onboarding status from Firestore on mount
  useEffect(() => {
    async function checkUserOnboardingStatus() {
      try {
        const response = await fetch("/api/user/status");
        if (response.ok) {
          const data = await response.json();

          // Step 2a: If user already has a teamId and role, redirect to dashboard immediately
          if (data.teamId && data.role) {
            if (data.role === "lead") {
              router.push("/dashboard/lead");
            } else {
              router.push("/dashboard/member");
            }
            return;
          }

          // Step 2b: If user has a pending join request, set pending state
          if (data.hasPendingRequest) {
            setHasPendingRequest(true);
            setPendingTeamName(data.pendingTeamName || "");
          }
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      } finally {
        setIsLoadingStatus(false);
      }
    }

    checkUserOnboardingStatus();
  }, [router]);

  return (
    <div className="w-full min-h-screen bg-[#091540] text-white flex flex-col justify-between">
      {/* Brand Header */}
      <header className="w-full max-w-6xl mx-auto px-6 pt-8 pb-4 flex items-center justify-between border-b border-white/10">
        <Link href="/" className="text-2xl font-bold tracking-tight text-white">
          Docket<span className="text-[#1B2CC1]">.</span>
        </Link>
        {session?.user?.email && (
          <span className="text-xs font-mono text-gray-300 bg-white/10 px-3 py-1 rounded-none">
            {session.user.email}
          </span>
        )}
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-6xl mx-auto px-6 py-10 flex-1 flex flex-col justify-center">
        {/* Loading Indicator */}
        {isLoadingStatus ? (
          <div className="max-w-md mx-auto p-6 border-2 border-white bg-[#091540] text-center font-mono text-xs uppercase tracking-widest text-gray-300 rounded-none">
            CHECKING WORKSPACE STATUS...
          </div>
        ) : hasPendingRequest ? (
          /* Step 3: Strictly render "Waiting for Approval" screen if user has a pending join request */
          <div className="max-w-xl mx-auto w-full p-8 border-2 border-yellow-400 bg-yellow-400/10 text-center space-y-4 rounded-none">
            <span className="inline-block px-3 py-1 bg-yellow-400 text-[#091540] text-xs font-extrabold uppercase tracking-widest rounded-none">
              WAITING FOR APPROVAL
            </span>
            <h2 className="text-3xl font-bold uppercase tracking-tight text-white">
              JOIN REQUEST PENDING.
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Your request to join {pendingTeamName ? <strong className="text-white">{pendingTeamName}</strong> : "the team"} has been submitted and is awaiting Team Lead approval.
            </p>
            <p className="text-xs text-gray-400 font-mono pt-2">
              Once approved, you will automatically gain access to your member workspace.
            </p>
          </div>
        ) : activeView === "create" ? (
          /* Step 4a: Render CreateTeamForm component */
          <div className="flex flex-col items-center justify-center">
            <button
              onClick={() => setActiveView("menu")}
              className="self-start text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white mb-6 border-b border-gray-400 rounded-none"
            >
              ← BACK TO SELECTION
            </button>
            <CreateTeamForm />
          </div>
        ) : activeView === "join" ? (
          /* Step 4b: Render JoinTeamForm component */
          <div className="flex flex-col items-center justify-center">
            <button
              onClick={() => setActiveView("menu")}
              className="self-start text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white mb-6 border-b border-gray-400 rounded-none"
            >
              ← BACK TO SELECTION
            </button>
            <JoinTeamForm />
          </div>
        ) : (
          /* Step 4c: Default View - Two Large Bordered Block Buttons */
          <div className="space-y-10">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1B2CC1] bg-white px-3 py-1 mb-4 inline-block rounded-none">
                WORKSPACE SETUP
              </span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight uppercase leading-tight mt-2 text-white">
                HOW WILL YOU USE DOCKET?
              </h1>
              <p className="text-lg text-gray-300 mt-3 font-normal">
                Select an option below to create a new workspace or join an existing team.
              </p>
            </div>

            {/* Block Buttons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Block Button 1: CREATE A TEAM */}
              <button
                type="button"
                onClick={() => setActiveView("create")}
                className="border-2 border-white p-8 bg-[#091540] hover:bg-[#1B2CC1] text-left transition-colors flex flex-col justify-between min-h-[260px] rounded-none group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-bold border-b-2 border-white pb-1">
                      01
                    </span>
                    <span className="text-xs font-bold uppercase border border-white px-2 py-1">
                      LEAD
                    </span>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-2">
                    I AM A TEAM LEAD
                  </p>
                  <h2 className="text-3xl font-bold uppercase tracking-tight text-white mb-3">
                    CREATE A TEAM (I am a Lead)
                  </h2>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Set up a new team workspace, assign tasks, and manage project progress.
                  </p>
                </div>

                <div className="pt-6 border-t border-white/20 mt-6 flex items-center justify-between text-lg font-bold uppercase">
                  <span>CREATE A TEAM &rarr;</span>
                </div>
              </button>

              {/* Block Button 2: JOIN A TEAM */}
              <button
                type="button"
                onClick={() => setActiveView("join")}
                className="border-2 border-white p-8 bg-[#091540] hover:bg-[#1B2CC1] text-left transition-colors flex flex-col justify-between min-h-[260px] rounded-none group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-bold border-b-2 border-white pb-1">
                      02
                    </span>
                    <span className="text-xs font-bold uppercase border border-white px-2 py-1">
                      MEMBER
                    </span>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-2">
                    I AM A MEMBER
                  </p>
                  <h2 className="text-3xl font-bold uppercase tracking-tight text-white mb-3">
                    JOIN A TEAM (I am a Member)
                  </h2>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Enter a Team ID to request access to your organization's workspace.
                  </p>
                </div>

                <div className="pt-6 border-t border-white/20 mt-6 flex items-center justify-between text-lg font-bold uppercase">
                  <span>JOIN A TEAM &rarr;</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}