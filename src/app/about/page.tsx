"use client";

import TiltedCard from "../components/UI/TiltedCard/TiltedCard";
import DecryptedText from "../components/UI/DecryptedText/DecryptedText";
import { useThemeCtx } from "@/app/providers/ThemeProvider";

const About = () => {
  const { theme } = useThemeCtx();
  const logoSrc = theme === "dark" ? "/fulllogo-white.png" : "/fulllogo-black.png";

  const stackBadges = [
    "Next.js 15",
    "React 18",
    "TypeScript",
    "Tailwind CSS",
    "shadcn/ui",
    "Mongoose",
    "MongoDB Atlas",
    "JWT (HttpOnly)",
    "Next.js App Router API",
    "Recharts",
    "Vercel",
  ];

  const stackCards = [
  {
    title: "Frontend Architecture",
    body:
      "Next.js 15 + React 18 focused on server components, fast load times, and clean App Router navigation.",
  },
  {
    title: "Design System",
    body:
      "Tailwind CSS with theme tokens, shadcn/ui for consistent patterns, custom animations, and handcrafted components.",
  },
  {
    title: "State & Data",
    body:
      "App Router server handlers for data and caching.",
  },
  {
    title: "Auth & Security",
    body:
      "JWT stored in HttpOnly cookies, middleware-protected routes, and centralized utilities in lib/auth.",
  },
  {
    title: "Database Layer",
    body:
      "Mongoose on top of MongoDB Atlas — strict schemas, migrations, lean queries, and indexed key lookups.",
  },
  {
    title: "Analytics & Visualization",
    body:
      "Recharts for interactive charts with smooth tooltips and fully responsive containers.",
  },
  {
    title: "Developer Experience & Deployment",
    body:
      "Vercel for CI/CD, preview environments, automatic HTTPS, and zero-config deployments.",
  },
  {
    title: "Quality & Accessibility",
    body:
      "Loaders and skeletons, empty/error states, a11y improvements, contrast validation, and predictive redirects.",
  },
];

  return (
    <div className="text-primary-text container mx-auto px-4 py-24">
      {/* HERO */}
      <div className="flex flex-col items-center text-center space-y-6">
        <TiltedCard
          imageSrc={logoSrc}
          altText="Relinxr"
          containerHeight="300px"
          containerWidth="300px"
          imageHeight="300px"
          imageWidth="300px"
          rotateAmplitude={30}
          scaleOnHover={1.3}
          showMobileWarning={false}
          showTooltip={false}
          displayOverlayContent={true}
        />
        <h1 className="font-bold text-4xl">
          <DecryptedText text="What is Relinxr?" animateOn="view" revealDirection="center" />
        </h1>
        <p className="w-4/5 md:w-3/5 text-xl leading-relaxed">
          <DecryptedText
            text="Relinxr is a next-generation platform for managing links and data visibility — combining short URLs, analytics, QR codes, and custom domains in one seamless interface. It redefines simplicity, speed, and precision with a focus on design and open architecture."
            animateOn="view"
            revealDirection="center"
          />
        </p>
      </div>

      {/* PHILOSOPHY */}
      <div className="mt-32 flex flex-col items-center space-y-4">
        <h2 className="text-4xl font-semibold">
          <DecryptedText text="Built with obsession, not deadlines." animateOn="view"/>
        </h2>
        <p className="w-4/5 md:w-3/5 text-xl leading-relaxed text-center">
          <DecryptedText
            text="Relinxr was created to make link management intuitive and beautiful. Every pixel, every line of code, every animation exists for a reason. The goal is not just functionality — it’s the feeling of clarity, precision, and calm while working with data."
            animateOn="view"
          />
        </p>
      </div>

      {/* PRINCIPLES GRID */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {[
          {
            title: "Privacy First",
            desc: "Your data belongs to you. Relinxr collects nothing beyond what you explicitly choose to share.",
          },
          {
            title: "Design as Function",
            desc: "Every interface element is crafted to enhance usability — minimal, precise, and responsive.",
          },
          {
            title: "Speed Matters",
            desc: "Next.js and serverless APIs to make every interaction feel instant and fluid.",
          },
          {
            title: "Open & Transparent",
            desc: "Open-source foundation you can inspect, learn from, and extend.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border p-6 shadow-sm transition-transform duration-300 hover:scale-105 hover:shadow-lg"
          >
            <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
            <p className="text-muted-foreground text-lg">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* TECH STACK — BADGES */}
      <div className="mt-32 text-center space-y-6">
        <h2 className="text-4xl font-semibold">
          <DecryptedText text="Tech Stack" animateOn="view" revealDirection="center" />
        </h2>
        <div className="mx-auto max-w-5xl flex flex-wrap justify-center gap-3">
          {stackBadges.map((label) => (
            <span
              key={label}
              className="rounded-full border px-4 py-2 text-sm shadow-sm transition-all hover:shadow-md hover:scale-105"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* TECH STACK — CARDS */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {stackCards.map((c) => (
          <div
            key={c.title}
            className="rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md hover:scale-[1.02]"
          >
            <h3 className="text-xl font-semibold mb-2">{c.title}</h3>
            <p className="text-muted-foreground">{c.body}</p>
          </div>
        ))}
      </div>

      {/* VISION */}
      <div className="mt-32 text-center space-y-6">
        <h2 className="text-4xl font-semibold">
          <DecryptedText text="Vision & Next Steps" animateOn="view" revealDirection="center" />
        </h2>
        <p className="w-4/5 md:w-3/5 mx-auto text-xl leading-relaxed">
          <DecryptedText
            text="Relinxr is evolving into a modular ecosystem — from branded shortlinks and public analytics to AI-assisted insights and customizable dashboards. Each release aims to make link data feel alive and genuinely useful."
            animateOn="view"
            revealDirection="center"
          />
        </p>
      </div>

      {/* CREATOR */}
      <div className="mt-32 text-center space-y-4">
        <h2 className="text-4xl font-semibold">
          <DecryptedText text="About the Creator" animateOn="view"  />
        </h2>
        <p className="w-4/5 md:w-2/3 mx-auto text-xl leading-relaxed">
          <DecryptedText
            text="Relinxr was designed and developed by Aleksandr Alekseev — a computer science student and web developer focused on building clean, functional, and visually refined products. A proof that one person can craft software at a studio-level quality."
            animateOn="view"
            revealDirection="center"
          />
        </p>
      </div>
    </div>
  );
};

export default About;