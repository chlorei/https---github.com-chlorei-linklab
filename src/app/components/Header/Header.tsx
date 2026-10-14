"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useSessionLite } from "@/app/providers/SessionProvider";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";
import { ButtonLink } from "../UI/Button/Button";

type NavItem = { label: string; href: string };

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

function initials(name?: string | null) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "") || "?";
}

export default function Header() {
  const { session } = useSessionLite();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // close the mobile menu whenever the route changes
  useEffect(() => setOpen(false), [pathname]);

  const nav: NavItem[] = session
    ? [
        { label: "Shorten", href: "/" },
        { label: "Overview", href: "/dashboard" },
        { label: "Links", href: "/links" },
        { label: "Projects", href: "/projects" },
      ]
    : [
        { label: "Shorten", href: "/" },
        { label: "About", href: "/about" },
      ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur supports-[backdrop-filter]:bg-paper/70">
      <div className="shell flex h-16 items-center gap-6">
        <Link href="/" className="flex items-center gap-2.5 rounded-control" aria-label="Relinxr home">
          <Image src="/logo-black.png" alt="" width={28} height={28} className="dark:invert" priority />
          <span className="font-display text-lg font-semibold tracking-tight">Relinxr</span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-control px-3 py-2 text-[0.9375rem] transition-colors ${
                      active
                        ? "text-ink underline decoration-link decoration-2 underline-offset-[0.6em]"
                        : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {session ? (
            <Link
              href="/account"
              aria-label="Account"
              title={session.name ?? "Account"}
              className={`grid size-9 place-items-center rounded-full border text-sm font-semibold uppercase transition-colors ${
                isActive(pathname, "/account")
                  ? "border-link bg-link-tint text-link"
                  : "border-line-strong bg-surface text-ink hover:border-ink-faint"
              }`}
            >
              {initials(session.name)}
            </Link>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <ButtonLink href="/signin" variant="ghost" size="sm">
                Sign in
              </ButtonLink>
              <ButtonLink href="/signup" variant="primary" size="sm">
                Create account
              </ButtonLink>
            </div>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-9 place-items-center rounded-control text-ink hover:bg-sunken md:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Primary" className="border-t border-line bg-paper md:hidden">
          <ul className="shell flex flex-col py-2">
            {[...nav, ...(session ? [] : [{ label: "Sign in", href: "/signin" }, { label: "Create account", href: "/signup" }])].map(
              (item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    className="flex h-12 items-center border-b border-line text-ink last:border-0 aria-[current=page]:text-link"
                  >
                    {item.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
