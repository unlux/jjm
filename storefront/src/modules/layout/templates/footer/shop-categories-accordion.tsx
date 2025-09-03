"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "lucide-react"
import { ArrowUpRightMini, ArrowRightMini } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Minimal cn helper (since we don't have a global util here)
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

export type Category = {
  id: string
  name: string
  handle: string
  category_children?: Array<{ id: string; name: string; handle: string }>
}

type Props = {
  title?: string
  categories: Category[]
  defaultOpen?: boolean
}

export default function ShopCategoriesAccordion({
  title = "Shop by Categories",
  categories,
  defaultOpen = false,
}: Props) {
  const ageGroups = [
    { label: "2-4", value: "2-4" },
    { label: "4-6", value: "4-6" },
    { label: "6-8", value: "6-8" },
    { label: "8+", value: "8+" },
  ]
  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      defaultValue={defaultOpen ? "item-1" : undefined}
    >
      <AccordionPrimitive.Item
        value="item-1"
        className="border-b border-white/10 last:border-b-0"
      >
        <AccordionPrimitive.Header className="flex">
          <AccordionPrimitive.Trigger
            className={cn(
              "flex flex-1 items-center justify-between gap-2 py-2 text-left font-semibold text-white outline-none transition-all",
              "focus-visible:ring-2 focus-visible:ring-white/30 rounded-md"
            )}
          >
            <span>{title}</span>
            <ChevronDownIcon className="size-4 shrink-0 text-gray-300 transition-transform duration-200 data-[state=open]:rotate-180" />
          </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
        <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <div className="mt-2 border border-white/15 rounded-md pl-3 pr-2 pt-2 pb-2">
            <ul className="mt-1 space-y-2 text-gray-300 max-h-64 overflow-auto pr-1">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <LocalizedClientLink
                    href={`/categories/${cat.handle}`}
                    className="group inline-flex min-w-0 items-start justify-start gap-1 w-auto whitespace-normal"
                  >
                    <span className="leading-snug">{cat.name}</span>
                    <span className="relative inline-flex h-4 w-4 shrink-0 translate-y-0.5">
                      <ArrowUpRightMini className="absolute inset-0 text-gray-400 transition-opacity duration-150 ease-in-out opacity-100 group-hover:opacity-0" />
                      <ArrowRightMini className="absolute inset-0 text-gray-400 transition-opacity duration-150 ease-in-out opacity-0 group-hover:opacity-100" />
                    </span>
                  </LocalizedClientLink>
                  {Array.isArray(cat.category_children) &&
                    cat.category_children.length > 0 && (
                      <ul className="mt-1 ml-3 space-y-1 text-gray-400">
                        {cat.category_children.map((child) => (
                          <li key={child.id}>
                            <LocalizedClientLink
                              href={`/categories/${child.handle}`}
                              className="group inline-flex min-w-0 items-start justify-start gap-1 w-auto whitespace-normal"
                            >
                              <span className="leading-snug">{child.name}</span>
                              <span className="relative inline-flex h-4 w-4 shrink-0 translate-y-0.5">
                                <ArrowUpRightMini className="absolute inset-0 text-gray-400 transition-opacity duration-150 ease-in-out opacity-100 group-hover:opacity-0" />
                                <ArrowRightMini className="absolute inset-0 text-gray-400 transition-opacity duration-150 ease-in-out opacity-0 group-hover:opacity-100" />
                              </span>
                            </LocalizedClientLink>
                          </li>
                        ))}
                      </ul>
                    )}
                </li>
              ))}
            </ul>
          </div>
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
      <AccordionPrimitive.Item
        value="item-2"
        className="border-b border-white/10 last:border-b-0"
      >
        <AccordionPrimitive.Header className="flex">
          <AccordionPrimitive.Trigger
            className={cn(
              "flex flex-1 items-center justify-between gap-2 py-2 text-left font-semibold text-white outline-none transition-all",
              "focus-visible:ring-2 focus-visible:ring-white/30 rounded-md"
            )}
          >
            <span>Shop by Age</span>
            <ChevronDownIcon className="size-4 shrink-0 text-gray-300 transition-transform duration-200 data-[state=open]:rotate-180" />
          </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
        <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <div className="mt-2 border border-white/15 rounded-md pl-3 pr-2 pt-2 pb-2">
            <ul className="mt-1 space-y-2 text-gray-300">
              {ageGroups.map((age) => (
                <li key={age.value}>
                  <LocalizedClientLink
                    href={`/store?age=${encodeURIComponent(age.value)}`}
                    className="group inline-flex min-w-0 items-start justify-start gap-1 w-auto whitespace-normal"
                  >
                    <span className="leading-snug">{age.label}</span>
                    <span className="relative inline-flex h-4 w-4 shrink-0 translate-y-0.5">
                      <ArrowUpRightMini className="absolute inset-0 text-gray-400 transition-opacity duration-150 ease-in-out opacity-100 group-hover:opacity-0" />
                      <ArrowRightMini className="absolute inset-0 text-gray-400 transition-opacity duration-150 ease-in-out opacity-0 group-hover:opacity-100" />
                    </span>
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
    </AccordionPrimitive.Root>
  )
}
