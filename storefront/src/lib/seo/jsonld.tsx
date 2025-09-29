import React from "react"
import { getBaseURL } from "@/lib/util/env"
import { getSiteConfig } from "./config"
import type { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@/lib/util/get-product-price"

function JsonLd({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      suppressHydrationWarning
    />
  )
}

export function OrganizationJsonLd() {
  const site = getSiteConfig()
  const url = site.url
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.organization.name,
    url,
    logo: new URL(site.organization.logo, url).toString(),
    sameAs: site.organization.sameAs,
  }
  return <JsonLd data={data} />
}

export function BlogPostingJsonLd({
  blog,
  url,
}: {
  blog: {
    id: string
    title: string
    publishedAt: string
    category: string
    image: string
    excerpt: string
    content: string
    author: string
  }
  url: string
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    image: [blog.image],
    datePublished: blog.publishedAt,
    dateModified: blog.publishedAt,
    author: {
      '@type': 'Person',
      name: blog.author,
    },
    description: blog.excerpt,
    mainEntityOfPage: url,
  }
  return <JsonLd data={data} />
}

export function WebsiteJsonLd({
  countryCode,
}: {
  countryCode: string
}) {
  const site = getSiteConfig()
  const url = site.url
  const homepage = new URL(`/${countryCode}`, url).toString()
  const data: any = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: homepage,
    name: site.name,
  }
  // Intentionally omitting SearchAction until "q" is supported in routing
  return <JsonLd data={data} />
}

export function ProductJsonLd({
  product,
  countryCode,
}: {
  product: HttpTypes.StoreProduct
  countryCode: string
}) {
  const site = getSiteConfig()
  const url = site.url
  const productUrl = new URL(`/${countryCode}/products/${product.handle}`, url)

  const cheapest = getProductPrice({ product }).cheapestPrice
  const currency = cheapest?.currency_code
  const price = cheapest?.calculated_price_number

  const hasStock = (product.variants || []).some(
    // @ts-ignore inventory_quantity may be present based on selected fields
    (v: any) => typeof v.inventory_quantity === 'number' && v.inventory_quantity > 0
  )

  const brandName = (product as any)?.metadata?.brand || site.name

  const data: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description || product.title,
    sku: product.variants?.[0]?.sku || undefined,
    image: product.thumbnail ? [product.thumbnail] : undefined,
    brand: {
      '@type': 'Brand',
      name: brandName,
    },
    url: productUrl.toString(),
    offers: price
      ? {
          '@type': 'Offer',
          priceCurrency: currency,
          price: (price / 100).toFixed(2),
          availability: hasStock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          url: productUrl.toString(),
        }
      : undefined,
  }

  return <JsonLd data={data} />
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[]
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
  return <JsonLd data={data} />
}

export function ItemListJsonLd({
  items,
}: {
  items: { name: string; url: string }[]
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: item.url,
      name: item.name,
    })),
  }
  return <JsonLd data={data} />
}
