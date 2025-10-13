"use client";

import React, { useEffect, useState } from 'react'
import PillNav from "../UI/PillNav/PillNav"
import { useThemeCtx } from '@/app/providers/ThemeProvider';

const Header = () => {
  
  const { theme } = useThemeCtx(); 
  const logoSrc = theme === "dark" ? "/logo-black.png" : "/logo-white.png";
  const [colors, setColors] = useState({
    baseColor: "", pillColor: "", hoveredPillTextColor: "", pillTextColor: ""
  });

  const readVars = () => {
    const s = getComputedStyle(document.documentElement);
    
    return {
      baseColor: s.getPropertyValue("--header-basecolor").trim(),
      pillColor: s.getPropertyValue("--header-pillcolor").trim(),
      hoveredPillTextColor: s.getPropertyValue("--header-hoveredpilltextcolor").trim(),
      pillTextColor: s.getPropertyValue("--header-pilltextcolor").trim(),
    };
  };

  useEffect(() => {
    setColors(readVars());
  }, [theme]);

  return (
    <div className='container flex items-center justify-center'>
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
              baseColor={colors.baseColor}
              pillColor={colors.pillColor}
              hoveredPillTextColor={colors.hoveredPillTextColor}
              pillTextColor={colors.pillTextColor}
              logo={logoSrc}        
        />
    </div>
  )
}

export default Header
