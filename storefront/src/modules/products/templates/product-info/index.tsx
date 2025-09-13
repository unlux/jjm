import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import { Info, Sparkles, PlayCircle } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const desc = product.description || ""
  const MARK_COOL = "Cool things mastered with this:"
  const MARK_PLAY = "How to Play:"

  // find indices robustly
  const iCool = desc.indexOf(MARK_COOL)
  const iPlay = desc.indexOf(MARK_PLAY)

  let part1 = desc
  let part2Raw = ""
  let part3Raw = ""

  if (iCool !== -1) {
    part1 = desc.slice(0, iCool).trim()
    const afterCool = desc.slice(iCool + MARK_COOL.length)
    if (iPlay !== -1 && iPlay > iCool) {
      part2Raw = afterCool.slice(0, iPlay - (iCool + MARK_COOL.length)).trim()
      part3Raw = desc.slice(iPlay + MARK_PLAY.length).trim()
    } else {
      part2Raw = afterCool.trim()
    }
  } else if (iPlay !== -1) {
    part1 = desc.slice(0, iPlay).trim()
    part3Raw = desc.slice(iPlay + MARK_PLAY.length).trim()
  }

  // Helper: to bullet list tokens when suitable
  const toTokens = (raw: string) =>
    raw
      .split(/\n|\r|•|,|;|\u2022/g)
      .map((t) => t.trim())
      .filter(Boolean)

  const tokens2 = toTokens(part2Raw)
  const hasList2 = tokens2.length > 1
  const tokens3 = toTokens(part3Raw)
  const hasList3 = tokens3.length > 1

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
          className="text-3xl leading-10 text-ui-fg-base text-center"
          data-testid="product-title"
        >
          {product.title}
        </Heading>
        <div className="space-y-6 pt-4">
          <div className="bg-ui-bg-base p-4 rounded-lg border border-ui-border-base">
            <h3 className="text-lg font-medium text-ui-fg-base mb-2 flex items-center">
              <Info className="w-5 h-5 text-blue-500 mr-2" />
              Description
            </h3>
            <Text className="text-ui-fg-subtle leading-relaxed" data-testid="product-description">
              {part1}
            </Text>
          </div>

          {part2Raw && (
            <div className="bg-ui-bg-base p-4 rounded-lg border border-ui-border-base">
              <h3 className="text-lg font-medium text-ui-fg-base mb-3 flex items-center">
                <Sparkles className="w-5 h-5 text-green-500 mr-2" />
                Cool things mastered with this
              </h3>
              {hasList2 ? (
                <ul className="list-disc pl-5 space-y-1 text-ui-fg-subtle">
                  {tokens2.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <Text className="text-ui-fg-subtle leading-relaxed">{part2Raw}</Text>
              )}
            </div>
          )}

          {part3Raw && (
            <div className="bg-ui-bg-base p-4 rounded-lg border border-ui-border-base">
              <h3 className="text-lg font-medium text-ui-fg-base mb-3 flex items-center">
                <PlayCircle className="w-5 h-5 text-yellow-500 mr-2" />
                How to Play
              </h3>
              {hasList3 ? (
                <ul className="list-disc pl-5 space-y-1 text-ui-fg-subtle">
                  {tokens3.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <Text className="text-ui-fg-subtle leading-relaxed">{part3Raw}</Text>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductInfo
