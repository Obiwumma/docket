import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getFirestore } from "firebase-admin/firestore";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getFirestore();
    const userId = session.user.id;

    // Step 1: Check user's document in Firestore for teamId or role
    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.exists ? userDoc.data() : null;

    // Step 2: Check if user has a pending join request in joinRequests collection
    const pendingQuery = await db
      .collection("joinRequests")
      .where("userId", "==", userId)
      .where("status", "==", "pending")
      .limit(1)
      .get();

    const hasPendingRequest = !pendingQuery.empty;
    let pendingTeamName = "";

    if (hasPendingRequest) {
      const requestData = pendingQuery.docs[0].data();
      const teamQuery = await db
        .collection("teams")
        .where("teamId", "==", requestData.teamId)
        .limit(1)
        .get();

      if (!teamQuery.empty) {
        pendingTeamName = teamQuery.docs[0].data().name;
      }
    }

    return NextResponse.json({
      teamId: userData?.teamId || null,
      role: userData?.role || null,
      hasPendingRequest: hasPendingRequest,
      pendingTeamName: pendingTeamName,
    });
  } catch (error: any) {
    console.error("Error fetching onboarding status:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
