import { CATEGORY_LABELS, MENU_CATEGORIES } from "@/lib/data/categories";
import type { MenuItem } from "@/lib/data/menu";
import { CONTACT, HOURS, LOCATION, SITE } from "@/lib/constants";
import { BUSINESS } from "@/lib/constants/business";
import { getSiteUrl } from "@/lib/seo/site-url";

export function getRestaurantSchema() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: SITE.name,
    image: `${siteUrl}/og-image.png`,
    email: BUSINESS.email,
    telephone: CONTACT.callPrimaryRaw.replace(/^91/, "+91"),
    priceRange: "₹₹",
    servesCuisine: ["Telangana", "Hyderabadi", "Indo-Chinese", "Indian"],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Road No 3, Plot No 44, Near Hanuman Temple",
      addressLocality: "Hyderabad",
      postalCode: "500091",
      addressRegion: "Telangana",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: LOCATION.lat,
      longitude: LOCATION.lng,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "11:00",
        closes: "22:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "12:00",
        closes: "21:00",
      },
    ],
    hasMenu: `${siteUrl}/menu`,
    description: SITE.description,
    url: siteUrl,
    openingHours: [HOURS.weekdays, HOURS.sunday],
  };
}

export function getBreadcrumbSchema(
  items: Array<{ name: string; path: string }>,
) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

export function getMenuSchema(items: MenuItem[]) {
  const siteUrl = getSiteUrl();

  const sections = MENU_CATEGORIES.map((category) => {
    const categoryItems = items.filter((item) => item.category === category);
    if (categoryItems.length === 0) {
      return null;
    }

    return {
      "@type": "MenuSection",
      name: CATEGORY_LABELS[category],
      hasMenuItem: categoryItems.map((item) => getMenuItemSchema(item)),
    };
  }).filter((section) => section !== null);

  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: `${SITE.name} Menu`,
    url: `${siteUrl}/menu`,
    hasMenuSection: sections,
  };
}

export function getMenuItemSchema(item: MenuItem) {
  return {
    "@type": "MenuItem",
    name: item.name,
    description: item.description,
    image: item.imageUrl,
    offers: {
      "@type": "Offer",
      price: item.price,
      priceCurrency: "INR",
    },
  };
}
