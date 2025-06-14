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
      enableSystem={true}
      enableColorScheme={true}
      storageKey="theme"
      themes={["light", "dark", "system"]}
      disableTransitionOnChange={false}
    >
      <StoreProvider>
        <AuthProvider>{children}</AuthProvider>
      </StoreProvider>
    </ThemeProvider>
  );
}
