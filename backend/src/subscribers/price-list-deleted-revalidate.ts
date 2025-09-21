import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { revalidateProductsWithCooldown } from "./_shared/revalidate-products"

export default async function priceListDeletedHandler({
  event: { data },
}: SubscriberArgs<{ id: string }>) {
  await revalidateProductsWithCooldown()
}

export const config: SubscriberConfig = {
  event: "price-list.deleted",
}
