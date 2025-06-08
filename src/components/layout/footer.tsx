"use client";

import React from "react";
import Link from "next/link";
import { ImFacebook2 } from "react-icons/im";
import { GrInstagram, GrLinkedin } from "react-icons/gr";
import { usePathname } from "next/navigation";
import Image from "next/image";
export default function Footer() {
  const pathname = usePathname();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-zinc-700 px-6 pt-12 pb-6">
      <div className="max-w-6xl container mx-auto space-y-10 md:space-y-0 flex flex-col md:flex-row items-center md:justify-between">
        {/* left */}
        <div className="flex flex-col md:-mt-12 md:justify-start h-20 space-y-8">
          <Link
            href="/"
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                scrollToTop();
              }
            }}
          >
            <Image
              src="/images/icon-full.png"
              alt="logo"
              width={400}
              height={400}
              className=" w-[250px] md:w-[300px]"
            />
          </Link>
        </div>
        {/* right */}
        <div className="flex flex-col md:justify-end mt-6 md:mt-0 space-y-8 md:space-y-10">
          <ul className="flex space-x-8 justify-center md:justify-end">
            <Link href="https://www.instagram.com/leelitam/">
              <GrInstagram className="text-white text-2xl hover:text-gray-400" />
            </Link>
            <Link href="https://www.linkedin.com/in/lei-ieong-tam-6602a92bb/">
              <GrLinkedin className="text-white text-2xl hover:text-gray-400" />
            </Link>
            <Link href="https://www.facebook.com/leeli.tam/">
              <ImFacebook2 className="text-white text-2xl hover:text-gray-400" />
            </Link>
          </ul>

          <p className="text-gray-500 font-bold text-center">
            © 2025 Peter Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
