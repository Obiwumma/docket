"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardNavbar from "@/app/components/DashboardNavbar";

interface MemberTask {
  id: string | number;
  title: string;
  description?: string;
  status: string;
  dueDate: string;
  assignedDate?: string;
  completed: boolean;
  priority?: string;
}

export default function MemberDashboard() {
  const [tasks, setTasks] = useState<MemberTask[]>([]);

  // Step 1: Use useEffect hook to fetch tasks from Firestore when the Member Dashboard loads
  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await fetch("/api/tasks");
        if (response.ok) {
          const data = await response.json();
          if (data.tasks && data.tasks.length > 0) {
            setTasks(data.tasks);
          } else {
            // Default sample tasks shown if database has no tasks yet
            setTasks([
              {
                id: "1",
                title: "Finalize Q3 Marketing Report",
                description: "Compile data from analytics team and draft executive summary.",
                status: "IN PROGRESS",
                dueDate: "Oct 24, 2023",
                assignedDate: "Oct 18, 2023",
                completed: false,
                priority: "normal",
              },
              {
                id: "2",
                title: "Review UI Component Library Updates",
                description: "Audit button and input states for accessibility compliance.",
                status: "HIGH PRIORITY",
                dueDate: "Today",
                assignedDate: "Oct 20, 2023",
                completed: false,
                priority: "high",
              },
            ]);
          }
        }
      } catch (error) {
        console.error("Error loading tasks from Firestore:", error);
      }
    }
    loadTasks();
  }, []);

  // Step 2: Function linked to the UI checkbox / task card that calls updateDoc in Firestore to mark tasks complete or incomplete
  async function toggleTask(id: string | number) {
    const targetTask = tasks.find((task) => task.id === id);
    if (!targetTask) return;

    const newCompleted = !targetTask.completed;
    const newStatus = newCompleted ? "DONE" : "IN PROGRESS";

    // Step 2a: Update local React state first so UI responds immediately
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id ? { ...task, completed: newCompleted, status: newStatus } : task
      )
    );

    try {
      // Step 2b: Asynchronously call updateDoc API to update document fields in Firestore
      await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completed: newCompleted,
          status: newStatus,
        }),
      });
    } catch (error) {
      console.error("Error updating task status in Firestore:", error);
    }
  }

  // Count active and completed tasks
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  // Calculate progress percentage
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-[#091540] text-white">
      <DashboardNavbar />

      {/* Hero / Title Section */}
      <div className="bg-[#091540] border-b border-gray-800 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-3">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide">
            MY TASKS THIS WEEK
          </h1>
          <p className="text-gray-300 text-lg">
            Everything assigned to you, in one place.
          </p>
          <div className="mt-2 inline-block bg-[#1B2CC1] px-4 py-2 text-sm font-bold text-white rounded self-start">
            {totalCount} TASKS • {completedCount} COMPLETED
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto py-10 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Tasks List */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Active Tasks */}
            <h2 className="text-xl font-bold text-white">Active Tasks ({activeTasks.length})</h2>
            
            {activeTasks.length === 0 ? (
              <div className="bg-white text-[#091540] p-8 rounded border-2 border-white text-center">
                <p className="font-bold text-lg">NO ACTIVE TASKS!</p>
                <p className="text-gray-600">Great job, you completed everything!</p>
              </div>
            ) : (
              activeTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="bg-white text-[#091540] border-2 border-white p-6 rounded cursor-pointer hover:bg-gray-100 transition flex items-start gap-4"
                >
                  <button
                    aria-label="Mark task complete"
                    className="w-7 h-7 rounded border-2 border-[#091540] flex items-center justify-center font-bold text-lg mt-1"
                  >
                    {/* Empty box for incomplete */}
                  </button>

                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${
                          task.priority === "high"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-[#1B2CC1]"
                        }`}
                      >
                        {task.status}
                      </span>
                      <span className={`text-xs font-bold uppercase ${task.priority === "high" ? "text-red-600" : "text-gray-500"}`}>
                        Due: {task.dueDate}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold">{task.title}</h3>
                    <p className="text-gray-700 text-sm">{task.description}</p>
                    <div className="text-xs text-gray-500 mt-2 uppercase font-semibold">
                      Assigned: {task.assignedDate}
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Completed Section Divider */}
            {completedTasks.length > 0 && (
              <>
                <div className="relative py-4 flex items-center justify-center">
                  <div className="w-full border-t border-gray-700"></div>
                  <span className="absolute bg-[#091540] px-4 text-xs font-bold text-gray-400 tracking-widest uppercase">
                    Completed Tasks ({completedTasks.length})
                  </span>
                </div>

                {/* Completed Tasks List */}
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="bg-[#091540] border border-gray-700 p-6 rounded opacity-75 cursor-pointer hover:opacity-100 transition flex items-start gap-4"
                  >
                    <button
                      aria-label="Unmark task complete"
                      className="w-7 h-7 rounded bg-[#1B2CC1] text-white flex items-center justify-center font-bold text-sm mt-1"
                    >
                      ✓
                    </button>

                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-400">DONE</span>
                        <span className="text-xs text-gray-400 line-through">Due: {task.dueDate}</span>
                      </div>

                      <h3 className="text-xl font-bold line-through text-gray-300">{task.title}</h3>
                      <p className="text-gray-400 text-sm line-through">{task.description}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Right Sidebar: Progress & Info */}
          <div className="lg:col-span-4 flex flex-col gap-6">
          </div>

        </div>
      </div>
    </div>
  );
}