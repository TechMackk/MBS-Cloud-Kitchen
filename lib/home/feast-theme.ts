/**
 * Homepage-only design tokens for "The Telangana Feast Journey".
 * Scoped via `.home-feast` in globals.css — does not override site-wide Tailwind colors.
 */
export const FEAST_THEME = {
  primary: "#D97706",
  secondary: "#14532D",
  accent: "#DC2626",
  bg: "#FFFDF7",
  text: "#1F2937",
} as const;

export type FeastThemeToken = keyof typeof FEAST_THEME;

export const FEAST_CSS_VARS = {
  "--feast-primary": FEAST_THEME.primary,
  "--feast-secondary": FEAST_THEME.secondary,
  "--feast-accent": FEAST_THEME.accent,
  "--feast-bg": FEAST_THEME.bg,
  "--feast-text": FEAST_THEME.text,
} as const;
