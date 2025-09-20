import type { Metadata } from "next";
import { Arimo } from "next/font/google";
import "./globals.css";
import RootLayoutClient from "./root-layout-client";

const ff = Arimo({
  weight: ["400", "500", "600", "700"],
  variable: "--font-alan-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Peter's Shop - Clothes, Food & More | petershop.shop",
    template: "%s | Peter's Shop",
  },
  description:
    "Shop the best selection of clothes, food, and everyday essentials at Peter's Shop. Quality products, great prices, and fast delivery. Your one-stop shopping destination at petershop.shop",
  keywords: [
    "Peter's Shop",
    "online shopping",
    "clothes",
    "clothing",
    "food",
    "groceries",
    "fashion",
    "apparel",
    "shopping",
    "retail",
    "petershop.shop",
    "quality products",
    "fast delivery",
    "everyday essentials",
  ],
  authors: [{ name: "Peter's Shop" }],
  creator: "Peter's Shop",
  publisher: "Peter's Shop",
  metadataBase: new URL("https://petershop.shop"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://petershop.shop",
    title: "Peter's Shop - Clothes, Food & More",
    description:
      "Shop the best selection of clothes, food, and everyday essentials at Peter's Shop. Quality products, great prices, and fast delivery.",
    siteName: "Peter's Shop",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Peter's Shop - Your One-Stop Shopping Destination",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Peter's Shop - Clothes, Food & More",
    description:
      "Shop the best selection of clothes, food, and everyday essentials at Peter's Shop. Quality products, great prices, and fast delivery.",
    images: ["/images/twitter-image.jpg"],
    creator: "@petershop",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  category: "shopping",
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
    apple: [
      {
        url: "/images/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: "/images/favicon.ico",
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
        className={`${ff.variable} font-alan-sans bg-background overflow-x-hidden antialiased`}
      >
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
