"use client";

import React, { useState } from "react";

interface FoundTeam {
  id: string;
  name: string;
  teamId: string;
  leadId: string;
}

/**
 * JoinTeamForm Component for Team Member onboarding step.
 * Uses flat editorial styling with sharp corners (rounded-none),
 * deep navy background (bg-[#091540]), white text, and vibrant blue buttons (bg-[#1B2CC1]).
 */
export default function JoinTeamForm() {
  // Step 1: Initialize basic useState variables for input, found team, and loading states
  const [teamCodeInput, setTeamCodeInput] = useState("");
  const [foundTeam, setFoundTeam] = useState<FoundTeam | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Step 2: Handle Team ID search form submission
  async function handleSearchTeam(e: React.FormEvent) {
    e.preventDefault();
    if (!teamCodeInput.trim()) return;

    setIsSearching(true);
    setErrorMessage("");
    setFoundTeam(null);
    setRequestSent(false);

    try {
      // Step 2a: Query Firestore to find a team matching the input Team ID
      const response = await fetch("/api/team/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId: teamCodeInput }),
      });

      const data = await response.json();

      if (response.ok && data.found) {
        // Step 2b: Store the found team in state to display team details and Request to Join button
        setFoundTeam(data.team);
      } else {
        setErrorMessage(data.message || "No team found matching that Team ID.");
      }
    } catch (error) {
      console.error("Error searching for team:", error);
      setErrorMessage("Something went wrong searching for the team. Please try again.");
    } finally {
      setIsSearching(false);
    }
  }

  // Step 3: Handle "Request to Join" button click
  async function handleRequestToJoin() {
    if (!foundTeam) return;

    setIsSubmittingRequest(true);
    setErrorMessage("");

    try {
      // Step 3a: Call API to execute requestToJoinTeam utility from lib/firebaseUtils.ts
      const response = await fetch("/api/team/join-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId: foundTeam.teamId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send join request.");
      }

      // Step 3b: Change UI state to "Waiting for Approval"
      setRequestSent(true);
    } catch (error: any) {
      console.error("Error sending join request:", error);
      setErrorMessage(error.message || "Failed to send join request. Please try again.");
    } finally {
      setIsSubmittingRequest(false);
    }
  }

  return (
    <div className="w-full max-w-md bg-[#091540] text-white p-8 border-2 border-white rounded-none">
      {/* Header Section */}
      <div className="border-b-2 border-white pb-4 mb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-[#1B2CC1] bg-white px-2 py-0.5 inline-block mb-2 rounded-none">
          MEMBER ONBOARDING
        </span>
        <h2 className="text-3xl font-bold uppercase tracking-tight text-white">
          JOIN A TEAM.
        </h2>
        <p className="text-sm text-gray-300 mt-1">
          Enter your 6-character Team ID (e.g. DK7X92) to request access.
        </p>
      </div>

      {/* Error Message Banner */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-600 text-white text-xs font-bold uppercase rounded-none">
          {errorMessage}
        </div>
      )}

      {/* State 1: Search Form (Input for Team ID) */}
      {!foundTeam && (
        <form onSubmit={handleSearchTeam} className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label htmlFor="teamId" className="text-xs uppercase font-bold text-gray-200 tracking-wider">
              TEAM ID
            </label>
            <input
              id="teamId"
              type="text"
              required
              maxLength={6}
              value={teamCodeInput}
              onChange={(e) => setTeamCodeInput(e.target.value.toUpperCase())}
              placeholder="e.g. DK7X92"
              className="w-full h-12 px-4 bg-[#091540] border-2 border-white text-white placeholder-gray-400 text-sm font-mono tracking-widest uppercase focus:outline-none focus:border-[#1B2CC1] rounded-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className="w-full h-12 bg-[#1B2CC1] hover:bg-blue-700 text-white font-bold text-sm uppercase tracking-wider transition-colors rounded-none disabled:opacity-50"
          >
            {isSearching ? "FINDING TEAM..." : "SEARCH TEAM →"}
          </button>
        </form>
      )}

      {/* State 2: Found Team Result & Request to Join Button */}
      {foundTeam && !requestSent && (
        <div className="space-y-6">
          <div className="p-4 border-2 border-white bg-white/5 space-y-2 rounded-none">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1B2CC1] bg-white px-2 py-0.5 inline-block">
              TEAM FOUND
            </span>
            <h3 className="text-xl font-bold uppercase text-white">
              {foundTeam.name}
            </h3>
            <p className="text-xs text-gray-300 font-mono">
              CODE: {foundTeam.teamId}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setFoundTeam(null);
                setTeamCodeInput("");
              }}
              className="w-1/3 h-12 border-2 border-white text-white font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-[#091540] transition-colors rounded-none"
            >
              CANCEL
            </button>

            <button
              type="button"
              onClick={handleRequestToJoin}
              disabled={isSubmittingRequest}
              className="w-2/3 h-12 bg-[#1B2CC1] hover:bg-blue-700 text-white font-bold text-sm uppercase tracking-wider transition-colors rounded-none disabled:opacity-50"
            >
              {isSubmittingRequest ? "SENDING..." : "REQUEST TO JOIN →"}
            </button>
          </div>
        </div>
      )}

      {/* State 3: Waiting for Approval Confirmation */}
      {requestSent && (
        <div className="p-6 border-2 border-yellow-400 bg-yellow-400/10 text-center space-y-3 rounded-none">
          <div className="inline-block px-3 py-1 bg-yellow-400 text-[#091540] text-xs font-extrabold uppercase tracking-widest rounded-none">
            WAITING FOR APPROVAL
          </div>
          <h3 className="text-lg font-bold uppercase text-white">
            Request Sent to {foundTeam?.name}!
          </h3>
          <p className="text-xs text-gray-300">
            Your join request is now pending. Once your Team Lead approves your request, you will automatically gain access.
          </p>
        </div>
      )}
    </div>
  );
}
