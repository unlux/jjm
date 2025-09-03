"use client"

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
}: FloatingShowcaseProps) {
  const Container: React.ElementType = mainImageHref ? Link : "div"
  const containerProps = mainImageHref ? { href: mainImageHref } : {}

  return (
    <div
      className={`relative w-full mx-auto overflow-x-hidden ${className}`.trim()}
      style={{ maxWidth: mainImageWidth }}
    >
      {/* Main image */}
      <Container {...containerProps} className="block">
        <Image
          src={mainImageSrc}
          alt={mainImageAlt}
          width={mainImageWidth}
          height={mainImageHeight}
          sizes="(max-width: 600px) 100vw, 521px"
          className="h-auto w-full object-contain rounded-3xl"
          priority={false}
        />
      </Container>

      {/* Primary floating icon (rotating) */}
      {primaryIconSrc ? (
        <div
          className={
            primaryWrapperClassName ||
            "pointer-events-auto absolute -top-6 -left-6 md:-top-10 md:-left-10 z-10"
          }
        >
          {primaryIconHref ? (
            <Link href={primaryIconHref} className="block">
              <Image
                src={primaryIconSrc}
                alt={primaryIconAlt}
                width={148}
                height={148}
                className={
                  primaryImageClassName ||
                  "h-auto w-[88px] md:w-[124px] lg:w-[148px] animate-[spin_12s_linear_infinite]"
                }
              />
            </Link>
          ) : (
            <Image
              src={primaryIconSrc}
              alt={primaryIconAlt}
              width={148}
              height={148}
              className={
                primaryImageClassName ||
                "h-auto w-[88px] md:w-[124px] lg:w-[148px] animate-[spin_12s_linear_infinite]"
              }
            />
          )}
        </div>
      ) : null}

      {/* Secondary floating icon */}
      {secondaryIconSrc ? (
        <div
          className={
            secondaryWrapperClassName ||
            "pointer-events-auto absolute bottom-6 -right-6 md:bottom-10 md:-right-10 z-20"
          }
        >
          {secondaryIconHref ? (
            <Link href={secondaryIconHref} className="block">
              <Image
                src={secondaryIconSrc}
                alt={secondaryIconAlt}
                width={99}
                height={99}
                className={
                  secondaryImageClassName ||
                  "h-auto w-[64px] md:w-[84px] lg:w-[99px]"
                }
              />
            </Link>
          ) : (
            <Image
              src={secondaryIconSrc}
              alt={secondaryIconAlt}
              width={99}
              height={99}
              className={
                secondaryImageClassName ||
                "h-auto w-[64px] md:w-[84px] lg:w-[99px]"
              }
            />
          )}
        </div>
      ) : null}
    </div>
  )
}
