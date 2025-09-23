import type { NextConfig } from "next"
const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "qipgbcfplwabixzlbdcd.supabase.co",
      },
      {
        protocol: "https",
        hostname: "vunurggmxxqphafcqfvq.supabase.co",
      },
      {
        protocol: "https",
        hostname: "jcpasbogaeujmakqvpby.supabase.co",
      },
      {
        protocol: "https",
        hostname: "r2-jj.unlux.dev",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
    ]
  },
  skipTrailingSlashRedirect: true,
}

export default nextConfig
