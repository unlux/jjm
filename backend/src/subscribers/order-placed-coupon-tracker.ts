import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { incrementCouponUsageWorkflow } from "../workflows/increment-coupon-usage"

export default async function orderPlacedCouponTracker({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger")

  try {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    const { data: [order] } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "promotions.*",
        "cart.promotions.*",
      ],
      filters: { id: data.id },
    })

    if (!order) {
      logger.warn(`[coupon-tracker] Order not found for id ${data.id}`)
      return
    }

    const codes = Array.from(
      new Set(
        [
          ...(order.promotions?.map((p: any) => p.code) ?? []),
          ...(order.cart?.promotions?.map((p: any) => p.code) ?? []),
        ]
          .filter(Boolean)
          .map((c: string) => c.trim().toLowerCase())
      )
    )

    if (codes.length === 0) {
      logger.info(`[coupon-tracker] No promotion codes on order ${order.id}`)
      return
    }

    const { result } = await incrementCouponUsageWorkflow(container).run({
      input: { codes },
    })

    logger.info(
      `[coupon-tracker] Incremented codes for order ${order.id}: ${result.updated
        .map((u: any) => `${u.code}=${u.timesUsed}`)
        .join(", ")}`
    )
  } catch (e: any) {
    logger.error(`[coupon-tracker] Failed to process order ${data.id}: ${e?.message || e}`)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
