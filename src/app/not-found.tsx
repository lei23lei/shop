"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Home, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-2xl mx-auto space-y-8">
        {/* 404 Number */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-7xl font-bold text-primary/20 select-none">
            404
          </h1>
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">
              Page Not Found
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. It
              might have been moved, deleted, or the URL might be incorrect.
            </p>
          </div>
        </div>

        {/* Logo/Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-36 h-36 md:w-48 md:h-48 bg-gradient-to-br from-primary/5 to-secondary/10 rounded-full flex items-center justify-center p-4 md:p-6">
              <Image
                src="/images/icon-full.png"
                alt="Peter Shop Logo"
                width={120}
                height={120}
                className="w-full h-full object-contain opacity-80"
                priority
              />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-destructive rounded-full flex items-center justify-center animate-pulse">
              <span className="text-destructive-foreground text-xl font-bold">
                !
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button className="flex items-center gap-2 w-full sm:w-auto">
                <Home className="w-4 h-4" />
                Return Home
              </Button>
            </Link>

            <Link href="/items/1">
              <Button
                variant="outline"
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <ShoppingBag className="w-4 h-4" />
                Browse Products
              </Button>
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground mb-3">
              You might be looking for:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                href="/items"
                className="text-primary hover:underline transition-colors"
              >
                All Products
              </Link>
              <Link
                href="/myaccount"
                className="text-primary hover:underline transition-colors"
              >
                My Account
              </Link>
              <Link
                href="/login"
                className="text-primary hover:underline transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-primary hover:underline transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
