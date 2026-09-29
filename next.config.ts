import type { NextConfig } from "next";

const storageUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const nextConfig: NextConfig = {
  images: {
    remotePatterns: storageUrl
      ? [
          {
            protocol: "https",
            hostname: new URL(storageUrl).hostname,
            pathname: "/storage/v1/object/public/portfolio-media/**",
          },
        ]
      : [],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};
export default nextConfig;
