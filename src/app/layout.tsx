import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header/Header";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Relinxr — Open-Source Link Shortener",
  description:
    "Relinxr is a modern, open-source link shortener built with Next.js 15 + MongoDB. Shorten, track, and manage your links with analytics and custom domains — fast, simple, and privacy-friendly.",
  keywords: [
    "Relinxr",
    "link shortener",
    "URL shortener",
    "Next.js",
    "MongoDB",
    "analytics",
    "open source",
    "URL tracker",
    "custom domains",
  ],
  openGraph: {
    title: "Relinxr — Smarter Link Management",
    description:
      "Shorten, track, and manage links with Relinxr — open-source, fast, and beautiful.",
    url: "https://relinxr.com",
    siteName: "Relinxr",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "Relinxr Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Relinxr — Smarter Link Shortener",
    description:
      "Open-source platform for creating, tracking, and managing short links.",
    images: ["/logo.png"],
    creator: "@sinaiida",
  },
  icons: {
    icon: "/logo.png",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        {children}
        <Header/>
      </body>
    </html>
  );
}
