import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import ProductActionsWrapper from "./product-actions-wrapper"
import { HttpTypes } from "@medusajs/types"

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

  return (
    <>
      <div
        className="max-w-8xl w-full mx-auto px-6 py-6 relative grid gap-8 items-start grid-cols-1 lg:[grid-template-columns:400px_minmax(0,1fr)_360px]"
        data-testid="product-container"
      >
        {/* Left: Product Info only */}
        <div className="flex flex-col lg:sticky lg:top-48 self-start w-full py-6 gap-y-6">
          <ProductInfo product={product} />
        </div>

        {/* Center: Image Gallery perfectly centered */}
        <div className="w-full flex max-w-3xl justify-center">
          <div className="w-full ">
            <ImageGallery images={product?.images || []} />
          </div>
        </div>

        {/* Right: Product Actions, then ProductTabs (shipping/returns etc.) */}
        <div className="flex flex-col lg:sticky lg:top-96 self-start w-full py-6 gap-y-12">
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
          <ProductTabs product={product} />
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
    </>
  )
}

export default ProductTemplate
