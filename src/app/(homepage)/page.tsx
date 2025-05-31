import React from "react";
import Header from "./_components/header";
import Content from "./_components/content";
import RecentItems from "./_components/recent-items";

export default function Page() {
  return (
    <main className="relative">
      <Header />
      <Content />
      <RecentItems />
    </main>
  );
}
