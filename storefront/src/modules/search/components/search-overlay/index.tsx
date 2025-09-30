"use client"

import { searchClient } from "@lib/config"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  Hits,
  InstantSearch,
  useInstantSearch,
  useSearchBox,
} from "react-instantsearch"

import { sdk } from "@/lib/config"
import {
  homeCategories,
  type HomeCategory,
} from "@/lib/context/categories.config"

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
      <div className="flex flex-row gap-x-4 rounded-lg p-2 transition-colors group-hover:bg-gray-100">
        <div className="relative h-20 w-20 flex-shrink-0">
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
    <div className="relative h-20 w-20 flex-shrink-0 animate-pulse rounded-md bg-gray-200"></div>
    <div className="flex flex-grow flex-col justify-center gap-y-2">
      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
      <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
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
      <div className="py-10 text-center">
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
        className="w-full rounded-lg border-0 bg-gray-100 px-5 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={isSearchDisabled}
        className="rounded-lg bg-[#262b5f] px-5 py-3 font-medium text-white transition-colors hover:bg-[#1e2248] disabled:cursor-not-allowed disabled:opacity-50"
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
      className="invisible fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-[.search-open]/nav:visible group-[.search-open]/nav:opacity-100"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="relative flex max-h-[90vh] w-full max-w-3xl scale-95 flex-col rounded-2xl bg-white opacity-0 shadow-2xl transition-all duration-300 ease-out group-[.search-open]/nav:scale-100 group-[.search-open]/nav:opacity-100">
        <div className="flex-grow overflow-y-auto p-6 sm:p-8">
          <InstantSearch searchClient={searchClient} indexName="products">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Search Our Store
              </h1>
              <button
                onClick={onClose}
                className="rounded-full bg-gray-100 p-2 transition-colors hover:bg-gray-200"
                aria-label="Close search"
              >
                <X size={24} className="text-gray-700" />
              </button>
            </div>
            <SearchBox />
            <div className="mt-8">
              <h2 className="mb-3 text-lg font-semibold text-gray-800">
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
                    className="rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-800 transition-colors hover:bg-blue-200"
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
                    className="rounded-full bg-green-100 px-3 py-1.5 text-sm font-medium text-green-800 transition-colors hover:bg-green-200"
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
