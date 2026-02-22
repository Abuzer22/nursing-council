"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function RegistrationsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "registrations")  // 🔥 IMPORTANT
        );

        const usersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching registrations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  if (loading) return <p className="p-6">Loading registrations...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-900">Registered Users</h1>

      {users.length === 0 ? (
        <p>No registered users found.</p>
      ) : (
        <div className="grid gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="border p-4 rounded-lg shadow bg-white"
            >
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Event:</strong> {user.eventTitle}</p>
              <p><strong>Date:</strong> {user.createdAt?.toDate?.().toString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}