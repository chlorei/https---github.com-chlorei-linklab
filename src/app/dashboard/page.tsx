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

const Dashboard = () => {
  const [greetingsText , setGreetingsText] = useState<string>("");
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await res.json();
        if (res.ok && data.ok){
          setSession(data.user);
          setGreetingsText(`Welcome back,  ${data.user?.name}!`);
        }
        else setSession(null);
      } catch {
        setSession(null);
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
            <DashboardLinks title={'Total Links'} count={14}/>
            <DashboardLinks title={'Total Clicks'} count={48000}/>
            <DashboardLinks title={'Conversion Rate'} count={3.23}/>
            <DashboardLinks title={'Active Projects'} count={3}/>
          </div>

          <div className='border-2 rounded-2xl mt-20 p-5'>
            <h3 className='font-bold'>Activity Overview</h3>
            <p className='text-sm text-gray-500 mt-2'>Here you can find an overview of your recent activities.</p>
            <div className="mt-5">
              <ActivityChart />
            </div>
          </div>
    
          <div className='flex flex-col border-2 rounded-2xl mt-17 p-5'>
            <h3 className='font-bold w-full'>Recent Links</h3>
            <p className='text-sm w-full text-gray-500 mt-2'>Your most recently shortened links</p>
            <div className="mt-5">
              <RecentLinks title={'Biba'} url={'Bish'} clicks={123} date={'3 days ago'}/>
              <RecentLinks title={'Baba'} url={'asd'} clicks={22} date={'a week ago'}/>
              <RecentLinks title={'Boba'} url={'Bish'} clicks={123} date={'3 days ago'}/>
              <RecentLinks title={'Baba'} url={'asd'} clicks={22} date={'a week ago'}/>
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
