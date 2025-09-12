import { Text, clx } from "@medusajs/ui"
import { VariantPrice } from "types/global"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-baseline gap-1.5">
        <Text
          className={clx("text-sm sm:text-base text-ui-fg-subtle", {
            "text-red-600 font-medium": price.price_type === "sale",
          })}
          data-testid="price"
        >
          {price.calculated_price}
        </Text>
        {price.price_type === "sale" && (
          <span className="hidden sm:inline-flex items-center rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
            -{price.percentage_diff}%
          </span>
        )}
      </div>
      {price.price_type === "sale" && (
        <Text
          className="text-xs text-ui-fg-muted line-through"
          data-testid="original-price"
        >
          {price.original_price}
        </Text>
      )}
    </div>
  )
}
