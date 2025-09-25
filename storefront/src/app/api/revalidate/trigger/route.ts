import { NextRequest, NextResponse } from "next/server"

// This is a server-side proxy that forwards to /api/revalidate with the secret header
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const tag = url.searchParams.get("tag")
    const tags = url.searchParams.get("tags")

    const search = tag ? `?tag=${encodeURIComponent(tag)}` : tags ? `?tags=${encodeURIComponent(tags)}` : ""

    const target = new URL(`/api/revalidate${search}`, url.origin)

    const headers: HeadersInit = {}
    const secret = process.env.REVALIDATE_SECRET
    if (secret) {
      headers["x-revalidate-secret"] = secret
    }

    const res = await fetch(target.toString(), {
      method: "GET",
      headers,
      // Keep it internal; don't forward cookies since the target also lives here
      cache: "no-store",
    })

    const json = await res.json().catch(() => ({}))
    if (!res.ok) {
      return NextResponse.json(json || { error: "Failed" }, { status: res.status })
    }
    return NextResponse.json(json)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error" }, { status: 500 })
  }
}
