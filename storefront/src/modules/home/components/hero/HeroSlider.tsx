import { listHeroSlidesCached } from "@/lib/repos/heroSlides"

import HeroSliderClient from "./HeroSliderClient"

export const revalidate = 86400 // daily revalidation

export default async function HeroSlider() {
  const slides = await listHeroSlidesCached({ limit: 100 })
  return <HeroSliderClient slides={slides} />
}
