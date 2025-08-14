export default function medusaError(error: any): never {
  try {
    if (error?.response) {
      // The request was made and the server responded with a non-2xx status
      const fullUrl = (() => {
        try {
          return new URL(error?.config?.url, error?.config?.baseURL).toString()
        } catch {
          return error?.config?.url || "<unknown>"
        }
      })()

      const status = error?.response?.status
      const data = error?.response?.data

      console.error("[medusaError] Request failed", {
        url: fullUrl,
        status,
        data,
        headers: error?.response?.headers,
      })

      // Prefer a string message; safely stringify otherwise
      let message: any =
        data?.message ?? data ?? error?.message ?? "Unknown error"
      if (typeof message !== "string") {
        try {
          message = JSON.stringify(message)
        } catch {
          message = String(message)
        }
      }

      // Normalize message casing but avoid charAt on empty
      const norm = message ? String(message) : "Unknown error"
      throw new Error(norm)
    } else if (error?.request) {
      // The request was made but no response was received
      console.error("[medusaError] No response received", {
        url: error?.config?.url,
        baseURL: error?.config?.baseURL,
      })
      throw new Error("No response received")
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("[medusaError] Request setup error", {
        message: error?.message,
      })
      throw new Error(error?.message || "Request setup error")
    }
  } catch (e: any) {
    // Final fallback to ensure we always throw a usable message
    throw new Error(e?.message || "Unexpected error")
  }
}
