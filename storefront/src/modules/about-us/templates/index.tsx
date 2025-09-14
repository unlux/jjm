import React from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CircularText from "../components/CircularText"
import { Button } from "@medusajs/ui"

const AboutUsTemplate = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#181D4E]/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-pink-400/10 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16">
            <div className="w-full md:w-1/2 space-y-6">
              <span className="inline-flex items-center text-xs md:text-sm font-semibold uppercase tracking-wider text-[#181D4E] bg-[#181D4E]/10 px-3 py-1 rounded-full w-fit">
                What we do
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1E2A4A] leading-tight">
                Let&apos;s go beyond academics
              </h1>

              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                We craft joyful learning experiences that build real-world
                skills beyond academics. Our kits are designed by passionate
                educators to spark curiosity, creativity, and confidence during
                early formative years.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <LocalizedClientLink href="/store">
                  <Button variant="primary" className="h-11 px-6">
                    Explore Products
                  </Button>
                </LocalizedClientLink>
                <LocalizedClientLink href="/contact">
                  <Button variant="secondary" className="h-11 px-6">
                    Talk to us
                  </Button>
                </LocalizedClientLink>
              </div>
            </div>

            <div className="w-full md:w-1/2">
              <div className="relative aspect-square max-w-[560px] mx-auto rounded-2xl overflow-hidden ring-1 ring-gray-100 shadow-sm">
                <Image
                  src="/aboutus-pic1.jpg"
                  alt="Educational toys including alphabet blocks, rocking horse, robot and xylophone"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values / Features */}
      <section className="py-12 md:py-16 bg-[#F6F7FB]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Educator-designed",
                desc: "Built by teachers who truly understand how children learn best.",
              },
              {
                title: "Skill-first learning",
                desc: "Activities that nurture creativity, thinking and motor skills.",
              },
              {
                title: "Kid-safe & sturdy",
                desc: "Quality you can trust. Safe materials and durable builds.",
              },
              {
                title: "Easy for parents",
                desc: "Clear guidance so you can play, learn, and bond without stress.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white p-6 ring-1 ring-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-[#1E2A4A]">
                  {f.title}
                </h3>
                <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Second section - We help you take care of the kids */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-10 md:gap-16">
            <div className="w-full md:w-1/2 relative">
              <div className="relative aspect-square max-w-[600px] mx-auto rounded-2xl overflow-hidden ring-1 ring-gray-100 shadow-sm">
                <Image
                  src="/aboutus-pic2.jpg"
                  alt="Educational color matching game and a child playing with wooden toys"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="w-full md:w-1/2 space-y-6">
              <p className="text-sm font-medium uppercase tracking-wider text-gray-700">
                OUR APPROACH
              </p>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1E2A4A] leading-tight">
                We help you take care of the kids
              </h2>

              <div className="space-y-4">
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  Our products are crafted with love and expertise by dedicated
                  teachers who spend every day immersed in the wonderful world
                  of children. They know what sparks joy and meaningful learning
                  in young minds.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-green-500 inline-block" />{" "}
                    Clear, parent-friendly guidance
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-green-500 inline-block" />{" "}
                    Age-appropriate, play-based tasks
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-green-500 inline-block" />{" "}
                    Balanced screen-free activities
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-green-500 inline-block" />{" "}
                    Builds confidence and independence
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      {/* <section className="py-10 md:py-12 bg-[#181D4E] text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-extrabold">10k+</div>
              <div className="mt-1 text-white/80 text-sm">Happy families</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold">150+</div>
              <div className="mt-1 text-white/80 text-sm">Activity ideas</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold">200+</div>
              <div className="mt-1 text-white/80 text-sm">
                Preschool partners
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold">4.8/5</div>
              <div className="mt-1 text-white/80 text-sm">Average rating</div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Call to action section */}
      <section className="py-16 md:py-24 bg-[#F6F7FB]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E2A4A] mb-4">
            Join us in making learning fun!
          </h2>
          <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto mb-8">
            Browse our collection of educational toys and games that encourage
            creativity, critical thinking, and joy in learning.
          </p>
          <div className="flex justify-center gap-3">
            <LocalizedClientLink href="/store">
              <Button variant="primary" className="h-11 px-6">
                Explore Our Products
              </Button>
            </LocalizedClientLink>
            <LocalizedClientLink href="/about-us#mission">
              <Button variant="secondary" className="h-11 px-6">
                Our Mission
              </Button>
            </LocalizedClientLink>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutUsTemplate
