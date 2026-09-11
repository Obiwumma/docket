"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import DashboardNavbar from "@/app/components/DashboardNavbar";
import { db } from "@/lib/firebaseClient";
import {
  collection,
  onSnapshot,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  QuerySnapshot,
  QueryDocumentSnapshot,
} from "@firebase/firestore";

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
}

interface TeamMember {
  id: string;
  name: string;
}

export default function TeamChatPage() {
  // State for active chat channel
  const [activeChannel, setActiveChannel] = useState("general");

  // State for storing live chat messages list
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // State for the message input box
  const [inputMessage, setInputMessage] = useState("");

  // Default display name for current user
  // const [currentUserName] = useState("You");

  const [teamId, setTeamId] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);


  const {data: session} = useSession();
  const userName = session?.user?.name || "Team Member";
  const userEmail = session?.user?.email;

  // Fetch current teamId on mount
  useEffect(() => {
    async function fetchTeamInfo() {
      const res = await fetch("/api/team/info");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.team) {
          setTeamId(data.team.teamId);
        }
      }
    }
    fetchTeamInfo();
  }, []);


  useEffect(() => {
    if (!teamId) return;

    async function loadTeamMembers() {
      const membersQuery = query(
        collection(db, "users"),
        where("teamId", "==", teamId)
      );
      const snapshot = await getDocs(membersQuery);
      const membersList = snapshot.docs.map((doc:QueryDocumentSnapshot) => ({
        id: doc.id,
        name: doc.data().name || doc.data().email || "Team Member",
      }));
      setTeamMembers(membersList);
    }

    loadTeamMembers();
  }, [teamId]);



  // Step 1: Plug Firestore onSnapshot listener into Chatroom ("live wire" for real-time messages)
  useEffect(() => {
    if (!teamId) return;


    const messagesQuery = query(
      collection(db, "messages"),
      where("teamId", "==", teamId),
      orderBy("createdAt", "asc")
    );

    // Step 1b: Set up onSnapshot listener to receive live message updates instantly
    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot: QuerySnapshot) => {
        const liveMessages: ChatMessage[] = snapshot.docs.map((docSnapshot: QueryDocumentSnapshot) => {
          const data = docSnapshot.data();
          // Format Firestore timestamp or fallback to current time
          const timestamp = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
          const timeString = timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          return {
            id: docSnapshot.id,
            sender: data.sender || "Team member",
            text: data.text || "",
            time: timeString,
            isMe: data.senderEmail === userEmail || data.sender === userName,
          };
        });

        // Step 1c: Update local React messages state with live wire data
        setMessages(liveMessages);
      },
      (error: any) => {
        console.error("Error listening to real-time chat messages:", error);
      }
    );

    // Step 1d: Clean up the onSnapshot listener on component unmount
    return () => unsubscribe();
  }, [teamId, userName, userEmail]);

  // Step 2: Function to post new message into Firestore using addDoc SDK method
  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const textToSend = inputMessage.trim();
    setInputMessage("");

    try {
      // Step 2a: Push new document to "messages" collection with serverTimestamp
      await addDoc(collection(db, "messages"), {
        teamId: teamId,
        sender: userName,
        senderEmail: userEmail,
        text: textToSend,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error pushing message document to Firestore:", error);
    }
  }

  return (
    <div className="min-h-screen bg-[#091540] text-white">
      <DashboardNavbar />

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
              </ul>
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Team Members ({teamMembers.length})
              </h2>
              <ul className="flex flex-col gap-2 text-sm font-semibold">
                {teamMembers.map((member) => (
                  <li key={member.id} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                    {member.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Main Chat Box */}
          <div className="md:col-span-8 p-4 flex flex-col justify-between h-full min-h-[450px]">
            {/* Header for Active Channel */}
            <div className="border-b border-gray-200 pb-3 mb-4 flex items-center justify-between">
              <span className="font-bold text-lg text-[#091540]">#{activeChannel}</span>
              <span className="text-xs text-[#1B2CC1] font-bold uppercase">Live Wire Connected</span>
            </div>

            {/* Messages Stream */}
            <div className="flex flex-col gap-4 overflow-y-auto mb-4 flex-1 pr-2 max-h-[360px]">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                  No messages yet. Send a message to start the conversation!
                </div>
              ) : (
                messages.map((msg) => (
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
                ))
              )}
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
              <button
                type="submit"
                className="bg-[#1B2CC1] hover:bg-blue-700 text-white font-bold px-5 py-2 rounded text-sm transition cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}