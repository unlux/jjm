// IMPORTANT: Assuming your new parser function is in a utility file
import { parseProductDescription } from "@lib/util/parse-product-description"
import { HttpTypes } from "@medusajs/types"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import InfoCard from "@modules/products/components/product-tabs/InfoCard"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { PlayCircle } from "lucide-react"
import { Sour_Gummy } from "next/font/google"
import { notFound } from "next/navigation"
import React, { Suspense } from "react"

import ProductViewTrack from "@/modules/products/components/ProductViewTrack"

import ProductActionsWrapper from "./product-actions-wrapper"

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
      {/* Analytics: product_view */}
      <ProductViewTrack
        product={product}
        region={region}
        countryCode={countryCode}
      />
      <div
        className="relative mx-auto grid w-full max-w-8xl grid-cols-1 items-start gap-8 px-6 py-6 lg:[grid-template-columns:400px_minmax(0,1fr)_360px]"
        data-testid="product-container"
      >
        {/* Left Column - Sticky - DESKTOP*/}
        <div className="hidden w-full self-start lg:sticky lg:top-12 lg:block">
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
        <div className="block w-full self-start lg:hidden">
          <div className="mt-2">
            <ProductInfo product={product} showTitle={true} />
          </div>
        </div>

        {/* Center Column */}
        <div className="flex w-full justify-center">
          <div className="w-full max-w-3xl">
            <ImageGallery images={product?.images || []} />
          </div>
        </div>

        {/* Right Column - Sticky */}
        <div className="flex w-full flex-col gap-y-8 self-start py-6 lg:sticky lg:top-12">
          <div className="hidden sm:block">
            {howToPlay && (
              <InfoCard
                icon={<PlayCircle className="h-5 w-5" />}
                title="How to Play"
                color="yellow"
                bg="bg-yellow-50"
              >
                <p className="whitespace-pre-line leading-relaxed">
                  {howToPlay}
                </p>
              </InfoCard>
            )}
          </div>

          {/* Show description, cool things and how to play on mobile after image gallery */}
          <div className="block w-full lg:hidden">
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
