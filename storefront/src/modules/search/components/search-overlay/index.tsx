"use client"

import {
  Hits,
  InstantSearch,
  useSearchBox,
  useInstantSearch,
} from "react-instantsearch"
import { searchClient } from "@lib/config"
import Image from "next/image"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  homeCategories,
  type HomeCategory,
} from "@/lib/context/categories.config"
import { sdk } from "@/lib/config"

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
    <LocalizedClientLink
      href={`/products/${hit.handle}`}
      className="group"
      aria-label={`View Product: ${hit.title}`}
    >
      <div className="flex flex-row gap-x-4 p-2 rounded-lg group-hover:bg-gray-100 transition-colors">
        <div className="relative w-20 h-20 flex-shrink-0">
          <Image
            src={hit.thumbnail}
            alt={hit.title}
            fill
            className="object-contain"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="text-base font-semibold text-gray-900">{hit.title}</h3>
          <p className="text-sm text-gray-600">{hit.description}</p>
        </div>
      </div>
    </LocalizedClientLink>
  )
}

const SkeletonHit = () => (
  <div className="flex flex-row gap-x-4 p-2">
    <div className="relative w-20 h-20 flex-shrink-0 bg-gray-200 rounded-md animate-pulse"></div>
    <div className="flex flex-col justify-center gap-y-2 flex-grow">
      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
    </div>
  </div>
)

const Results = () => {
  const { status, results } = useInstantSearch()
  const isLoading = status === "loading" || status === "stalled"

  // Show skeleton only on initial search when there are no results yet.
  if (isLoading && results.nbHits === 0) {
    return (
      <div className="flex flex-col gap-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonHit key={index} />
        ))}
      </div>
    )
  }

  // Show "no results" message only after a search completes with no hits.
  if (results.nbHits === 0 && results.query) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">
          No results found for{" "}
          <span className="font-semibold">"{results.query}"</span>.
        </p>
      </div>
    )
  }

  return <Hits hitComponent={Hit} />
}

const SearchBox = () => {
  const { refine } = useSearchBox()
  const [inputValue, setInputValue] = useState("")
  const isSearchDisabled = !inputValue || inputValue.trim() === ""

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isSearchDisabled) {
      return
    }
    refine(inputValue)
  }

  return (
    <form
      noValidate
      action=""
      role="search"
      className="flex items-center gap-x-3"
      onSubmit={handleFormSubmit}
    >
      <input
        type="search"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search for toys, games, flashcards..."
        className="w-full py-3 px-5 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-gray-900"
      />
      <button
        type="submit"
        disabled={isSearchDisabled}
        className="px-5 py-3 bg-[#262b5f] hover:bg-[#1e2248] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
type Category = {
  id: string
  name: string
  handle: string
  parent_category?: unknown | null
}

const SearchOverlay = ({ onClose }: SearchOverlayProps) => {
  const router = useRouter()
  // Hardcoded categories from config (handles)
  const overlayCategories: HomeCategory[] = homeCategories
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 opacity-0 invisible group-[.search-open]/nav:opacity-100 group-[.search-open]/nav:visible transition-opacity duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col relative opacity-0 scale-95 group-[.search-open]/nav:opacity-100 group-[.search-open]/nav:scale-100 transition-all duration-300 ease-out">
        <div className="p-6 sm:p-8 flex-grow overflow-y-auto">
          <InstantSearch searchClient={searchClient} indexName="products">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Search Our Store
              </h1>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Close search"
              >
                <X size={24} className="text-gray-700" />
              </button>
            </div>
            <SearchBox />
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Popular Searches
              </h2>
              <div className="flex flex-wrap gap-2">
                {ageGroups.map((age) => (
                  <button
                    key={age}
                    onClick={() => {
                      router.push(`/store?age=${age}`)
                      onClose()
                    }}
                    className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                  >
                    Age: {age}
                  </button>
                ))}
                {overlayCategories.slice(0, 10).map((cat) => (
                  <button
                    key={cat.handle}
                    onClick={() => {
                      router.push(
                        `/store?category=${encodeURIComponent(cat.handle)}`
                      )
                      onClose()
                    }}
                    className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium hover:bg-green-200 transition-colors"
                  >
                    {cat.title}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <Results />
            </div>
          </InstantSearch>
        </div>
      </div>
    </div>
  )
}

export default SearchOverlay
