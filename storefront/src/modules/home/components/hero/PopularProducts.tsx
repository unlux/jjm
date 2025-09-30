import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"

export default async function PopularProducts({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  // Add a defensive check to ensure region is not undefined
  if (!region) {
    return null
  }

  try {
    const {
      response: { products },
    } = await listProducts({
      regionId: region.id,
      queryParams: { limit: 8 },
    })

    if (!products || products.length === 0) {
      return null
    }

    return (
      <div className="bg-slate-50 md:py-10">
        <div className="content-container py-10 sm:py-12">
          <div className="flex flex-col items-center text-center">
            <h2 className="font-baloo mb-4 text-center text-4xl font-bold tracking-tight text-[#111827] md:text-5xl">
              Popular in Store
            </h2>
            <p className="font-fredoka mx-auto mb-12 max-w-2xl text-center text-lg text-gray-600 md:text-xl">
              Discover our most loved toys that bring smiles to children of all
              ages
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
            {products.map((p) => (
              <ProductPreview
                key={p.id}
                product={p}
                region={region}
                isFeatured
              />
            ))}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Failed to fetch popular products:", error)
    // In case of an error, return null to avoid crashing the page
    return null
  }
}
