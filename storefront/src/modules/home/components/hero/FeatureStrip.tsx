// Server component: no client-only APIs used

import Image from "next/image"

const features = [
  {
    title: "Crafted by teachers",
    image: "/ficon1.png",
  },
  {
    title: "Premium Quality",
    image: "/ficon2.png",
  },
  {
    title: "Engaging play",
    image: "/ficon3.png",
  },
  {
    title: "Future Support",
    image: "/ficon4.png",
  },
]

export default function FeatureStrip() {
  return (
    <section className="bg-white px-4 py-10 sm:px-6 md:py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 md:grid-cols-4">
        {features.map((feature, i) => (
          <div
            key={i}
            className="flex aspect-square flex-col items-center rounded-xl border border-gray-200 p-8 py-10 text-center transition hover:shadow-xl"
          >
            <div className="aspect-square w-full">
              <Image
                src={feature.image}
                alt={feature.title}
                width={1200}
                height={1200}
                className="h-full w-full object-contain"
              />
            </div>
            <h3 className="text-lg font-bold text-[#1e1e3f] md:text-2xl">
              {feature.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  )
}
