"use client";

import UserBar from "@/components/layout/user-bar";
import Footer from "@/components/layout/footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <UserBar />
      <div className="pt-[85px] md:pt-[150px]">{children}</div>
      <Footer />
    </>
  );
}
