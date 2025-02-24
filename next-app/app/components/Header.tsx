"use client";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  return (
    <header className="bg-white shadow-md py-4 px-10 border-b border-gray-300">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-brown">SalonAI</h1>
        <div>
          <button
            onClick={() => router.push("/login")}
            className="mr-4 px-4 py-2 text-brown border border-brown rounded-md hover:bg-brown hover:text-white transition"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/signup")}
            className="px-4 py-2 bg-rosegold text-white rounded-md hover:bg-opacity-80 transition"
          >
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
}
