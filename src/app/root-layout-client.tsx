"use client";

import { StoreProvider } from "@/providers/store-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider } from "@/providers/theme-provider";
import HomeDialog from "@/components/layout/home-dialog";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      enableColorScheme={true}
      storageKey="theme"
      themes={["light", "dark", "system"]}
      disableTransitionOnChange={false}
    >
      <StoreProvider>
        <AuthProvider>
          {children}
          <HomeDialog />
          <Toaster />
        </AuthProvider>
      </StoreProvider>
    </ThemeProvider>
  );
}
