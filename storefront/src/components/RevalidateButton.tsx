"use client"

import React, { useState } from "react"

export default function RevalidateButton({ tags = "all" }: { tags?: string }) {
  const [status, setStatus] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const trigger = async () => {
    try {
      setLoading(true)
      setStatus("")
      const res = await fetch(`/api/revalidate?tags=${encodeURIComponent(tags)}`)
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || `Status ${res.status}`)
      setStatus("Revalidated")
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
        {loading ? "Revalidating…" : `Revalidate (${tags})`}
      </button>
      {status && <span className="text-sm text-gray-600">{status}</span>}
    </div>
  )
}
