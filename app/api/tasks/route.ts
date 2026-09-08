import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getFirestore } from "firebase-admin/firestore";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getFirestore();
    const snapshot = await db.collection("tasks").orderBy("createdAt", "desc").get();

    const tasks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ tasks });
  } catch (error: any) {
    console.error("Error fetching tasks from Firestore:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, assignee, dueDate, description } = body;

    if (!title) {
      return NextResponse.json({ error: "Task title is required" }, { status: 400 });
    }

    const db = getFirestore();
    const newTask = {
      title,
      assignee: assignee || "Unassigned",
      dueDate: dueDate || "TBD",
      description: description || "",
      status: "To Do",
      completed: false,
      createdBy: session.user.id || session.user.email,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("tasks").add(newTask);

    return NextResponse.json({
      task: {
        id: docRef.id,
        ...newTask,
      },
    });
  } catch (error: any) {
    console.error("Error adding task to Firestore:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
