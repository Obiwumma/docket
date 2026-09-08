"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

/**
 * CreateTeamForm Component for Team Lead onboarding step.
 * Uses stark, flat editorial design with sharp corners (rounded-none),
 * deep navy background (bg-[#091540]), white text, and vibrant blue primary button (bg-[#1B2CC1]).
 */
export default function CreateTeamForm() {
  // Step 1: Initialize hooks and component state
  const router = useRouter();
  const { update } = useSession();
  const [teamName, setTeamName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Step 2: Handle form submission linearly and simply
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!teamName.trim()) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // Step 2a: Send request to API endpoint which executes createTeam from lib/firebaseUtils.ts
      const response = await fetch("/api/team/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create team");
      }

      // Step 2b: Update session to set user role to lead
      if (typeof window !== "undefined") {
        localStorage.setItem("docket_user_role", "lead");
      }
      await update({ role: "lead" });

      // Step 2c: Redirect user to the Lead Dashboard upon success
      router.push("/dashboard/lead");
    } catch (error: any) {
      console.error("Error creating team:", error);
      setErrorMessage(error.message || "Failed to create team. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md bg-[#091540] text-white p-8 border-2 border-white rounded-none">
      {/* Header Section */}
      <div className="border-b-2 border-white pb-4 mb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-[#1B2CC1] bg-white px-2 py-0.5 inline-block mb-2 rounded-none">
          TEAM LEAD ONBOARDING
        </span>
        <h2 className="text-3xl font-bold uppercase tracking-tight text-white">
          CREATE A TEAM.
        </h2>
        <p className="text-sm text-gray-300 mt-1">
          Enter your team name to generate a workspace for your members.
        </p>
      </div>

      {/* Error Message Display */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-600 text-white text-xs font-bold uppercase rounded-none">
          {errorMessage}
        </div>
      )}

      {/* Single Input Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col space-y-2">
          <label htmlFor="teamName" className="text-xs uppercase font-bold text-gray-200 tracking-wider">
            TEAM NAME
          </label>
          <input
            id="teamName"
            type="text"
            required
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Enter team name..."
            className="w-full h-12 px-4 bg-[#091540] border-2 border-white text-white placeholder-gray-400 text-sm focus:outline-none focus:border-[#1B2CC1] rounded-none"
          />
        </div>

        {/* Primary Action Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-[#1B2CC1] hover:bg-blue-700 text-white font-bold text-sm uppercase tracking-wider transition-colors rounded-none disabled:opacity-50"
        >
          {isSubmitting ? "CREATING TEAM..." : "CREATE WORKSPACE →"}
        </button>
      </form>
    </div>
  );
}
