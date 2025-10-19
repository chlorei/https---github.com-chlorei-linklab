"use client"
import React from 'react'
import TextType from '@/app/components/UI/TextType/TextType'
import Image from 'next/image'
const Account = () => {


    const handleLogout = async () => {
        try{
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers:{
                    'Content-Type' : 'application/json'
                }
            })
            window.location.href = "/";
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div className="container text-primary-text mx-auto px-4 mt-40">
            <div className='flex justify-between flex-col md:flex-row w-full mb-10 gap-5'>
            <div>
              <div>
                <TextType
                  textColors={["text-primary-text"]}
                  text={["Account Settings"]}
                  typingSpeed={25}
                  pauseDuration={1500}
                  showCursor
                  cursorCharacter=""
                  className="text-4xl text-primary-text text-center"
                />
              </div>
            
            </div>
            <button className="flex justify-center items-center  justfiy-self-center w-full sm:w-1/3 lg:w-1/10 self-center bg-red-400 rounded-2xl border p-2 font-semibold
                         transition hover:bg-red-600 hover:text-hover-button-text hover:shadow-lg hover:-translate-y-0.5
                         active:translate-y-0 active:shadow-md
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
                          onClick={handleLogout}>
              <Image src="/icons/log-out.svg" alt="Logout Icon" width={22} height={22} className='mr-2' />
              Logout

            </button>
          </div>
          
          <div className='flex flex-col border-2 rounded-2xl mt-17 p-5'>
            <h3 className='font-bold w-full'>Profile Information</h3>
            <p className='text-sm w-full text-gray-500 mt-2'>Update your profile information below</p>
            <div className="mt-5">
            <form className="mt-6 flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  name="firstName"
                  type="text"
                  placeholder="First name"
                  className="h-11 w-full rounded-2xl border px-4 outline-none transition
                            focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
                />

                <input
                  name="lastName"
                  type="text"
                  placeholder="Last name"
                  className="h-11 w-full rounded-2xl border px-4 outline-none transition
                            focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
                />

              </div>

              <div className="flex flex-col gap-3">
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  className="h-11 w-full rounded-2xl border px-4 outline-none transition
                            focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
                />
              </div>
              <div className="flex flex-row gap-3 justify-end">
                <button
                type="submit"
                className="w-full self-end lg:w-1/7 rounded-2xl border px-5 py-3 font-semibold
                          transition hover:bg-hover-button-bg hover:text-hover-button-text hover:shadow-lg hover:-translate-y-0.5
                          active:translate-y-0 active:shadow-md
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="reset"
                className="w-full self-end sm:w-1/3 lg:w-1/7 rounded-2xl border px-5 py-3 font-semibold
                          transition hover:bg-hover-button-bg hover:text-hover-button-text hover:shadow-lg hover:-translate-y-0.5
                          active:translate-y-0 active:shadow-md
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2"
              >
                Save Changes
              </button>
              </div>
      
            </form>
            </div>
        </div>
        </div>
            
    );
}

export default Account
