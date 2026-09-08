import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { requestToJoinTeam } from "@/lib/firebaseUtils";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { teamId } = await request.json();

    if (!teamId || !teamId.trim()) {
      return NextResponse.json({ error: "Team ID is required" }, { status: 400 });
    }

    // Call requestToJoinTeam utility from lib/firebaseUtils.ts
    const joinRequest = await requestToJoinTeam(teamId.trim().toUpperCase(), session.user.id);

    return NextResponse.json({ success: true, joinRequest });
  } catch (error: any) {
    console.error("Error creating join request in Firestore:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
