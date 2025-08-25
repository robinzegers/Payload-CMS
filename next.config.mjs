import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  experimental: {
    // Remove hardcoded path that breaks deployment
    // outputFileTracingRoot: process.cwd(),
  },
  // Disable source maps in production to avoid module resolution issues
  productionBrowserSourceMaps: false,
  async rewrites() {
    return [
      {
        source: "/((?!admin|api))tenant-domains/:path*",
        destination: "/tenant-domains/:tenant/:path*",
        has: [
          {
            type: "host",
            value: "(?<tenant>.*)",
          },
        ],
      },
    ];
  },
};

export default withPayload(nextConfig);
