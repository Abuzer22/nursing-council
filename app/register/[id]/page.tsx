"use client";
<h1 className="text-red-600 text-3xl">TEST PAGE</h1>

import { useParams } from "next/navigation";
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function RegisterPage() {
  const params = useParams();
  const eventId = params.id;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [course, setCourse] = useState("");
  const [courseYear, setCourseYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Basic validation
    if (!name || !email || !contact || !course || !courseYear) {
      alert("Please fill all fields");
      return;
    }

    if (contact.length !== 10) {
      alert("Contact number must be 10 digits");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "registrations"), {
        name,
        email,
        contact,
        course,
        courseYear,
        eventId,
        createdAt: serverTimestamp(),
      });

      setSuccess(true);

      // Reset fields
      setName("");
      setEmail("");
      setContact("");
      setCourse("");
      setCourseYear("");
    } catch (error) {
      console.error("Error saving registration:", error);
      alert("Something went wrong. Please try again.");
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
          Event Name : <span className="font-semibold">{eventId}</span>
        </p>

        {success && (
          <div className="bg-green-500/20 border border-green-400 text-green-100 p-3 rounded-lg mb-4 text-center">
            🎉 Registration Successful!
            <a href="https://chat.whatsapp.com/HAccC6GA7yw6EAgESSuWcf?mode=gi_t" className="text-green-300 underline ml-1" target="_blank" rel="noopener noreferrer">
              Join WhatsApp Group
            </a>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Full Name */}
          <div>
            <label className="text-sm">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full mt-1 p-3 rounded-lg bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-1 p-3 rounded-lg bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Contact */}
          <div>
            <label className="text-sm">Contact Number</label>
            <input
              type="tel"
              placeholder="10 digit mobile number"
              className="w-full mt-1 p-3 rounded-lg bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={contact}
              onChange={(e) => setContact(e.target.value.replace(/\D/g, ""))}
              maxLength={10}
              required
            />
          </div>

          {/* Course Dropdown */}
          <div>
            <label className="text-sm">Course</label>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select Course</option>
              <option value="GNM">GNM</option>
              <option value="B.Sc Nursing">B.Sc Nursing</option>
              <option value="Post Basic B.Sc Nursing">
                Post Basic B.Sc Nursing
              </option>
              <option value="M.Sc Nursing">M.Sc Nursing</option>
            </select>
          </div>

          {/* Course Year Dropdown */}
          <div>
            <label className="text-sm">Course Year</label>
            <select
              value={courseYear}
              onChange={(e) => setCourseYear(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select Year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>

          <button
            type="submit"
            className="mt-3 bg-white text-blue-700 font-semibold py-3 rounded-lg hover:bg-blue-100 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register Now"}
          </button>
        </form>
      </div>
    </div>
  );
}