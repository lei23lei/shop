"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

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

    // Initial check
    handleScroll();

    // Add scroll listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      id="content-section"
      className=" max-w-6xl mx-auto px-6 relative 
          md:h-[530px] my-8 md:my-16 md:px-2 md:mb-40"
    >
      <div
        className={`md:absolute md:right-2 contrast-75 transform transition-all duration-1000 ease-out
          ${
            isVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-full"
          }`}
      >
        <Image
          src="/images/image2.avif"
          width={700}
          height={700}
          alt="experience"
        />
      </div>
      <div
        className={`flex flex-col md:z-2 md:absolute md:left-0 md:top-[350px] bg-white items-center 
          space-y-8 p-8 md:p-16 transform transition-all duration-1000 delay-300 ease-out
          ${
            isVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-full"
          }`}
      >
        <h2 className="text-4xl md:text-5xl md:text-left text-center max-w-md uppercase">
          Discover Amazing Experiences!
        </h2>
        <p className="max-w-md md:text-left text-center">
          Immerse yourself in breathtaking moments and create unforgettable
          memories. From stunning landscapes to unique adventures, every journey
          tells a story worth sharing and remembering forever.
        </p>
      </div>
    </div>
  );
}
