"use client";

import React, { use, useEffect } from 'react'
import RecentLinks from '../components/UI/RecentLinks/RecentLinks'
import TextType from '@/app/components/UI/TextType/TextType'
import Link from 'next/link'


interface LinkItem {
  createdAt: string;
  _id: string;
  originalUrl: string;
  shortId: string;
  clicks: number;
  date: string;
}

const Links = () => {


  const [links, setLinks] = React.useState<Array<LinkItem>>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/links", { cache: "no-store" });
        const data = await res.json();
        if (res.ok && data.ok) setLinks(data.links);
        console.log(data.links);
      } catch {
        setLinks([]);
      }
    })();
  }, []);
  
  return (
    <div className="container text-primary-text mx-auto px-4 mt-40">

          <div className='flex justify-between flex-col md:flex-row w-full mb-10 gap-5'>
            <div>
              <div>
                <TextType
                  textColors={["text-primary-text"]}
                  text={["All your Links in one place"]}
                  typingSpeed={25}
                  pauseDuration={1500}
                  showCursor
                  cursorCharacter=""
                  className="text-4xl text-primary-text text-center"
                />
              </div>
              <div>
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
            </div>
            <div className="flex justify-center justfiy-self-center w-full sm:w-1/3 lg:w-1/5 self-center rounded-2xl border p-2 font-semibold
                         transition hover:bg-hover-button-bg hover:text-hover-button-text hover:shadow-lg hover:-translate-y-0.5
                         active:translate-y-0 active:shadow-md
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2">
              <Link href="/" className="w-full h-full text-center">
                Create more
              </Link>
            </div>
          </div>

          <input
                name="search"
                type="text"
                placeholder="Search"
                className="h-11 w-full rounded-2xl border px-4 mt-3 outline-none transition
                           focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
              />
          
          <div className='flex flex-col border-2 rounded-2xl mt-3 p-5'>
            <h3 className='font-bold w-full'>All Links</h3>
            <p className='text-sm w-full text-gray-500 mt-2'>Your most recently shortened links</p>
            <div className="mt-5">
              {links.length === 0 && (
                <p className="text-gray-500">No links found. Start by creating a new shortened link!</p>
              )}
              {links.map(link => (
                // console.log(link),
                <RecentLinks key={link._id} title={link.originalUrl} url={link.shortId} clicks={link.clicks} date={link.createdAt} />
              ))}

            </div>
          </div>
    </div>
  )
}

export default Links
function setLinks(arg0: never[]) {
  throw new Error('Function not implemented.');
}

