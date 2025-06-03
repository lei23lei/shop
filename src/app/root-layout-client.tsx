"use client";

import { StoreProvider } from "@/providers/store-provider";
import UserBar from "@/components/layout/user-bar";
import Footer from "@/components/layout/footer";
import { AuthProvider } from "@/contexts/auth-context";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <AuthProvider>
        <>
          <UserBar />
          <div className="pt-[72px] md:pt-[120px]">{children}</div>
          <Footer />
        </>
      </AuthProvider>
    </StoreProvider>
  );
}
