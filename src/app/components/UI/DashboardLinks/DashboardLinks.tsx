import React from 'react'
import Image from 'next/image'

type DashboardLinkProps = {
    title: string,
    count: number
}
const DashboardLinks = (props: DashboardLinkProps) => {
    return (
        <div className='border w-full transition-transform duration-300 hover:scale-110 text-primary-text p-5 h-50 rounded-3xl xl:w-1/5 sm:w-2/5'>
            <Image src="/logo-black.png" alt="Link Icon" width={60} height={60} className='mt-3' />

            <div className="ml-3">
                <p className='text-sm text-gray-500 mt-2'>{props.title}</p>
                <h3 className='text-lg mt-4 font-semibold'>{props.count}</h3>
            </div>
            
        </div>
    );
}

export default DashboardLinks
