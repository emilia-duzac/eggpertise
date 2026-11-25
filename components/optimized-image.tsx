"use client";

import Image, { type ImageLoader, type ImageProps } from "next/image";

// Contentful images are resized and converted by Contentful's own Images API
// (no quota of its own), so they never use Vercel's image optimization, which
// on the Hobby plan has a monthly limit. Everything else (the few fixed images
// in public/) goes through Vercel's default optimizer.
const CONTENTFUL_HOSTS = ["images.ctfassets.net"];

// The Images API can't convert SVG, and converting a GIF would drop its animation.
const PASSTHROUGH_EXTENSIONS = /\.(svg|gif)$/i;

function isContentfulImage(src: ImageProps["src"]): src is string {
  if (typeof src !== "string") return false;
  try {
    const url = new URL(src, "https://placeholder.invalid");
    return (
      CONTENTFUL_HOSTS.includes(url.hostname) &&
      !PASSTHROUGH_EXTENSIONS.test(url.pathname)
    );
  } catch {
    return false;
  }
}

// Same default quality next/image uses for the images Vercel optimizes.
const DEFAULT_QUALITY = 75;

// WebP rather than AVIF: AVIF fails on sources over 9 megapixels, and marketing
// may upload very large photos.
const contentfulLoader: ImageLoader = ({ src, width, quality }) => {
  const url = new URL(src, "https://images.ctfassets.net");
  url.protocol = "https:";
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? DEFAULT_QUALITY));
  url.searchParams.set("fm", "webp");
  return url.toString();
};

/**
 * Drop-in replacement for next/image. Use it for every image on the site
 * (lint enforces it) so new images are optimized without anyone remembering to.
 */
export default function OptimizedImage({ alt, ...props }: ImageProps) {
  if (isContentfulImage(props.src)) {
    return <Image alt={alt} loader={contentfulLoader} {...props} />;
  }
  // Any other remote image (an SVG or GIF from Contentful, a file Contentful
  // serves from another host, an external URL) is shown as is: Vercel would
  // refuse a host it doesn't know and break the page.
  if (typeof props.src === "string" && /^(https?:)?\/\//.test(props.src)) {
    return <Image alt={alt} {...props} unoptimized />;
  }
  return <Image alt={alt} {...props} />;
}
