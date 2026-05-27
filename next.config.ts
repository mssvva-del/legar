import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // typedRoutes увімкнемо коли всі маршрути стабілізуються — Next.js 16 надто
  // строгий до `as \`/${string}\`` патернів для динамічних маршрутів.
  typedRoutes: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "legar.com.ua",
      },
    ],
  },
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
