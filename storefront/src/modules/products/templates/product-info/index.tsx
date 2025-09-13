import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-medium text-ui-fg-muted hover:text-ui-fg-subtle"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <Heading
          level="h2"
          className="text-3xl leading-10 text-ui-fg-base"
          data-testid="product-title"
        >
          {product.title}
        </Heading>
        <div className="space-y-6 pt-4">
          <div>
            <h3 className="text-lg font-medium text-ui-fg-base mb-2 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2"></span>
              Description
            </h3>
            <Text
              className="text-ui-fg-subtle leading-relaxed"
              data-testid="product-description"
            >
              {product.description}
            </Text>
          </div>

          {product.subtitle && (
            <div className="bg-ui-bg-base p-4 rounded-lg border border-ui-border-base">
              <h3 className="text-lg font-medium text-ui-fg-base mb-3 flex items-center">
                <span className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center text-ui-fg-base mr-2">
                  <span className="text-xs font-bold">!</span>
                </span>
                How to Play
              </h3>
              <Text
                className="text-ui-fg-subtle leading-relaxed"
                data-testid="product-subtitle"
              >
                {product.subtitle}
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductInfo
