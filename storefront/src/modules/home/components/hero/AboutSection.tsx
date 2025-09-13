// Server component: no client-only APIs used

import Image from "next/image"
import FloatingShowcase from "./FloatingShowcase"
import RotatingBadge from "./RotatingBadge"

export default function AboutSection() {
  return (
    <section className="text-[#181D4E] bg-white w-full px-4 sm:px-6 md:px-12 py-10 md:py-24 flex flex-col justify-center">
      <div className="max-w-7xl mx-auto flex flex-col md:grid md:grid-cols-2 gap-10 md:gap-24">
        {/* Images Section - Stacked on mobile, left side in desktop */}
        <div className="relative w-full flex flex-col items-center md:items-start">
          <FloatingShowcase
            mainImageSrc="/feature.webp"
            mainImageAlt="Character Flashcards"
            mainImageWidth={600}
            mainImageHeight={600}
            className="w-full"
            badgeWrapperClassName="absolute -bottom-6 -right-2 md:-bottom-10 md:-right-10 z-50"
            badge={
              <RotatingBadge
                href="/about-us"
                centerIconSrc="/smile.svg"
                centerIconAlt="About us"
                text="ABOUT US"
                diameterClassName="w-[110px] h-[110px] md:w-[128px] md:h-[128px] lg:w-[148px] lg:h-[148px]"
                spinDurationSec={12}
              />
            }
          />
        </div>

        {/* Right column with text and image 2 on desktop */}
        <div className="w-full flex flex-col">
          {/* Text Section */}
          <div className="">
            <p className="uppercase text-sm tracking-widest text-[#181D4E] font-semibold font-fredoka md:pb-4 pb-1">
              OUR APPROACH
            </p>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#181D4E] mb-6 md:mb-8 leading-tight font-baloo">
              We help you take care
              <br />
              of the kids
            </h2>
            <p className="text-[#181D4E] leading-relaxed text-md md:mb-12 max-w-lg">
              Our products are crafted with love and expertise by dedicated
              teachers who spend every day immersed in the wonderful world of
              children. They&apos;re the superheroes of understanding and know
              just what sparks joy and learning in young minds. Dive into our
              playful learning experiences and watch the magic unfold!
            </p>
          </div>

          {/* Second image below text */}
          <div className="mt-8">
            <Image
              src="/feature2.jpg"
              alt="Colorful Flashcards"
              width={600}
              height={250}
              className="w-full h-auto rounded-3xl shadow-md"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
