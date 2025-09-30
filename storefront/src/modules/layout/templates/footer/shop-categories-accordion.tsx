"use client"

import { ArrowRightMini, ArrowUpRightMini } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "lucide-react"
import * as React from "react"

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
  // Visual appearance: footer uses dark; sidebar uses light
  appearance?: "dark" | "light"
  // Layout variant: 'card' (with bordered content) or 'list' (flush, no border)
  variant?: "card" | "list"
  // Optional wrapper class
  className?: string
}

export default function ShopCategoriesAccordion({
  title = "Shop by Categories",
  categories,
  defaultOpen = false,
  appearance = "dark",
  variant = "card",
  className,
}: Props) {
  const isLight = appearance === "light"
  const ageGroups = [
    { label: "2-4", value: "2-4" },
    { label: "4-6", value: "4-6" },
    { label: "6-8", value: "6-8" },
    { label: "8+", value: "8+" },
  ]

  const itemBorder = isLight ? "border-gray-200" : "border-white/10"
  const triggerText = isLight ? "text-gray-900" : "text-white"
  const chevronColor = isLight ? "text-gray-500" : "text-gray-300"
  const focusRing = isLight
    ? "focus-visible:ring-gray-300"
    : "focus-visible:ring-white/30"
  const contentBorder = isLight ? "border-gray-200" : "border-white/15"
  const listText = isLight ? "text-gray-700" : "text-gray-300"
  const childListText = isLight ? "text-gray-500" : "text-gray-400"
  const iconColor = "text-gray-400"

  const triggerSizing =
    variant === "list" ? "text-base md:text-lg" : "text-base"
  const listSizing =
    variant === "list" ? "text-sm md:text-base" : "text-sm md:text-base"

  const contentWrap =
    variant === "list"
      ? "mt-1 pl-1 pr-1 pt-1 pb-2 md:pl-0 md:pr-0"
      : cn("mt-2 border rounded-md pl-3 pr-2 pt-2 pb-2", contentBorder)

  const contentAnim =
    "overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"

  const listContainer =
    variant === "list"
      ? "mt-1 space-y-2.5"
      : "mt-1 space-y-2 max-h-64 overflow-auto pr-1"

  return (
    <div className={className}>
      <AccordionPrimitive.Root
        type="single"
        collapsible
        defaultValue={defaultOpen ? "item-1" : undefined}
      >
        <AccordionPrimitive.Item
          value="item-1"
          className={cn("border-b last:border-b-0", itemBorder)}
        >
          <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger
              className={cn(
                "flex flex-1 items-center justify-between gap-2 px-1 py-2 text-left font-semibold outline-none transition-all md:px-0",
                triggerSizing,
                triggerText,
                "rounded-md focus-visible:ring-2",
                focusRing
              )}
            >
              <span>{title}</span>
              <ChevronDownIcon
                className={cn(
                  "size-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-180",
                  chevronColor
                )}
              />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className={contentAnim}>
            <div className={contentWrap}>
              <ul className={cn(listContainer, listSizing, listText)}>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <LocalizedClientLink
                      href={`/store?category=${cat.handle}`}
                      className="group inline-flex w-auto min-w-0 items-start justify-start gap-1 whitespace-normal"
                    >
                      <span className="leading-snug">{cat.name}</span>
                      <span className="relative inline-flex h-4 w-4 shrink-0 translate-y-0.5">
                        <ArrowUpRightMini
                          className={cn(
                            "absolute inset-0 opacity-100 transition-opacity duration-150 ease-in-out group-hover:opacity-0",
                            iconColor
                          )}
                        />
                        <ArrowRightMini
                          className={cn(
                            "absolute inset-0 opacity-0 transition-opacity duration-150 ease-in-out group-hover:opacity-100",
                            iconColor
                          )}
                        />
                      </span>
                    </LocalizedClientLink>
                    {Array.isArray(cat.category_children) &&
                      cat.category_children.length > 0 && (
                        <ul
                          className={cn("ml-3 mt-1 space-y-1", childListText)}
                        >
                          {cat.category_children.map((child) => (
                            <li key={child.id}>
                              <LocalizedClientLink
                                href={`/categories/${child.handle}`}
                                className="group inline-flex w-auto min-w-0 items-start justify-start gap-1 whitespace-normal"
                              >
                                <span className="leading-snug">
                                  {child.name}
                                </span>
                                <span className="relative inline-flex h-4 w-4 shrink-0 translate-y-0.5">
                                  <ArrowUpRightMini
                                    className={cn(
                                      "absolute inset-0 opacity-100 transition-opacity duration-150 ease-in-out group-hover:opacity-0",
                                      iconColor
                                    )}
                                  />
                                  <ArrowRightMini
                                    className={cn(
                                      "absolute inset-0 opacity-0 transition-opacity duration-150 ease-in-out group-hover:opacity-100",
                                      iconColor
                                    )}
                                  />
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
          className={cn("border-b last:border-b-0", itemBorder)}
        >
          <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger
              className={cn(
                "flex flex-1 items-center justify-between gap-2 py-2 text-left font-semibold outline-none transition-all",
                triggerSizing,
                triggerText,
                "rounded-md focus-visible:ring-2",
                focusRing
              )}
            >
              <span>Shop by Age</span>
              <ChevronDownIcon
                className={cn(
                  "size-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-180",
                  chevronColor
                )}
              />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className={contentAnim}>
            <div className={contentWrap}>
              <ul className={cn("mt-1 space-y-2", listSizing, listText)}>
                {ageGroups.map((age) => (
                  <li key={age.value}>
                    <LocalizedClientLink
                      href={`/store?age=${encodeURIComponent(age.value)}`}
                      className="group inline-flex w-auto min-w-0 items-start justify-start gap-1 whitespace-normal"
                    >
                      <span className="leading-snug">{age.label}</span>
                      <span className="relative inline-flex h-4 w-4 shrink-0 translate-y-0.5">
                        <ArrowUpRightMini
                          className={cn(
                            "absolute inset-0 opacity-100 transition-opacity duration-150 ease-in-out group-hover:opacity-0",
                            iconColor
                          )}
                        />
                        <ArrowRightMini
                          className={cn(
                            "absolute inset-0 opacity-0 transition-opacity duration-150 ease-in-out group-hover:opacity-100",
                            iconColor
                          )}
                        />
                      </span>
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      </AccordionPrimitive.Root>
    </div>
  )
}
