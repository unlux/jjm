"use client"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import GlareHover from "@modules/products/components/product-tabs/glare-hover"
import InfoCard from "@modules/products/components/product-tabs/InfoCard"
import { Info, PlayCircle, Sparkles } from "lucide-react"
import { Modak } from "next/font/google"
import { Comic_Neue } from "next/font/google"
import { Sour_Gummy } from "next/font/google"
import { useRef } from "react"
const comicNeue = Comic_Neue({ subsets: ["latin"], weight: ["400"] })
const modak = Modak({ subsets: ["latin"], weight: ["400"] })
const sour = Sour_Gummy({ subsets: ["latin"], weight: ["400"] })
type ProductInfoProps = {
  product: HttpTypes.StoreProduct
  description?: string
  // Optional: omit to hide the section
  coolThings?: string[] | false
  // Accept string or string[] or false; omit to hide
  howToPlay?: string | string[] | false
  showTitle?: boolean
}

const ProductInfo = ({
  product,
  description,
  coolThings,
  howToPlay,
  showTitle = true,
}: ProductInfoProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  return (
    <div id="product-info">
      <div className="mx-auto flex flex-col gap-y-8 lg:max-w-[700px]">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="inline-block text-sm font-medium text-pink-500 transition-colors hover:text-pink-600"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}

        {/* product title */}
        {showTitle && (
          <div className="flex justify-center">
            <GlareHover
              glareColor="#ffffff"
              glareOpacity={0.5}
              glareAngle={-30}
              glareSize={300}
              transitionDuration={800}
              playOnce={false}
              className="w-auto max-w-full"
            >
              <h2
                className={`transform whitespace-normal break-words rounded-full bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 text-center text-4xl font-black text-[#181D4E]/80 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:shadow-md md:text-4xl ${sour.className}`}
                style={{
                  maxWidth: "100%",
                  wordWrap: "break-word",
                  lineHeight: "1",
                }}
              >
                {product.title}
              </h2>
            </GlareHover>
          </div>
        )}

        {/* heading */}
        {/* <div
          className="inline-flex justify-center items-center bg-gradient-to-r from-blue-50 to-blue-100 rounded-full px-8 py-3 mx-auto shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105"
          ref={containerRef}
        >
          <Heading
            level="h2"
            className={`text-4xl text-center font-medium tracking-wide text-[#61A2C9] ${modak.className} animate-float`}
            data-testid="product-title"
          >
            <VariableProximity
              label={product.title}
              className={"variable-proximity-demo"}
              fromFontVariationSettings="'wght' 400, 'opsz' 9"
              toFontVariationSettings="'wght' 1000, 'opsz' 40"
              containerRef={containerRef}
              radius={100}
              falloff="linear"
            />
            {product.title}
          </Heading>
        </div> */}

        {/* description */}
        <div className="space-y-8 pt-4">
          {description && (
            <InfoCard
              icon={<Info className="h-5 w-5" />}
              title="What’s Inside?"
              color="blue"
              bg="bg-blue-50"
            >
              <Text
                data-testid="product-description"
                className={`whitespace-pre-line text-lg text-gray-700 ${comicNeue.className}`}
              >
                {description}
              </Text>
            </InfoCard>
          )}

          {/* Cool Things Section*/}
          {coolThings && Array.isArray(coolThings) && coolThings.length > 0 && (
            <InfoCard
              icon={<Sparkles className="h-5 w-5" />}
              title="Cool Things You’ll Learn"
              color="pink"
              bg="bg-pink-50"
            >
              <ul className="list-inside list-disc space-y-2 text-gray-700">
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
                icon={<PlayCircle className="h-5 w-5" />}
                title="How to Play"
                color="yellow"
                bg="bg-yellow-50"
              >
                <p className="whitespace-pre-line leading-relaxed text-gray-700">
                  {Array.isArray(howToPlay) ? howToPlay.join("\n") : howToPlay}
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
