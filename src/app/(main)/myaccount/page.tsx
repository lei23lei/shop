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
    <div className=" min-h-[700px] flex flex-col md:flex-row mx-auto px-2 md:px-6 lg:px-10 p-2 md:p-4 gap-10">
      {/* nav */}
      <div className="flex w-full md:w-[230px] flex-col gap-4">
        <h3>My Account</h3>
        <div className="flex flex-col gap-2">
          <p
            className={`text-md font-bold text-muted-foreground cursor-pointer ${
              activeTab === "personal-info" ? "text-primary" : ""
            }`}
            onClick={() => setActiveTab("personal-info")}
          >
            Personal Information
          </p>
          <p
            className={`text-md font-bold text-muted-foreground cursor-pointer ${
              activeTab === "order-history" ? "text-primary" : ""
            }`}
            onClick={() => setActiveTab("order-history")}
          >
            Order History
          </p>
        </div>
        <div>
          <p
            onClick={() => setShowConfirmDialog(true)}
            className="text-lg font-bold text-muted-foreground cursor-pointer hover:text-primary"
          >
            LOG OUT
          </p>
        </div>
      </div>
      {/* content */}
      <div className="flex flex-col w-full gap-4">
        <div className="space-y-8 p-4">
          {activeTab === "personal-info" && <PersonalInfo />}
          {activeTab === "order-history" && <OrderHistory />}
        </div>
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
