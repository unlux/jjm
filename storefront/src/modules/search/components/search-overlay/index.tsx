"use client"

import { Hits, InstantSearch, useSearchBox } from "react-instantsearch"
import { searchClient } from "@lib/config"
import Image from "next/image"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

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
  onClose: () => void
}

const ageGroups = ["2-4", "4-6", "6-8", "8+"]
const categories = [
  "Puzzles",
  "Board Games",
  "Building Blocks",
  "Art & Craft",
  "Flashcards",
]

const SearchOverlay = ({ onClose }: SearchOverlayProps) => {
  const router = useRouter()
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 opacity-0 invisible group-[.search-open]:opacity-100 group-[.search-open]:visible transition-all duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col relative animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
          aria-label="Close search"
        >
          <X size={24} className="text-gray-700" />
        </button>
        <div className="p-8 flex-grow overflow-y-auto">
          <InstantSearch searchClient={searchClient} indexName="products">
            <DebouncedSearchBox />
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Popular Searches
              </h2>
              <div className="flex flex-wrap gap-2">
                {ageGroups.map((age) => (
                  <button
                    key={age}
                    onClick={() => {
                      router.push(`/store?age_group=${age}`)
                      onClose()
                    }}
                    className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                  >
                    Age: {age}
                  </button>
                ))}
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      router.push(`/store?category=${category}`)
                      onClose()
                    }}
                    className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium hover:bg-green-200 transition-colors"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <Hits hitComponent={Hit} />
            </div>
          </InstantSearch>
        </div>
      </div>
    </div>
  )
}

export default SearchOverlay
