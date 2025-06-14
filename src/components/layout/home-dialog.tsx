"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gift, ShoppingBag, Sparkles } from "lucide-react";

export default function HomeDialog() {
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);

  useEffect(() => {
    // Check if user has seen the welcome dialog before
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      // Show dialog after a short delay for better UX
      const timer = setTimeout(() => {
        setShowWelcomeDialog(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseDialog = () => {
    setShowWelcomeDialog(false);
    // Mark that user has seen the welcome dialog
    localStorage.setItem("hasSeenWelcome", "true");
  };

  const handleStartShopping = () => {
    handleCloseDialog();
    // Optional: Navigate to a specific category or scroll to products
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <Dialog open={showWelcomeDialog} onOpenChange={setShowWelcomeDialog}>
      <DialogContent className="sm:max-w-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>

          <DialogTitle className="text-lg md:text-3xl font-bold text-center bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            Welcome to Peter&apos;s Shop!
          </DialogTitle>
        </DialogHeader>

        <div className="text-center space-y-2 md:space-y-4 pt-2">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              Our website is hosted in the East US. If you&apos;re visiting from
              another country, the speed might be a little bit slow. Sorry for
              the inconvenience and enjoy your shopping!
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 py-2">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">
                Quality Products
              </span>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Gift className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">
                Special Offers
              </span>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">
                Premium Experience
              </span>
            </div>
          </div>

          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            From fashion to food, find everything you need in one place
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-6">
          <Button
            onClick={handleStartShopping}
            className="w-full h-10 md:h-12 text-sm md:text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
          >
            Start Shopping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
