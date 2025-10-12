import React from 'react'
// import logo from '../../../public/logo.png';
import PillNav from "../UI/PillNav/PillNav"
import Image from 'next/image'

const Header = () => {
  return (
    <div className='container flex items-center justify-center'>
      {/* <Image src={'/logo.png'} alt={'asdsa'} width={130} height={130}/> */}
{/* asdasdasd */}
      <PillNav
              logoAlt="Company Logo"
              items={[
                  { label: 'Converse', href: '/' },
                  { label: 'About', href: '/about' },
                  { label: 'Sign Up', href: '/signup' }
              ]}
              activeHref="/"
              className="custom-nav"
              ease="power2.easeOut"
              baseColor="#000000"
              pillColor="#ffffff"
              hoveredPillTextColor="#ffffff"
              pillTextColor="#000000" logo={"/logo.png"}        />
    </div>
  )
}

export default Header
