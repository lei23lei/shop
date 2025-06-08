"use client";

import React, { useState } from "react";
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

export default function Page() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("personal-info");

  const handleSignOut = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="container min-h-[700px]  flex  mx-auto p-4 gap-10">
      {/* nav */}
      <div className="flex w-[230px] flex-col gap-4">
        <div className="text-2xl font-bold">My Account</div>
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
      <div className="flex flex-col w-full  gap-4">
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
      </Dialog>{" "}
    </div>
  );
}

{
  /* <Button
          variant="destructive"
          onClick={() => setShowConfirmDialog(true)}
          className="w-full"
        >
          Sign Out
        </Button> */
}

{
}
