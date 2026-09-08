"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardNavbar from "@/app/components/DashboardNavbar";

interface Task {
  id: string | number;
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

  // Fetch tasks from Firestore on load
  useEffect(() => {
    async function loadTasks() {
      try {
        const res = await fetch("/api/tasks");
        if (res.ok) {
          const data = await res.json();
          if (data.tasks && data.tasks.length > 0) {
            setTasks(data.tasks);
          } else {
            // Default sample tasks if database is fresh
            setTasks([
              {
                id: "1",
                title: "Q3 Marketing Strategy Deck",
                assignee: "Sarah Jenkins",
                dueDate: "Oct 12, 2023",
                status: "In Progress",
                completed: false,
              },
              {
                id: "2",
                title: "Client Onboarding Portal Update",
                assignee: "Marcus Vance",
                dueDate: "Oct 15, 2023",
                status: "To Do",
                completed: false,
              },
            ]);
          }
        }
      } catch (error) {
        console.error("Error loading tasks:", error);
      }
    }
    loadTasks();
  }, []);

  // Toggle task completion status in Firestore
  async function toggleTask(id: string | number) {
    const targetTask = tasks.find((t) => t.id === id);
    if (!targetTask) return;

    const newCompleted = !targetTask.completed;
    const newStatus = newCompleted ? "Completed" : "In Progress";

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: newCompleted, status: newStatus } : t))
    );

    try {
      await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: newCompleted, status: newStatus }),
      });
    } catch (error) {
      console.error("Error updating task in Firestore:", error);
    }
  }

  // Create new task document in Firestore
  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmittingTask(true);

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          assignee: newAssignee,
          dueDate: newDueDate || "Oct 30, 2023",
          description: newDescription,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTasks((prev) => [data.task, ...prev]);
        setNewTitle("");
        setNewDueDate("");
        setNewDescription("");
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error pushing new task to Firestore collection:", error);
    } finally {
      setIsSubmittingTask(false);
    }
  }

  // Calculate weekly progress percentage
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#091540] text-white">
      <DashboardNavbar />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto py-10 px-6 flex flex-col gap-8">
        
        {/* Page Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b-4 border-[#1B2CC1] pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide">
              TEAM TASKS
            </h1>
            <p className="text-gray-300 text-lg mt-1">
              Create, assign, and track your team's work.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#1B2CC1] hover:bg-blue-700 text-white font-bold px-6 py-3 rounded transition flex items-center justify-center gap-2 self-start md:self-auto"
          >
            <span>{showForm ? "✕ CLOSE FORM" : "+ CREATE TASK"}</span>
          </button>
        </div>

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
                className="bg-[#1B2CC1] hover:bg-blue-700 text-white font-bold px-6 py-2 rounded transition"
              >
                ASSIGN TASK
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

        {/* Weekly Progress Footer */}
        <div className="mt-6 border-t-2 border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        </div>

      </div>
    </div>
  );
}