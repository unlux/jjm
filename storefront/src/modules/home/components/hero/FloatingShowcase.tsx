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
      className={`relative isolate mx-auto w-full overflow-x-visible overflow-y-visible [overscroll-behavior-x:contain] large:overflow-y-visible ${className}`.trim()}
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
          className="h-auto w-full rounded-3xl object-contain"
          priority={false}
        />
      </Container>

      {/* Unified Badge takes precedence if provided */}
      {badge ? (
        <div
          className={
            badgeWrapperClassName ||
            "pointer-events-auto absolute -bottom-6 -right-6 z-20 md:-bottom-10 md:-right-10"
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
            "pointer-events-auto absolute -left-6 -top-6 z-10 h-[88px] w-[88px] origin-center animate-spin [animation-duration:12s] [contain:layout_paint] md:-left-10 md:-top-10 md:h-[124px] md:w-[124px] lg:h-[148px] lg:w-[148px]"
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
            "pointer-events-auto absolute -right-6 bottom-6 z-20 h-[64px] w-[64px] [contain:layout_paint] md:-right-10 md:bottom-10 md:h-[84px] md:w-[84px] lg:h-[99px] lg:w-[99px]"
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
