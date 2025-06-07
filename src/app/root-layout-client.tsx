"use client";

import { StoreProvider } from "@/providers/store-provider";
import { AuthProvider } from "@/contexts/auth-context";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <AuthProvider>{children}</AuthProvider>
    </StoreProvider>
  );
}
