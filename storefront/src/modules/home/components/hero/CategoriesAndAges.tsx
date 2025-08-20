"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"

const categories = [
  {
    title: "Card-Tastic Fun",
    image: "/card-tastic-fun.png",
    slug: "Card-Tastic Fun",
  },
  {
    title: "Flashcard Fun",
    image: "/flashcard-fun.png",
    slug: "Flashcard Fun",
  },
  {
    title: "Kid's Development Games",
    image: "/kids-development-games.png",
    slug: "Kid's Development Games",
  },
  {
    title: "Wooden Wonders",
    image: "/wooden-wonders.png",
    slug: "Wooden Wonders",
  },
]

const shopByAge = [
  {
    age: "2-4",
    image: "/age-2-4.png",
    slug: "2-4",
  },
  {
    age: "4-6",
    image: "/age-4-6.png",
    slug: "4-6",
  },
  {
    age: "6-8",
    image: "/age-6-8.png",
    slug: "6-8",
  },
  {
    age: "8+",
    image: "/age-8-plus.png",
    slug: "8+",
  },
]

export default function CategoriesAndAges() {
  const router = useRouter()

  const handleCategoryClick = (category: string) => {
    router.push(`/products?category=${encodeURIComponent(category)}`)
  }

  const handleAgeClick = (age: string) => {
    router.push(`/products?age=${encodeURIComponent(age)}`)
  }

  return (
    <div className="bg-[#f6f7fa] flex-1 items-center justify-center w-full py-12 sm:py-16 md:py-20 px-4">
      {/* CATEGORIES */}
      <div className="text-center items-center flex flex-col mb-6">
        <p className="font-bold md:text-base text-sm text-[#181D4E] max-w-lg mx-auto tracking-widest">
          CATEGORIES
        </p>
        <h2 className="max-w-5xl text-[#181D4E] text-3xl md:text-6xl font-bold mb-2 leading-tight">
          We design toys not just for kids but with kids
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl  mx-auto">
        {categories.map((cat, i) => (
          <div
            key={i}
            className="relative group overflow-hidden rounded-2xl  hover:shadow-lg transition cursor-pointer shadow-lg"
            onClick={() => handleCategoryClick(cat.slug)}
          >
            <div className="shadow-md relative overflow-hidden rounded-2xl">
              <Image
                src={cat.image}
                alt={cat.title}
                width={500}
                height={500}
                className="object-cover group-hover:brightness-75 transition-transform duration-500 group-hover:scale-110 "
              />
            </div>
            {/* Hover Overlay */}
            <div className="absolute inset-0 flex items-end justify-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black/30">
              <div className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                Shop Now <ArrowRight className="w-4 h-4" />
              </div>
            </div>
            {/* Label */}
            {/* <div className="absolute inset-x-0 bottom-0 bg-white/80 py-2 text-center font-medium text-gray-800">
              {cat.title}
            </div> */}
          </div>
        ))}
      </div>

      {/* SHOP BY AGE */}
      <div className="text-center mt-20 mb-6">
        <div className="text-center items-center flex flex-col mb-10">
          <p className="font-bold md:text-base text-sm text-[#181D4E] max-w-lg mx-auto tracking-widest">
            SHOP BY AGE
          </p>
          <h2 className="max-w-5xl text-[#181D4E] text-3xl md:text-6xl font-bold mb-2 leading-tight">
            JJ Toys & Games for every stage of childhood development
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {shopByAge.map((item, i) => (
          <div
            key={i}
            className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition cursor-pointer"
            onClick={() => handleAgeClick(item.slug)}
          >
            <div className="relative overflow-hidden aspect-[2/1]">
              <Image
                src={item.image}
                alt={item.age}
                fill
                sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                className="object-cover group-hover:brightness-75 transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            {/* Hover Overlay */}
            <div className="absolute inset-0 flex items-end justify-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black/30">
              <div className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                Shop Now <ArrowRight className="w-4 h-4" />
              </div>
            </div>
            {/* Label */}
            {/* <div className="absolute inset-x-0 bottom-0 bg-white/80 py-2 text-center font-medium text-gray-800">
                            Ages {item.age}
                        </div> */}
          </div>
        ))}
      </div>
    </div>
  )
}
