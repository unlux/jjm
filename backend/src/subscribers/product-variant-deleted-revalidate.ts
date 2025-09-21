import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { revalidateProductsWithCooldown } from "./_shared/revalidate-products"

export default async function productVariantDeletedHandler({
  event: { data },
}: SubscriberArgs<{ id: string }>) {
  await revalidateProductsWithCooldown()
}

export const config: SubscriberConfig = {
  event: "product-variant.deleted",
}
