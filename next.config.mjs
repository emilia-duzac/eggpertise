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
    minimumCacheTTL: 60 * 60 * 24 * 31,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Other sites can't show ours inside a frame (blocks clickjacking).
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Other sites only learn a visitor came from eggpertise.com, not the page.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // The site never uses these, so nothing on it can ask for them.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ]
  },
}

export default nextConfig
