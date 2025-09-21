import React, { Suspense } from "react"
import { PlayCircle } from "lucide-react"
import { HttpTypes } from "@medusajs/types"
import { notFound } from "next/navigation"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import ProductActionsWrapper from "./product-actions-wrapper"
import { Sour_Gummy } from "next/font/google"

// IMPORTANT: Assuming your new parser function is in a utility file
import { parseProductDescription } from "@lib/util/parse-product-description"
import InfoCard from "@modules/products/components/product-tabs/InfoCard"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  // 1. Call the new, robust parser once
  const { description, coolThings, howToPlay } = parseProductDescription(
    product.description || ""
  )

  return (
    <div className="min-h-screen">
      <div
        className="max-w-8xl w-full mx-auto px-6 py-6 relative grid gap-8 items-start grid-cols-1 lg:[grid-template-columns:400px_minmax(0,1fr)_360px]"
        data-testid="product-container"
      >
        {/* Left Column - Sticky - DESKTOP*/}
        <div className="hidden lg:block lg:sticky lg:top-12 self-start w-full">
          <div className="mt-2">
            <ProductInfo
              product={product}
              description={description}
              coolThings={Array.isArray(coolThings) ? coolThings : []}
              howToPlay={howToPlay}
            />
          </div>
        </div>

        {/* Show only title on mobile */}
        <div className="block lg:hidden self-start w-full">
          <div className="mt-2">
            <ProductInfo product={product} showTitle={true} />
          </div>
        </div>

        {/* Center Column */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-3xl">
            <ImageGallery images={product?.images || []} />
          </div>
        </div>

        {/* Right Column - Sticky */}
        <div className="flex flex-col lg:sticky lg:top-12 self-start w-full py-6 gap-y-8">
          <div className="hidden sm:block">
            {howToPlay && (
              <InfoCard
                icon={<PlayCircle className="w-5 h-5" />}
                title="How to Play"
                color="yellow"
                bg="bg-yellow-50"
              >
                <p className="leading-relaxed whitespace-pre-line">
                  {howToPlay}
                </p>
              </InfoCard>
            )}
          </div>

          {/* Show description, cool things and how to play on mobile after image gallery */}
          <div className="block lg:hidden w-full">
            <div className="mt-2">
              <ProductInfo
                product={product}
                description={description}
                coolThings={Array.isArray(coolThings) ? coolThings : []}
                howToPlay={howToPlay}
                showTitle={false}
              />
            </div>
          </div>

          {/* <ProductTabs product={product} /> */}
          <ProductOnboardingCta />
          <Suspense
            fallback={
              <ProductActions
                disabled={true}
                product={product}
                region={region}
              />
            }
          >
            <ProductActionsWrapper id={product.id} region={region} />
          </Suspense>
        </div>
      </div>
      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </div>
  )
}

export default ProductTemplate
