import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header/Header";
import AppProviders from "@/app/providers/AppProviders";
import { getSession } from "@/lib/auth/auth";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-main",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://rld.bio"),
  title: "Relinxr — Smarter Link Management",
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
    url: "https://rld.bio",
    siteName: "Relinxr",
    images: [
      {
        url: "/fulllogo-black.png",
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
    images: ["/fulllogo-black.png"],
    creator: "@sinaiida",
  },
  icons: {
    icon: "/logo-black.png",
  },
};

const themeInitScript = `try{var t=localStorage.getItem("theme")||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.classList.toggle("dark",t==="dark")}catch(e){}`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const initialSession = await getSession();

  return (
    <html lang="en" className={montserrat.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-main leading-[1.75rem]">
        <Analytics />
        <SpeedInsights/>
        <AppProviders initialSession={initialSession}>
          <Header />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
