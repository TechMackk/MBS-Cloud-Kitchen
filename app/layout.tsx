import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { SITE } from "@/lib/constants";
import { getSiteUrl } from "@/lib/seo/site-url";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: SITE.name,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  metadataBase: new URL(getSiteUrl()),
  appleWebApp: {
    capable: true,
    title: "MBS Kitchen",
    statusBarStyle: "default",
  },
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    url: getSiteUrl(),
    siteName: SITE.name,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: SITE.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#1F3A3D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="flex min-h-screen flex-col overflow-x-hidden font-sans">
        <SkipLink />
        <Header />
        <main id="main-content" className="min-w-0 flex-1 overflow-x-hidden">
          {children}
        </main>
        <Footer />
        <Toaster position="top-center" richColors closeButton />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
