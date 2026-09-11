"use client";

import React, { useState, useEffect } from "react";

interface TeamInfo {
  id?: string;
  teamId: string;
  name: string;
  leadId?: string;
  createdAt?: string;
}

export default function TeamInfoBanner() {
  const [team, setTeam] = useState<TeamInfo | null>(null);
  const [role, setRole] = useState<string>("lead");
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchTeamInfo() {
      try {
        const response = await fetch("/api/team/info");
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.team) {
            setTeam(data.team);
            if (data.role) setRole(data.role);
          }
        }
      } catch (error) {
        console.error("Error fetching team info:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTeamInfo();
  }, []);

  const handleCopyCode = () => {
    if (!team?.teamId) return;
    navigator.clipboard.writeText(team.teamId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (isLoading) {
    return (
      <div className="w-full bg-[#0b1a4f] border-2 border-white/20 p-6 animate-pulse flex flex-col gap-3">
        <div className="h-4 w-32 bg-white/20 rounded-none"></div>
        <div className="h-8 w-64 bg-white/20 rounded-none"></div>
      </div>
    );
  }

  if (!team || role !== "lead") {
    return null;
  }

  return (
    <div className="w-full bg-[#0b1a4f] border-2 border-white p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      {/* Left side: Team Details */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest bg-[#1B2CC1] text-white px-2 py-0.5 rounded-none">
            {role === "lead" ? "TEAM WORKSPACE" : "MEMBER WORKSPACE"}
          </span>
          <span className="text-xs text-gray-300 font-mono">
            ID: <strong className="text-white">{team.teamId}</strong>
          </span>
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight uppercase">
          {team.name}
        </h2>

        <p className="text-xs md:text-sm text-gray-300 max-w-xl">
          Share this unique Team ID with your team members so they can join your workspace during onboarding.
        </p>
      </div>

      {/* Right side: Unique Team ID & Copy Action Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
        <div className="bg-[#091540] border-2 border-[#1B2CC1] px-4 py-2.5 flex items-center justify-between sm:justify-start gap-4">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">
              UNIQUE TEAM ID
            </span>
            <span className="text-xl font-mono font-black text-amber-400 tracking-widest">
              {team.teamId}
            </span>
          </div>
        </div>

        <button
          onClick={handleCopyCode}
          className={`h-full min-h-[48px] px-6 text-xs font-bold uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer border-2 ${
            copied
              ? "bg-emerald-600 border-emerald-400 text-white"
              : "bg-[#1B2CC1] hover:bg-blue-700 border-white text-white"
          }`}
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
              <span>COPIED!</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span>COPY TEAM ID</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
