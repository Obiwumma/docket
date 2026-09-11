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

    // Fetch current user document to retrieve teamId & role
    const userDoc = await db.collection("users").doc(session.user.id).get();
    const userData = userDoc.exists ? userDoc.data() : null;

    if (!userData || !userData.teamId) {
      return NextResponse.json(
        { success: false, message: "No team associated with this user" },
        { status: 404 }
      );
    }

    const teamId = userData.teamId;

    // Fetch team document from "teams" collection matching teamId
    const teamSnapshot = await db
      .collection("teams")
      .where("teamId", "==", teamId)
      .limit(1)
      .get();

    if (teamSnapshot.empty) {
      return NextResponse.json(
        { success: false, message: "Team record not found" },
        { status: 404 }
      );
    }

    const teamDocData = teamSnapshot.docs[0].data();

    return NextResponse.json({
      success: true,
      team: {
        id: teamSnapshot.docs[0].id,
        teamId: teamDocData.teamId,
        name: teamDocData.name || "My Team",
        leadId: teamDocData.leadId,
        createdAt: teamDocData.createdAt,
      },
      role: userData.role || "lead",
    });
  } catch (error: any) {
    console.error("Error fetching team info:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
