import { Text } from "@medusajs/ui"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductClickLink from "@/modules/products/components/ProductClickLink"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
  size = "full",
  position,
  listId,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
  size?: "full" | "square"
  position?: number
  listId?: string
}) {
  // const pricedProduct = await listProducts({
  //   regionId: region.id,
  //   queryParams: { id: [product.id!] },
  // }).then(({ response }) => response.products[0])

  // if (!pricedProduct) {
  //   return null
  // }

  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <ProductClickLink
      product={product}
      href={`/products/${product.handle}`}
      position={position}
      list_id={listId}
    >
      <div data-testid="product-wrapper">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size={size}
          isFeatured={isFeatured}
          discountPercentage={
            cheapestPrice?.price_type === "sale"
              ? Number(cheapestPrice.percentage_diff)
              : undefined
          }
        />
        <div className="flex txt-compact-medium mt-4 justify-between">
          <Text
            className="text-ui-fg-subtle text-sm sm:text-base"
            data-testid="product-title"
          >
            {product.title}
          </Text>
          <div className="flex items-center gap-x-2">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
        </div>
      </div>
    </ProductClickLink>
  )
}
