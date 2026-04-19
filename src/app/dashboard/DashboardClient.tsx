"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import TextType from "@/app/components/UI/TextType/TextType";
import DashboardLinks from "@/app/components/UI/DashboardLinks/DashboardLinks";
import ActivityChart from "@/app/components/ActivityChart/ActivityChart";
import RecentLinks from "@/app/components/UI/RecentLinks/RecentLinks";

type BasicLink = {
  _id: string;
  originalUrl: string;
  shortId: string;
  clicks: number;
  createdAt: string;
};

type ActivityPoint = { day: string; clicks: number };

type CountryRow = { countryName: string; clicks: number; _id?: string };

type Props = {
  greetingsText: string;
  links: BasicLink[];
  amountVisits: number;
  activity: ActivityPoint[];
  locations?: CountryRow[];
  topCountry?: { name: string; clicks: number } | null;
};

export default function DashboardClient({
  greetingsText,
  links,
  amountVisits,
  activity,
  topCountry,
}: Props) {
  return (
    <div className="container mx-auto px-4 pt-32 pb-20">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
        {/* Greeting */}
        <div className="relative flex h-[60px] items-center justify-center text-foreground">
          <TextType
            textColors={["text-foreground"]}
            text={[greetingsText]}
            typingSpeed={25}
            pauseDuration={3000}
            showCursor
            cursorCharacter=""
            className="text-3xl font-bold text-foreground sm:text-4xl"
          />
        </div>

        {/* Stats Grid */}
        <div className="mt-12 grid w-full grid-cols-2 gap-4 md:grid-cols-4">
          <DashboardLinks
            image="/icons/link-2.svg"
            title="Total Links"
            count={links.length}
          />
          <DashboardLinks
            image="/icons/corner-down-right.svg"
            title="Total Clicks"
            count={amountVisits}
          />
          <DashboardLinks
            image="/icons/globe.svg"
            title="Top Country"
            count={topCountry?.name ?? "N/A"}
          />
          <DashboardLinks
            image="/icons/activity.svg"
            title="Active Projects"
            count={0}
          />
        </div>

        {/* Activity Chart */}
        <div className="mt-8 w-full rounded-2xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-card-foreground">
            Activity Overview
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Your click activity over the past week
          </p>
          <div className="mt-6">
            <ActivityChart data={activity} />
          </div>
        </div>

        {/* Recent Links */}
        <div className="mt-8 w-full rounded-2xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-card-foreground">
            Recent Links
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Your most recently shortened links
          </p>
          <div className="mt-6 space-y-3">
            {links.length === 0 && (
              <p className="py-8 text-center text-muted-foreground">
                No links found. Start by creating a new shortened link!
              </p>
            )}
            {links.slice(0, 4).map((l) => (
              <RecentLinks
                key={l._id}
                title={l.originalUrl}
                url={l.shortId}
                clicks={l.clicks}
                date={l.createdAt}
                id={l._id}
              />
            ))}
          </div>

          <Link
            href="/links"
            prefetch={false}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-semibold text-card-foreground transition-all duration-200 hover:bg-secondary active:scale-[0.98]"
          >
            View all links
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
