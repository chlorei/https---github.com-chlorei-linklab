import Link from 'next/link'
import React from 'react'

const Main = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="flex min-h-screen w-full flex-col items-center justify-center py-8 sm:py-12">
        <div className="w-full max-w-xl rounded-2xl border p-6 sm:p-8">
          <h2 className="text-center font-bold text-2xl sm:text-3xl">Sign Up</h2>

          <form className="mt-6 flex flex-col gap-5" action="">
            {/* First / Last name */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="First name"
                autoComplete="given-name"
                className="h-11 w-full rounded-2xl border px-4 outline-none transition
                           focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
              />
              <input
                type="text"
                placeholder="Last name"
                autoComplete="family-name"
                className="h-11 w-full rounded-2xl border px-4 outline-none transition
                           focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Email"
                autoComplete="email"
                className="h-11 w-full rounded-2xl border px-4 outline-none transition
                           focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
              />
              <input
                type="email"
                placeholder="Repeat Email"
                autoComplete="email"
                className="h-11 w-full rounded-2xl border px-4 outline-none transition
                           focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-3">
              <input
                type="password"
                placeholder="Password"
                autoComplete="new-password"
                className="h-11 w-full rounded-2xl border px-4 outline-none transition
                           focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
              />
              <input
                type="password"
                placeholder="Repeat Password"
                autoComplete="new-password"
                className="h-11 w-full rounded-2xl border px-4 outline-none transition
                           focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-2/3 lg:w-1/2 self-center rounded-2xl border px-5 py-3 font-semibold
                         transition hover:bg-black hover:text-white hover:shadow-lg hover:-translate-y-0.5
                         active:translate-y-0 active:shadow-md
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2"
            >
              Sign up
            </button>

            <Link
              href="/signin"
              className="self-center text-sm text-neutral-600 underline underline-offset-4 hover:text-black hover:no-underline"
            >
              or sign in here
            </Link>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Main