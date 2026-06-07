import Link from "next/link";
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
}: {
  title: string;
  children: React.ReactNode;
  withBorder?: boolean;
}) {
  return (
    <div
      className={
        withBorder
          ? "lg:border-r lg:border-green-soft/30 lg:pr-6 xl:pr-8"
          : undefined
      }
    >
      <h3 className="mb-4 font-heading text-base font-semibold text-orange">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto bg-green-deep text-cream">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          <div className="lg:border-r lg:border-green-soft/30 lg:pr-6 xl:pr-8">
            <div className="space-y-4">
              <Logo className="h-10 w-10 text-xs" />
              <p className="text-sm font-medium">Healthy Telangana Foods</p>
              <div className="flex gap-3">
                {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      href.startsWith("http") ? "noopener noreferrer" : undefined
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-green-soft text-green-deep transition-colors hover:bg-orange hover:text-white"
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <FooterColumn title="Menu">
            <ul className="space-y-2.5">
              {MENU_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream/90 transition-colors hover:text-orange"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Catering">
            <ul className="space-y-2.5">
              {CATERING_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream/90 transition-colors hover:text-orange"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Company">
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream/90 transition-colors hover:text-orange"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Contact" withBorder={false}>
            <ul className="space-y-3 text-sm text-cream/90">
              <li>
                <a
                  href={`tel:${CONTACT.callPrimaryRaw}`}
                  className="flex items-center gap-2 transition-colors hover:text-orange"
                  aria-label={`Call ${CONTACT.callPrimary}`}
                >
                  <Phone className="h-4 w-4 shrink-0 text-orange" aria-hidden="true" />
                  <span>{CONTACT.callPrimary}</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@mbscloudkitchen.in"
                  className="flex items-center gap-2 transition-colors hover:text-orange"
                  aria-label="Email hello@mbscloudkitchen.in"
                >
                  <Mail className="h-4 w-4 shrink-0 text-orange" aria-hidden="true" />
                  <span>hello@mbscloudkitchen.in</span>
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-orange"
                  aria-hidden="true"
                />
                <span>Hyderabad, Telangana</span>
              </li>
            </ul>

            <div className="mt-6 rounded-2xl border border-orange/30 bg-green-deep p-5 shadow-lg">
              <h4 className="font-heading text-lg font-bold text-orange">
                Craving Something?
              </h4>
              <p className="mt-1 text-sm text-cream/80">
                We are just a call away!
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
                <Button
                  asChild
                  variant="default"
                  size="sm"
                  className="w-full sm:w-auto lg:w-full xl:w-auto"
                >
                  <a href={`tel:${CONTACT.callPrimaryRaw}`}>
                    {CONTACT.callPrimary}
                  </a>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  size="sm"
                  className="w-full bg-green-soft hover:bg-green-neon sm:w-auto lg:w-full xl:w-auto"
                >
                  <a
                    href={whatsappUrl(
                      CONTACT.whatsappOrdersRaw,
                      "Hi, I'd like to place an order!",
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp Us
                  </a>
                </Button>
              </div>
            </div>
          </FooterColumn>
        </div>
      </div>

      <div className="border-t border-green-soft/20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-sm text-cream/80 sm:flex-row sm:px-6 lg:px-8">
          <p>
            &copy; 2026 {SITE.name}. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="transition-colors hover:text-orange"
            >
              Privacy Policy
            </Link>
            <span aria-hidden="true">|</span>
            <Link
              href="#"
              className="transition-colors hover:text-orange"
            >
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
