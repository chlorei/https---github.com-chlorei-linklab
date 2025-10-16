import React from 'react'
import Image from 'next/image'

type RecentLinksProps = {
  title: string;
  url: string;
  clicks: number;
  date: string;
}
const RecentLinks = (props: RecentLinksProps) => {
  return (
    <div className='flex mt-3 transition-transform duration-300 hover:scale-101 border w-full text-primary-text p-5 h-25 rounded-3xl'>
        <div className='flex flex-col'>
            <h3 className='font-bold'>{props.title}</h3>

            <div className="mt-1 gap-9 flex-row items-center flex">
                <a href={props.url} className='text-sm text-gray-500'>{props.url}</a>
                <p className='text-sm md:block hidden text-gray-500'>{props.clicks} Clicks</p>
                <p className='text-sm md:block hidden text-gray-500'>{props.date}</p>
            </div>
        </div>
            
        <div className='flex items-center justify-center ml-auto '>
            <Image src="/logo-black.png" alt="Link Icon" width={60} height={60} className='mt-3' />
            <Image src="/logo-black.png" alt="Link Icon" width={60} height={60} className='mt-3 hidden md:block' />
        </div>
        
        
    </div>
  )
}

export default RecentLinks
