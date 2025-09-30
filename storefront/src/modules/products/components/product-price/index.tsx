import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block h-9 w-32 animate-pulse bg-gray-100" />
  }

  return (
    <div className="flex flex-col gap-2 text-ui-fg-base">
      <div className="flex items-baseline gap-3">
        <span
          className={clx("text-3xl", {
            "font-semibold text-red-600": selectedPrice.price_type === "sale",
            "font-normal": selectedPrice.price_type !== "sale",
          })}
          aria-label={
            selectedPrice.price_type === "sale" ? "Discounted price" : "Price"
          }
        >
          {!variant && "From "}
          <span
            data-testid="product-price"
            data-value={selectedPrice.calculated_price_number}
          >
            {selectedPrice.calculated_price}
          </span>
        </span>

        {selectedPrice.price_type === "sale" && (
          <span
            className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm ring-1 ring-blue-400/30"
            aria-label={`Save ${selectedPrice.percentage_diff}%`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="h-3.5 w-3.5 opacity-90"
              fill="currentColor"
            >
              <path d="M11.3 1.7a1 1 0 0 1 .9.6l1.5 3.4 3.7.3a1 1 0 0 1 .56 1.76l-2.9 2.4.9 3.6a1 1 0 0 1-1.45 1.12L10 13.5 6.49 17a1 1 0 0 1-1.45-1.12l.9-3.6-2.9-2.4A1 1 0 0 1 3.6 6l3.7-.3 1.5-3.4a1 1 0 0 1 1.5-.6Z" />
            </svg>
            -{selectedPrice.percentage_diff}%
          </span>
        )}
      </div>

      {selectedPrice.price_type === "sale" ? (
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
          <p className="text-base">
            <span className="text-ui-fg-subtle">Original: </span>
            <span
              className="line-through"
              data-testid="original-product-price"
              data-value={selectedPrice.original_price_number}
            >
              {selectedPrice.original_price}
            </span>
          </p>
          <span className="text-sm font-medium text-green-600">
            {(() => {
              const save =
                typeof selectedPrice.original_price_number === "number" &&
                typeof selectedPrice.calculated_price_number === "number"
                  ? selectedPrice.original_price_number -
                    selectedPrice.calculated_price_number
                  : undefined
              return save && save > 0
                ? `You save ₹${save.toLocaleString()}`
                : `Save ${selectedPrice.percentage_diff}%`
            })()}
          </span>
        </div>
      ) : (
        <span className="text-sm text-ui-fg-subtle">Best price guaranteed</span>
      )}
    </div>
  )
}
