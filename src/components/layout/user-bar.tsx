"use client";

import React, { useEffect, useState, useRef, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingBasket } from "lucide-react";
import { categories } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserBar() {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const SCROLL_THRESHOLD = 100;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      if (currentScrollPos === 0) {
        setVisible(true);
        setPrevScrollPos(currentScrollPos);
        return;
      }

      if (Math.abs(prevScrollPos - currentScrollPos) > SCROLL_THRESHOLD) {
        setVisible(prevScrollPos > currentScrollPos);
        setPrevScrollPos(currentScrollPos);
        setActiveCategory(null);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveCategory(null);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [prevScrollPos]);

  const handleCategoryClick = (categoryId: number) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };

  const handleLinkClick = () => {
    setActiveCategory(null);
  };

  return (
    <div
      className={`fixed flex flex-col top-0 left-0 right-0 bg-gray-200 z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
      ref={menuRef}
    >
      <div className="  px-10 h-14 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3>Logo</h3>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="text-foreground">
            Sign In
          </Button>
        </div>
      </div>
      <div className="flex relative flex-row justify-between h-14 items-center w-full mx-auto px-10">
        <div className="flex space-x-4 items-center">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group cursor-pointer relative py-2"
              onClick={() => handleCategoryClick(Number(category.id))}
            >
              <div className="px-2">{category.name}</div>
              <div className="absolute bottom-0 left-0 w-full h-[3px]">
                <div
                  className={`h-full bg-black transition-all duration-400 mx-auto
                    ${
                      activeCategory === category.id
                        ? "w-[80%]"
                        : "w-0 group-hover:w-[80%]"
                    }`}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <form
            className="relative"
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                router.push(
                  `/items/?search=${encodeURIComponent(searchQuery.trim())}`
                );
                setSearchQuery("");
              }
            }}
          >
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-[200px] pl-8 bg-white/80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <ShoppingBasket className="h-5 w-5 cursor-pointer" />
        </div>
        {/* expandable categories */}
        {activeCategory !== null && (
          <div
            className="absolute flex rounded-b-sm flex-row left-0 top-14 w-[600px] h-[290px] bg-neutral-300/75 shadow-lg 
            transform transition-all duration-300 ease-in-out opacity-100 translate-y-0 space-x-6
            origin-top animate-in fade-in slide-in-from-top-2"
          >
            <div className="flex flex-col w-40 h-full">
              <div className="flex flex-col pl-6 pt-4">
                {categories
                  .find((c) => c.id === activeCategory)
                  ?.subcategories?.map((subcategory) => (
                    <Link
                      key={subcategory.id}
                      href={`/items/${subcategory.id}`}
                      className="hover:bg-background rounded-md px-4 py-2 cursor-pointer"
                      onClick={handleLinkClick}
                    >
                      {subcategory.name}
                    </Link>
                  )) ?? null}
              </div>
            </div>
            <div className="flex flex-col flex-1 h-full">
              <div className="pt-2.5 pr-2 relative">
                <Image
                  src={
                    categories.find((c) => c.id === activeCategory)?.image ?? ""
                  }
                  alt={
                    categories.find((c) => c.id === activeCategory)?.name ?? ""
                  }
                  className="rounded-md"
                  width={500}
                  height={250}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
