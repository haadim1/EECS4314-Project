"use client";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center h-[80vh] flex items-center justify-center text-center px-6 bg-gradient-to-b from-black via-gray-900 to-white"
      >
        <div className="bg-black bg-opacity-50 p-10 rounded-lg text-white max-w-3xl">
          <h1 className="text-5xl font-bold mb-4">AI-Powered Salon Management</h1>
          <p className="text-lg mb-6">
            Automate scheduling, get AI-powered hairstyle recommendations, and manage your salon effortlessly.
          </p>
          <button
            onClick={() => router.push("/book")}
            className="px-6 py-3 bg-white text-brown font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition"
          >
            Book an Appointment
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white text-center">
        <h2 className="text-4xl font-bold text-brown mb-10">Why Choose SalonAI?</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="p-6 shadow-md rounded-lg bg-rosegold text-white">
            <h3 className="text-2xl font-semibold mb-2">AI-Powered Scheduling</h3>
            <p>Never worry about double bookings. Let AI optimize your schedule.</p>
          </div>
          <div className="p-6 shadow-md rounded-lg bg-brown text-white">
            <h3 className="text-2xl font-semibold mb-2">Personalized Hairstyle Recommendations</h3>
            <p>Get AI-based hairstyle and color suggestions tailored to you.</p>
          </div>
          <div className="p-6 shadow-md rounded-lg bg-rosegold text-white">
            <h3 className="text-2xl font-semibold mb-2">Effortless Management</h3>
            <p>Handle client bookings, staff schedules, and pricing all in one place.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-black via-gray-800 to-white text-center">
        <h2 className="text-4xl font-bold text-brown mb-10">What Our Clients Say</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 shadow-md rounded-lg bg-white">
            <p className="italic text-gray-800">&quot;SalonAI changed how we manage appointments. It&apos;s a game-changer!&quot;</p>
            <h4 className="mt-4 font-semibold text-brown">— Sarah M.</h4>
          </div>
          <div className="p-6 shadow-md rounded-lg bg-white">
            <p className="italic text-gray-800">&quot;The AI suggestions are spot on! My clients love the personalized experience.&quot;</p>
            <h4 className="mt-4 font-semibold text-brown">— David L.</h4>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16  via-white text-center text-brown">
        <h2 className="text-4xl font-bold mb-6">Ready to Elevate Your Salon Experience?</h2>
        <button
          onClick={() => router.push("/signup")}
          className="px-6 py-3 bg-brown text-white font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition"
        >
          Sign Up Now
        </button>
      </section>

      <Footer />
    </div>
  );
}
