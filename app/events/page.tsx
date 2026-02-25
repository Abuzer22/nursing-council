"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      const snapshot = await getDocs(collection(db, "events"));
      setEvents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen p-10 bg-green-100">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Available Events
      </h1>

      <div className="grid grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold text-blue-700">
              {event.title}
            </h2>
            <p className="text-gray-600">{event.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              {event.date}
            </p>

            <button
              onClick={() => router.push(`/register/${event.id}`)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Register
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}