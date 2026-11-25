// How wide an image is drawn on each screen, for next/image's `sizes`. The
// browser uses it to download the smallest version that still looks sharp, so
// it must match the layout: update it here if a grid changes.
// (Kept out of components/optimized-image.tsx: a "use client" module can't
// hand plain values to server components.)
export const IMAGE_SIZES = {
  /** Full-bleed images: home hero and the cover behind product and brand pages. */
  fullWidth: "100vw",
  /** One column on phones, two from lg (about section, product gallery). */
  halfFromLg: "(min-width: 1024px) 50vw, 100vw",
  /** One column on phones, three from lg (services). */
  thirdFromLg: "(min-width: 1024px) 33vw, 100vw",
  /** One, two (md) or three (lg) columns of cards (news, a brand's products). */
  cardGrid: "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw",
  /** Product and brand logos shown contained in a fixed-height card. */
  cardLogo: "300px",
  /** Brand logo inside the round badge on its page (at most 240px wide). */
  brandBadge: "240px",
} as const;
