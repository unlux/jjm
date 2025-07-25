"use client"

import { Hits, InstantSearch, useSearchBox } from "react-instantsearch"
import { searchClient } from "../../../../lib/config"
import Link from "next/link"
import Image from "next/image"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type HitProps = {
  hit: {
    objectID: string
    id: string
    title: string
    description: string
    handle: string
    thumbnail: string
  }
}

const Hit = ({ hit }: HitProps) => {
  return (
    <div className="flex flex-row gap-x-2 mt-4 relative">
      <Image src={hit.thumbnail} alt={hit.title} width={100} height={100} />
      <div className="flex flex-col gap-y-1">
        <h3>{hit.title}</h3>
        <p className="text-sm text-gray-500">{hit.description}</p>
      </div>
      <LocalizedClientLink
        href={`/products/${hit.handle}`}
        className="absolute right-0 top-0 w-full h-full"
        aria-label={`View Product: ${hit.title}`}
      />
    </div>
  )
}

const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

const DebouncedSearchBox = () => {
  const { refine } = useSearchBox()
  const [inputValue, setInputValue] = useState("")
  const debouncedInputValue = useDebounce(inputValue, 500)

  useEffect(() => {
    refine(debouncedInputValue)
  }, [debouncedInputValue, refine])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    refine(inputValue)
  }

  return (
    <form
      noValidate
      action=""
      role="search"
      className="flex gap-2"
      onSubmit={handleFormSubmit}
    >
      <input
        type="search"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search for toys, games, flashcards..."
        className="w-full py-3 px-5 pr-12 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
      />
      <button
        type="submit"
        className="px-4 py-3 bg-[#262b5f] hover:bg-[#1e2248] text-white font-medium rounded-lg transition-colors"
      >
        Search
      </button>
    </form>
  )
}

type SearchOverlayProps = {
  isOpen: boolean
  onClose: () => void
}

const ageGroups = ["2-4", "4-6", "6-8", "8+"]
const categories = [
  "Card-Tastic Fun",
  "Flashcard Fun",
  "Kid's Development Games",
  "Wooden Wonders",
]

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const router = useRouter()

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    window.addEventListener("keydown", handleEsc)
    return () => {
      window.removeEventListener("keydown", handleEsc)
    }
  }, [isOpen, onClose])

  const filterRoute = (type: string, value: string) => {
    router.push(`/store?${type}=${value}`)
    onClose()
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 backdrop-blur-md text-black bg-white/30 z-50 flex items-start justify-center pt-16 md:pt-24"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 animate-slide-down shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-black">Search Products</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-black" />
          </button>
        </div>

        <InstantSearch
          searchClient={searchClient}
          indexName={process.env.NEXT_PUBLIC_ALGOLIA_PRODUCT_INDEX_NAME || ""}
        >
          <DebouncedSearchBox />
          <div className="mt-5">
            <Hits hitComponent={Hit} />
          </div>
        </InstantSearch>

        <div className="mt-5 flex flex-wrap gap-2">
          <p className="text-sm text-gray-500 mr-2">Popular searches:</p>
          {ageGroups.map((age) => (
            <span
              key={age}
              onClick={() => filterRoute("age", age)}
              className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 transition-colors"
            >
              Ages {age}
            </span>
          ))}
          {categories.map((cat) => (
            <span
              key={cat}
              onClick={() => filterRoute("category", cat)}
              className="px-3 py-1 text-sm bg-green-50 text-green-600 rounded-full cursor-pointer hover:bg-green-100 transition-colors"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchOverlay
