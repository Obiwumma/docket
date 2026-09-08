"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardNavbar from "@/app/components/DashboardNavbar";
import JoinRequestsList from "@/app/components/JoinRequestsList";
import { db } from "@/lib/firebaseClient";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  QuerySnapshot,
  QueryDocumentSnapshot,
} from "firebase/firestore";

interface Task {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  status: string;
  completed: boolean;
  description?: string;
}

export default function LeadDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  // Form input states
  const [newTitle, setNewTitle] = useState("");
  const [newAssignee, setNewAssignee] = useState("Sarah Jenkins");
  const [newDueDate, setNewDueDate] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // Step 1: Plug Firestore onSnapshot listener into Task grid ("live wire" real-time listener)
  useEffect(() => {
    // Step 1a: Create query to fetch tasks ordered by creation timestamp descending
    const tasksQuery = query(
      collection(db, "tasks"),
      orderBy("createdAt", "desc")
    );

    // Step 1b: Attach onSnapshot live wire listener to automatically sync updates without page refresh
    const unsubscribe = onSnapshot(
      tasksQuery,
      (snapshot: QuerySnapshot) => {
        const liveTasks: Task[] = snapshot.docs.map((docSnapshot: QueryDocumentSnapshot) => {
          const data = docSnapshot.data();
          return {
            id: docSnapshot.id,
            title: data.title || "Untitled Task",
            assignee: data.assignee || "Unassigned",
            dueDate: data.dueDate || "No Due Date",
            status: data.status || "To Do",
            completed: Boolean(data.completed),
            description: data.description || "",
          };
        });

        // Step 1c: Set state with live Firestore data or fallback to sample tasks if empty
        if (liveTasks.length > 0) {
          setTasks(liveTasks);
        } else {
          setTasks([
            {
              id: "sample-1",
              title: "Q3 Marketing Strategy Deck",
              assignee: "Sarah Jenkins",
              dueDate: "Oct 12, 2023",
              status: "In Progress",
              completed: false,
            },
            {
              id: "sample-2",
              title: "Client Onboarding Portal Update",
              assignee: "Marcus Vance",
              dueDate: "Oct 15, 2023",
              status: "To Do",
              completed: false,
            },
          ]);
        }
      },
      (error: any) => {
        console.error("Error listening to real-time tasks grid onSnapshot:", error);
      }
    );

    // Step 1d: Clean up listener on component unmount
    return () => unsubscribe();
  }, []);

  // Step 2: Function using updateDoc to toggle task completion in real time in Firestore
  async function toggleTask(id: string) {
    const targetTask = tasks.find((t) => t.id === id);
    if (!targetTask) return;

    const newCompleted = !targetTask.completed;
    const newStatus = newCompleted ? "Completed" : "In Progress";

    // Step 2a: Optimistically update local state for responsive UI
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id ? { ...task, completed: newCompleted, status: newStatus } : task
      )
    );

    try {
      // Step 2b: Call updateDoc to modify specific task document in Firestore
      if (!id.startsWith("sample-")) {
        const taskDocRef = doc(db, "tasks", id);
        await updateDoc(taskDocRef, {
          completed: newCompleted,
          status: newStatus,
        });
      }
    } catch (error) {
      console.error("Error updating task using updateDoc in Firestore:", error);
    }
  }

  // Step 3: Function using addDoc to push a new task document into the tasks collection
  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmittingTask(true);

    try {
      // Step 3a: Call addDoc to push task payload into Firestore "tasks" collection
      await addDoc(collection(db, "tasks"), {
        title: newTitle,
        assignee: newAssignee,
        dueDate: newDueDate || "Oct 30, 2023",
        description: newDescription,
        status: "To Do",
        completed: false,
        createdAt: serverTimestamp(),
      });

      // Step 3b: Reset form input fields
      setNewTitle("");
      setNewDueDate("");
      setNewDescription("");
      setShowForm(false);
    } catch (error) {
      console.error("Error adding task document to Firestore using addDoc:", error);
    } finally {
      setIsSubmittingTask(false);
    }
  }

  // Calculate task counts
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="min-h-screen bg-[#091540] text-white">
      <DashboardNavbar />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto py-10 px-6 flex flex-col gap-8">
        
        {/* Page Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b-4 border-[#1B2CC1] pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide">
              TEAM TASKS (LIVE WIRE)
            </h1>
            <p className="text-gray-300 text-lg mt-1">
              Create, assign, and track your team's work in real time.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#1B2CC1] hover:bg-blue-700 text-white font-bold px-6 py-3 rounded transition flex items-center justify-center gap-2 self-start md:self-auto cursor-pointer"
          >
            <span>{showForm ? "✕ CLOSE FORM" : "+ CREATE TASK"}</span>
          </button>
        </div>

        {/* Join Requests Approval Widget */}
        <JoinRequestsList />

        {/* New Task Form Section */}
        {showForm && (
          <form
            onSubmit={handleAddTask}
            className="bg-white text-[#091540] border-2 border-white p-6 rounded flex flex-col gap-4"
          >
            <h2 className="text-2xl font-bold border-b border-gray-200 pb-2">
              New Task Assignment
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="flex flex-col gap-1 md:col-span-8">
                <label className="text-xs font-bold uppercase text-gray-700">Task Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter task objective..."
                  className="border border-gray-400 p-2 rounded focus:outline-none focus:border-[#1B2CC1]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1 md:col-span-4">
                <label className="text-xs font-bold uppercase text-gray-700">Assign To</label>
                <select
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  className="border border-gray-400 p-2 rounded focus:outline-none focus:border-[#1B2CC1] bg-white cursor-pointer"
                >
                  <option value="Sarah Jenkins">Sarah Jenkins</option>
                  <option value="Marcus Vance">Marcus Vance</option>
                  <option value="Elena Rostova">Elena Rostova</option>
                  <option value="David Chen">David Chen</option>
                </select>
              </div>

              <div className="flex flex-col gap-1 md:col-span-4">
                <label className="text-xs font-bold uppercase text-gray-700">Due Date</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="border border-gray-400 p-2 rounded focus:outline-none focus:border-[#1B2CC1]"
                />
              </div>

              <div className="flex flex-col gap-1 md:col-span-8">
                <label className="text-xs font-bold uppercase text-gray-700">Description</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Provide context and deliverables..."
                  rows={2}
                  className="border border-gray-400 p-2 rounded focus:outline-none focus:border-[#1B2CC1] resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={isSubmittingTask}
                className="bg-[#1B2CC1] hover:bg-blue-700 text-white font-bold px-6 py-2 rounded transition cursor-pointer disabled:opacity-50"
              >
                {isSubmittingTask ? "ASSIGNING..." : "ASSIGN TASK"}
              </button>
            </div>
          </form>
        )}

        {/* Task List Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-white">All Tasks ({totalCount})</h2>

          <div className="flex flex-col gap-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-5 rounded border-2 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  task.completed
                    ? "bg-[#091540] border-gray-700 opacity-70 text-gray-400"
                    : "bg-white text-[#091540] border-white hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => {}}
                    className="w-5 h-5 accent-[#1B2CC1] cursor-pointer"
                  />
                  <div>
                    <h3 className={`text-lg font-bold ${task.completed ? "line-through" : ""}`}>
                      {task.title}
                    </h3>
                    <p className="text-xs font-semibold uppercase mt-1 opacity-75">
                      Assignee: {task.assignee}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 text-sm">
                  <span className="font-semibold text-xs uppercase">
                    Due: {task.dueDate}
                  </span>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded uppercase ${
                      task.completed
                        ? "bg-gray-800 text-gray-300"
                        : task.status === "In Progress"
                        ? "bg-blue-100 text-[#1B2CC1]"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}