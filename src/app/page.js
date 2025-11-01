"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [year, setYear] = useState(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-[#111827] text-center px-6"
      suppressHydrationWarning
    >
      <h1 className="text-4xl font-bold text-[#F6C85F] mb-4">
        Welcome to Synnora API
      </h1>
      <p className="text-gray-300 text-lg max-w-xl">
        This API serves sign language learning content such as videos for
        alphabets, numbers, and colors.
      </p>

      <div className="mt-8 space-y-2 text-gray-400">
        <p>Try endpoints like:</p>
        <ul className="text-sm">
          <li>
            <code>/api/letters/A</code> → returns a video for the letter A
          </li>
          <li>
            <code>/api/numbers/1</code> → returns a video for number 1
          </li>
          <li>
            <code>/api/colors/red</code> → returns a video for color red
          </li>
        </ul>
      </div>

      <footer className="mt-12 text-sm text-gray-500">
        © {year || "...."} Synnora Learning Platform
      </footer>
    </main>
  );
}
