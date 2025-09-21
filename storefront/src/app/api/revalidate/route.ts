import { NextRequest, NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const tags = searchParams.get("tags") as string
  const simpleHeroTag = searchParams.get("tag") as string | null

  // Optional auth: require shared secret if configured
  const expected = process.env.REVALIDATE_SECRET
  if (expected) {
    const provided = req.headers.get("x-revalidate-secret") || ""
    if (provided !== expected) {
      console.warn("[revalidate] unauthorized request")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  console.log("[revalidate] incoming", {
    url: req.nextUrl.pathname + req.nextUrl.search,
    mode: simpleHeroTag ? "simple" : tags ? "multi" : "invalid",
    tag: simpleHeroTag || null,
    tags,
  })

  // Simple mode: allow GET /api/revalidate?tag=<value>
  // Supported values: hero, testimonials, blogs, products, all
  if (simpleHeroTag) {
    const tag = simpleHeroTag.toLowerCase()
    console.log("[revalidate] simple tag mode ->", tag)
    switch (tag) {
      case "hero": {
        console.log("[revalidate] hero -> tags hero-slides*, path /[countryCode]/(main)")
        revalidateTag("hero-slides")
        revalidateTag("hero-slides:all")
        revalidateTag("hero-slides:mobile:true")
        revalidateTag("hero-slides:mobile:false")
        revalidatePath("/[countryCode]/(main)", "page")
        return NextResponse.json({ message: "Revalidated hero" }, { status: 200 })
      }
      case "testimonials": {
        console.log("[revalidate] testimonials -> tags testimonials*, paths home + /api/testimonials")
        revalidateTag("testimonials")
        revalidateTag("testimonials:all")
        revalidatePath("/[countryCode]/(main)")
        revalidatePath("/api/testimonials")
        return NextResponse.json({ message: "Revalidated testimonials" }, { status: 200 })
      }
      case "blogs": {
        console.log("[revalidate] blogs -> tags blogs*, path /blogs index")
        revalidateTag("blogs")
        revalidateTag("blogs:all")
        revalidatePath("/[countryCode]/(main)/blogs", "page")
        // We cannot know specific [id] to tag; path-level will refresh index and detail on next request
        return NextResponse.json({ message: "Revalidated blogs" }, { status: 200 })
      }
      case "products": {
        console.log("[revalidate] products -> paths store + product detail")
        revalidatePath("/[countryCode]/(main)/store", "page")
        revalidatePath("/[countryCode]/(main)/products/[handle]", "page")
        return NextResponse.json({ message: "Revalidated products" }, { status: 200 })
      }
      case "all": {
        console.log("[revalidate] all -> hero + testimonials + blogs + products")
        // Hero
        revalidateTag("hero-slides")
        revalidateTag("hero-slides:all")
        revalidateTag("hero-slides:mobile:true")
        revalidateTag("hero-slides:mobile:false")
        revalidatePath("/[countryCode]/(main)", "page")
        // Testimonials
        revalidateTag("testimonials")
        revalidateTag("testimonials:all")
        revalidatePath("/api/testimonials")
        // Blogs
        revalidateTag("blogs")
        revalidateTag("blogs:all")
        revalidatePath("/[countryCode]/(main)/blogs", "page")
        // Products
        revalidatePath("/[countryCode]/(main)/store", "page")
        revalidatePath("/[countryCode]/(main)/products/[handle]", "page")
        return NextResponse.json({ message: "Revalidated all" }, { status: 200 })
      }
      default: {
        console.warn("[revalidate] unknown simple tag", tag)
        return NextResponse.json({ error: `Unknown tag: ${tag}` }, { status: 400 })
      }
    }
  }

  if (!tags) {
    console.warn("[revalidate] missing tags and no simple tag provided")
    return NextResponse.json({ error: "No tags provided" }, { status: 400 })
  }

  const tagsArray = tags.split(",")
  console.log("[revalidate] multi mode ->", tagsArray)
  await Promise.all(
    tagsArray.map(async (tag) => {
      console.log("[revalidate] processing tag", tag)
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
          // Invalidate hero slides cache by tag and refresh home
          revalidateTag("hero-slides")
          revalidateTag("hero-slides:all")
          revalidatePath("/[countryCode]/(main)", "page")
          break
        case "hero-slides":
          revalidateTag("hero-slides")
          revalidateTag("hero-slides:all")
          break
        case "hero-slides:mobile:true":
          revalidateTag("hero-slides:mobile:true")
          break
        case "hero-slides:mobile:false":
          revalidateTag("hero-slides:mobile:false")
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
          revalidateTag("hero-slides")
          revalidateTag("hero-slides:all")
          revalidateTag("hero-slides:mobile:true")
          revalidateTag("hero-slides:mobile:false")
          break
        default:
          console.warn("[revalidate] unknown tag in multi mode", tag)
          break
      }
    })
  )

  console.log("[revalidate] done")
  return NextResponse.json({ message: "Revalidated" }, { status: 200 })
}
