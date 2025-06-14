import type { Metadata } from "next";
import { Maven_Pro } from "next/font/google";
import "./globals.css";
import RootLayoutClient from "./root-layout-client";

const mavenPro = Maven_Pro({
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-maven-pro",
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
        className={`${mavenPro.variable} font-maven-pro bg-background overflow-x-hidden antialiased`}
      >
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
