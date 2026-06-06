import Link from "next/link";
import { MapPin, MessageCircle, Phone } from "lucide-react";

import { Logo } from "@/components/layout/Logo";
import {
  CONTACT,
  FOOTER_QUICK_LINKS,
  HOURS,
  SITE,
  whatsappUrl,
} from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto">
      <div className="bg-cream/50">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Logo className="h-9 w-9 text-xs" />
              <div>
                <p className="font-heading font-semibold text-green-deep">
                  {SITE.name}
                </p>
                <p className="text-xs text-green-soft">{SITE.subTagline}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-text/70">
              {SITE.description}
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-green-deep">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {FOOTER_QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text/70 transition-colors hover:text-green-deep"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-green-deep">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-text/70">
              <li className="flex items-start gap-2">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-orange"
                  aria-hidden="true"
                />
                <span>{CONTACT.address}</span>
              </li>
              <li>
                <a
                  href={whatsappUrl(
                    CONTACT.whatsappOrdersRaw,
                    "Hi, I'd like to place an order!",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors hover:text-green-deep"
                  aria-label={`WhatsApp orders: ${CONTACT.whatsappOrders}`}
                >
                  <MessageCircle
                    className="h-4 w-4 text-green-soft"
                    aria-hidden="true"
                  />
                  <span>
                    Orders: {CONTACT.whatsappOrders}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl(
                    CONTACT.whatsappCateringRaw,
                    "Hi, I'd like to enquire about catering!",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors hover:text-green-deep"
                  aria-label={`WhatsApp catering: ${CONTACT.whatsappCatering}`}
                >
                  <MessageCircle
                    className="h-4 w-4 text-green-soft"
                    aria-hidden="true"
                  />
                  <span>
                    Catering: {CONTACT.whatsappCatering}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT.callPrimaryRaw}`}
                  className="flex items-center gap-2 transition-colors hover:text-green-deep"
                  aria-label={`Call ${CONTACT.callPrimary}`}
                >
                  <Phone className="h-4 w-4 text-orange" aria-hidden="true" />
                  <span>{CONTACT.callPrimary}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT.callSecondaryRaw}`}
                  className="flex items-center gap-2 transition-colors hover:text-green-deep"
                  aria-label={`Call ${CONTACT.callSecondary}`}
                >
                  <Phone className="h-4 w-4 text-orange" aria-hidden="true" />
                  <span>{CONTACT.callSecondary}</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-green-deep">
              Hours
            </h3>
            <ul className="space-y-2 text-sm text-text/70">
              <li>{HOURS.weekdays}</li>
              <li>{HOURS.sunday}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-green-deep py-4 text-center">
        <p className="text-sm text-cream">
          &copy; {currentYear} {SITE.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
