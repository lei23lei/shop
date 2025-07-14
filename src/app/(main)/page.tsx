"use client";

import React from "react";
import Header from "./_components/header";
import Content from "./_components/content";
import RecentItems from "./_components/recent-items";

export default function Page() {
  return (
    <main className="relative  min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.3),transparent_50%),radial-gradient(circle_at_40%_40%,rgba(120,219,255,0.3),transparent_50%)] opacity-50 dark:opacity-20"></div>

      {/* Floating dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-ping delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-pink-400 rounded-full animate-ping delay-2000"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-orange-400 rounded-full animate-ping delay-3000"></div>
      </div>

      {/* Content sections with staggered animations */}
      <div className="relative z-10">
        <section className="animate-fade-in">
          <Header />
        </section>

        <section className="animate-fade-in-delay-200">
          <Content />
        </section>

        <section className="animate-fade-in-delay-400 pb-1">
          <RecentItems />
        </section>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-fade-in-delay-200 {
          animation: fade-in 0.6s ease-out 0.2s forwards;
          opacity: 0;
        }

        .animate-fade-in-delay-400 {
          animation: fade-in 0.6s ease-out 0.4s forwards;
          opacity: 0;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(
            45deg,
            #f093fb 0%,
            #f5576c 50%,
            #4facfe 100%
          );
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(
            45deg,
            #e084fc 0%,
            #f04868 50%,
            #3b9eff 100%
          );
        }
      `}</style>
    </main>
  );
}
