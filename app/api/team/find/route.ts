import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getFirestore } from "firebase-admin/firestore";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { teamId } = await request.json();

    if (!teamId || !teamId.trim()) {
      return NextResponse.json({ error: "Team ID is required" }, { status: 400 });
    }

    const db = getFirestore();
    const querySnapshot = await db
      .collection("teams")
      .where("teamId", "==", teamId.trim().toUpperCase())
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return NextResponse.json({ found: false, message: "No team found with that ID." });
    }

    const teamDoc = querySnapshot.docs[0];
    const teamData = teamDoc.data();

    return NextResponse.json({
      found: true,
      team: {
        id: teamDoc.id,
        name: teamData.name,
        teamId: teamData.teamId,
        leadId: teamData.leadId,
      },
    });
  } catch (error: any) {
    console.error("Error searching team in Firestore:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
