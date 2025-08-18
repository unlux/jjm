import { HttpTypes } from "@medusajs/types"
import { listProducts } from "@lib/data/products"
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
      queryParams: { limit: 4 },
    })

    if (!products || products.length === 0) {
      return null
    }

    return (
      <div className="pb-12 bg-slate-50">
        <div className="content-container py-12">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-[#111827] mb-4 font-baloo tracking-tight">
              Popular in Store
            </h2>
            <p className="text-lg md:text-xl text-center text-gray-600 mb-12 font-fredoka max-w-2xl mx-auto">
              Discover our most loved toys that bring smiles to children of all
              ages
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
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
