import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "green-deep": "#1F3A3D",
        "green-soft": "#8DBA5F",
        "green-neon": "#A8E063",
        orange: "#E8843A",
        "orange-neon": "#FFB347",
        cream: "#F5EFD8",
        bg: "#FFFFFF",
        text: "#1A1A1A",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(168, 224, 99, 0.35)",
        "glow-orange": "0 0 24px rgba(232, 132, 58, 0.45)",
        "glow-card": "0 0 30px rgba(168, 224, 99, 0.25)",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #F5EFD8 0%, #FFFFFF 40%, rgba(141, 186, 95, 0.15) 100%)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
