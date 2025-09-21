"use client"

import React, { useState } from "react"

export default function RevalidateButton({ tag, tags }: { tag?: string; tags?: string }) {
  const [status, setStatus] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const trigger = async () => {
    try {
      setLoading(true)
      setStatus("")
      const qs = tag
        ? `?tag=${encodeURIComponent(tag)}`
        : tags
        ? `?tags=${encodeURIComponent(tags)}`
        : "?tag=hero"
      const res = await fetch(`/api/revalidate${qs}`)
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || `Status ${res.status}`)
      setStatus(json?.message || "Revalidated")
    } catch (e: any) {
      setStatus(`Failed: ${e.message || "error"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4 flex items-center gap-3">
      <button
        onClick={trigger}
        disabled={loading}
        className="px-4 py-2 rounded bg-[#262b5f] text-white hover:bg-opacity-90 disabled:opacity-50"
      >
        {loading ? "Revalidating…" : `Revalidate (${tag || tags || "hero"})`}
      </button>
      {status && <span className="text-sm text-gray-600">{status}</span>}
    </div>
  )
}
