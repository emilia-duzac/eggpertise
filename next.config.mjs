/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Contentful images are optimized by Contentful (components/optimized-image.tsx).
    // This entry is only a safety net so a Contentful image rendered with plain
    // next/image still shows up instead of breaking the page.
    remotePatterns: [{ protocol: "https", hostname: "images.ctfassets.net" }],
    // Vercel counts a transformation on every cache miss or stale hit, so keep
    // optimized images cached for 31 days (the most Vercel keeps them).
    minimumCacheTTL: 2678400,
  },
}

export default nextConfig
