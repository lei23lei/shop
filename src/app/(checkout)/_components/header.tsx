import React from "react";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <div className="bg-neutral-200 dark:bg-neutral-900">
      <div className="flex container px-4 h-[100px] md:h-[120px] mx-auto flex-row justify-between items-center">
        <Link href="/">
          <div className="flex flex-row items-center gap-2 cursor-pointer group">
            <ChevronLeft className="w-5 h-5 group-hover:text-primary transition-colors" />
            <span className="group-hover:text-primary text-sm md:text-md transition-colors">
              Continue Shopping
            </span>
          </div>
        </Link>
        <Image
          src="/images/icon-full.png"
          alt="logo"
          width={400}
          height={400}
          className="h-[90px] hidden md:block w-auto"
        />
        <Image
          src="/images/icon.png"
          alt="logo"
          width={400}
          height={400}
          className="h-[70px] block md:hidden w-auto"
        />
      </div>
    </div>
  );
}
