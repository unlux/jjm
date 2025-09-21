import HeroSliderClient from "./HeroSliderClient"
import { listHeroSlidesCached } from "@/lib/repos/heroSlides"

export const revalidate = 86400 // daily revalidation

export default async function HeroSlider() {
  const slides = await listHeroSlidesCached({ limit: 100 })
  return <HeroSliderClient slides={slides} />
}
