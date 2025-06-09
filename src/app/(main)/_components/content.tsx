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
      className="max-w-6xl mx-auto px-6 relative md:h-[530px] my-8 md:my-16 md:px-2 md:mb-40"
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
            src="/images/image2.avif"
            width={700}
            height={700}
            alt="experience"
            className="transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="flex  flex-col md:z-2 md:absolute md:left-0 md:top-[350px] bg-white/95 backdrop-blur-sm items-center 
          space-y-4 p-6 md:p-10 shadow-xl rounded-lg border border-gray-100"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-2xl md:text-4xl md:text-left text-center max-w-md uppercase font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"
        >
          Discover Amazing Experiences!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="max-w-md md:text-left text-center text-gray-600 md:leading-relaxed leading-tight"
        >
          Immerse yourself in breathtaking moments and create unforgettable
          memories. From stunning landscapes to unique adventures, every journey
          tells a story worth sharing and remembering forever.
        </motion.p>
        <Link href="/items/1">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="px-4 py-2 md:px-8 md:py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-300 transform hover:scale-105"
          >
            Explore More
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
