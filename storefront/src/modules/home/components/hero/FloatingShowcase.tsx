// Server component: no client-only APIs used

import Image from "next/image"
import Link from "next/link"
import React from "react"

type FloatingShowcaseProps = {
  mainImageSrc: string
  mainImageAlt?: string
  mainImageWidth?: number
  mainImageHeight?: number
  mainImageHref?: string

  primaryIconSrc?: string
  primaryIconAlt?: string
  primaryIconHref?: string
  primaryWrapperClassName?: string
  primaryImageClassName?: string

  secondaryIconSrc?: string
  secondaryIconAlt?: string
  secondaryIconHref?: string
  secondaryWrapperClassName?: string
  secondaryImageClassName?: string

  className?: string

  // New unified badge (e.g., rotating circular text with center icon)
  badge?: React.ReactNode
  badgeWrapperClassName?: string
}

export default function FloatingShowcase({
  mainImageSrc,
  mainImageAlt = "",
  mainImageWidth = 521,
  mainImageHeight = 521,
  mainImageHref,

  primaryIconSrc,
  primaryIconAlt = "",
  primaryIconHref,
  primaryWrapperClassName,
  primaryImageClassName,

  secondaryIconSrc,
  secondaryIconAlt = "",
  secondaryIconHref,
  secondaryWrapperClassName,
  secondaryImageClassName,

  className = "",
  badge,
  badgeWrapperClassName,
}: FloatingShowcaseProps) {
  const Container: React.ElementType = mainImageHref ? Link : "div"
  const containerProps = mainImageHref ? { href: mainImageHref } : {}

  return (
    <div
      className={`relative w-full mx-auto overflow-y-visible large:overflow-y-visible overflow-x-visible isolate [overscroll-behavior-x:contain] ${className}`.trim()}
      style={{ maxWidth: mainImageWidth }}
    >
      {/* Main image */}
      <Container {...containerProps} className="block">
        <Image
          src={mainImageSrc}
          alt={mainImageAlt}
          width={mainImageWidth}
          height={mainImageHeight}
          sizes={`(max-width: 768px) 100%, ${mainImageWidth}px`}
          className="h-auto w-full object-contain rounded-3xl"
          priority={false}
        />
      </Container>

      {/* Unified Badge takes precedence if provided */}
      {badge ? (
        <div
          className={
            badgeWrapperClassName ||
            "pointer-events-auto absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 z-20"
          }
        >
          {badge}
        </div>
      ) : null}

      {/* Primary floating icon (rotating) */}
      {!badge && primaryIconSrc ? (
        <div
          className={
            primaryWrapperClassName ||
            "pointer-events-auto absolute -top-6 -left-6 md:-top-10 md:-left-10 z-10 w-[88px] h-[88px] md:w-[124px] md:h-[124px] lg:w-[148px] lg:h-[148px] [contain:layout_paint] animate-spin [animation-duration:12s] origin-center"
          }
        >
          {primaryIconHref ? (
            <Link href={primaryIconHref} className="block">
              <Image
                src={primaryIconSrc}
                alt={primaryIconAlt}
                width={148}
                height={148}
                className={primaryImageClassName || "h-full w-full"}
              />
            </Link>
          ) : (
            <Image
              src={primaryIconSrc}
              alt={primaryIconAlt}
              width={148}
              height={148}
              className={primaryImageClassName || "h-full w-full"}
            />
          )}
        </div>
      ) : null}

      {/* Secondary floating icon */}
      {!badge && secondaryIconSrc ? (
        <div
          className={
            secondaryWrapperClassName ||
            "pointer-events-auto absolute bottom-6 -right-6 md:bottom-10 md:-right-10 z-20 w-[64px] h-[64px] md:w-[84px] md:h-[84px] lg:w-[99px] lg:h-[99px] [contain:layout_paint]"
          }
        >
          {secondaryIconHref ? (
            <Link href={secondaryIconHref} className="block">
              <Image
                src={secondaryIconSrc}
                alt={secondaryIconAlt}
                width={99}
                height={99}
                className={secondaryImageClassName || "h-full w-full"}
              />
            </Link>
          ) : (
            <Image
              src={secondaryIconSrc}
              alt={secondaryIconAlt}
              width={99}
              height={99}
              className={secondaryImageClassName || "h-full w-full"}
            />
          )}
        </div>
      ) : null}
    </div>
  )
}
