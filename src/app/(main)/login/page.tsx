"use client";
import React, { useEffect } from "react";
import { LoginForm } from "./_components/login-form";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function Page() {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);
  return (
    <div className="container mx-auto flex w-full items-center justify-center min-h-[700px] py-8">
      <LoginForm />
    </div>
  );
}
