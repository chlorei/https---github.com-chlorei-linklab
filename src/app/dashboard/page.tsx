"use client"


import React, { useEffect, useState } from 'react'
import TextType from '@/app/components/UI/TextType/TextType'


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
            className="text-4xl font-bold text-primary-text text-center"
          />
        </div>

        <div className="flex mt-20 w-full max-w-2xl self-center rounded-2xl border-2 p-10">
          <div>
            {session?.email}
          </div>
          <div>Hello, world!</div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
