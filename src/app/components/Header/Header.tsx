"use client";
import React, { useEffect, useState } from 'react'
import PillNav from "../UI/PillNav/PillNav"
import { useThemeCtx } from '@/app/providers/ThemeProvider';

const Header = () => {
  type Session = {
    id: string;
    name: string;
    email: string;
  };

  const [session, setSession] = useState<Session | null>(null);

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
  (async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.ok) setSession(data.user);
      else setSession(null);
    } catch {
      setSession(null);
    }
  })();
}, []);

  useEffect(() => {
    setColors(readVars());
  }, [theme]);

  return (
    <div className='container flex items-center justify-center'>
      <PillNav
              logoAlt="Company Logo"
              items={[
                  { label: 'Converse', href: '/' },
                  session ? {label: "Dashboard", href: '/dashboard'} : null,
                  session ? {label: "Links", href: '/links'} : null,
                  session ? {label: "Analytics", href: '/analytics'} : null,
                  { label: 'About', href: '/about' },
                  session ? { label: 'Account', href: '/account' } : { label: 'Sign Up', href: '/signup' }
              ].filter((item): item is { label: string; href: string } => item !== null)}
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

