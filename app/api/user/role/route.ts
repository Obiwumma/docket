import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getFirestore } from "firebase-admin/firestore";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role } = await request.json();

    if (!role || (role !== "lead" && role !== "member")) {
      return NextResponse.json({ error: "Invalid role specified" }, { status: 400 });
    }

    const db = getFirestore();
    await db.collection("users").doc(session.user.id).set(
      {
        role,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return NextResponse.json({ success: true, role });
  } catch (error: any) {
    console.error("Error updating user role in Firestore:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
