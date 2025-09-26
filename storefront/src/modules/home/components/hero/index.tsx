import AboutSection from "./AboutSection"
import BlogCarousel from "./BlogSection"
import CategoriesAndAges from "./CategoriesAndAges"
import { listCategories } from "@/lib/data/categories"
import { homeCategories } from "@/lib/context/categories.config"
import FeatureStrip from "./FeatureStrip"
import HeroSlider from "./HeroSlider"
import RevalidateButton from "@/components/RevalidateButton"
import PopularProducts from "./PopularProducts"
import Testimonials from "./TestimonialSection"
import WhatsAppButton from "./WhatsAppButton"
import { HttpTypes } from "@medusajs/types"

const Hero = async ({ region }: { region: HttpTypes.StoreRegion }) => {
  // Pre-resolve category handles -> IDs for hero links (cached server-side via ISR)
  const desired = homeCategories

  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

  const resolvedMap: Record<string, string> = {}
  try {
    for (const d of desired) {
      // Try exact handle match first
      const byHandle = await listCategories({
        handle: d.handle,
        limit: 1,
        fields: "id,handle,name",
      })
      if (byHandle?.[0]?.id && byHandle?.[0]?.handle) {
        resolvedMap[d.handle] = byHandle[0].id
        continue
      }
      // Fallback: search by name and pick best normalized match
      const viaSearch = await listCategories({
        q: d.title,
        limit: 50,
        fields: "id,handle,name",
      })
      const target = normalize(d.title)
      const best = viaSearch?.find(
        (c) => normalize(c.handle || c.name || "") === target
      )
      if (best?.id) {
        resolvedMap[d.handle] = best.id
      }
    }
  } catch {}

  return (
    <main className="w-full">
      <HeroSlider />
      {process.env.NODE_ENV !== "production" && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <RevalidateButton tags="all" />
        </div>
      )}
      <CategoriesAndAges resolvedCategoryIds={resolvedMap} />
      <AboutSection />
      <PopularProducts region={region} />
      <FeatureStrip />
      <Testimonials />
      <BlogCarousel />
      <WhatsAppButton
        phoneNumber="919321791644"
        message="Hello from The Joy Junction! .m interested in learning more about your educational toys."
      />
    </main>
  )
}

export default Hero
