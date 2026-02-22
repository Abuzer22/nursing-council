"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function RegisterPage() {
  const params = useParams();
  const eventId = params.id;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "registrations"), {
        name,
        email,
        eventId,
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setName("");
      setEmail("");
    } catch (error) {
      console.error("Error saving registration:", error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-4">
      <div className="backdrop-blur-lg bg-white/20 border border-white/30 p-8 rounded-2xl shadow-2xl w-full max-w-md text-white">

        <h1 className="text-3xl font-bold text-center mb-2">
          Event Registration
        </h1>

        <p className="text-center text-sm text-blue-100 mb-6">
          Event ID: <span className="font-semibold">{eventId}</span>
        </p>

        {success && (
          <div className="bg-green-500/20 border border-green-400 text-green-100 p-3 rounded-lg mb-4 text-center">
            🎉 Registration Successful!
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div>
            <label className="text-sm">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full mt-1 p-3 rounded-lg bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-1 p-3 rounded-lg bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="mt-3 bg-white text-blue-700 font-semibold py-3 rounded-lg hover:bg-blue-100 transition duration-300 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register Now"}
          </button>
        </form>
      </div>
    </div>
  );
}