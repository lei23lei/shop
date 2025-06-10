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

  const handleSignOut = () => {
    logout();
    router.push("/login");
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return <LoadingPage />;
  }

  // If no user, show nothing while redirecting
  if (!user) {
    return null;
  }

  return (
    <div className=" min-h-[700px] flex flex-col mx-auto px-2 md:px-6 lg:px-10 p-2 md:p-4 gap-10">
      <div className="flex justify-between items-center">
        <h3>My Account</h3>
        <Button
          variant="primary"
          onClick={() => setShowConfirmDialog(true)}
          size="default"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
      {/* nav */}
      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-row border-b gap-8 border-gray-300 pb-2 relative">
          <div className="relative">
            <p
              className={`text-md font-bold text-muted-foreground cursor-pointer ${
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
          <div className="relative">
            <p
              className={`text-md font-bold text-muted-foreground cursor-pointer ${
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
      <div className="px-2 md:px-4">
        {activeTab === "personal-info" && <PersonalInfo />}
        {activeTab === "order-history" && <OrderHistory />}
      </div>
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Sign Out</DialogTitle>
            <DialogDescription>
              Are you sure you want to sign out? You will need to sign in again
              to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowConfirmDialog(false);
                handleSignOut();
              }}
            >
              Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
