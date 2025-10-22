"use client";
import React, { useEffect, useState } from "react";
import PillNav from "../UI/PillNav/PillNav";
import { useThemeCtx } from "@/app/providers/ThemeProvider";
import { useSessionLite } from "@/app/providers/SessionProvider"; // <-- важно
import { usePathname } from "next/navigation";

const Header = () => {
  const { theme } = useThemeCtx();
  const { session } = useSessionLite();        // <-- вместо fetch("/api/auth/me")
  const pathname = usePathname();

  const logoSrc = theme === "dark" ? "/logo-black.png" : "/logo-white.png";
  const [colors, setColors] = useState({
    baseColor: "", pillColor: "", hoveredPillTextColor: "", pillTextColor: ""
  });

  useEffect(() => {
    const s = getComputedStyle(document.documentElement);
    setColors({
      baseColor: s.getPropertyValue("--header-basecolor").trim(),
      pillColor: s.getPropertyValue("--header-pillcolor").trim(),
      hoveredPillTextColor: s.getPropertyValue("--header-hoveredpilltextcolor").trim(),
      pillTextColor: s.getPropertyValue("--header-pilltextcolor").trim(),
    });
  }, [theme]);

  return (
    <div className="container flex items-center justify-center">
      <PillNav
        logoAlt="Company Logo"
        items={[
          { label: "Converse", href: "/" },
          session ? { label: "Dashboard", href: "/dashboard" } : null,
          session ? { label: "Links", href: "/links" } : null,
          session ? { label: "Projects", href: "/projects" } : null,
          { label: "About", href: "/about" },
          session ? { label: "Account", href: "/account" } : { label: "Sign Up", href: "/signup" },
        ].filter(Boolean) as { label: string; href: string }[]}
        activeHref={pathname}                 
        className="custom-nav"
        ease="power2.easeOut"
        baseColor={colors.baseColor}
        pillColor={colors.pillColor}
        hoveredPillTextColor={colors.hoveredPillTextColor}
        pillTextColor={colors.pillTextColor}
        logo={logoSrc}
      />
    </div>
  );
};

export default Header;