import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // External packages for Node runtime
  serverExternalPackages: ["@prisma/client", "prisma", "bcryptjs"],

  // Image optimization
  images: {
    formats: ["image/webp", "image/avif"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
    ];
  },

  // Redirects for legacy URLs to canonical route architecture
  async redirects() {
    return [
      { source: '/knee-replacement', destination: '/treatments/knee-replacement/', permanent: true },
      { source: '/acl', destination: '/treatments/acl-surgery/', permanent: true },
      { source: '/knee-pain', destination: '/treatments/knee-pain/', permanent: true },
      { source: '/knee-check', destination: '/knee-reset/', permanent: true },
      { source: '/consult/imaging-review', destination: '/consult/xray-mri-review/', permanent: true },
      { source: '/international-second-opinion', destination: '/consult/international/', permanent: true },
      { source: '/blog', destination: '/insights/', permanent: true },
    ];
  },
};

export default nextConfig;
