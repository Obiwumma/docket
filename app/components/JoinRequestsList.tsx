"use client";

import React, { useState, useEffect } from "react";

interface JoinRequest {
  id: string;
  requestId: string;
  teamId: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: string;
  createdAt?: string;
}

/**
 * JoinRequestsList Component for Team Lead Dashboard.
 * Renders pending join requests in a flat, bordered list with Approve and Decline action buttons.
 */
export default function JoinRequestsList() {
  // Step 1: Initialize hooks and component state
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Step 2: Use useEffect hook to fetch pending join requests from Firestore when component mounts
  useEffect(() => {
    async function fetchPendingRequests() {
      try {
        const response = await fetch("/api/team/requests");
        if (response.ok) {
          const data = await response.json();
          setRequests(data.requests || []);
        }
      } catch (error) {
        console.error("Error fetching join requests:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPendingRequests();
    // Poll every 5 seconds for new incoming join requests
    const interval = setInterval(fetchPendingRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  // Step 3: Function executed when Team Lead clicks the bright "Approve" button
  async function handleApprove(request: JoinRequest) {
    setProcessingId(request.id);

    try {
      // Step 3a: Call API endpoint that runs approveJoinRequest utility function in lib/firebaseUtils.ts
      const response = await fetch("/api/team/approve-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: request.requestId || request.id,
          userId: request.userId,
          teamId: request.teamId,
        }),
      });

      if (response.ok) {
        // Step 3b: Remove approved request from local component state
        setRequests((previousRequests) =>
          previousRequests.filter((item) => item.id !== request.id)
        );
      }
    } catch (error) {
      console.error("Error approving join request:", error);
    } finally {
      setProcessingId(null);
    }
  }

  // Step 4: Function executed when Team Lead clicks the subtle "Decline" button
  async function handleDecline(requestId: string) {
    setProcessingId(requestId);

    try {
      // Remove request locally from state
      setRequests((previousRequests) =>
        previousRequests.filter((item) => item.id !== requestId)
      );
    } catch (error) {
      console.error("Error declining join request:", error);
    } finally {
      setProcessingId(null);
    }
  }

  // If loading, display minimal loading indicator
  if (isLoading) {
    return (
      <div className="p-4 border-2 border-white/20 bg-[#091540] text-gray-300 text-xs font-mono uppercase rounded-none">
        LOADING PENDING JOIN REQUESTS...
      </div>
    );
  }

  // If no pending requests exist
  if (requests.length === 0) {
    return (
      <div className="p-4 border-2 border-white/20 bg-[#091540] text-gray-300 text-xs font-semibold uppercase rounded-none">
        NO PENDING JOIN REQUESTS AT THIS TIME.
      </div>
    );
  }

  return (
    <div className="w-full bg-[#091540] text-white space-y-4">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b-2 border-white pb-3">
        <h3 className="text-lg font-bold uppercase tracking-wider text-white">
          PENDING JOIN REQUESTS ({requests.length})
        </h3>
        <span className="text-[10px] font-bold uppercase bg-[#1B2CC1] text-white px-2 py-0.5 rounded-none">
          ACTION REQUIRED
        </span>
      </div>

      {/* Flat, Bordered Requests List */}
      <div className="space-y-3">
        {requests.map((request) => (
          <div
            key={request.id}
            className="p-4 border-2 border-white bg-[#091540] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-none"
          >
            {/* Applicant Details */}
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-bold uppercase text-white">
                {request.userName}
              </span>
              <span className="text-xs text-gray-300 font-mono">
                {request.userEmail}
              </span>
              <span className="text-[10px] text-gray-400 font-mono uppercase">
                STATUS: PENDING
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              {/* Subtle Decline Button */}
              <button
                type="button"
                disabled={processingId === request.id}
                onClick={() => handleDecline(request.id)}
                className="px-3 py-1.5 border border-white/40 text-gray-300 hover:text-white hover:border-white text-xs font-bold uppercase tracking-wider transition-colors rounded-none disabled:opacity-50"
              >
                DECLINE
              </button>

              {/* Bright Approve Button */}
              <button
                type="button"
                disabled={processingId === request.id}
                onClick={() => handleApprove(request)}
                className="px-4 py-1.5 bg-[#1B2CC1] hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-none disabled:opacity-50"
              >
                {processingId === request.id ? "APPROVING..." : "APPROVE"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
