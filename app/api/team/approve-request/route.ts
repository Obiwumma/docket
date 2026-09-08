import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { approveJoinRequest } from "@/lib/firebaseUtils";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { requestId, userId, teamId } = await request.json();

    if (!requestId || !userId || !teamId) {
      return NextResponse.json(
        { error: "requestId, userId, and teamId are required" },
        { status: 400 }
      );
    }

    // Call approveJoinRequest utility function from lib/firebaseUtils.ts
    const result = await approveJoinRequest(requestId, userId, teamId);

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("Error approving join request in Firestore:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
