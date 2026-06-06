import type { MetadataRoute } from "next";

import { SITE } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: "MBS Kitchen",
    description: "Authentic Telangana specials, delivered fresh",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#1F3A3D",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
