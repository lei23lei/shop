import React from "react";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";

export default function Header() {
  return (
    <div className="bg-neutral-200">
      <div className="flex container h-[110px] mx-auto flex-row justify-between items-center">
        <div className="flex flex-row items-center gap-2 cursor-pointer">
          <ChevronLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </div>
        <Image
          src="/images/icon-full.png"
          alt="logo"
          width={100}
          height={100}
          className="h-[80px] w-auto"
        />
      </div>
    </div>
  );
}
