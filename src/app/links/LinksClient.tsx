// app/links/LinksClient.tsx
"use client";

import React, { useMemo, useState } from "react";
import TextType from "@/app/components/UI/TextType/TextType";
import RecentLinks from "@/app/components/UI/RecentLinks/RecentLinks";
import Link from "next/link";
import Image from "next/image";

type LinkItem = {
  _id: string;
  originalUrl: string;
  shortId: string;
  clicks: number;
  createdAt: string;
};

export default function LinksClient({ links }: { links: LinkItem[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return links;
    return links.filter(
      (l) =>
        l.originalUrl.toLowerCase().includes(s) ||
        l.shortId.toLowerCase().includes(s)
    );
  }, [q, links]);

  return (
    <div className="container text-primary-text mx-auto px-4 mt-40">
      <div className="flex justify-between  md:flex-row w-full mb-10 gap-5">
        <div className="flex flex-col">
          <TextType
            textColors={["text-primary-text"]}
            text={["All your Links in one place"]}
            typingSpeed={25}
            pauseDuration={1500}
            showCursor
            cursorCharacter=""
            className="text-4xl text-primary-text text-center md:text-left"
          />
          <TextType
            textColors={["text-primary-text"]}
            text={["Manage and track your shortened links"]}
            typingSpeed={30}
            pauseDuration={1500}
            showCursor
            cursorCharacter=""
            className="text-start text-gray-500 mt-2"
          />
        </div>

        <div
          className="flex items-center justify-center
                     w-full sm:w-1/3 lg:w-1/5
                     text-primary-text bg-bg-primary rounded-2xl border p-2 font-semibold
                     transition hover:bg-hover-primary hover:text-hover-button-text hover:shadow-lg hover:-translate-y-0.5
                     active:translate-y-0 active:shadow-md
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
        >
          <Link href="/" className="relative flex items-center justify-center w-full h-full p-2 text-center">
            <Image
              src="/icons/plus (2).svg"
              alt="Create Icon"
              width={22}
              height={22}
              className="absolute left-4"
            />
            <h3 className="w-full text-center">Create more</h3>
          </Link>
        </div>
      </div>

      <input
        name="search"
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search"
        className="h-11 w-full rounded-2xl border px-4 mt-3 outline-none transition
                   focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
      />

      <div className="flex flex-col border-2 rounded-2xl mt-3 p-5">
        <h3 className="font-bold w-full">All Links</h3>
        <p className="text-sm w-full text-gray-500 mt-2">Your most recently shortened links</p>

        <div className="mt-5">
          {filtered.length === 0 ? (
            <p className="text-gray-500">No links found. Start by creating a new shortened link!</p>
          ) : (
            filtered.map((l) => (
              <RecentLinks
                key={l._id}
                title={l.originalUrl}
                url={l.shortId}
                clicks={l.clicks}
                date={l.createdAt}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}