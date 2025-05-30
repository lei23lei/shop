import React from "react";
import Header from "./_components/header";
import Content from "./_components/content";
import RecentItems from "./_components/recent-items";
import UserBar from "./_components/user-bar";
import Footer from "./_components/footer";

export default function Page() {
  return (
    <main className="relative">
      <UserBar />
      <div className="pt-16">
        {" "}
        {/* Add padding top to account for fixed header */}
        <Header />
        <Content />
        <RecentItems />
      </div>
      <Footer />
    </main>
  );
}
