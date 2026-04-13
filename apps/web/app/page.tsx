"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-red-50">
      {/* Navbar */}
      <div className="flex justify-between items-center p-6 bg-white/80 backdrop-blur shadow-sm">
        <h1 className="text-xl font-bold text-pink-600">
          InviteFlow ❤️
        </h1>

        <div className="flex gap-4 items-center">
          <Link href="/login" className="text-gray-700 hover:text-pink-600">
            Login
          </Link>

          <Link
            href="/signup"
            className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-2 rounded-lg shadow"
          >
            Signup
          </Link>
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="text-center mt-20 px-6">
        <h2 className="text-5xl font-bold mb-6 text-gray-800 leading-tight">
          Create Beautiful Invites <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500">
            For Every Special Moment ❤️
          </span>
        </h2>

        <p className="text-gray-600 max-w-xl mx-auto mb-8">
          Weddings, birthdays, baby showers or any celebration —
          send stunning WhatsApp invites in seconds.
        </p>

        <Link
          href="/signup"
          className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-8 py-3 rounded-full text-lg shadow-lg hover:scale-105 transition"
        >
          Start Sending Invites 🚀
        </Link>
      </div>

      {/* EVENT SHOWCASE */}
      <div className="grid md:grid-cols-3 gap-8 mt-20 px-10">
        {[
          {
            title: "Wedding 💍",
            desc: "Elegant invites for your big day",
            img: "https://images.unsplash.com/photo-1520857014576-2c4f4c972b57",
          },
          {
            title: "Birthday 🎂",
            desc: "Fun and colorful party invites",
            img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d",
          },
          {
            title: "Baby Shower 👶",
            desc: "Cute and memorable invites",
            img: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
          },
        ].map((event, i) => (
          <div
            key={i}
            className="bg-white rounded-xl overflow-hidden shadow-lg hover:scale-105 transition"
          >
            <img src={event.img} className="h-48 w-full object-cover" />
            <div className="p-5">
              <h3 className="font-bold text-lg text-pink-600">
                {event.title}
              </h3>
              <p className="text-gray-600">{event.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* HOW IT WORKS */}
      <div className="mt-24 px-10 text-center">
        <h2 className="text-3xl font-bold mb-10 text-gray-800">
          How It Works ⚡
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            "Upload your guest list 📋",
            "Choose beautiful template 🎨",
            "Send via WhatsApp instantly 📲",
          ].map((step, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-pink-600 mb-2">
                Step {i + 1}
              </h3>
              <p className="text-gray-600">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div className="grid md:grid-cols-3 gap-6 mt-20 px-10">
        <div className="bg-white p-6 shadow rounded-xl">
          <h3 className="font-bold mb-2 text-pink-600">
            Bulk Invites 🚀
          </h3>
          <p className="text-gray-600">Send 1000+ invites using queue system.</p>
        </div>

        <div className="bg-white p-6 shadow rounded-xl">
          <h3 className="font-bold mb-2 text-pink-600">
            Real-time Tracking 📊
          </h3>
          <p className="text-gray-600">Track delivered, failed, pending invites.</p>
        </div>

        <div className="bg-white p-6 shadow rounded-xl">
          <h3 className="font-bold mb-2 text-pink-600">
            Reliable Delivery 🔁
          </h3>
          <p className="text-gray-600">Retry system ensures no invite is missed.</p>
        </div>
      </div>

      {/* FINAL CTA */}
      <div className="text-center mt-24 pb-20 px-6">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">
          Ready to Send Your First Invite? 🎉
        </h2>

        <Link
          href="/signup"
          className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-8 py-3 rounded-full text-lg shadow-lg"
        >
          Get Started Now ❤️
        </Link>
      </div>
    </div>
  );
}