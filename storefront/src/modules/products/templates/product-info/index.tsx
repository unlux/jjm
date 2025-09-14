import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import { Info, PlayCircle, Sparkles } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import InfoCard from "@modules/products/components/product-tabs/InfoCard"
import { Modak } from "next/font/google"
import { Comic_Neue } from "next/font/google"
const comicNeue = Comic_Neue({ subsets: ["latin"], weight: ["400"] })
const modak = Modak({ subsets: ["latin"], weight: ["400"] })

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
  description: string
  // Updated to handle 'false' if the section is missing
  coolThings: string[] | false
  howToPlay: string[] | false
}

const ProductInfo = ({
  product,
  description,
  coolThings,
  howToPlay,
}: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-8 lg:max-w-[700px] mx-auto">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="inline-block text-sm font-medium text-pink-500 hover:text-pink-600 transition-colors"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}

        {/* heading */}
        <div className="inline-flex justify-center items-center bg-blue-50 rounded-full px-8 py-3 mx-auto">
          <Heading
            level="h2"
            className={`text-4xl text-center font-medium tracking-wide text-[#61A2C9] ${modak.className}`}
            data-testid="product-title"
          >
            {product.title}
          </Heading>
        </div>

        {/* description */}
        <div className="space-y-8 pt-4">
          {description && (
            <InfoCard
              icon={<Info className="w-5 h-5" />}
              title="What’s Inside?"
              color="blue"
              bg="bg-blue-50"
            >
              <Text
                data-testid="product-description"
                className={`text-gray-700 text-lg whitespace-pre-line ${comicNeue.className}`}
              >
                {description}
              </Text>
            </InfoCard>
          )}

          {/* This now checks for a non-false value before rendering */}
          {coolThings && coolThings.length > 0 && (
            <InfoCard
              icon={<Sparkles className="w-5 h-5" />}
              title="Cool Things You’ll Learn"
              color="pink"
              bg="bg-pink-50"
            >
              <ul className="space-y-2 list-disc list-inside text-gray-700">
                {coolThings.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </InfoCard>
          )}

          {/* "How to Play" section for mobile */}
          <div className="block lg:hidden">
            {howToPlay && (
              <InfoCard
                icon={<PlayCircle className="w-5 h-5" />}
                title="How to Play"
                color="yellow"
                bg="bg-yellow-50"
              >
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {howToPlay}
                </p>
              </InfoCard>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductInfo
