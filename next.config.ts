import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "date-fns"],
  },

  /**
   * Packages listed here are NOT bundled into each serverless function.
   * Instead, Vercel loads them from a shared layer at runtime.
   *
   * This is critical for staying under Vercel's 50 MB per-function limit.
   *
   * - sharp: native binary (pre-built for Vercel's Linux)
   * - @prisma/client: query engine is large (~12 MB)
   * - @libsql/client: native binding for Turso
   */
  serverExternalPackages: ["sharp", "@prisma/client", "@prisma/adapter-libsql", "@libsql/client"],

  headers: async () => [
    {
      source: "/:path*",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
    },
  ],
};

export default withSentryConfig(nextConfig, {
  silent: true,
  hideAllErrors: false,
  disableLogger: true,
});