"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function TeamChatPage() {
  // Simple state for channels
  const [activeChannel, setActiveChannel] = useState("general");

  // Simple state for chat messages
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Samuel",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus, minima??",
      time: "10:15 AM",
      isMe: false,
    },
    {
      id: 2,
      sender: "Marcus ",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus, minima",
      time: "10:18 AM",
      isMe: false,
    },
    {
      id: 3,
      sender: "You",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus, minima",
      time: "10:22 AM",
      isMe: true,
    },
  ]);

  // State for the message input
  const [inputMessage, setInputMessage] = useState("");

  // Function to handle sending a new message
  function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "You",
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
    };

    setMessages([...messages, newMessage]);
    setInputMessage("");
  }

  return (
    <div className="min-h-screen bg-[#091540] text-white">
      {/* Navigation Header */}
      <header className="bg-[#091540] border-b border-gray-800 py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <Link href="/" className="text-2xl font-bold text-white tracking-tight">
            Docket<span className="text-[#1B2CC1]">.</span>
          </Link>

          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/dashboard/member" className="text-gray-300 hover:text-white transition">
              Member Dashboard
            </Link>
            <Link href="/dashboard/lead" className="text-gray-300 hover:text-white transition">
              Lead Dashboard
            </Link>
            <span className="bg-[#1B2CC1] text-white font-bold px-3 py-1 rounded text-xs">
              Team Chat
            </span>
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.removeItem("docket_user_role");
                }
                signOut({ callbackUrl: "/login" });
              }}
              className="ml-2 border border-gray-600 hover:border-white text-gray-300 hover:text-white px-3 py-1 text-xs font-bold uppercase transition-colors rounded"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto py-8 px-6 flex flex-col gap-6">
        {/* Title Header */}
        <div className="border-b-4 border-[#1B2CC1] pb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide">
            TEAM CHAT
          </h1>
          <p className="text-gray-300 text-lg mt-1">
            Discuss tasks and project updates with your team in real time.
          </p>
        </div>

        {/* Chat Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white text-[#091540] border-2 border-white rounded overflow-hidden min-h-[500px]">
          {/* Left Sidebar - Channels & Online Members */}
          <div className="md:col-span-4 bg-gray-100 border-r border-gray-300 p-4 flex flex-col gap-6">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Channels
              </h2>
              <ul className="flex flex-col gap-1 font-semibold text-sm">
                <li
                  onClick={() => setActiveChannel("general")}
                  className={`p-2 rounded cursor-pointer ${
                    activeChannel === "general"
                      ? "bg-[#1B2CC1] text-white font-bold"
                      : "hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  # general
                </li>
                {/* <li
                  onClick={() => setActiveChannel("marketing")}
                  className={`p-2 rounded cursor-pointer ${
                    activeChannel === "marketing"
                      ? "bg-[#1B2CC1] text-white font-bold"
                      : "hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  # marketing
                </li> */}
                {/* <li
                  onClick={() => setActiveChannel("dev-updates")}
                  className={`p-2 rounded cursor-pointer ${
                    activeChannel === "dev-updates"
                      ? "bg-[#1B2CC1] text-white font-bold"
                      : "hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  # dev-updates
                </li> */}
              </ul>
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Team Members (4)
              </h2>
              <ul className="flex flex-col gap-2 text-sm font-semibold">
                <li className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                  Sarah Jenkins
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                  Marcus Vance
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                  David Chen
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-400"></span>
                  Elena Rostova
                </li>
              </ul>
            </div>
          </div>

          {/* Right Main Chat Box */}
          <div className="md:col-span-8 p-4 flex flex-col justify-between h-full min-h-[450px]">
            {/* Header for Active Channel */}
            <div className="border-b border-gray-200 pb-3 mb-4 flex items-center justify-between">
              <span className="font-bold text-lg text-[#091540]">#{activeChannel}</span>
              {/* <span className="text-xs text-gray-500 font-semibold uppercase">3 Active Now</span> */}
            </div>

            {/* Messages Stream */}
            <div className="flex flex-col gap-4 overflow-y-auto mb-4 flex-1 pr-2 max-h-[360px]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[80%] ${
                    msg.isMe ? "self-end items-end" : "self-start items-start"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-600">{msg.sender}</span>
                    <span className="text-[10px] text-gray-400">{msg.time}</span>
                  </div>
                  <div
                    className={`p-3 rounded-lg text-sm font-medium ${
                      msg.isMe
                        ? "bg-[#1B2CC1] text-white rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="flex gap-2 border-t pt-3 border-gray-200">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 border border-gray-300 p-2 rounded text-sm focus:outline-none focus:border-[#1B2CC1]"
              />
              {/* <button
                type="submit"
                className="bg-[#1B2CC1] hover:bg-blue-700 text-white font-bold px-5 py-2 rounded text-sm transition"
              >
                Send
              </button> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}