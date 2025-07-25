"use client"

import React, { useEffect, useState } from "react"
import { Hits, InstantSearch, SearchBox } from "react-instantsearch"
import { searchClient } from "../../../../lib/config"
import Modal from "../../../common/components/modal"
import { Button } from "@medusajs/ui"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Hit = {
  objectID: string
  id: string
  title: string
  description: string
  handle: string
  thumbnail: string
}

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      <div className="hidden small:flex items-center gap-x-6 h-full">
        <Button
          onClick={() => setIsOpen(true)}
          variant="transparent"
          className="hover:text-ui-fg-base text-small-regular px-0 hover:bg-transparent focus:!bg-transparent"
        >
          Search
        </Button>
      </div>
      <Modal isOpen={isOpen} close={() => setIsOpen(false)}>
        <InstantSearch
          searchClient={searchClient}
          indexName={process.env.NEXT_PUBLIC_ALGOLIA_PRODUCT_INDEX_NAME}
        >
          <SearchBox className="w-full [&_input]:w-[94%] [&_input]:outline-none [&_button]:w-[3%]" />
          <Hits hitComponent={Hit} />
        </InstantSearch>
      </Modal>
    </>
  )
}

const Hit = ({ hit }: { hit: Hit }) => {
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
