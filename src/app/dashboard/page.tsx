"use client"


import React, { useEffect, useState } from 'react'
import TextType from '@/app/components/UI/TextType/TextType'
import DashboardLinks from '@/app/components/UI/DashboardLinks/DashboardLinks'
import ActivityChart from '@/app/components/ActivityChart/ActivityChart'
import RecentLinks from '../components/UI/RecentLinks/RecentLinks'
import Link from 'next/link'

type Session = {
  id: string, 
  email: string
  name: string;
};

interface LinkItem {
  createdAt: string;
  _id: string;
  originalUrl: string;
  shortId: string;
  clicks: number;
  date: string;
}




const Dashboard = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [links, setLinks] = React.useState<Array<LinkItem>>([]);
  const [amountVisits, setAmountVisits] = useState<number>(0);
  const [visitsLast7Days, setVisitsLast7Days] = useState<Array<{ date: string; count: number }>>([]);

  
  
  useEffect(() => {
    (async () => {
      try {
        const visitUrl = session?.id ? `/api/visits?linkId=${session.id}` : "/api/visits";
        const visitRes = await fetch(visitUrl, {
          method: "GET",
          cache: "no-store"
        });
        // console.log("Fetch response for visits:", visitRes);
        const visitData = await visitRes.json();
        // console.log("Visits data:", visitData);
        if (visitRes.ok && visitData.ok) {
          setAmountVisits(visitData.visits);
          setVisitsLast7Days(visitData.series || []);
        } else {
          setAmountVisits(0);
        }
        // console.log("Fetching links for linkId:", session?.id);
        const url = session?.id ? `/api/links?linkId=${session.id}` : "/api/links";
        const res = await fetch(url, {
          method: "GET", 
          cache: "no-store"
        });
        const data = await res.json();
          if (res.ok && data.ok) setLinks(data.links);
          // console.log(data.links);
        } catch {
          setLinks([]);
        }
      })();
    }, []);
    

  const [greetingsText , setGreetingsText] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await res.json();
        setSession(data.user as Session);
        // console.log("Session data:", data);
        if (res.ok && data.ok){
          setGreetingsText(`Welcome back,  ${data.user?.name}!`);
        }
      } catch {
      }
    })();
  }, []); 


  return (
    <div className="container mx-auto px-4 mt-40">
      <div className="flex w-full flex-col items-center">
        <div className="relative h-[60px] text-primary-text flex items-center justify-center ">
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

        <div className="flex flex-col mt-20 w-full max-w-2xl self-center rounded-2xl p-10 ">
          <div className='flex flex-row flex-wrap w-full justify-center  gap-5 md:gap-10 md:justify-between'>
            <DashboardLinks image="/icons/link-2.svg" title={'Total Links'} count={links.length}/>
            <DashboardLinks image="/icons/corner-down-right.svg" title={'Total Clicks'} count={amountVisits}/>
            <DashboardLinks image="/icons/bar-chart-2.svg" title={'Conversion Rate'} count={3.23}/>
            <DashboardLinks image="/icons/activity.svg" title={'Active Projects'} count={3}/>
          </div>

          <div className='border-2 rounded-2xl mt-20 p-5'>
            <h3 className='font-bold'>Activity Overview</h3>
            <p className='text-sm text-gray-500 mt-2'>Here you can find an overview of your recent activities.</p>
            <div className="mt-5">
              <ActivityChart data={visitsLast7Days} />
            </div>
          </div>
    
          <div className='flex flex-col border-2 rounded-2xl mt-17 p-5'>
            <h3 className='font-bold w-full'>Recent Links</h3>
            <p className='text-sm w-full text-gray-500 mt-2'>Your most recently shortened links</p>
            <div className="mt-5">
              {links.length === 0 && (
                <p className="text-gray-500">No links found. Start by creating a new shortened link!</p>
              )}
              {links.slice(0, 4).map(link => (
                <RecentLinks key={link._id} title={link.originalUrl} url={link.shortId} clicks={link.clicks} date={link.createdAt} />
              ))}

            </div>
            <div className="flex mt-5 justify-center justfiy-self-center w-full sm:w-2/3 lg:w-1/2 self-center rounded-2xl border p-2 font-semibold
                         transition hover:bg-hover-button-bg hover:text-hover-button-text hover:shadow-lg hover:-translate-y-0.5
                         active:translate-y-0 active:shadow-md
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2">
              <Link href="/links" className="w-full h-full text-center">
                View all links!
              </Link>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
