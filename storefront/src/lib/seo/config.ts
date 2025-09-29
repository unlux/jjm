import { getBaseURL } from "@/lib/util/env"

export type SiteConfig = {
  name: string
  description: string
  url: string
  defaultOgImage: string
  organization: {
    name: string
    logo: string
    sameAs: string[]
  }
}

export function getSiteConfig(): SiteConfig {
  const url = getBaseURL()
  return {
    name: "The Joy Junction",
    description: "The Joy Junction - A Sustainable and Eco-friendly Toy Store.",
    url,
    defaultOgImage: "/Engaging-play.png",
    organization: {
      name: "The Joy Junction",
      logo: "/logo.png",
      sameAs: [],
    },
  }
}

/**
 * Build hreflang language mapping for Next.js metadata alternates.
 * By default we map each country code to an English locale tag `en-CC`.
 */
export function buildHreflangMap(
  countryCodes: string[] | undefined,
  buildUrlForCountry: (cc: string) => string
): Record<string, string> {
  const languages: Record<string, string> = {}
  if (!countryCodes?.length) return languages
  for (const cc of countryCodes) {
    if (!cc) continue
    const locale = `en-${cc.toUpperCase()}`
    languages[locale] = buildUrlForCountry(cc)
  }
  return languages
}
