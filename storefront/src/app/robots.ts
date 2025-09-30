import type { MetadataRoute } from "next"

import { getBaseURL } from "@/lib/util/env"

export default function robots(): MetadataRoute.Robots {
  const base = getBaseURL()
  const isProd =
    process.env.NODE_ENV === "production" && !base.includes("localhost")
  const noindex =
    String(process.env.NEXT_PUBLIC_NOINDEX || "").toLowerCase() === "true"

  return {
    rules: [
      {
        userAgent: "*",
        allow: isProd && !noindex ? "/" : [],
        disallow: isProd && !noindex ? ["/api", "/api/*"] : ["/"],
      },
    ],
    sitemap: [new URL("/sitemap.xml", base).toString()],
  }
}
