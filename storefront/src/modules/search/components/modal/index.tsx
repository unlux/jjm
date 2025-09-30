"use client"

import { Button } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { useEffect, useState } from "react"
import { Hits, InstantSearch, SearchBox } from "react-instantsearch"

import { searchClient } from "../../../../lib/config"
import Modal from "../../../common/components/modal"

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
      <div className="hidden h-full items-center gap-x-6 small:flex">
        <Button
          onClick={() => setIsOpen(true)}
          variant="transparent"
          className="text-small-regular px-0 hover:bg-transparent hover:text-ui-fg-base focus:!bg-transparent"
        >
          Search
        </Button>
      </div>
      <Modal isOpen={isOpen} close={() => setIsOpen(false)}>
        <InstantSearch
          searchClient={searchClient}
          indexName={process.env.NEXT_PUBLIC_ALGOLIA_PRODUCT_INDEX_NAME}
          future={{ preserveSharedStateOnUnmount: true }}
        >
          <SearchBox className="w-full [&_button]:w-[3%] [&_input]:w-[94%] [&_input]:outline-none" />
          <Hits hitComponent={Hit} />
        </InstantSearch>
      </Modal>
    </>
  )
}

const Hit = ({ hit }: { hit: Hit }) => {
  return (
    <div className="relative mt-4 flex flex-row gap-x-2">
      <Image src={hit.thumbnail} alt={hit.title} width={100} height={100} />
      <div className="flex flex-col gap-y-1">
        <h3>{hit.title}</h3>
        <p className="text-sm text-gray-500">{hit.description}</p>
      </div>
      <LocalizedClientLink
        href={`/products/${hit.handle}`}
        className="absolute right-0 top-0 h-full w-full"
        aria-label={`View Product: ${hit.title}`}
      />
    </div>
  )
}
