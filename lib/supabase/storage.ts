/** Public Storage bucket holding installer company logos. */
export const LOGO_BUCKET = "logos";

const PUBLIC_URL_MARKER = `/storage/v1/object/public/${LOGO_BUCKET}/`;

/**
 * Turns a public logo URL back into the object path Storage knows it by
 * (`<uid>/logo-123.png`), so a replaced logo can be removed. Returns null for
 * anything that isn't a logo URL from our own bucket — old rows may hold a
 * URL from a different project, or nothing at all.
 */
/**
 * next/image's optimizer rejects SVG unless `dangerouslyAllowSVG` is on, which
 * we don't want for user-uploaded files. Serving them unoptimized keeps them in
 * an <img> context, where SVG scripting is inert.
 */
export function isSvgUrl(url: string): boolean {
  return url.split("?")[0].toLowerCase().endsWith(".svg");
}

export function logoPathFromPublicUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const index = url.indexOf(PUBLIC_URL_MARKER);
  if (index === -1) return null;
  const path = url.slice(index + PUBLIC_URL_MARKER.length).split("?")[0];
  return path ? decodeURIComponent(path) : null;
}
