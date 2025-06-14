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
      className="max-w-6xl mx-auto px-4 sm:px-6 relative my-8 sm:my-16 md:h-[530px] md:px-2 md:mb-20"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={
          isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
        }
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="md:absolute md:right-2 contrast-75"
      >
        <div className="relative group">
          <Image
            src="/images/men-top.png"
            width={700}
            height={700}
            alt="men-top"
            className="w-full h-auto object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="flex flex-col md:z-2 md:absolute md:left-0 md:top-[350px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm items-center 
          space-y-3 sm:space-y-4 p-4 sm:p-6 md:p-10 shadow-xl rounded-lg border border-gray-100 dark:border-gray-800 mt-4 sm:mt-6 md:mt-0"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-xl sm:text-2xl md:text-4xl md:text-left text-center max-w-md uppercase font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent"
        >
          Elevate Your Style
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="max-w-md md:text-left text-center text-gray-600 dark:text-gray-300 text-sm sm:text-base md:leading-relaxed leading-tight"
        >
          Discover premium men's fashion that defines modern masculinity. From
          sharp business attire to casual weekend wear, find pieces that reflect
          your confidence and sophistication.
        </motion.p>
        <Link href="/items/1" className="w-full sm:w-auto flex justify-center">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="px-4 py-2 sm:px-8 sm:py-3 bg-black dark:bg-white text-white dark:text-black rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-300 transform hover:scale-105 text-sm sm:text-base"
          >
            Shop Men's Collection
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
