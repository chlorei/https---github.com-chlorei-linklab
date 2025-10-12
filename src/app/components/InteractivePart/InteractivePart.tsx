"use client"

import React, { useState } from 'react'

const InteractivePart = () => {
    const [activeLink, setActiveLink] = useState<string>("")
  return (
    <form className="flex flex-col gap-4" action="">
            <input
              type="text"
              placeholder="htttps:/yourlonglink.com/blahblahblah"
              onChange={(e) => setActiveLink(e.target.value)}
              className="w-full rounded-2xl border p-3 h-[48px"
            />

            <button
              type="submit"
              className="w-full rounded-2xl border-2 px-5 py-3 font-semibold
                         transition-all duration-300
                         hover:bg-black hover:text-white hover:shadow-lg hover:-translate-y-0.5
                         active:translate-y-0 active:shadow-md
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2"
            >
              Get better link now!
            </button>
          </form>  )
}

export default InteractivePart
