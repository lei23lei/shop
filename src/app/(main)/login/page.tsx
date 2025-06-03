"use client";
import React from "react";
import { LoginForm } from "./_components/login-form";

export default function Page() {
  return (
    <div className="container mx-auto flex w-full items-center justify-center min-h-[700px] py-8">
      <LoginForm />
    </div>
  );
}
