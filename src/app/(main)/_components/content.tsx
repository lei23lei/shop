"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Content() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById("content-section");
      if (element) {
        const rect = element.getBoundingClientRect();
        const isInView = rect.top <= window.innerHeight * 0.75;
        setIsVisible(isInView);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      id="content-section"
      className="max-w-7xl mx-auto px-4 sm:px-6 relative my-12 sm:my-16 md:my-24 lg:my-28 xl:my-40 md:h-[580px] md:px-2"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/40 via-pink-50/30 to-purple-50/40 dark:from-orange-950/20 dark:via-pink-950/20 dark:to-purple-950/20 rounded-3xl"></div>

      {/* Floating geometric shapes */}
      <div className="absolute top-8 left-8 w-16 h-16 bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-lg rotate-12 animate-pulse"></div>
      <div className="absolute top-20 right-16 w-12 h-12 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-16 left-1/4 w-20 h-20 bg-gradient-to-br from-pink-200/20 to-orange-200/20 rounded-full blur-md animate-pulse delay-2000"></div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,theme(colors.gray.900)_1px,transparent_1px),linear-gradient(theme(colors.gray.900)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,white_70%,transparent_110%)]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
        animate={
          isVisible
            ? { opacity: 1, scale: 1, rotateY: 0 }
            : { opacity: 0, scale: 0.8, rotateY: 15 }
        }
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="md:absolute md:right-2 contrast-75 perspective-1000"
      >
        <div className="relative w-full md:w-[850px] group transform-gpu">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-pink-500/20 to-purple-600/20 rounded-lg blur-2xl transform scale-105 group-hover:scale-110 transition-transform duration-500"></div>

          <Image
            src="/images/men-top.png"
            width={3000}
            height={3000}
            alt="men-top"
            className="relative w-full object-cover rounded-lg transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl transform-gpu"
          />

          {/* Overlay effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>

          {/* Corner accent */}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -100, y: 50 }}
        animate={
          isVisible
            ? { opacity: 1, x: 0, y: 0 }
            : { opacity: 0, x: -100, y: 50 }
        }
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="flex flex-col md:z-20 md:absolute md:left-0 md:top-[320px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md items-center 
          space-y-4 sm:space-y-5 p-4 sm:p-6 md:p-8 md:px-12 shadow-2xl rounded-2xl border border-gray-100/50 dark:border-gray-800/50 mt-6 sm:mt-8 md:mt-0
          before:absolute before:inset-0 before:bg-gradient-to-br before:from-orange-500/5 before:via-pink-500/5 before:to-purple-500/5 before:rounded-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-pink-500/5 to-purple-500/5 rounded-2xl"></div>

        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl md:text-left text-center max-w-md uppercase font-black 
            bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent
            relative z-10"
        >
          <span className="relative text-foreground text-2xl md:text-3xl lg:text-4xl">
            Elevate Your Style
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </span>
        </motion.h2>

        <motion.p className="max-w-md md:text-left text-center text-gray-700 dark:text-gray-200 text-base sm:text-lg md:leading-relaxed leading-relaxed relative z-10">
          Discover premium men&apos;s fashion that defines modern masculinity.
          From sharp business attire to casual weekend wear, find pieces that
          reflect your{" "}
          <span className="font-semibold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            confidence
          </span>{" "}
          and{" "}
          <span className="font-semibold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            sophistication
          </span>
          .
        </motion.p>

        <Link
          href="/items/1"
          className="w-full sm:w-auto flex justify-center relative z-10"
        >
          <motion.button
            className="group relative px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 
              bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 
              text-white font-bold rounded-full 
              hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 
              transition-all duration-300 transform hover:scale-105 hover:-translate-y-1
              text-sm sm:text-base md:text-lg
              shadow-lg hover:shadow-2xl
              before:absolute before:inset-0 before:bg-gradient-to-r before:from-orange-400 before:via-pink-400 before:to-purple-400 before:rounded-full before:blur-lg before:opacity-0 before:group-hover:opacity-50 before:transition-opacity before:duration-300 before:-z-10"
          >
            <span className="relative z-10 text-sm md:text-base lg:text-md flex items-center space-x-2">
              <span>Shop Men&apos;s Collection</span>
              <motion.svg
                initial={{ x: 0 }}
                animate={{ x: isVisible ? 0 : -10 }}
                transition={{ duration: 0.3 }}
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </motion.svg>
            </span>
          </motion.button>
        </Link>

        {/* Decorative elements */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full opacity-60 animate-pulse delay-500"></div>
        <div className="absolute top-1/2 -left-4 w-2 h-2 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full opacity-60 animate-pulse delay-1000"></div>
      </motion.div>
    </div>
  );
}
