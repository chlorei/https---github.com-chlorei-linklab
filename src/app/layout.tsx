import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header/Header";
import Footer from "@/app/components/Footer/Footer";
import AppProviders from "@/app/providers/AppProviders";
import { getSession } from "@/lib/auth/auth";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
  weight: ["500", "600", "700"],
});

const sans = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plex-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://rld.bio"),
  title: { default: "Relinxr — short links with click stats", template: "%s | Relinxr" },
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
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <Analytics />
        <SpeedInsights/>
        <AppProviders initialSession={initialSession}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-surface focus:px-4 focus:py-2"
          >
            Skip to content
          </a>
          <Header />
          <div id="main" className="flex-1">
            {children}
          </div>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
