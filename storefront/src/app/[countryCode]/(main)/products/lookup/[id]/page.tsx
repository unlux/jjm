import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { notFound, redirect } from "next/navigation"

// This route resolves a product by its ID and redirects to the canonical
// handle-based PDP route: /[countryCode]/products/[handle]
// Useful as a safe fallback when only the product ID is available (e.g., legacy wishlist entries)

type Props = {
  params: Promise<{ countryCode: string; id: string }>
}

export default async function ProductLookupByIdPage(props: Props) {
  const params = await props.params
  const { countryCode, id } = params

  const region = await getRegion(countryCode)
  if (!region) {
    notFound()
  }

  const { response } = await listProducts({
    countryCode,
    queryParams: { id: [id], fields: "handle" },
  })

  const product = response.products?.[0]

  if (!product?.handle) {
    notFound()
  }

  redirect(`/${countryCode}/products/${product.handle}`)
}
