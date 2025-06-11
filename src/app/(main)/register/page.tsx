"use client";
import React, { Suspense } from "react";
import RegForm from "./_components/reg-form";
import LoadingPage from "@/components/loading/loading-page";

function RegisterContent() {
  return (
    <div className="container mx-auto flex w-full items-center justify-center min-h-[600px] md:min-h-[700px] py-8">
      <RegForm />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={<LoadingPage minHeight="min-h-[600px] md:min-h-[700px]" />}
    >
      <RegisterContent />
    </Suspense>
  );
}
