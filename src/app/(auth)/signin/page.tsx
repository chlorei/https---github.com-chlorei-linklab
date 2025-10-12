import Link from 'next/link'
import React from 'react'

const Main = () => {
  return (
    <div className="container mx-auto px-4">
      {/* центрируем по высоте и ширине, добавляем отступы для маленьких экранов */}
      <div className="flex min-h-screen items-center justify-center py-8 sm:py-12">
        {/* карточка: на мобиле — во всю ширину, дальше ограничиваем */}
        <div className="w-full max-w-lg rounded-2xl border p-6 sm:p-8">
          <h2 className="text-center font-bold text-2xl sm:text-3xl">
            Sign in
          </h2>

          <form className="mt-6 flex flex-col gap-5" action="">
            <div>
              <input
                type="email"
                placeholder="Email"
                autoComplete="email"
                className="w-full h-11 rounded-2xl border px-4 outline-none transition
                           focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                className="w-full h-11 rounded-2xl border px-4 outline-none transition
                           focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
              />
            </div>

            {/* на мобиле кнопка на всю ширину, дальше уже сужаем */}
            <button
              type="submit"
              className="w-full sm:w-2/3 lg:w-1/2 self-center rounded-2xl border px-5 py-3 font-semibold
                         transition hover:bg-black hover:text-white hover:shadow-lg hover:-translate-y-0.5
                         active:translate-y-0 active:shadow-md
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2"
            >
              Sign in
            </button>

            <p className="text-center text-sm text-neutral-600">
              Don’t have an account?{' '}
              <Link href="/signup" className="underline underline-offset-4 hover:no-underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Main