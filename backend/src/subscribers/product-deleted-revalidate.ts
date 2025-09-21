import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { revalidateProductsWithCooldown } from "./_shared/revalidate-products"

export default async function productDeletedHandler({
  event: { data },
}: SubscriberArgs<{ id: string }>) {
  await revalidateProductsWithCooldown()
}

export const config: SubscriberConfig = {
  event: "product.deleted",
}
