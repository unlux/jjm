import { Button } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import React from "react"

import CircularText from "../components/CircularText"

const AboutUsTemplate = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#181D4E]/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-pink-400/10 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <div className="flex flex-col items-center justify-between gap-10 md:flex-row md:gap-16">
            <div className="w-full space-y-6 md:w-1/2">
              <span className="inline-flex w-fit items-center rounded-full bg-[#181D4E]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#181D4E] md:text-sm">
                What we do
              </span>

              <h1 className="text-4xl font-extrabold leading-tight text-[#1E2A4A] md:text-5xl lg:text-6xl">
                Let&apos;s go beyond academics
              </h1>

              <p className="text-base leading-relaxed text-gray-700 md:text-lg">
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
              <div className="relative mx-auto aspect-square max-w-[560px] overflow-hidden rounded-2xl shadow-sm ring-1 ring-gray-100">
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
      <section className="bg-[#F6F7FB] py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-[#1E2A4A]">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Second section - We help you take care of the kids */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-col items-center justify-between gap-10 md:flex-row-reverse md:gap-16">
            <div className="relative w-full md:w-1/2">
              <div className="relative mx-auto aspect-square max-w-[600px] overflow-hidden rounded-2xl shadow-sm ring-1 ring-gray-100">
                <Image
                  src="/aboutus-pic2.jpg"
                  alt="Educational color matching game and a child playing with wooden toys"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="w-full space-y-6 md:w-1/2">
              <p className="text-sm font-medium uppercase tracking-wider text-gray-700">
                OUR APPROACH
              </p>

              <h2 className="text-3xl font-bold leading-tight text-[#1E2A4A] md:text-4xl lg:text-5xl">
                We help you take care of the kids
              </h2>

              <div className="space-y-4">
                <p className="text-base leading-relaxed text-gray-700 md:text-lg">
                  Our products are crafted with love and expertise by dedicated
                  teachers who spend every day immersed in the wonderful world
                  of children. They know what sparks joy and meaningful learning
                  in young minds.
                </p>
                <ul className="grid grid-cols-1 gap-3 text-gray-700 sm:grid-cols-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-green-500" />{" "}
                    Clear, parent-friendly guidance
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-green-500" />{" "}
                    Age-appropriate, play-based tasks
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-green-500" />{" "}
                    Balanced screen-free activities
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-green-500" />{" "}
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
      <section className="bg-[#F6F7FB] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center md:px-8">
          <h2 className="mb-4 text-3xl font-bold text-[#1E2A4A] md:text-4xl">
            Join us in making learning fun!
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-base text-gray-700 md:text-lg">
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
