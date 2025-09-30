import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { tag } = (req.body || {}) as { tag?: string }

  if (!tag) {
    res.status(400).json({ error: "tag is required" })
    return
  }

  const storefrontUrl = process.env.NEXT_PUBLIC_MEDUSA_STOREFRONT_URL || "http://localhost:8000"
  const revalidateSecret = process.env.REVALIDATE_SECRET || ""

  if (!process.env.NEXT_PUBLIC_MEDUSA_STOREFRONT_URL) {
    console.warn("[revalidate] NEXT_PUBLIC_MEDUSA_STOREFRONT_URL not set, using default:", storefrontUrl)
  }

  try {
    const url = `${storefrontUrl}/api/revalidate?tag=${encodeURIComponent(tag)}`
    const headers: Record<string, string> = {}
    
    if (revalidateSecret) {
      headers["x-revalidate-secret"] = revalidateSecret
    }

    console.log(`[revalidate] Calling storefront: ${url}`)
    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }))
      res.status(response.status).json(error)
      return
    }

    const result = await response.json()
    res.json(result)
  } catch (error: any) {
    console.error(`[revalidate] Failed to revalidate ${tag}:`, error)
    
    if (error.cause?.code === 'ECONNREFUSED') {
      res.status(503).json({ 
        error: `Cannot connect to storefront at ${storefrontUrl}. Make sure the storefront is running and NEXT_PUBLIC_MEDUSA_STOREFRONT_URL is set correctly.` 
      })
      return
    }
    
    res.status(500).json({ error: error.message || "Failed to revalidate" })
  }
}
