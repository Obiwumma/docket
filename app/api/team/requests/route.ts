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

    // Get lead user's document to check their teamId
    const userDoc = await db.collection("users").doc(session.user.id).get();
    const userData = userDoc.exists ? userDoc.data() : null;
    const teamId = userData?.teamId;

    let query = db.collection("joinRequests").where("status", "==", "pending");

    if (teamId) {
      query = query.where("teamId", "==", teamId);
    }

    const snapshot = await query.get();

    // Format requests and enrich with user info if available
    const requests = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        let userName = "Team Member";
        let userEmail = data.userId;

        try {
          const applicantDoc = await db.collection("users").doc(data.userId).get();
          if (applicantDoc.exists) {
            const applicantData = applicantDoc.data();
            userName = applicantData?.name || applicantData?.email || userName;
            userEmail = applicantData?.email || userEmail;
          }
        } catch (e) {
          // Ignore fallback error
        }

        return {
          id: doc.id,
          requestId: doc.id,
          teamId: data.teamId,
          userId: data.userId,
          userName,
          userEmail,
          status: data.status,
          createdAt: data.createdAt,
        };
      })
    );

    return NextResponse.json({ requests });
  } catch (error: any) {
    console.error("Error fetching join requests from Firestore:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
