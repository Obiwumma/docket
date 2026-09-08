"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-navy border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        <Link href="/" className="text-white font-bold text-2xl tracking-tight">
          Docket<span className="text-vibrant-blue">.</span>
        </Link>

        <div className="hidden sm:flex items-center gap-8 text-sm font-medium text-ice-blue">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>

        {session ? (
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.removeItem("docket_user_role");
              }
              signOut({ callbackUrl: "/login" });
            }}
            className="bg-vibrant-blue hover:opacity-90 text-white text-sm font-medium py-2 px-5 rounded-md transition-colors"
          >
            Sign Out
          </button>
        ) : (
          <Link
            href="/login"
            className="bg-vibrant-blue hover:opacity-90 text-white text-sm font-medium py-2 px-5 rounded-md transition-colors"
          >
            Sign In
          </Link>
        )}

      </div>
    </nav>
  );
}