import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createTeam } from "@/lib/firebaseUtils";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { teamName } = body;

    if (!teamName || !teamName.trim()) {
      return NextResponse.json({ error: "Team name is required" }, { status: 400 });
    }

    // Call createTeam from lib/firebaseUtils.ts
    const team = await createTeam(teamName.trim(), session.user.id);

    return NextResponse.json({ success: true, team });
  } catch (error: any) {
    console.error("Error in create team API route:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
