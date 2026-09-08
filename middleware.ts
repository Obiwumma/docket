import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // If user has not selected a role yet and tries to access dashboard, redirect to onboarding
    if (path.startsWith("/dashboard") && !token?.role) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // If a Member tries to access the Lead Dashboard, redirect them to Member Dashboard
    if (path.startsWith("/dashboard/lead") && token?.role !== "lead") {
      return NextResponse.redirect(new URL("/dashboard/member", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*"],
};
