import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// NextAuth withAuth wrapper protects specified routes automatically via proxy
export default withAuth(
  function proxy(req) {
    // Step 1: Retrieve the user token and target URL path
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Step 2: If a user has logged in but has not chosen a role yet, redirect them to onboarding
    if (path.startsWith("/dashboard") && !token?.role) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // Step 3: If a Member attempts to access the Lead Dashboard, redirect them to the Member Dashboard
    if (path.startsWith("/dashboard/lead") && token?.role !== "lead") {
      return NextResponse.redirect(new URL("/dashboard/member", req.url));
    }

    // Step 4: Allow the request to proceed if all checks pass
    return NextResponse.next();
  },
  {
    callbacks: {
      // Step 5: Check if the user is authenticated (token exists)
      authorized: ({ token }) => !!token,
    },
    pages: {
      // Step 6: If unauthenticated, redirect to our custom login page
      signIn: "/login",
    },
  }
);

// Step 7: Configure matchers for the routes protected by this proxy
export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*"],
};
