"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function UserBar() {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const SCROLL_THRESHOLD = 100; // Threshold in pixels

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      // Always show at the top
      if (currentScrollPos === 0) {
        setVisible(true);
        setPrevScrollPos(currentScrollPos);
        return;
      }

      // Only hide after scrolling down more than threshold
      if (Math.abs(prevScrollPos - currentScrollPos) > SCROLL_THRESHOLD) {
        setVisible(prevScrollPos > currentScrollPos);
        setPrevScrollPos(currentScrollPos);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <div
      className={`fixed top-0 left-0 right-0 bg-black z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container text-background mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3>Logo</h3>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="text-foreground">
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}
