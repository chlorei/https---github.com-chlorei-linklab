// app/dashboard/DashboardClient.tsx
"use client";

import React from "react";
import Link from "next/link";
import TextType from "@/app/components/UI/TextType/TextType";
import DashboardLinks from "@/app/components/UI/DashboardLinks/DashboardLinks";
import ActivityChart from "@/app/components/ActivityChart/ActivityChart";
import RecentLinks from "@/app/components/UI/RecentLinks/RecentLinks"; // проверь путь

type LinkItem = {
  _id: string;
  originalUrl: string;
  shortId: string;
  clicks: number;
  createdAt: string;
};

export default function DashboardClient({
  greetingsText,
  links,
  amountVisits,
  activity,
}: {
  greetingsText: string;
  links: LinkItem[];
  amountVisits: number;
  activity: Array<{ day: string; clicks: number }>;
}) {

  return (
    <div className="container mx-auto px-4 mt-40">
      <div className="flex w-full flex-col items-center">
        <div className="relative h-[60px] text-primary-text flex items-center justify-center">
          <TextType
            textColors={["text-primary-text"]}
            text={[greetingsText]}
            typingSpeed={25}
            pauseDuration={3000}
            showCursor
            cursorCharacter=""
            className="text-4xl text-primary-text text-center"
          />
        </div>

        <div className="flex flex-col mt-20 w-full max-w-2xl self-center rounded-2xl p-10">
          <div className="flex flex-row flex-wrap w-full justify-center gap-5 md:gap-10 md:justify-between">
            <DashboardLinks image="/icons/link-2.svg" title="Total Links" count={links.length} />
            <DashboardLinks image="/icons/corner-down-right.svg" title="Total Clicks" count={amountVisits} />
            <DashboardLinks image="/icons/bar-chart-2.svg" title="Conversion Rate" count={3.23} />
            <DashboardLinks image="/icons/activity.svg" title="Active Projects" count={3} />
          </div>

          <div className="border-2 rounded-2xl mt-20 p-5">
            <h3 className="font-bold">Activity Overview</h3>
            <p className="text-sm text-gray-500 mt-2">Here you can find an overview of your recent activities.</p>
            <div className="mt-5">
              <ActivityChart data={activity} />
            </div>
          </div>

          <div className="flex flex-col border-2 rounded-2xl mt-17 p-5">
            <h3 className="font-bold w-full">Recent Links</h3>
            <p className="text-sm w-full text-gray-500 mt-2">Your most recently shortened links</p>
            <div className="mt-5">
              {links.length === 0 && (
                <p className="text-gray-500">No links found. Start by creating a new shortened link!</p>
              )}
              {links.slice(0, 4).map((l) => (
                <RecentLinks
                  key={l._id}
                  title={l.originalUrl}
                  url={l.shortId}
                  clicks={l.clicks}
                  date={l.createdAt}
                />
              ))}
            </div>

            <div className="flex mt-5 justify-center justfiy-self-center w-full sm:w-2/3 lg:w-1/2 self-center rounded-2xl border p-2 font-semibold
                            transition hover:bg-hover-button-bg hover:text-hover-button-text hover:shadow-lg hover:-translate-y-0.5
                            active:translate-y-0 active:shadow-md
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2">
              <Link href="/links" prefetch={false} className="w-full h-full text-center">
                View all links!
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}