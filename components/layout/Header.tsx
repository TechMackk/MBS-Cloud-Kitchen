"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { CartIcon } from "@/components/cart/CartIcon";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname.startsWith(href);
}

function navLinkClassName(isActive: boolean): string {
  return cn(
    "text-sm font-medium transition-colors",
    isActive
      ? "border-b-2 border-orange pb-0.5 text-orange"
      : "text-text hover:text-green-deep",
  );
}

function mobileNavLinkClassName(isActive: boolean): string {
  return cn(
    "block rounded-xl px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-cream text-orange"
      : "text-text/80 hover:bg-cream hover:text-green-deep",
  );
}

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-50 border-b border-green-soft/20 bg-bg/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
          aria-label="MBS Cloud Kitchen home"
        >
          <Logo className="h-10 w-10 text-sm" />
          <div className="hidden sm:block">
            <p className="font-heading text-sm font-semibold text-green-deep">
              {SITE.name}
            </p>
            <p className="text-xs text-green-soft">{SITE.tagline}</p>
          </div>
        </Link>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => {
            const active = isNavLinkActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={navLinkClassName(active)}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {!isAdminRoute && <CartIcon />}
          <Button asChild variant="default" size="sm">
            <Link href="/menu">Order Now</Link>
          </Button>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          {!isAdminRoute && <CartIcon />}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl p-2 text-green-deep transition-colors hover:bg-cream md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          className="border-t border-green-soft/20 bg-bg px-4 py-4 md:hidden"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => {
              const active = isNavLinkActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={mobileNavLinkClassName(active)}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li className="pt-2">
              <Button asChild variant="default" className="w-full">
                <Link href="/menu" onClick={() => setMobileOpen(false)}>
                  View Menu
                </Link>
              </Button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
