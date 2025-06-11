"use client";
import React, { useEffect, Suspense } from "react";
import { LoginForm } from "./_components/login-form";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import LoadingPage from "@/components/loading/loading-page";

function LoginContent() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <div className="container mx-auto flex w-full items-center justify-center min-h-[600px] md:min-h-[700px] py-8">
      <LoginForm />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={<LoadingPage minHeight="min-h-[600px] md:min-h-[700px]" />}
    >
      <LoginContent />
    </Suspense>
  );
}
