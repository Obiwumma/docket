import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getFirestore } from "firebase-admin/firestore";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { completed, status } = body;

    const db = getFirestore();
    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (typeof completed === "boolean") {
      updateData.completed = completed;
    }

    if (typeof status === "string") {
      updateData.status = status;
    }

    await db.collection("tasks").doc(id).update(updateData);

    return NextResponse.json({ success: true, id, updateData });
  } catch (error: any) {
    console.error("Error updating task in Firestore:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
