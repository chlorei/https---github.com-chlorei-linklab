import React from 'react'
import RecentLinks from '../components/UI/RecentLinks/RecentLinks'
import TextType from '@/app/components/UI/TextType/TextType'
import Link from 'next/link'
const Links = () => {
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
          
          <div className='flex flex-col border-2 rounded-2xl mt-17 p-5'>
            <h3 className='font-bold w-full'>All Links</h3>
            <p className='text-sm w-full text-gray-500 mt-2'>Your most recently shortened links</p>
            <div className="mt-5">
              <RecentLinks title={'Biba'} url={'Bish'} clicks={123} date={'3 days ago'}/>
              <RecentLinks title={'Baba'} url={'asd'} clicks={22} date={'a week ago'}/>
              <RecentLinks title={'Boba'} url={'Bish'} clicks={123} date={'3 days ago'}/>
              <RecentLinks title={'Baba'} url={'asd'} clicks={22} date={'a week ago'}/>
            </div>
            {/* <div className="flex mt-5 justify-center justfiy-self-center w-full sm:w-2/3 lg:w-1/2 self-center rounded-2xl border p-2 font-semibold
                         transition hover:bg-hover-button-bg hover:text-hover-button-text hover:shadow-lg hover:-translate-y-0.5
                         active:translate-y-0 active:shadow-md
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2">
              <Link href="/links" className="">
                View all links!
              </Link>
            </div> */}
            
          </div>
    </div>
  )
}

export default Links
