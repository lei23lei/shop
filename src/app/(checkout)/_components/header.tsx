import React from "react";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <div className="bg-neutral-200">
      <div className="flex container  h-[120px] mx-auto flex-row justify-between items-center">
        <Link href="/">
          <div className="flex flex-row items-center gap-2 cursor-pointer">
            <ChevronLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </div>
        </Link>
        <Image
          src="/images/icon-full.png"
          alt="logo"
          width={400}
          height={400}
          className="h-[90px]  w-auto"
        />
      </div>
    </div>
  );
}
