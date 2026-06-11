"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Youtube,
} from "lucide-react";

import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { CONTACT, SITE, whatsappUrl } from "@/lib/constants";
import { BUSINESS, businessEmailMailto } from "@/lib/constants/business";
import { isWhatsAppWebUrl } from "@/lib/whatsapp/links";
import { cn } from "@/lib/utils";

const MENU_LINKS = [
  { label: "Veg Menu", href: "/menu?diet=veg" },
  { label: "Non-Veg Menu", href: "/menu?diet=non-veg" },
  { label: "Rice Specialties", href: "/menu?category=rice" },
  { label: "Today's Specials", href: "/menu" },
] as const;

const CATERING_LINKS = [
  { label: "Catering Services", href: "/catering" },
  { label: "Bulk Orders", href: "/catering" },
  { label: "Corporate Lunch", href: "/catering" },
  { label: "Event Catering", href: "/catering" },
] as const;

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Our Chefs", href: "/about" },
  { label: "Our Story", href: "/about" },
  { label: "Careers", href: "#" },
] as const;

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "#",
    icon: Facebook,
  },
  {
    label: "Instagram",
    href: "#",
    icon: Instagram,
  },
  {
    label: "WhatsApp",
    href: whatsappUrl(CONTACT.whatsappOrdersRaw, "Hi from MBS Cloud Kitchen!"),
    icon: MessageCircle,
  },
  {
    label: "YouTube",
    href: "#",
    icon: Youtube,
  },
] as const;

function FooterColumn({
  title,
  children,
  withBorder = true,
  isRoyalHome,
}: {
  title: string;
  children: React.ReactNode;
  withBorder?: boolean;
  isRoyalHome: boolean;
}) {
  return (
    <div
      className={
        withBorder
          ? isRoyalHome
            ? "min-w-0 lg:border-r lg:border-gold-dark/25 lg:pr-6 xl:pr-8"
            : "min-w-0 lg:border-r lg:border-green-soft/30 lg:pr-6 xl:pr-8"
          : "min-w-0"
      }
    >
      <h3
        className={cn(
          "mb-4 font-heading text-base font-semibold",
          isRoyalHome ? "text-gold-primary" : "text-orange-neon",
        )}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

export function Footer() {
  const pathname = usePathname();
  const isRoyalHome = pathname === "/";

  return (
    <footer
      className={cn(
        "relative mt-auto overflow-hidden",
        isRoyalHome
          ? "royal-footer bg-royal-bg-primary text-cream-warm"
          : "bg-green-deep text-cream",
      )}
    >
      {isRoyalHome ? (
        <div
          className="royal-arch-pattern pointer-events-none absolute inset-x-0 top-0 h-24 border-b border-gold-dark/30"
          aria-hidden="true"
        />
      ) : null}

      <div
        className={cn(
          "relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8",
          isRoyalHome && "text-cream-warm",
        )}
      >
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-5 lg:gap-8">
          <div
            className={cn(
              "min-w-0 lg:pr-6 xl:pr-8",
              isRoyalHome
                ? "lg:border-r lg:border-gold-dark/25"
                : "lg:border-r lg:border-green-soft/30",
            )}
          >
            <div className="space-y-4">
              <Logo
                className={cn(
                  "h-10 w-10 !bg-transparent",
                  isRoyalHome && "!text-cream-warm",
                )}
              />
              <p className="text-sm font-medium">
                {isRoyalHome
                  ? "Healthy Telangana Foods"
                  : "Healthy Telangana Foods"}
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={
                      href.startsWith("http") && !isWhatsAppWebUrl(href)
                        ? "_blank"
                        : undefined
                    }
                    rel={
                      href.startsWith("http") && !isWhatsAppWebUrl(href)
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className={cn(
                      "neon-social-hover flex h-8 w-8 items-center justify-center rounded-full sm:h-9 sm:w-9",
                      isRoyalHome
                        ? "bg-gold-dark/55 text-cream-warm hover:bg-gold-primary hover:text-royal-bg-primary hover:shadow-none"
                        : "bg-green-soft text-green-deep hover:bg-orange hover:text-white",
                    )}
                    aria-label={label}
                  >
                    <Icon
                      className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                      aria-hidden="true"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <FooterColumn title="Menu" isRoyalHome={isRoyalHome}>
            <ul className="space-y-2.5">
              {MENU_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={cn(
                      "text-sm transition-colors",
                      isRoyalHome
                        ? "text-cream-warm/90 hover:text-gold-light"
                        : "text-cream/90 hover:text-orange",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Catering" isRoyalHome={isRoyalHome}>
            <ul className="space-y-2.5">
              {CATERING_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={cn(
                      "text-sm transition-colors",
                      isRoyalHome
                        ? "text-cream-warm/90 hover:text-gold-light"
                        : "text-cream/90 hover:text-orange",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Company" isRoyalHome={isRoyalHome}>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={cn(
                      "text-sm transition-colors",
                      isRoyalHome
                        ? "text-cream-warm/90 hover:text-gold-light"
                        : "text-cream/90 hover:text-orange",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn
            title="Contact"
            withBorder={false}
            isRoyalHome={isRoyalHome}
          >
            <ul
              className={cn(
                "space-y-3 text-sm",
                isRoyalHome ? "text-cream-warm/90" : "text-cream/90",
              )}
            >
              <li>
                <a
                  href={`tel:${CONTACT.callPrimaryRaw}`}
                  className={cn(
                    "flex items-center gap-2 transition-colors",
                    isRoyalHome ? "hover:text-gold-light" : "hover:text-orange",
                  )}
                  aria-label={`Call ${CONTACT.callPrimary}`}
                >
                  <Phone
                    className={cn(
                      "h-4 w-4 shrink-0",
                      isRoyalHome ? "text-gold-primary" : "text-orange",
                    )}
                    aria-hidden="true"
                  />
                  <span>{CONTACT.callPrimary}</span>
                </a>
              </li>
              <li>
                <a
                  href={businessEmailMailto()}
                  className={cn(
                    "flex items-center gap-2 transition-colors",
                    isRoyalHome ? "hover:text-gold-light" : "hover:text-orange",
                  )}
                  aria-label={`Email ${BUSINESS.email}`}
                >
                  <Mail
                    className={cn(
                      "h-4 w-4 shrink-0",
                      isRoyalHome ? "text-gold-primary" : "text-orange",
                    )}
                    aria-hidden="true"
                  />
                  <span className="break-all sm:break-normal">
                    {BUSINESS.email}
                  </span>
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0",
                    isRoyalHome ? "text-gold-primary" : "text-orange",
                  )}
                  aria-hidden="true"
                />
                <span>Hyderabad, Telangana</span>
              </li>
            </ul>

            <div
              className={cn(
                "mt-6 w-full min-w-0 rounded-2xl border p-4 shadow-lg sm:p-5 lg:mt-6",
                isRoyalHome
                  ? "border-gold-primary/35 bg-royal-bg-tertiary"
                  : "border-orange/30 bg-green-deep",
              )}
            >
              <h4
                className={cn(
                  "font-heading text-lg font-bold",
                  isRoyalHome ? "text-gold-primary" : "text-orange",
                )}
              >
                Craving Something?
              </h4>
              <p
                className={cn(
                  "mt-1 text-sm",
                  isRoyalHome ? "text-cream-warm/80" : "text-cream/80",
                )}
              >
                We are just a call away!
              </p>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
                <Button
                  asChild
                  variant="default"
                  size="sm"
                  className={cn(
                    "neon-btn-orange w-full sm:w-auto",
                    isRoyalHome &&
                      "border border-gold-dark/35 hover:shadow-[0_0_24px_rgba(212,175,55,0.35)] hover:shadow-none",
                  )}
                >
                  <a href={`tel:${CONTACT.callPrimaryRaw}`}>
                    {CONTACT.callPrimary}
                  </a>
                </Button>

                <Button
                  asChild
                  variant="secondary"
                  size="sm"
                  className={cn(
                    "w-full sm:w-auto",
                    isRoyalHome
                      ? "!hover:bg-[#22c55e] !bg-[#25D366] !shadow-none"
                      : "bg-green-soft hover:bg-green-neon",
                  )}
                >
                  <a
                    href={whatsappUrl(
                      CONTACT.whatsappOrdersRaw,
                      "Hi, I'd like to place an order!",
                    )}
                  >
                    WhatsApp Us
                  </a>
                </Button>
              </div>
            </div>
          </FooterColumn>
        </div>
      </div>

      <div
        className={cn(
          "border-t",
          isRoyalHome ? "border-gold-dark/20" : "border-green-soft/20",
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-center sm:flex-row sm:px-6 lg:px-8",
            isRoyalHome ? "text-gold-dark/85" : "text-cream/80",
          )}
        >
          <p className="min-w-0">
            &copy; 2026 {SITE.name}. All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/privacy"
              className={cn(
                "transition-colors",
                isRoyalHome ? "hover:text-gold-light" : "hover:text-orange",
              )}
            >
              Privacy Policy
            </Link>
            <span aria-hidden="true">|</span>
            <Link
              href="/terms"
              className={cn(
                "transition-colors",
                isRoyalHome ? "hover:text-gold-light" : "hover:text-orange",
              )}
            >
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
