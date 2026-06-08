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
        "glow-orange-neon": "0 0 20px rgba(255, 179, 71, 0.4)",
        "glow-green-neon": "0 0 20px rgba(168, 224, 99, 0.5)",
        "glow-card": "0 0 30px rgba(168, 224, 99, 0.25)",
        "glow-card-neon": "0 0 24px rgba(168, 224, 99, 0.35)",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #F5EFD8 0%, #FFFFFF 40%, rgba(141, 186, 95, 0.15) 100%)",
        "hero-radial":
          "radial-gradient(ellipse at center, #F5EFD8 0%, #FFFFFF 70%)",
      },
      keyframes: {
        "hero-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "neon-pulse-subtle": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.88", transform: "scale(1.04)" },
        },
        "neon-dot-pulse": {
          "0%, 100%": { opacity: "0.25", transform: "scale(1)" },
          "50%": { opacity: "0.55", transform: "scale(1.2)" },
        },
        "cart-neon-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(168, 224, 99, 0)" },
          "50%": { boxShadow: "0 0 14px 3px rgba(168, 224, 99, 0.45)" },
        },
      },
      animation: {
        "hero-float": "hero-float 3s ease-in-out infinite",
        "neon-pulse-subtle": "neon-pulse-subtle 3s ease-in-out infinite",
        "neon-dot-pulse": "neon-dot-pulse 4s ease-in-out infinite",
        "cart-neon-pulse": "cart-neon-pulse 1.2s ease-in-out",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
