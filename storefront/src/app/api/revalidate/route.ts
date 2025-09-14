import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const tags = searchParams.get("tags") as string

  if (!tags) {
    return NextResponse.json({ error: "No tags provided" }, { status: 400 })
  }

  const tagsArray = tags.split(",")
  await Promise.all(
    tagsArray.map(async (tag) => {
      switch (tag) {
        case "testimonials":
          revalidatePath("/[countryCode]/(main)") // Home page where testimonials are shown
          revalidatePath("/api/testimonials") // API route
          break
        case "products":
          revalidatePath("/[countryCode]/(main)/store", "page")
          revalidatePath("/[countryCode]/(main)/products/[handle]", "page")
          break
        case "blogs":
          // Blogs listing and blog detail pages (route patterns)
          revalidatePath("/[countryCode]/(main)/blogs", "page")
          revalidatePath("/[countryCode]/(main)/blogs/[id]", "page")
          break
        case "hero":
          // Home page uses HeroSlider with SSR
          revalidatePath("/[countryCode]/(main)", "page")
          break
        case "all":
          // Revalidate everything relevant in one go
          revalidatePath("/[countryCode]/(main)", "page")
          revalidatePath("/[countryCode]/(main)/blogs", "page")
          revalidatePath("/[countryCode]/(main)/blogs/[id]", "page")
          revalidatePath("/[countryCode]/(main)/store", "page")
          revalidatePath("/[countryCode]/(main)/products/[handle]", "page")
          revalidatePath("/api/testimonials")
          break
        default:
          break
      }
    })
  )

  return NextResponse.json({ message: "Revalidated" }, { status: 200 })
}
