/**
 * Creor Design Tokens — Strict Black & White
 *
 * No colors. Pure monochrome. Modern and precise.
 * These values are mirrored in globals.css as CSS custom properties.
 */

export const theme = {
  light: {
    background: "#ffffff",
    foreground: "#000000",
    "foreground-secondary": "#666666",
    muted: "#f5f5f5",
    "muted-foreground": "#888888",
    border: "#e5e5e5",
    card: "#fafafa",
    "card-foreground": "#000000",
    accent: "#000000",
    "accent-foreground": "#ffffff",
  },
  dark: {
    background: "#0a0a0a",
    foreground: "#fafafa",
    "foreground-secondary": "#999999",
    muted: "#141414",
    "muted-foreground": "#777777",
    border: "#1f1f1f",
    card: "#111111",
    "card-foreground": "#fafafa",
    accent: "#fafafa",
    "accent-foreground": "#0a0a0a",
  },
} as const;
