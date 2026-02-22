"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AvailableEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      const snapshot = await getDocs(collection(db, "events"));
      setEvents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchEvents();
  }, []);

  const handleRegister = async (e: any) => {
    e.preventDefault();

    await addDoc(collection(db, "registrations"), {
      eventId: selectedEvent.id,
      eventTitle: selectedEvent.title,
      name,
      email,
      createdAt: new Date(),
    });

    alert("Registered Successfully!");

    setSelectedEvent(null);
    setName("");
    setEmail("");
  };

  return (
    <div className="min-h-screen p-10 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Available Events
      </h1>

      <div className="grid grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white p-6 rounded-xl shadow"
          >
            <h2 className="text-xl font-bold mb-2">
              {event.title}
            </h2>
            <p className="text-gray-600">{event.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              {event.date}
            </p>

            <button
              onClick={() => setSelectedEvent(event)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Register
            </button>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-8 rounded-xl shadow w-96 relative">

            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-3 right-3 text-gray-500"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-6">
              Register for {selectedEvent.title}
            </h2>

            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border p-3 mb-4 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <input
                type="email"
                placeholder="Your Email"
                className="w-full border p-3 mb-4 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button className="bg-blue-600 text-white w-full py-3 rounded-lg hover:bg-blue-700">
                Confirm Registration
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}