"use client";

import { StoreProvider } from "@/providers/store-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider } from "@/providers/theme-provider";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <StoreProvider>
        <AuthProvider>{children}</AuthProvider>
      </StoreProvider>
    </ThemeProvider>
  );
}
