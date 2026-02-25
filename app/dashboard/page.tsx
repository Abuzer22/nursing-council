"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("messages");

  const [messages, setMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

  const [eventTitle, setEventTitle] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventDate, setEventDate] = useState("");

  // ================= FETCH DATA =================
  const fetchData = async () => {
    const msgSnap = await getDocs(collection(db, "messages"));
    const userSnap = await getDocs(collection(db, "registrations"));
    const eventSnap = await getDocs(collection(db, "events"));

    setMessages(msgSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setUsers(userSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setEvents(eventSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= REPLY =================
  const handleReply = async (id: string) => {
    if (!replyText[id]) return alert("Write reply first");

    await updateDoc(doc(db, "messages", id), {
      reply: replyText[id],
      status: "replied",
    });

    setReplyText((prev) => ({ ...prev, [id]: "" }));
    fetchData();
  };

  // ================= CREATE EVENT =================
  const handleCreateEvent = async (e: any) => {
    e.preventDefault();

    await addDoc(collection(db, "events"), {
      title: eventTitle,
      description: eventDesc,
      date: eventDate,
      createdAt: new Date(),
    });

    setEventTitle("");
    setEventDesc("");
    setEventDate("");
    fetchData();
  };

  // ================= DELETE EVENT =================
  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Delete this event?")) return;

    await deleteDoc(doc(db, "events", id));
    fetchData();
  };

  // ================= DELETE USER =================
  const handleDeleteUser = async (id: string) => {
    if (!confirm("Delete this registered user?")) return;

    await deleteDoc(doc(db, "registrations", id));
    fetchData();
  };

  // ================= DELETE MESSAGE=================
  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Delete this message?")) return;

    await deleteDoc(doc(db, "messages", id));
    fetchData();
  };

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* ================= SIDEBAR ================= */}
      <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-700 text-white p-6 space-y-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>

        <button
          onClick={() => setActiveTab("messages")}
          className={`w-full text-left p-3 rounded-lg transition ${
            activeTab === "messages" ? "bg-white text-blue-900" : "hover:bg-blue-800"
          }`}
        >
          Messages
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`w-full text-left p-3 rounded-lg transition ${
            activeTab === "users" ? "bg-white text-blue-900" : "hover:bg-blue-800"
          }`}
        >
          Registered Users
        </button>

        <button
          onClick={() => setActiveTab("events")}
          className={`w-full text-left p-3 rounded-lg transition ${
            activeTab === "events" ? "bg-white text-blue-900" : "hover:bg-blue-800"
          }`}
        >
          Manage Events
        </button>

        <button
          onClick={() => router.push("/")}
          className="mt-10 bg-white text-blue-900 px-4 py-2 rounded-lg w-full hover:bg-gray-200"
        >
          Back to Home
        </button>
      </div>

      {/* ================= MAIN ================= */}
      <div className="flex-1 p-10">

        {/* ======== STATS CARDS ======== */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <h3 className="text-gray-500">Total Messages</h3>
            <p className="text-3xl font-bold text-blue-700">{messages.length}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow text-center">
            <h3 className="text-gray-500">Registered Users</h3>
            <p className="text-3xl font-bold text-green-600">{users.length}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow text-center">
            <h3 className="text-gray-500">Total Events</h3>
            <p className="text-3xl font-bold text-purple-600">{events.length}</p>
          </div>
        </div>

        {/* ================= MESSAGES ================= */}
        {activeTab === "messages" && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-blue-900">Contact Messages</h2>

            {messages.length === 0 && (
              <p className="text-gray-500">No messages found.</p>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className="bg-white p-6 mb-6 rounded-xl shadow border-l-4 border-blue-600">
                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold text-blue-900">{msg.name}</h3>
                  <span className={`text-sm ${
                    msg.status === "pending" ? "text-red-600" : "text-green-600"
                  }`}>
                    {msg.status}
                  </span>
                </div>

                <p className="text-gray-600">{msg.email}</p>
                <p className="mt-3 text-gray-700">{msg.message}</p>

                {msg.status === "pending" && (
                  <div className="mt-4">
                    <textarea
                      className="w-full border p-3 rounded-lg text-gray-700"
                      placeholder="Write reply..."
                      onChange={(e) =>
                        setReplyText((prev) => ({
                          ...prev,
                          [msg.id]: e.target.value,
                        }))
                      }
                    />
                    <button
                      onClick={() => handleReply(msg.id)}
                      className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Send Reply
                    </button>
                  </div>
                )}

                {msg.status === "replied" && (
                  <div className="mt-4 bg-blue-300 p-4 rounded-lg text-blue-900">
                    <strong>Reply:</strong> {msg.reply}
                    <button
                    onClick={() => handleDeleteMessage(msg.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800 ml-2"
                  >
                    Delete
                  </button>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* ================= USERS ================= */}
        {activeTab === "users" && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-blue-900">Registered Users</h2>

            {users.length === 0 ? (
              <div className="bg-yellow-100 p-4 rounded-lg text-blue-800">
                No users found. Make sure users are saved in Firestore.
              </div>
            ) : (
              <div className="bg-blue-600 rounded-xl shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-blue-900">
                    <tr>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Event Title</th>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Course Name</th>
                      <th className="p-3 text-left">Course Year</th>
                      <th className="p-3 text-left">Contact</th>
                      <th className="p-3 text-left">Action</th> 

                    </tr>
                  </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-t hover:bg-gray-500 transition">
                          <td className="p-3">{user.name || "N/A"}</td>
                          <td className="p-3">{user.email}</td>
                          <td className="p-3">{user.eventTitle || "N/A"}</td>
                          <td className="p-3">
                            {user.createdAt
                              ? new Date(user.createdAt.seconds * 1000).toLocaleString()
                              : "N/A"}
                          </td>
                          <td className="p-3">{user.course || "N/A"}</td>
                          <td className="p-3">{user.courseYear || "N/A"}</td>
                          <td className="p-3">{user.contact || "N/A"}</td>

                          {/* 🔴 DELETE BUTTON */}
                          <td className="p-3">
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ================= EVENTS ================= */}
        {activeTab === "events" && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-blue-900">Create Event</h2>

            <form
              onSubmit={handleCreateEvent}
              className="bg-blue-500 p-6 rounded-xl shadow mb-8"
            >
              <input
                type="text"
                placeholder="Event Title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="w-full border p-3 mb-4 rounded-lg"
                required
              />

              <textarea
                placeholder="Event Description"
                value={eventDesc}
                onChange={(e) => setEventDesc(e.target.value)}
                className="w-full border p-3 mb-4 rounded-lg"
                required
              />

              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full border p-3 mb-4 rounded-lg"
                required
              />

              <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
                Create Event
              </button>
            </form>

            <h2 className="text-xl font-bold mb-4 text-blue-900">Existing Events</h2>

            {events.map((event) => (
              <div key={event.id} className="bg-white p-6 mb-4 rounded-xl shadow flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg text-blue-900">{event.title}</h3>
                  <p className="text-gray-600">{event.description}</p>
                  <p className="text-sm text-gray-500 mt-1">{event.date}</p>
                </div>

                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}