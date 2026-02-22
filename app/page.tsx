"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function LandingPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "messages"), {
        name,
        email,
        message,
        reply: "",
        status: "pending",
        createdAt: new Date(),
      });

      alert("Message Sent Successfully ✅");

      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      alert("Error sending message ❌");
    }
  };

  return (
    <div className="min-h-screen font-sans scroll-smooth">

      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 left-0 w-full bg-black/60 backdrop-blur-md text-white z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">
          <h1 className="text-lg md:text-xl font-bold">
            INTEGRAL UNIVERSITY
          </h1>

          <div className="space-x-6 text-sm md:text-base">
            <button onClick={() => router.push("/")} className="hover:text-blue-300">
              Home
            </button>
            <button onClick={() => router.push("/events")} className="hover:text-blue-300">
              Event
            </button>
            <button onClick={() => router.push("/login")} className="hover:text-blue-300">
              Admin
            </button>
          </div>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="relative h-screen flex items-center justify-center text-white text-center">
        <img
          src="https://th.bing.com/th/id/R.5009ceac68e38eb3781dcf7d743056ca?rik=L9aY2LZX5DGlPg&riu=http%3a%2f%2fdepintegraluniversity.in%2fimages%2fslider%2fhome1%2fslide1.jpg&ehk=5gv5w9knjnwGkaPrElGG9lOc4tUbCh9Q3LEq6ufuCws%3d&risl=&pid=ImgRaw&r=0"
          alt="Integral University"
          className="absolute w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-blue-900/60"></div>

        <div className="relative px-6 max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-bold mb-5 leading-tight">
            INTEGRAL INSTITUTE OF NURSING SCIENCE & RESEARCH
          </h2>

          <p className="text-lg md:text-xl mb-8">
            Built a professionally managed student body that promotes academic excellence, leadership, and holistic development.
          </p>

          <div className="space-x-4">
            <button
              onClick={() => router.push("/events")}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-lg transition transform hover:scale-105"
            >
              View Event
            </button>

            <button
              onClick={() => router.push("/login")}
              className="bg-white text-blue-700 px-8 py-3 rounded-lg text-lg transition transform hover:scale-105"
            >
              Admin Login
            </button>
          </div>
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section className="py-20 px-6 bg-white text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">
          About Us
        </h2>

        <p className="max-w-4xl mx-auto text-gray-600 leading-8">
          The Integral Institute of Nursing Science and Research (IINSR), a constituent unit of Integral University, Lucknow, is committed to excellence in nursing education, research, and healthcare service.
        </p>
      </section>

      {/* ================= SPEAKERS SECTION ================= */}
      <section className="py-20 px-6 bg-gray-100">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-12">
          EVENT MANAGER
        </h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition text-center p-6">
            <img
              src="/Enhancer.jpeg"
              alt="Event Manager"
              className="w-40 h-40 object-cover object-top rounded-full mx-auto"
            />
            <h3 className="text-xl font-semibold text-blue-700 mt-4">
              JAY KUMAR
            </h3>
            <p className="text-gray-500 text-sm">
              B.SC Nursing, 3rd Year / 6th Sem
            </p>
            <p className="text-gray-500 text-sm">
              Mob No - 9508522548
            </p>
            <p className="text-gray-600 text-sm mt-2">
              Event Manager
            </p>
          </div>
        </div>
      </section>

      {/* ================= CONTACT SECTION ================= */}
      <section className="bg-blue-700 px-6 text-white">
        <h2 className="text-3xl font-bold text-center text-white-400 mb-12">
          Contact Us
        </h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">

          <div className="space-y-4">
            <p>📍 Integral University Lucknow, Uttar Pradesh, India</p>
            <p>📞 +91 9508522548</p>
            <p>📧 jaykku570@gmail.com</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" >
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-lg text-white"
              required
            />

            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg text-white"
              required
            />

            <textarea
              placeholder="Your Message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border rounded-lg text-white"
              required
            ></textarea>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      <footer className="bg-blue-900 text-white text-center py-6">
        © 2026 Integral Institute of Nursing Science & Research | All Rights Reserved
      </footer>

    </div>
  );
}