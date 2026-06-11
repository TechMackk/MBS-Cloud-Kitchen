export const BUSINESS = {
  email: "admin@mbscloudkitchen.in",
  phone: {
    primary: "+91 98486 06161",
    secondary: "+91 98486 06262",
  },
  whatsapp: {
    orders: "+91 81796 56696",
    catering: "+91 96769 40777",
  },
  address: "Road No 3, Plot 44, Near Hanuman Temple, Hyderabad - 500091",
  domain: "mbscloudkitchen.in",
  siteUrl: "https://mbscloudkitchen.in",
} as const;

export function businessEmailMailto(): string {
  return `mailto:${BUSINESS.email}`;
}
