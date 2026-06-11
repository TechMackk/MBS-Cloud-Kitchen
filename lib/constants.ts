import { BUSINESS } from "@/lib/constants/business";

function toRawPhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export { BUSINESS } from "@/lib/constants/business";

export const SITE = {
  name: "MBS Cloud Kitchen",
  tagline: "Mind, Body & Soul",
  subTagline: "Telangana Specials",
  description:
    "Authentic Telangana Specials, Delivered Fresh. Mind, Body & Soul.",
  url: BUSINESS.siteUrl,
} as const;

export const CONTACT = {
  email: BUSINESS.email,
  address: BUSINESS.address,
  whatsappOrders: BUSINESS.whatsapp.orders,
  whatsappOrdersRaw: toRawPhone(BUSINESS.whatsapp.orders),
  whatsappCatering: BUSINESS.whatsapp.catering,
  whatsappCateringRaw: toRawPhone(BUSINESS.whatsapp.catering),
  callPrimary: BUSINESS.phone.primary,
  callPrimaryRaw: toRawPhone(BUSINESS.phone.primary),
  callSecondary: BUSINESS.phone.secondary,
  callSecondaryRaw: toRawPhone(BUSINESS.phone.secondary),
} as const;

export const LOCATION = {
  lat: 17.4435,
  lng: 78.3772,
  mapsEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.234567890123!2d78.3746!3d17.4435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDI2JzM2LjYiTiA3OMKwMjInMzguNiJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=17.4435,78.3772`,
} as const;

export const HOURS = {
  weekdays: "Mon – Sat: 11:00 AM – 10:00 PM",
  sunday: "Sunday: 12:00 PM – 9:00 PM",
} as const;

export type NavLink = {
  label: string;
  href: string;
};

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/about" },
  { label: "Catering", href: "/catering" },
  { label: "Contact", href: "/contact" },
];

export type QualityPromise = {
  id: string;
  label: string;
};

export const QUALITY_PROMISES: QualityPromise[] = [
  { id: "no-frozen", label: "No Frozen Food" },
  { id: "no-reused-oil", label: "No Reused Oil" },
  { id: "fresh-daily", label: "Fresh Daily Prep" },
  { id: "hygienic", label: "Hygienic Kitchen" },
];

export type AboutCard = {
  id: string;
  title: string;
  description: string;
  iconName: "book-open" | "heart-handshake" | "chef-hat";
};

export const ABOUT_CARDS: AboutCard[] = [
  {
    id: "story",
    title: "Our Story",
    description:
      "Born in Hyderabad, MBS Cloud Kitchen brings authentic Telangana flavours to your doorstep — recipes passed down through generations.",
    iconName: "book-open",
  },
  {
    id: "promise",
    title: "Our Promise",
    description:
      "Every dish is prepared fresh daily with premium ingredients. No shortcuts, no compromises — just honest, homestyle cooking.",
    iconName: "heart-handshake",
  },
  {
    id: "process",
    title: "Our Process",
    description:
      "From sourcing local produce to hygienic packaging, we follow strict quality checks so every meal arrives hot, fresh, and safe.",
    iconName: "chef-hat",
  },
];

export { whatsappUrl } from "@/lib/whatsapp/links";

export const FOOTER_QUICK_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "About Us", href: "/about" },
  { label: "Catering", href: "/catering" },
  { label: "Contact", href: "/contact" },
];
