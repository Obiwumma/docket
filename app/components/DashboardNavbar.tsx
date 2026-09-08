"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function DashboardNavbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [activeRole, setActiveRole] = useState<string | null>(null);

  useEffect(() => {
    // Read role from session, or fallback to localStorage
    const roleFromSession = session?.user?.role;
    if (roleFromSession) {
      setActiveRole(roleFromSession);
    } else if (typeof window !== "undefined") {
      const localRole = localStorage.getItem("docket_user_role");
      if (localRole) setActiveRole(localRole);
    }
  }, [session]);

  const isLead = activeRole === "lead" || pathname.includes("/dashboard/lead");
  const isMember = activeRole === "member" || pathname.includes("/dashboard/member");

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("docket_user_role");
    }
    signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="bg-[#091540] border-b border-gray-800 py-4 px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="text-2xl font-bold text-white tracking-tight">
            Docket<span className="text-[#1B2CC1]">.</span>
          </Link>
          {activeRole && (
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1B2CC1] text-white px-2 py-0.5 rounded">
              {activeRole}
            </span>
          )}
        </div>

        {/* Universal Navigation Links */}
        <div className="flex items-center gap-3 text-sm font-medium">
          <Link
            href="/dashboard/member"
            className={`px-3 py-1 rounded transition text-xs font-bold ${
              pathname === "/dashboard/member"
                ? "bg-[#1B2CC1] text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Member Dashboard
          </Link>

          <Link
            href="/dashboard/lead"
            className={`px-3 py-1 rounded transition text-xs font-bold ${
              pathname === "/dashboard/lead"
                ? "bg-[#1B2CC1] text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Lead Dashboard
          </Link>

          <Link
            href="/dashboard/chat"
            className={`px-3 py-1 rounded transition text-xs font-bold ${
              pathname === "/dashboard/chat"
                ? "bg-[#1B2CC1] text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Team Chat
          </Link>

          {/* User Email/Name Badge */}
          {session?.user?.name || session?.user?.email ? (
            <span className="hidden sm:inline-block text-xs font-semibold text-gray-300 bg-white/10 px-2 py-1 rounded">
              {session.user.name || session.user.email}
            </span>
          ) : null}

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="ml-1 border border-gray-600 hover:border-white text-gray-300 hover:text-white px-3 py-1 text-xs font-bold uppercase transition-colors rounded"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
