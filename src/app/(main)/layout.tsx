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
      <div className="pt-[55px] md:pt-[110px]">{children}</div>
      <Footer />
    </>
  );
}
