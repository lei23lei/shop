import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import RootLayoutClient from "./root-layout-client";

const workSans = Work_Sans({
  weight: "500",
  variable: "--font-work-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Peter's Shop",
  description: "Welcome to Peter's Shop - Your One-Stop Shopping Destination",
  icons: {
    icon: [
      {
        url: "/images/icon.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/images/icon.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${workSans.variable} font-work-sans bg-background overflow-x-hidden antialiased`}
      >
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
