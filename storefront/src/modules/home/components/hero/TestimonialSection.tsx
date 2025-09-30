import { listTestimonialsCached } from "@/lib/repos/testimonials"

import TestimonialSectionClient from "./TestimonialSectionClient"

export const revalidate = 3600

export default async function TestimonialSection() {
  const testimonials = await listTestimonialsCached({
    isFeatured: true,
    limit: 6,
    orderBy: "sortOrder",
  })
  if (!testimonials || testimonials.length === 0) return null
  return <TestimonialSectionClient testimonials={testimonials} />
}
