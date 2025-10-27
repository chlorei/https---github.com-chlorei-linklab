import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header/Header";
import { ThemeToggle } from "./components/ThemeToggle/ThemeToggle";
import AppProviders from "@/app/providers/AppProviders";
import { getSession } from "@/lib/auth/auth";
import Link from "next/link";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",     // шрифт не вызывает CLS
  variable: "--font-main", // добавит CSS-переменную
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
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
    images: ["/logo.png"],
    creator: "@sinaiida",
  },
  icons: {
    icon: "/logo-black.png",
  },
};




export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const s = await getSession();
  const initialSession = s ? { id: s.id, email: s.email, name: s.name } : null;

  return (
    <html lang="en" className={montserrat.variable}>
      <body className="font-main leading-[1.75rem]">
        <Analytics />
        <SpeedInsights/>
        <AppProviders initialSession={initialSession}>
          <Header />
          {children}
          <div
          className="
            absolute
            left-1/2 -translate-x-1/2
            top-[calc(env(safe-area-inset-top)+12px)]
            mt-1
            md:left-4 md:top-4 md:translate-x-0
            w-auto h-auto z-[9999] 
          "
          >
          <ThemeToggle
            className="
              rounded-full border border-border bg-card text-foreground
              px-4 py-2 text-sm shadow-md
              transition hover:shadow-lg
            "
          />
          </div>
            <footer className="text-xs text-gray-500 text-center py-6">
            © 2025 Relinxr — <Link href="/privacy" className="underline">Privacy Policy</Link>
          </footer>
        </AppProviders>
      </body>
    </html>
  );
}
