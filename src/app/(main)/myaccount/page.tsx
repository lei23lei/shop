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

export default function Page() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleSignOut = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="container min-h-[700px] flex items-center justify-center mx-auto p-4">
      <div className="w-full max-w-md mx-auto  space-y-4">
        <h1 className="text-2xl font-bold">My Account</h1>
        {user && (
          <div className="space-y-2">
            <p>Email: {user.email}</p>
            <p>
              Name: {user.first_name} {user.last_name}
            </p>
            <p>Phone: {user.phone_number}</p>
            <p>Address: {user.address}</p>
          </div>
        )}
        <Button
          variant="destructive"
          onClick={() => setShowConfirmDialog(true)}
          className="w-full"
        >
          Sign Out
        </Button>
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
