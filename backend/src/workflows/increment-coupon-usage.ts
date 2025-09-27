import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { incrementCouponsStep, IncrementCouponsStepInput, IncrementCouponsStepOutput } from "./steps/increment-coupons"

export const incrementCouponUsageWorkflow = createWorkflow(
  "increment-coupon-usage",
  (input: IncrementCouponsStepInput) => {
    const { updated } = incrementCouponsStep(input)

    return new WorkflowResponse<IncrementCouponsStepOutput>({ updated })
  }
)
