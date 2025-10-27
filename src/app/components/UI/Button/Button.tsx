import React from 'react'
import Link from 'next/link'

type ButtonProps = {
    href: string;
    children: React.ReactNode;
};

const Button = ({ href, children} : ButtonProps) => {
  return (
    <div className="flex mt-5 justify-center justfiy-self-center w-full sm:w-1/3 lg:w-1/5 self-center rounded-2xl border p-2 font-semibold
                            transition hover:bg-hover-button-bg hover:text-hover-button-text hover:shadow-lg hover:-translate-y-0.5
                            active:translate-y-0 active:shadow-md
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2">
        <Link href={href} prefetch={false} className="w-full h-full text-center">
        {children}
        </Link>
    </div>
  )
}

export default Button
