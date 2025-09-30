// Server component: no client-only APIs used

import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { homeCategories } from "@/lib/context/categories.config"

const categories = homeCategories

const shopByAge = [
  {
    age: "2-4",
    image: "/age-2-4.png",
  },
  {
    age: "4-6",
    image: "/age-4-6.png",
  },
  {
    age: "6-8",
    image: "/age-6-8.png",
  },
  {
    age: "8+",
    image: "/age-8-plus.png",
  },
]

type Props = {
  resolvedCategoryIds?: Record<string, string>
}

export default function CategoriesAndAges({ resolvedCategoryIds = {} }: Props) {
  // No client-side navigation handlers needed; using links directly

  return (
    <div className="w-full flex-1 items-center justify-center bg-[#f6f7fa] px-4 py-12 sm:py-16 md:py-20">
      {/* CATEGORIES */}
      <div className="mb-6 flex flex-col items-center text-center">
        <p className="mx-auto max-w-lg text-sm font-bold tracking-widest text-[#181D4E] md:text-base">
          CATEGORIES
        </p>
        <h2 className="mb-2 max-w-5xl text-3xl font-bold leading-tight text-[#181D4E] md:text-6xl">
          We design toys not just for kids but with kids
        </h2>
      </div>

      <div className="mx-auto grid max-w-8xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => (
          <Link
            href={
              resolvedCategoryIds[cat.handle]
                ? `/store?categoryId=${resolvedCategoryIds[cat.handle]}`
                : `/store?category=${encodeURIComponent(cat.handle)}`
            }
            key={cat.handle}
            className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg transition hover:shadow-lg"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-md">
              <Image
                src={cat.image}
                alt={cat.title}
                width={500}
                height={500}
                className="object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-75"
              />
            </div>
            {/* Hover Overlay */}
            <div className="absolute inset-0 flex items-end justify-center bg-black/30 opacity-0 transition duration-300 group-hover:opacity-100">
              <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                Shop Now <ArrowRight className="h-4 w-4" />
              </div>
            </div>
            {/* Label */}
            {/* <div className="absolute inset-x-0 bottom-0 bg-white/80 py-2 text-center font-medium text-gray-800">
              {cat.title}
            </div> */}
          </Link>
        ))}
      </div>

      {/* SHOP BY AGE */}
      <div className="mb-6 mt-20 text-center">
        <div className="mb-10 flex flex-col items-center text-center">
          <p className="mx-auto max-w-lg text-sm font-bold tracking-widest text-[#181D4E] md:text-base">
            SHOP BY AGE
          </p>
          <h2 className="mb-2 max-w-5xl text-3xl font-bold leading-tight text-[#181D4E] md:text-6xl">
            JJ Toys & Games for every stage of childhood development
          </h2>
        </div>
      </div>

      <div className="mx-auto grid max-w-8xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {shopByAge.map((item) => (
          <Link
            href={`/store?age=${encodeURIComponent(item.age)}`}
            key={item.age}
            className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg transition hover:shadow-xl"
          >
            <div className="relative aspect-[2/1] overflow-hidden">
              <Image
                src={item.image}
                alt={item.age}
                fill
                sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100%"
                className="object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-75"
              />
            </div>
            {/* Hover Overlay */}
            <div className="absolute inset-0 flex items-end justify-center bg-black/30 opacity-0 transition duration-300 group-hover:opacity-100">
              <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                Shop Now <ArrowRight className="h-4 w-4" />
              </div>
            </div>
            {/* Label */}
            {/* <div className="absolute inset-x-0 bottom-0 bg-white/80 py-2 text-center font-medium text-gray-800">
                            Ages {item.age}
                        </div> */}
          </Link>
        ))}
      </div>
    </div>
  )
}
