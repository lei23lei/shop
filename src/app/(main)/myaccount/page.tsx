"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PersonalInfo from "./_components/personal-info";
import OrderHistory from "./_components/order-history";
import LoadingPage from "@/components/loading/loading-page";
import { LogOut } from "lucide-react";

export default function Page() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("personal-info");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
    setIsLoading(false);
  }, [user, router]);

  const handleSignOut = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Sign out failed:", error);
      // Still redirect even if logout endpoint fails
      router.push("/login");
    }
  };

  // Show loading state while checking authentication
  if (isLoading || !user) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-[700px] mt-4 flex flex-col mx-auto px-2 md:px-6 lg:px-10 p-2 md:p-4 gap-6 md:gap-10">
      <div className="flex justify-between items-center">
        <h3>My Account</h3>
        <Button
          variant="primary"
          onClick={() => setShowConfirmDialog(true)}
          size="sm"
        >
          <LogOut className="h-4 text-white w-4 md:h-5 md:w-5" />
          <h6 className="hidden md:inline ml-2 text-white">Logout</h6>
        </Button>
      </div>
      {/* nav */}
      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-row border-b gap-4 md:gap-8 border-znic-400 pb-2 relative ">
          <div className="relative whitespace-nowrap">
            <p
              className={`text-sm md:text-md font-bold text-muted-foreground cursor-pointer ${
                activeTab === "personal-info" ? "text-primary" : ""
              }`}
              onClick={() => setActiveTab("personal-info")}
            >
              Personal Information
            </p>
            {activeTab === "personal-info" && (
              <div className="absolute bottom-[-10px] left-0 w-full h-0.5 bg-primary transition-all duration-300" />
            )}
          </div>
          <div className="relative whitespace-nowrap">
            <p
              className={`text-sm md:text-md font-bold text-muted-foreground cursor-pointer ${
                activeTab === "order-history" ? "text-primary" : ""
              }`}
              onClick={() => setActiveTab("order-history")}
            >
              Order History
            </p>
            {activeTab === "order-history" && (
              <div className="absolute bottom-[-10px] left-0 w-full h-0.5 bg-primary transition-all duration-300" />
            )}
          </div>
        </div>
      </div>
      {/* content */}
      <div className="px-1 md:px-4">
        {activeTab === "personal-info" && <PersonalInfo />}
        {activeTab === "order-history" && <OrderHistory />}
      </div>
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="w-[95%] sm:max-w-[425px] p-6 rounded-lg">
          <DialogHeader>
            <DialogTitle>Confirm Sign Out</DialogTitle>
            <DialogDescription>
              Are you sure you want to sign out? You will need to sign in again
              to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowConfirmDialog(false);
                handleSignOut();
              }}
              className="w-full sm:w-auto dark:bg-red-600"
            >
              Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
