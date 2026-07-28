import type { CSSProperties } from "react";

/** Fallback palette used whenever an installer hasn't picked a brand colour. */
export const DEFAULT_BRAND_COLOR = "#1c8a4c";

const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;

/** Coerces stored/user input to a usable hex colour, falling back to the default. */
export function resolveBrandColor(value: string | null | undefined): string {
  if (!value) return DEFAULT_BRAND_COLOR;
  const trimmed = value.trim();
  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  return HEX_PATTERN.test(withHash) ? withHash.toLowerCase() : DEFAULT_BRAND_COLOR;
}

type Rgb = [number, number, number];

function toRgb(hex: string): Rgb {
  const value = resolveBrandColor(hex).slice(1);
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ];
}

function toHex([r, g, b]: Rgb): string {
  const channel = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${channel(r)}${channel(g)}${channel(b)}`;
}

function mix(hex: string, target: Rgb, ratio: number): string {
  const [r, g, b] = toRgb(hex);
  return toHex([
    r + (target[0] - r) * ratio,
    g + (target[1] - g) * ratio,
    b + (target[2] - b) * ratio,
  ]);
}

/** Lightens toward white — used for tinted section backgrounds. */
export function tint(hex: string, ratio: number): string {
  return mix(hex, [255, 255, 255], ratio);
}

/** Darkens toward black — used for text that sits on a tinted background. */
export function shade(hex: string, ratio: number): string {
  return mix(hex, [0, 0, 0], ratio);
}

export function withAlpha(hex: string, alpha: number): string {
  const [r, g, b] = toRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** WCAG relative luminance, used to decide black-vs-white text on the brand colour. */
function luminance(hex: string): number {
  const [r, g, b] = toRgb(hex).map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }) as Rgb;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Readable text colour to place directly on top of `hex`. */
export function onBrand(hex: string): string {
  return luminance(hex) > 0.55 ? "#14231b" : "#ffffff";
}

/**
 * Maps a company's brand colour onto the design-system tokens the whole
 * authenticated UI is built from. Spread onto a wrapper element's `style` and
 * every `bg-primary`, `text-primary`, `ring`, and `accent` beneath it re-themes
 * to the installer's brand — no per-component wiring needed.
 */
export function brandThemeVars(brandColor: string | null | undefined): CSSProperties {
  const brand = resolveBrandColor(brandColor);

  return {
    "--primary": brand,
    "--primary-foreground": onBrand(brand),
    "--ring": withAlpha(brand, 0.5),
    "--accent": tint(brand, 0.9),
    "--accent-foreground": shade(brand, 0.2),
    "--sidebar-primary": brand,
    "--sidebar-primary-foreground": onBrand(brand),
    "--sidebar-ring": withAlpha(brand, 0.5),
    "--success": tint(brand, 0.9),
    "--success-foreground": shade(brand, 0.2),
    // Glow under the primary call-to-action buttons.
    "--brand-shadow": withAlpha(brand, 0.24),
  } as CSSProperties;
}
